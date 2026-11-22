
import db from '../database/knex.js';

import {
  getAdminOverview,
  getAdminUsers,
  getAdminTasks,
  updateUserStatus
} from '../controllers/adminController.js';

export default async function adminRoutes(fastify) {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.addHook('preHandler', async (request, reply) => {
    const user = await db('users')
      .select('id', 'role', 'is_active')
      .where({ id: request.user.sub })
      .first();

    if (!user || !user.is_active) {
      return reply.code(401).send({
        success: false,
        message: 'Your account is inactive or no longer exists.'
      });
    }

    if (user.role !== 'admin') {
      return reply.code(403).send({
        success: false,
        message: 'Administrator access required.'
      });
    }
  });

  fastify.get('/overview', getAdminOverview);
  fastify.get('/users', getAdminUsers);
  fastify.get('/tasks', getAdminTasks);
  fastify.patch('/users/:id/status', updateUserStatus);
}
