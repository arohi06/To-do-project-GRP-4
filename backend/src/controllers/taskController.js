
import db from '../database/knex.js';

/**
 * Retrieve the currently authenticated, active user.
 * The database is checked so that outdated JWT role information
 * cannot grant permissions after an account is changed or disabled.
 */
async function getAuthenticatedUser(request) {
  return db('users')
    .select('id', 'name', 'email', 'role', 'is_active')
    .where({
      id: request.user.sub,
      is_active: true
    })
    .first();
}

/**
 * CREATE a new task
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

  const {
    title,
    description,
    status,
    priority,
    due_date,
    user_id
  } = request.body;

  if (!title || !title.trim()) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Title is required and cannot be empty or whitespace only'
    });
  }

  // Regular users can create tasks only for themselves.
  // Administrators may assign a task to another active user.
  let assignedUserId = currentUser.id;

  if (currentUser.role === 'admin' && user_id) {
    const targetUser = await db('users')
      .where({ id: user_id, is_active: true })
      .first();

    if (!targetUser) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'The selected user does not exist or is inactive.'
      });
    }

    assignedUserId = targetUser.id;
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

  return reply.code(201).send({
    success: true,
    message: 'Task created successfully',
    data: newTask
  });
}

/**
 * READ tasks with filtering, searching and pagination.
 * Regular users see only their own tasks.
 * Administrators can see all users' tasks.
 */
export async function getTasks(request, reply) {
  const currentUser = await getAuthenticatedUser(request);

  if (!currentUser) {
    return reply.code(401).send({
      success: false,
      message: 'User account not found or inactive.'
    });
  }

  const {
    status,
    priority,
    user_id,
    search,
    limit = 50,
    offset = 0
  } = request.query;

  let query = db('tasks')
    .leftJoin('users', 'tasks.user_id', 'users.id')
    .select(
      'tasks.*',
      'users.name as user_name',
      'users.email as user_email'
    );

  // Enforce task ownership for regular users.
  if (currentUser.role !== 'admin') {
    query = query.where('tasks.user_id', currentUser.id);
  } else if (user_id) {
    // Admins may filter tasks by a particular user.
    query = query.where('tasks.user_id', user_id);
  }

  if (status) {
    query = query.where('tasks.status', status);
  }

  if (priority) {
    query = query.where('tasks.priority', priority);
  }

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;

    query = query.where(builder => {
      builder
        .whereILike('tasks.title', term)
        .orWhereILike('tasks.description', term);
    });
  }

  const tasks = await query
    .orderBy('tasks.created_at', 'desc')
    .limit(limit)
    .offset(offset);

  return reply.code(200).send({
    success: true,
    count: tasks.length,
    data: tasks
  });
}

/**
 * READ a single task by ID.
 */
export async function getTaskById(request, reply) {
  const currentUser = await getAuthenticatedUser(request);

  if (!currentUser) {
    return reply.code(401).send({
      success: false,
      message: 'User account not found or inactive.'
    });
  }

  const { id } = request.params;

  let query = db('tasks')
    .leftJoin('users', 'tasks.user_id', 'users.id')
    .select(
      'tasks.*',
      'users.name as user_name',
      'users.email as user_email'
    )
    .where('tasks.id', id);

  if (currentUser.role !== 'admin') {
    query = query.where('tasks.user_id', currentUser.id);
  }

  const task = await query.first();

  if (!task) {
    return reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Task with id "${id}" not found`
    });
  }

  return reply.code(200).send({
    success: true,
    data: task
  });
}

/**
 * UPDATE an existing task.
 */
export async function updateTask(request, reply) {
  const currentUser = await getAuthenticatedUser(request);

  if (!currentUser) {
    return reply.code(401).send({
      success: false,
      message: 'User account not found or inactive.'
    });
  }

  const { id } = request.params;
  const updates = request.body;

  if (!updates || Object.keys(updates).length === 0) {
    return reply.code(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'At least one field must be provided to update'
    });
  }

  if (updates.title !== undefined) {
    if (typeof updates.title !== 'string' || !updates.title.trim()) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Title cannot be empty or whitespace only'
      });
    }
  }

  // Find the task while enforcing ownership.
  let taskQuery = db('tasks').where({ id });

  if (currentUser.role !== 'admin') {
    taskQuery = taskQuery.where('user_id', currentUser.id);
  }

  const existingTask = await taskQuery.first();

  if (!existingTask) {
    return reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Task with id "${id}" not found`
    });
  }

  const updateData = {
    updated_at: db.fn.now()
  };

  if (updates.title !== undefined) {
    updateData.title = updates.title.trim();
  }

  if (updates.description !== undefined) {
    updateData.description = updates.description;
  }

  if (updates.status !== undefined) {
    updateData.status = updates.status;
  }

  if (updates.priority !== undefined) {
    updateData.priority = updates.priority;
  }

  if (updates.due_date !== undefined) {
    updateData.due_date = updates.due_date;
  }

  // Only administrators can reassign a task to another user.
  if (updates.user_id !== undefined && currentUser.role === 'admin') {
    const targetUser = await db('users')
      .where({
        id: updates.user_id,
        is_active: true
      })
      .first();

    if (!targetUser) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'The selected user does not exist or is inactive.'
      });
    }

    updateData.user_id = targetUser.id;
  }

  let updateQuery = db('tasks').where({ id });

  if (currentUser.role !== 'admin') {
    updateQuery = updateQuery.where('user_id', currentUser.id);
  }

  const [updatedTask] = await updateQuery
    .update(updateData)
    .returning('*');

  if (!updatedTask) {
    return reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Task with id "${id}" not found`
    });
  }

  return reply.code(200).send({
    success: true,
    message: 'Task updated successfully',
    data: updatedTask
  });
}

/**
 * DELETE a task.
 */
export async function deleteTask(request, reply) {
  const currentUser = await getAuthenticatedUser(request);

  if (!currentUser) {
    return reply.code(401).send({
      success: false,
      message: 'User account not found or inactive.'
    });
  }

  const { id } = request.params;

  let deleteQuery = db('tasks').where({ id });

  if (currentUser.role !== 'admin') {
    deleteQuery = deleteQuery.where('user_id', currentUser.id);
  }

  const [deletedTask] = await deleteQuery
    .del()
    .returning('*');

  if (!deletedTask) {
    return reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Task with id "${id}" not found`
    });
  }

  return reply.code(200).send({
    success: true,
    message: 'Task deleted successfully',
    data: deletedTask
  });
}
