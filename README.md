# Real-Time Orders Dashboard

A real-time order tracking system where connected browser clients automatically receive live updates whenever data changes in PostgreSQL. The system uses PostgreSQL triggers with `pg_notify` for change data capture, and WebSockets to push events to all connected clients instantly — zero polling.

## Architecture

```
DB Change → PostgreSQL Trigger → pg_notify('orders_channel')
                                        ↓
                              Node.js LISTEN client receives event
                                        ↓
                              WebSocket server broadcasts to all clients
                                        ↓
                              Browser dashboard updates live
```

## Approach Evaluation

Three approaches were evaluated before settling on `pg_notify + Triggers`:

1. **Polling** — clients repeatedly query the server on an interval. Ruled out: wastes resources with redundant queries and introduces latency equal to the poll interval. Poorly suited for live dashboards.

2. **WAL Logical Replication** — reads PostgreSQL's write-ahead log via a replication slot with `wal2json`. This is the production-grade approach: it guarantees zero missed events even if the listener process restarts, because the WAL slot persists position. However, it requires `wal_level=logical` in `postgresql.conf`, plugin installation, and more complex consumer setup — making local evaluation significantly harder.

3. **pg_notify + Triggers** *(chosen)* — a trigger function fires on every INSERT/UPDATE/DELETE and calls `pg_notify`. A dedicated Node.js `pg.Client` (not a pool connection) holds a persistent `LISTEN` subscription. Events arrive in real time with minimal setup, no configuration changes to PostgreSQL, and trivial local development via Docker.

> **Note:** `pg_notify` is fire-and-forget. If the listener is down, events are lost. For production systems handling financial data or requiring auditability, WAL replication or an event streaming platform like Kafka would be the right choice. For this scope, `pg_notify` provides the right tradeoff between reliability and setup simplicity.

## Scaling Considerations

- **Current:** A single Node.js process can handle 10,000+ concurrent WebSocket connections comfortably.
- **Multi-instance:** Add Redis pub/sub between the pg_notify listener and multiple WebSocket server instances — each instance subscribes to the Redis channel and broadcasts to its own client pool.
- **Enterprise:** Replace `pg_notify` with WAL logical replication feeding Kafka topics, with independent consumer groups for different downstream systems (notifications, analytics, third-party integrations). This decouples the database from consumers entirely.

## Tech Stack

Node.js · Express · PostgreSQL 16 · ws (WebSocket) · React 18 · Tailwind CSS · shadcn/ui · Vite · Docker

## How to Run

### With Docker (recommended)

```bash
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

The frontend is built inside the Docker image and served by the Express backend in production mode.

### Without Docker

**1. Start PostgreSQL and initialize schema**
```bash
# Create database and run migrations
psql -U postgres -c "CREATE DATABASE orders_db;"
psql -U postgres -d orders_db -f backend/sql/init.sql
```

**2. Start the backend**
```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL
npm install
npm start
```

**3. Start the frontend dev server**
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) (Vite proxies `/api` and `/ws` to the backend).

## Project Structure

```
realtime-orders/
├── backend/
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   ├── src/
│   │   ├── index.js        ← Express + WebSocket server entry point
│   │   ├── db.js           ← pg Pool + dedicated LISTEN client with reconnect
│   │   ├── listener.js     ← Subscribes to pg_notify, emits parsed events
│   │   ├── broadcaster.js  ← Manages WebSocket clients, broadcasts events
│   │   ├── routes.js       ← REST API (CRUD on orders)
│   │   └── seed.js         ← Random INSERT/UPDATE/DELETE every 3-5 seconds
│   └── sql/
│       └── init.sql        ← orders table + trigger + notify function
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx               ← React entry point
│       ├── App.jsx                ← Root component, WebSocket state management
│       ├── index.css              ← Tailwind + CSS variables
│       ├── hooks/
│       │   └── useWebSocket.js    ← WebSocket connect/reconnect hook
│       ├── components/
│       │   ├── Header.jsx         ← Connection status + title
│       │   ├── StatsBar.jsx       ← Live order counts
│       │   ├── OrdersTable.jsx    ← Live table with flash animations
│       │   ├── ActivityFeed.jsx   ← Prepending event log
│       │   ├── AddOrderForm.jsx   ← Manual order creation
│       │   └── ui/
│       │       ├── badge.jsx      ← Status pill (shadcn/ui pattern)
│       │       ├── button.jsx     ← shadcn/ui Button
│       │       ├── card.jsx       ← shadcn/ui Card
│       │       ├── input.jsx      ← shadcn/ui Input
│       │       └── sonner.jsx     ← Toast provider wrapper
│       └── lib/
│           └── utils.js           ← cn() helper
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/orders` | List all orders, newest first |
| `POST` | `/api/orders` | Create order `{ customer_name, product_name }` |
| `PATCH` | `/api/orders/:id` | Update status `{ status }` |
| `DELETE` | `/api/orders/:id` | Delete order |

## WebSocket Protocol

All messages are JSON. The client connects to `ws[s]://<host>/ws`.

**Initial state** — sent once on connection, before any changes:
```json
{
  "type": "initial_state",
  "data": [{ "id": 1, "customer_name": "...", "product_name": "...", "status": "pending", "updated_at": "..." }]
}
```

**Change event** — broadcast to all clients on every INSERT, UPDATE, or DELETE:
```json
{
  "type": "change",
  "operation": "INSERT" | "UPDATE" | "DELETE",
  "data": { "id": 1, "customer_name": "...", "product_name": "...", "status": "shipped", "updated_at": "..." },
  "timestamp": "2026-06-05T10:30:00.000Z"
}
```
