import Fastify from 'fastify';
import cors from '@fastify/cors';
import db from './database/knex.js';
import taskRoutes from './routes/taskRoutes.js';

/**
 * Build and configure the Fastify application.
 *
 * @param {object} opts - Fastify server options
 * @returns {Promise<FastifyInstance>}
 */
export async function buildApp(opts = {}) {
  const app = Fastify({
    logger: opts.logger !== undefined ? opts.logger : true,
    ...opts
  });

  // Enable Cross-Origin Resource Sharing (CORS) for Angular frontend
  await app.register(cors, {
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  });

  // Global Error Handler for consistent REST API responses
  app.setErrorHandler((error, request, reply) => {
    if (error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: error.message,
        details: error.validation
      });
    }

    const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
    if (statusCode === 500) {
      request.log.error(error);
    }

    return reply.status(statusCode).send({
      statusCode,
      error: error.name || 'Error',
      message: error.message || 'An unexpected server error occurred'
    });
  });

  // Global 404 Handler
  app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method} ${request.url} not found`
    });
  });

  // Register Task REST API routes under /api/tasks
  await app.register(taskRoutes, { prefix: '/api/tasks' });

  // System Health Check Endpoint
  app.get('/api/health', async (request, reply) => {
    try {
      await db.raw('SELECT 1');
      return {
        success: true,
        message: 'To-Do API is running',
        database: 'connected'
      };
    } catch (error) {
      reply.status(503);
      return {
        success: false,
        message: 'To-Do API is running but database connection failed',
        database: 'disconnected',
        error: error.message
      };
    }
  });

  return app;
}
