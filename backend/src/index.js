import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, connectListener } from './db.js';
import { startListener, emitter } from './listener.js';
import { initBroadcaster, broadcast } from './broadcaster.js';
import router from './routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
  // In Docker: /frontend/dist (copied by multi-stage build)
  // Locally: ../../frontend/dist relative to src/
  const frontendDist = process.env.FRONTEND_DIST
    ?? path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectListener();
    startListener();
    initBroadcaster(server);

    emitter.on('change', (event) => {
      broadcast(event);
    });

    if (process.env.SEED_ENABLED === 'true') {
      const { startSeed } = await import('./seed.js');
      startSeed();
    }

    server.listen(PORT, () => {
      console.log(`[SERVER] Running on port ${PORT}`);
    });
  } catch (err) {
    console.error('[SERVER] Failed to start:', err.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`[SERVER] ${signal} received — shutting down gracefully`);
  server.close(async () => {
    await pool.end();
    console.log('[SERVER] Shutdown complete');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
