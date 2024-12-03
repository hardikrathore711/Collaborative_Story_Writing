const knex = require('knex');
require('dotenv').config();

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1', // Default to localhost
    user: process.env.DB_USER || 'postgres', // Default to postgres
    password: process.env.DB_PASSWORD || 'mysql123', // Default password
    database: process.env.DB_NAME || 'story_platform', // Default database
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port
  },
});

module.exports = db;

