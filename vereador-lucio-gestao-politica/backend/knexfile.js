// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg', // Indica que estamos usando PostgreSQL
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      tableName: 'knex_migrations', // Tabela para rastrear as migrations
      directory: './migrations' // Onde os arquivos de migration serão salvos
    },
    seeds: {
      directory: './seeds'
    }
  },
};