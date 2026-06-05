import pg from 'pg';
import { EventEmitter } from 'events';

const { Pool, Client } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('[DB] Pool error:', err.message);
});

let listenerClient = null;
export const listenerEvents = new EventEmitter();

async function createListenerClient() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  client.on('error', (err) => {
    console.error('[DB] Listener client error:', err.message);
  });
  client.on('end', () => {
    console.warn('[DB] Listener client disconnected — reconnecting...');
    scheduleReconnect();
  });
  return client;
}

let reconnectDelay = 1000;

async function scheduleReconnect() {
  await new Promise((r) => setTimeout(r, reconnectDelay));
  reconnectDelay = Math.min(reconnectDelay * 2, 30000);
  try {
    await connectListener();
    reconnectDelay = 1000;
  } catch (err) {
    console.error('[DB] Reconnect failed:', err.message);
    scheduleReconnect();
  }
}

export async function connectListener() {
  listenerClient = await createListenerClient();
  await listenerClient.connect();
  await listenerClient.query('LISTEN orders_channel');
  console.log('[DB] Listener connected and listening on orders_channel');

  listenerClient.on('notification', (msg) => {
    listenerEvents.emit('notification', msg);
  });
}

export { listenerClient };
