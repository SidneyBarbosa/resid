// dentro do seu novo arquivo na pasta /migrations

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  // A função 'up' CRIA as tabelas.
  // Criamos 'Profiles' primeiro, pois as outras tabelas dependem dela.
  return knex.schema
    .createTable('Profiles', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('first_name', 100).notNullable();
      table.string('last_name', 100).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('role', 50).defaultTo('user');
      table.timestamps(true, true); // Cria 'created_at' e 'updated_at'
    })
    .then(() => {
      return knex.schema.createTable('Contatos', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('nome_completo', 255).notNullable();
        table.string('telefone', 50);
        table.string('bairro', 100);
        table.decimal('latitude', 10, 7);
        table.decimal('longitude', 10, 7);
        // Chave estrangeira que se conecta à tabela 'Profiles'
        table.uuid('profile_id').references('id').inTable('Profiles').onDelete('SET NULL');
        table.timestamps(true, true);
      });
    })
    .then(() => {
      return knex.schema.createTable('Acoes', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('titulo', 255).notNullable();
        table.text('descricao');
        table.string('tipo', 100).notNullable();
        table.date('data').notNullable();
        table.string('bairro', 100);
        table.boolean('concluida').defaultTo(false);
        table.uuid('municipioId'); // Pode ser usado no futuro
        table.uuid('profile_id').references('id').inTable('Profiles').onDelete('SET NULL');
        table.timestamps(true, true);
      });
    })
    .then(() => {
      return knex.schema.createTable('Tarefas', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('titulo', 255).notNullable();
        table.text('descricao');
        table.date('data_prazo');
        table.boolean('concluida').defaultTo(false);
        table.uuid('profile_id').references('id').inTable('Profiles').onDelete('SET NULL');
        table.timestamps(true, true);
      });
    })
    .then(() => {
      return knex.schema.createTable('RegistrosFinanceiros', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.date('data_registro').notNullable();
        table.decimal('valor_locacao_imovel', 10, 2).defaultTo(0.00);
        table.decimal('valor_assessoria_juridica', 10, 2).defaultTo(0.00);
        table.decimal('valor_assessoria_comunicacao', 10, 2).defaultTo(0.00);
        table.decimal('valor_combustivel', 10, 2).defaultTo(0.00);
        table.decimal('despesas_debito', 10, 2).defaultTo(0.00);
        table.decimal('despesas_credito', 10, 2).defaultTo(0.00);
        table.decimal('outras_despesas', 10, 2).defaultTo(0.00);
        table.uuid('profile_id').references('id').inTable('Profiles').onDelete('SET NULL');
        table.timestamps(true, true);
      });
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  // A função 'down' DELETA as tabelas (rollback).
  // É crucial deletar na ORDEM INVERSA da criação para evitar erros de chave estrangeira.
  return knex.schema
    .dropTable('RegistrosFinanceiros')
    .then(() => knex.schema.dropTable('Tarefas'))
    .then(() => knex.schema.dropTable('Acoes'))
    .then(() => knex.schema.dropTable('Contatos'))
    .then(() => knex.schema.dropTable('Profiles'));
};