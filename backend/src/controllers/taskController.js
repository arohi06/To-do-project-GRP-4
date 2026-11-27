import db from '../database/knex.js';

/**
 * Resolves the authenticated user from the request (set by fastify.authenticate).
 */
async function getAuthenticatedUser(request) {
  const rawAuth = request.user || request.authUser || request.session?.user || null;
  const authUser = rawAuth?.user || rawAuth;

  if (!authUser) {
    return null;
  }

  const userId = authUser.id ?? authUser.userId ?? authUser.sub;

  if (!userId) {
    console.warn('Authenticated user object missing id:', authUser);
    return null;
  }

  const user = await db('users')
    .select('id')
    .where('id', userId)
    .first();

  return user || null;
}

/**
 * CREATE a new task for the logged-in user.
 * POST /api/tasks
 */
export async function createTask(request, reply) {
  const currentUser = await getAuthenticatedUser(request);

  if (!currentUser) {
    return reply.code(401).send({
      success: false,
      message: 'User account not found or inactive.'
    });
  }

  const { title, description = null, status = 'pending', priority = 'medium', due_date = null } = request.body || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    return reply.code(400).send({
      success: false,
      message: 'Task title is required.'
    });
  }

  try {
    const [createdTask] = await db('tasks')
      .insert({
        user_id: currentUser.id,
        title: title.trim(),
        description,
        status,
        priority,
        due_date
      })
      .returning(['id', 'title', 'description', 'status', 'priority', 'due_date']);

    return reply.code(201).send({
      success: true,
      message: 'Task created successfully.',
      data: createdTask
    });
  } catch (error) {
    console.error('createTask error:', error);
    request.log?.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Failed to create task.',
      error: error.message
    });
  }
}

/**
 * READ all tasks belonging to the logged-in user (with optional status/priority filters).
 * GET /api/tasks
 */
export async function getTasks(request, reply) {
  const currentUser = await getAuthenticatedUser(request);

  if (!currentUser) {
    return reply.code(401).send({
      success: false,
      message: 'User account not found or inactive.'
    });
  }

  const { status, priority } = request.query || {};

  try {
    let query = db('tasks')
      .select('*')
      .where('user_id', currentUser.id);

    if (status) {
      query = query.where('status', status);
    }

    if (priority) {
      query = query.where('priority', priority);
    }

    const tasks = await query;

    return reply.code(200).send({
      success: true,
      total: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('getTasks error:', error);
    request.log?.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Failed to fetch tasks.',
      error: error.message
    });
  }
}

/**
 * READ the logged-in user's due and overdue tasks.
 * GET /api/tasks/due
 */
export async function getDueTasks(request, reply) {
  const currentUser = await getAuthenticatedUser(request);

  if (!currentUser) {
    return reply.code(401).send({
      success: false,
      message: 'User account not found or inactive.'
    });
  }

  const FINISHED_STATUS = 'completed';

  try {
    const tasks = await db('tasks')
      .select(
        '*',
        db.raw('(due_date::date < CURRENT_DATE) as is_overdue')
      )
      .where('user_id', currentUser.id)
      .whereNot('status', FINISHED_STATUS)
      .whereNotNull('due_date')
      .whereRaw('due_date::date <= CURRENT_DATE')
      .orderBy('due_date', 'asc');

    const normalizedTasks = tasks.map((task) => ({
      ...task,
      is_overdue: Boolean(task.is_overdue)
    }));

    const overdueCount = normalizedTasks.filter((t) => t.is_overdue).length;

    return reply.code(200).send({
      success: true,
      total: normalizedTasks.length,
      overdueCount,
      dueTodayCount: normalizedTasks.length - overdueCount,
      data: normalizedTasks
    });
  } catch (error) {
    console.error('getDueTasks error:', error);
    request.log?.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Failed to fetch due tasks.',
      error: error.message
    });
  }
}

/**
 * READ a single task by ID for the logged-in user.
 * GET /api/tasks/:id
 */
export async function getTaskById(request, reply) {
  const currentUser = await getAuthenticatedUser(request);

  if (!currentUser) {
    return reply.code(401).send({
      success: false,
      message: 'User account not found or inactive.'
    });
  }

  const { id } = request.params || {};

  if (!id) {
    return reply.code(400).send({
      success: false,
      message: 'Task ID is required.'
    });
  }

  try {
    const task = await db('tasks')
      .select('*')
      .where({
        id,
        user_id: currentUser.id
      })
      .first();

    if (!task) {
      return reply.code(404).send({
        success: false,
        message: 'Task not found.'
      });
    }

    return reply.code(200).send({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('getTaskById error:', error);
    request.log?.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Failed to fetch task.',
      error: error.message
    });
  }
}

/**
 * UPDATE an existing task belonging to the logged-in user.
 * PUT / PATCH /api/tasks/:id
 */
export async function updateTask(request, reply) {
  const currentUser = await getAuthenticatedUser(request);

  if (!currentUser) {
    return reply.code(401).send({
      success: false,
      message: 'User account not found or inactive.'
    });
  }

  const { id } = request.params || {};

  if (!id) {
    return reply.code(400).send({
      success: false,
      message: 'Task ID is required.'
    });
  }

  const { title, description, status, priority, due_date } = request.body || {};
  const updates = {};

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      return reply.code(400).send({
        success: false,
        message: 'Task title cannot be empty.'
      });
    }
    updates.title = title.trim();
  }

  if (description !== undefined) updates.description = description;
  if (status !== undefined) updates.status = status;
  if (priority !== undefined) updates.priority = priority;
  if (due_date !== undefined) updates.due_date = due_date;

  if (Object.keys(updates).length === 0) {
    return reply.code(400).send({
      success: false,
      message: 'At least one field is required to update.'
    });
  }

  try {
    const [updatedTask] = await db('tasks')
      .where({
        id,
        user_id: currentUser.id
      })
      .update(updates)
      .returning('*');

    if (!updatedTask) {
      return reply.code(404).send({
        success: false,
        message: 'Task not found.'
      });
    }

    return reply.code(200).send({
      success: true,
      message: 'Task updated successfully.',
      data: updatedTask
    });
  } catch (error) {
    console.error('updateTask error:', error);
    request.log?.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Failed to update task.',
      error: error.message
    });
  }
}

/**
 * DELETE a task belonging to the logged-in user.
 * DELETE /api/tasks/:id
 */
export async function deleteTask(request, reply) {
  const currentUser = await getAuthenticatedUser(request);

  if (!currentUser) {
    return reply.code(401).send({
      success: false,
      message: 'User account not found or inactive.'
    });
  }

  const { id } = request.params || {};

  if (!id) {
    return reply.code(400).send({
      success: false,
      message: 'Task ID is required.'
    });
  }

  try {
    const deletedCount = await db('tasks')
      .where({
        id,
        user_id: currentUser.id
      })
      .del();

    if (deletedCount === 0) {
      return reply.code(404).send({
        success: false,
        message: 'Task not found.'
      });
    }

    return reply.code(200).send({
      success: true,
      message: 'Task deleted successfully.'
    });
  } catch (error) {
    console.error('deleteTask error:', error);
    request.log?.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Failed to delete task.',
      error: error.message
    });
  }
}