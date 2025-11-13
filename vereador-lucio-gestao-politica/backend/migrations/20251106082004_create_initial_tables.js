// backend/migrations/...._create_tables.js

exports.up = function(knex) {
  return knex.schema
    .createTable('Profiles', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('first_name', 100).notNullable();
      table.string('last_name', 100).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('role', 50).defaultTo('user');
      table.timestamps(true, true);
    })
    .then(() => {
      return knex.schema.createTable('contatos', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('nome_completo', 255).notNullable();
        table.string('telefone', 50);
        table.string('bairro', 100);
        table.string('cidade', 100);
        table.string('email');
        table.date('data_nascimento');
        table.string('sexo', 50);
        table.string('escolaridade', 100);
        table.string('assessor_parlamentar', 255);
        table.text('assunto');
        table.text('observacao');
        table.decimal('latitude', 10, 7);
        table.decimal('longitude', 10, 7);
        table.uuid('user_id').references('id').inTable('Profiles').onDelete('SET NULL');
        table.timestamps(true, true);
      });
    })
    .then(() => {
      return knex.schema.createTable('tarefas', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('titulo', 255).notNullable();
        table.text('descricao');
        table.date('data_prazo');
        table.string('status', 50).defaultTo('A Fazer');
        table.string('priority', 50).defaultTo('Média');
        table.string('category', 100);
        table.string('responsible', 255);
        table.uuid('user_id').references('id').inTable('Profiles').onDelete('SET NULL');
        table.uuid('contato_id').references('id').inTable('contatos').onDelete('SET NULL');
        table.timestamps(true, true);
      });
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('tarefas')
    .dropTableIfExists('contatos')
    .dropTableIfExists('Profiles');
};