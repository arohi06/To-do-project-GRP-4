
import db from './knex.js';

try {
  const result = await db.raw('SELECT NOW() AS current_time');

  console.log('Database connected successfully!');
  console.log('PostgreSQL time:', result.rows[0].current_time);
} catch (error) {
  console.error('Database connection failed:', error.message);
} finally {
  await db.destroy();
}
