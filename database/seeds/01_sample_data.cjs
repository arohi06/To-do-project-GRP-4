const bcrypt = require('../../backend/node_modules/bcryptjs');
const { randomUUID } = require('crypto');

exports.seed = async function (knex) {
  const demoEmails = [
    'admin@example.com',
    'alex@example.com',
    'maya@example.com'
  ];

  
  const existingUsers = await knex('users')
    .whereIn('email', demoEmails)
    .select('id');

  if (existingUsers.length > 0) {
    await knex('tasks')
      .whereIn('user_id', existingUsers.map(user => user.id))
      .del();

    await knex('users')
      .whereIn('email', demoEmails)
      .del();
  }

  
  const passwordHash = await bcrypt.hash('Demo@12345', 10);

  const adminId = randomUUID();
  const alexId = randomUUID();
  const mayaId = randomUUID();

  await knex('users').insert([
    {
      id: adminId,
      name: 'Admin Demo',
      email: 'admin@example.com',
      password_hash: passwordHash,
      role: 'admin'
    },
    {
      id: alexId,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password_hash: passwordHash,
      role: 'user'
    },
    {
      id: mayaId,
      name: 'Maya Sharma',
      email: 'maya@example.com',
      password_hash: passwordHash,
      role: 'user'
    }
  ]);

  await knex('tasks').insert([
    {
      user_id: alexId,
      title: 'Learn Angular components',
      description: 'Practise creating and using Angular components.',
      status: 'pending',
      priority: 'high'
    },
    {
      user_id: alexId,
      title: 'Build task dashboard',
      description: 'Create the main dashboard interface.',
      status: 'completed',
      priority: 'medium'
    },
    {
      user_id: alexId,
      title: 'Test task API',
      description: 'Verify task CRUD operations.',
      status: 'pending',
      priority: 'low'
    },
    {
      user_id: mayaId,
      title: 'Learn PostgreSQL',
      description: 'Practise basic SQL queries.',
      status: 'completed',
      priority: 'medium'
    },
    {
      user_id: mayaId,
      title: 'Create login page',
      description: 'Build the login form and validation.',
      status: 'pending',
      priority: 'high'
    },
    {
      user_id: mayaId,
      title: 'Review project documentation',
      description: 'Check the project requirements.',
      status: 'pending',
      priority: 'low'
    }
  ]);

  console.log('Sample users and tasks inserted successfully.');
};
