import { EventEmitter } from 'events';
import { listenerEvents } from './db.js';

export const emitter = new EventEmitter();

export function startListener() {
  listenerEvents.on('notification', (msg) => {
    try {
      const payload = JSON.parse(msg.payload);
      const ts = new Date().toISOString();
      console.log(`[LISTENER] ${ts} — ${payload.operation} on order #${payload.data?.id}`);
      emitter.emit('change', payload);
    } catch (err) {
      console.error('[LISTENER] Failed to parse notification payload:', err.message);
    }
  });

  console.log('[LISTENER] Subscribed to pg_notify events');
}
