import db from '../database/knex.js';

/**
 * Task Controller - Implements business logic and Knex.js database operations
 * for To-Do tasks: Create, Read, Update, Delete.
 */

/**
 * CREATE a new task
 * POST /api/tasks
 *
 * Database connection:
 * Executes:
 *   INSERT INTO "tasks" ("user_id", "title", "description", "status", "priority", "due_date")
 *   VALUES ($1, $2, $3, $4, $5, $6)
 *   RETURNING *
 */
export async function createTask(request, reply) {
  const { title, description, status, priority, due_date, user_id } = request.body;

  // Validate title is not empty or whitespace only
  if (!title || !title.trim()) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Title is required and cannot be empty or whitespace only'
    });
  }

  // Determine user_id:
  // If user_id is passed, verify the user exists to satisfy foreign key constraint.
  // If user_id is omitted, fallback to the first active user in the database.
  let assignedUserId = user_id;

  if (assignedUserId) {
    const existingUser = await db('users').where({ id: assignedUserId }).first();
    if (!existingUser) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: `User with id "${assignedUserId}" does not exist`
      });
    }
  } else {
    const defaultUser = await db('users').where({ is_active: true }).orderBy('created_at', 'asc').first()
      || await db('users').first();

    if (defaultUser) {
      assignedUserId = defaultUser.id;
    } else {
      // If database has no users, create a default user record
      const [newDemoUser] = await db('users')
        .insert({
          name: 'Default User',
          email: 'demo@example.com',
          password_hash: '$2a$10$wTf7F.F1F8Pqv6q6Dq1r5eXnJ5J0qY4RzP6yY.1h8Jb1H3V7Bv2X2',
          role: 'user'
        })
        .returning('*');
      assignedUserId = newDemoUser.id;
    }
  }

  const [newTask] = await db('tasks')
    .insert({
      user_id: assignedUserId,
      title: title.trim(),
      description: description ?? null,
      status: status || 'pending',
      priority: priority || 'medium',
      due_date: due_date ?? null
    })
    .returning('*');

  return reply.status(201).send({
    success: true,
    message: 'Task created successfully',
    data: newTask
  });
}

/**
 * READ all tasks (with optional query filtering and pagination)
 * GET /api/tasks
 *
 * Database connection:
 * Executes:
 *   SELECT "tasks".*, "users"."name" AS "user_name", "users"."email" AS "user_email"
 *   FROM "tasks"
 *   LEFT JOIN "users" ON "tasks"."user_id" = "users"."id"
 *   WHERE ... (optional filters)
 *   ORDER BY "tasks"."created_at" DESC
 *   LIMIT $limit OFFSET $offset
 */
export async function getTasks(request, reply) {
  const { status, priority, user_id, search, limit = 50, offset = 0 } = request.query;

  let query = db('tasks')
    .leftJoin('users', 'tasks.user_id', 'users.id')
    .select(
      'tasks.*',
      'users.name as user_name',
      'users.email as user_email'
    );

  if (status) {
    query = query.where('tasks.status', status);
  }

  if (priority) {
    query = query.where('tasks.priority', priority);
  }

  if (user_id) {
    query = query.where('tasks.user_id', user_id);
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.where(builder => {
      builder.whereILike('tasks.title', term).orWhereILike('tasks.description', term);
    });
  }

  const tasks = await query
    .orderBy('tasks.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  return reply.status(200).send({
    success: true,
    count: tasks.length,
    data: tasks
  });
}

/**
 * READ a single task by ID
 * GET /api/tasks/:id
 *
 * Database connection:
 * Executes:
 *   SELECT "tasks".*, "users"."name" AS "user_name", "users"."email" AS "user_email"
 *   FROM "tasks"
 *   LEFT JOIN "users" ON "tasks"."user_id" = "users"."id"
 *   WHERE "tasks"."id" = $1
 *   LIMIT 1
 */
export async function getTaskById(request, reply) {
  const { id } = request.params;

  const task = await db('tasks')
    .leftJoin('users', 'tasks.user_id', 'users.id')
    .select(
      'tasks.*',
      'users.name as user_name',
      'users.email as user_email'
    )
    .where('tasks.id', id)
    .first();

  if (!task) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Task with id "${id}" not found`
    });
  }

  return reply.status(200).send({
    success: true,
    data: task
  });
}

/**
 * UPDATE an existing task by ID
 * PUT /api/tasks/:id
 *
 * Database connection:
 * Executes:
 *   UPDATE "tasks"
 *   SET ...fields..., "updated_at" = CURRENT_TIMESTAMP
 *   WHERE "id" = $id
 *   RETURNING *
 */
export async function updateTask(request, reply) {
  const { id } = request.params;
  const updates = request.body;

  if (!updates || Object.keys(updates).length === 0) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'At least one field must be provided to update'
    });
  }

  // Validate title if provided
  if (updates.title !== undefined) {
    if (typeof updates.title !== 'string' || !updates.title.trim()) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Title cannot be empty or whitespace only'
      });
    }
  }

  // Validate user_id if reassigned
  if (updates.user_id !== undefined) {
    const user = await db('users').where({ id: updates.user_id }).first();
    if (!user) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: `User with id "${updates.user_id}" does not exist`
      });
    }
  }

  const updateData = {
    updated_at: db.fn.now()
  };

  if (updates.title !== undefined) updateData.title = updates.title.trim();
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.priority !== undefined) updateData.priority = updates.priority;
  if (updates.due_date !== undefined) updateData.due_date = updates.due_date;
  if (updates.user_id !== undefined) updateData.user_id = updates.user_id;

  const [updatedTask] = await db('tasks')
    .where({ id })
    .update(updateData)
    .returning('*');

  if (!updatedTask) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Task with id "${id}" not found`
    });
  }

  return reply.status(200).send({
    success: true,
    message: 'Task updated successfully',
    data: updatedTask
  });
}

/**
 * DELETE a task by ID
 * DELETE /api/tasks/:id
 *
 * Database connection:
 * Executes:
 *   DELETE FROM "tasks"
 *   WHERE "id" = $id
 *   RETURNING *
 */
export async function deleteTask(request, reply) {
  const { id } = request.params;

  const [deletedTask] = await db('tasks')
    .where({ id })
    .del()
    .returning('*');

  if (!deletedTask) {
    return reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Task with id "${id}" not found`
    });
  }

  return reply.status(200).send({
    success: true,
    message: 'Task deleted successfully',
    data: deletedTask
  });
}
