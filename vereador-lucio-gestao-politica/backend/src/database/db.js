const { Pool } = require('pg');
require('dotenv').config(); // <-- Esta linha é essencial

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD, // <-- Agora esta linha vai funcionar
    port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};