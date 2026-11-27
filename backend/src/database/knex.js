import knex from 'knex';
import config from '../../knexfile.cjs';

const env = process.env.NODE_ENV || 'development';
const db = knex(config[env] || config.development);

export default db;