
import Fastify from 'fastify';
import cors from '@fastify/cors';
import db from './database/knex.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: 'http://localhost:4200'
  });

  // Verify database connectivity
  await db.raw('SELECT 1');

  app.get('/api/health', async () => ({
    success: true,
    message: 'To-Do API is running',
    database: 'connected'
  }));

  return app;
}
