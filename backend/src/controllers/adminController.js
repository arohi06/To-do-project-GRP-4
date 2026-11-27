
import db from '../database/knex.js';

// GET /api/admin/overview
export async function getAdminOverview(request, reply) {
  try {
    const [
      usersResult,
      activeUsersResult,
      tasksResult,
      completedResult,
      pendingResult
    ] = await Promise.all([
      db('users').count('* as total').first(),
      db('users').where({ is_active: true }).count('* as total').first(),
      db('tasks').count('* as total').first(),
      db('tasks').where({ status: 'completed' }).count('* as total').first(),
      db('tasks').where({ status: 'pending' }).count('* as total').first()
    ]);

    return {
      success: true,
      data: {
        totalUsers: Number(usersResult.total),
        activeUsers: Number(activeUsersResult.total),
        totalTasks: Number(tasksResult.total),
        completedTasks: Number(completedResult.total),
        pendingTasks: Number(pendingResult.total)
      }
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Unable to load admin overview.'
    });
  }
}

// GET /api/admin/users
export async function getAdminUsers(request, reply) {
  try {
    const users = await db('users')
      .select('id', 'name', 'email', 'role', 'is_active', 'created_at')
      .orderBy('created_at', 'desc');

    return { success: true, count: users.length, data: users };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Unable to retrieve users.'
    });
  }
}

// GET /api/admin/tasks
export async function getAdminTasks(request, reply) {
  try {
    const tasks = await db('tasks')
      .leftJoin('users', 'tasks.user_id', 'users.id')
      .select(
        'tasks.*',
        'users.name as user_name',
        'users.email as user_email'
      )
      .orderBy('tasks.created_at', 'desc');

    return { success: true, count: tasks.length, data: tasks };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Unable to retrieve all tasks.'
    });
  }
}

// PATCH /api/admin/users/:id/status
export async function updateUserStatus(request, reply) {
  try {
    const { id } = request.params;
    const { is_active } = request.body || {};

    if (typeof is_active !== 'boolean') {
      return reply.code(400).send({
        success: false,
        message: 'is_active must be true or false.'
      });
    }

    if (id === request.user.sub && !is_active) {
      return reply.code(400).send({
        success: false,
        message: 'You cannot deactivate your own account.'
      });
    }

    const targetUser = await db('users').where({ id }).first();

    if (!targetUser) {
      return reply.code(404).send({
        success: false,
        message: 'User not found.'
      });
    }

    if (targetUser.role === 'admin') {
      return reply.code(403).send({
        success: false,
        message: 'Admin accounts cannot be changed here.'
      });
    }

    const [updatedUser] = await db('users')
      .where({ id })
      .update({ is_active })
      .returning(['id', 'name', 'email', 'role', 'is_active']);

    return {
      success: true,
      message: is_active
        ? 'User account activated.'
        : 'User account deactivated.',
      data: updatedUser
    };
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({
      success: false,
      message: 'Unable to update user status.'
    });
  }
}
