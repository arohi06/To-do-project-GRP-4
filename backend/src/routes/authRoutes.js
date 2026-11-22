
import {
  register,
  login,
  getCurrentUser
} from '../controllers/authController.js';

export default async function authRoutes(fastify) {
  fastify.post('/register', register);
  fastify.post('/login', login);

  fastify.get(
    '/me',
    { preHandler: [fastify.authenticate] },
    getCurrentUser
  );
}
