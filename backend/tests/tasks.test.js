
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp } from '../src/app.js';
import db from '../src/database/knex.js';

test('Task REST API Endpoints Test Suite', async (t) => {
  const app = await buildApp({ logger: false });

  t.after(async () => {
    await app.close();
    await db.destroy();
  });

  let createdTaskId = null;
  let testUserId = null;
  let authToken = null;

  // Setup: Log in using the seeded test user
  const existingUser = await db('users')
    .where({
      email: 'alex@example.com',
      is_active: true,
      role: 'user'
    })
    .first();

  assert.ok(existingUser, 'An active test user must exist');

  testUserId = existingUser.id;

  const loginResponse = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: existingUser.email,
      password: 'Demo@12345'
    }
  });

  assert.equal(loginResponse.statusCode, 200, 'Test user login must succeed');

  authToken = JSON.parse(loginResponse.body).token;
  assert.ok(authToken, 'Login must return a JWT token');

  const authHeaders = {
    authorization: `Bearer ${authToken}`
  };

  // Helper for authenticated requests
  const injectAuth = (options) => app.inject({
    ...options,
    headers: {
      ...options.headers,
      ...authHeaders
    }
  });

  await t.test('GET /api/health should return 200 OK and database status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health'
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.equal(body.database, 'connected');
  });

  await t.test('GET /api/tasks - should reject unauthenticated requests', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/tasks'
      });

      assert.equal(response.statusCode, 401);
    });

  // --- POST /api/tasks ---
  await t.test('POST /api/tasks - should successfully create a new task (201 Created)', async () => {
    const payload = {
      title: 'Automated Test Task',
      description: 'Testing task creation with Fastify and Knex',
      priority: 'high',
      status: 'pending'
    };

    const response = await injectAuth({
      method: 'POST',
      url: '/api/tasks',
      payload
    });

    assert.equal(response.statusCode, 201);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.ok(body.data.id);
    assert.equal(body.data.title, 'Automated Test Task');
    assert.equal(body.data.priority, 'high');
    assert.equal(body.data.status, 'pending');
    assert.equal(body.data.user_id, testUserId);

    createdTaskId = body.data.id;
  });

  await t.test('POST /api/tasks - should fail with 400 when title is missing', async () => {
    const response = await injectAuth({
      method: 'POST',
      url: '/api/tasks',
      payload: {
        description: 'No title provided'
      }
    });

    assert.equal(response.statusCode, 400);
    const body = JSON.parse(response.body);
    assert.equal(body.statusCode, 400);
  });

  await t.test('POST /api/tasks - should fail with 400 when title is empty whitespace', async () => {
    const response = await injectAuth({
      method: 'POST',
      url: '/api/tasks',
      payload: {
        title: '   '
      }
    });

    assert.equal(response.statusCode, 400);
    const body = JSON.parse(response.body);
    assert.equal(body.statusCode, 400);
  });

  await t.test('POST /api/tasks - should fail with 400 when status is invalid enum', async () => {
    const response = await injectAuth({
      method: 'POST',
      url: '/api/tasks',
      payload: {
        title: 'Invalid Status Task',
        status: 'in-progress'
      }
    });

    assert.equal(response.statusCode, 400);
  });

  await t.test('POST /api/tasks - should fail with 400 when priority is invalid enum', async () => {
    const response = await injectAuth({
      method: 'POST',
      url: '/api/tasks',
      payload: {
        title: 'Invalid Priority Task',
        priority: 'urgent'
      }
    });

    assert.equal(response.statusCode, 400);
  });

  await t.test('POST /api/tasks - should fail with 400 when user_id is not a valid UUID', async () => {
    const response = await injectAuth({
      method: 'POST',
      url: '/api/tasks',
      payload: {
        title: 'Invalid UUID Task',
        user_id: '123-not-a-valid-uuid'
      }
    });

    assert.equal(response.statusCode, 400);
  });

  // --- GET /api/tasks ---
  await t.test('GET /api/tasks - should return 200 OK with list of tasks', async () => {
    const response = await injectAuth({
      method: 'GET',
      url: '/api/tasks'
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.count >= 1);
  });

  await t.test('GET /api/tasks - should filter by status', async () => {
    const response = await injectAuth({
      method: 'GET',
      url: '/api/tasks?status=pending'
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.ok(body.data.every(task => task.status === 'pending'));
  });

  await t.test('GET /api/tasks - should search by keyword', async () => {
    const response = await injectAuth({
      method: 'GET',
      url: '/api/tasks?search=Automated'
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.ok(body.data.some(task => task.title.includes('Automated')));
  });

  // --- GET /api/tasks/:id ---
  await t.test('GET /api/tasks/:id - should return single task (200 OK)', async () => {
    assert.ok(createdTaskId, 'Task ID must be available');

    const response = await injectAuth({
      method: 'GET',
      url: `/api/tasks/${createdTaskId}`
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.equal(body.data.id, createdTaskId);
  });

  await t.test('GET /api/tasks/:id - should return 404 for non-existent UUID', async () => {
    const response = await injectAuth({
      method: 'GET',
      url: '/api/tasks/00000000-0000-0000-0000-000000000000'
    });

    assert.equal(response.statusCode, 404);
  });

  await t.test('GET /api/tasks/:id - should return 400 for malformed UUID', async () => {
    const response = await injectAuth({
      method: 'GET',
      url: '/api/tasks/not-a-uuid'
    });

    assert.equal(response.statusCode, 400);
  });

  // --- PUT /api/tasks/:id ---
  await t.test('PUT /api/tasks/:id - should update task status and title (200 OK)', async () => {
    const response = await injectAuth({
      method: 'PUT',
      url: `/api/tasks/${createdTaskId}`,
      payload: {
        title: 'Updated Task Title',
        status: 'completed',
        priority: 'low'
      }
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.equal(body.data.title, 'Updated Task Title');
    assert.equal(body.data.status, 'completed');
    assert.equal(body.data.priority, 'low');
  });

  await t.test('PUT /api/tasks/:id - should fail with 400 when empty body provided', async () => {
    const response = await injectAuth({
      method: 'PUT',
      url: `/api/tasks/${createdTaskId}`,
      payload: {}
    });

    assert.equal(response.statusCode, 400);
  });

  await t.test('PUT /api/tasks/:id - should return 404 for non-existent UUID', async () => {
    const response = await injectAuth({
      method: 'PUT',
      url: '/api/tasks/00000000-0000-0000-0000-000000000000',
      payload: {
        title: 'Non-existent task'
      }
    });

    assert.equal(response.statusCode, 404);
  });

  // --- DELETE /api/tasks/:id ---
  await t.test('DELETE /api/tasks/:id - should delete existing task (200 OK)', async () => {
    const response = await injectAuth({
      method: 'DELETE',
      url: `/api/tasks/${createdTaskId}`
    });

    assert.equal(response.statusCode, 200);
    const body = JSON.parse(response.body);
    assert.equal(body.success, true);
    assert.equal(body.data.id, createdTaskId);

    // Verify task is deleted
    const verifyResponse = await injectAuth({
      method: 'GET',
      url: `/api/tasks/${createdTaskId}`
    });

    assert.equal(verifyResponse.statusCode, 404);
  });

  await t.test('DELETE /api/tasks/:id - should return 404 for non-existent task', async () => {
    const response = await injectAuth({
      method: 'DELETE',
      url: '/api/tasks/00000000-0000-0000-0000-000000000000'
    });

    assert.equal(response.statusCode, 404);
  });

  await t.test('DELETE /api/tasks/:id - should return 400 for malformed UUID', async () => {
    const response = await injectAuth({
      method: 'DELETE',
      url: '/api/tasks/not-a-uuid'
    });

    assert.equal(response.statusCode, 400);
  });
});
