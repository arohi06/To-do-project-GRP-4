import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDueTasks
} from '../controllers/taskController.js';

import {
  createTaskSchema,
  getTasksSchema,
  getTaskByIdSchema,
  updateTaskSchema,
  deleteTaskSchema
} from '../schemas/taskSchemas.js';

/**
 * Fastify Task Routes Plugin
 * Base Prefix: /api/tasks
 *
 * Endpoints:
 * - POST   /api/tasks      -> Create a task
 * - GET    /api/tasks      -> Read all tasks (with filters & pagination)
 * - GET    /api/tasks/due  -> Read the user's due and overdue tasks
 * - GET    /api/tasks/:id  -> Read a single task by ID
 * - PUT    /api/tasks/:id  -> Update a task by ID
 * - DELETE /api/tasks/:id  -> Delete a task by ID
 */
export default async function taskRoutes(fastify, options) {
  fastify.addHook('preHandler', fastify.authenticate);

  // CREATE
  fastify.post('/', { schema: createTaskSchema }, createTask);

  // READ (List)
  fastify.get('/', { schema: getTasksSchema }, getTasks);

  // READ (Due / overdue tasks) - must stay registered before '/:id'
  fastify.get('/due', getDueTasks);

  // READ (Single)
  fastify.get('/:id', { schema: getTaskByIdSchema }, getTaskById);

  // UPDATE
  fastify.put('/:id', { schema: updateTaskSchema }, updateTask);

  // DELETE
  fastify.delete('/:id', { schema: deleteTaskSchema }, deleteTask);
}