import { WebSocketServer, WebSocket } from 'ws';
import { pool } from './db.js';

const clients = new Set();
let wss = null;

export function initBroadcaster(server) {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', async (ws, req) => {
    clients.add(ws);
    console.log(`[WS] Client connected. Total: ${clients.size}`);

    try {
      const result = await pool.query('SELECT * FROM orders ORDER BY id DESC');
      ws.send(JSON.stringify({ type: 'initial_state', data: result.rows }));
    } catch (err) {
      console.error('[WS] Failed to send initial state:', err.message);
    }

    ws.on('close', () => {
      clients.delete(ws);
      console.log(`[WS] Client disconnected. Total: ${clients.size}`);
    });

    ws.on('error', (err) => {
      console.error('[WS] Client error:', err.message);
      clients.delete(ws);
    });
  });

  const heartbeat = setInterval(() => {
    for (const ws of clients) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      } else {
        clients.delete(ws);
      }
    }
  }, 30000);

  wss.on('close', () => clearInterval(heartbeat));

  console.log('[WS] WebSocket server initialized on path /ws');
}

export function broadcast(event) {
  const message = JSON.stringify({ type: 'change', ...event });
  let sent = 0;
  for (const ws of clients) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      sent++;
    }
  }
  console.log(`[WS] Broadcasted to ${sent}/${clients.size} clients`);
}
