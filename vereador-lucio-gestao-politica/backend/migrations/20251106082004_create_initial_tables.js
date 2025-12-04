exports.up = function(knex) {
  return knex.schema
    // --- 1. TABELA DE PERFIS (USUÁRIOS) ---
    .createTable('Profiles', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('first_name', 100).notNullable();
      table.string('last_name', 100).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.string('role', 50).defaultTo('user'); // 'admin' ou 'user'
      table.timestamps(true, true);
    })

    // --- 2. TABELA DE CONTATOS (ELEITORES) ---
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
        // Coordenadas para Mapa de Calor
        table.decimal('latitude', 10, 7);
        table.decimal('longitude', 10, 7);
        // Quem cadastrou
        table.uuid('user_id').references('id').inTable('Profiles').onDelete('SET NULL');
        table.timestamps(true, true);
      });
    })

    // --- 3. TABELA DE TAREFAS ---
    .then(() => {
      return knex.schema.createTable('tarefas', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('titulo', 255).notNullable();
        table.text('descricao');
        table.date('data_prazo');
        table.string('status', 50).defaultTo('A Fazer');
        table.string('priority', 50).defaultTo('Média');
        table.string('category', 100);
        table.string('responsible', 255); // Pode ser nome ou linkar com User
        // Vínculos
        table.uuid('user_id').references('id').inTable('Profiles').onDelete('SET NULL');
        table.uuid('contato_id').references('id').inTable('contatos').onDelete('SET NULL');
        table.timestamps(true, true);
      });
    })

    // --- 4. TABELA FINANCEIRA (NOVA) ---
    .then(() => {
      return knex.schema.createTable('financeiro', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('descricao', 255).notNullable();
        table.string('tipo', 20).notNullable(); // 'receita' ou 'despesa'
        table.decimal('valor', 14, 2).notNullable(); // Suporta até 999 bilhões
        table.string('categoria', 100);
        table.date('data').defaultTo(knex.fn.now());
        table.uuid('user_id').references('id').inTable('Profiles').onDelete('SET NULL');
        table.timestamps(true, true);
      });
    })

    // --- 5. TABELA DE AÇÕES/EVENTOS (NOVA - Para o Mapa do Dashboard) ---
    .then(() => {
      return knex.schema.createTable('acoes', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('titulo', 255).notNullable();
        table.text('descricao');
        table.date('data');
        table.string('local', 255);
        table.string('status', 50).defaultTo('planejada'); // planejada, concluida, cancelada
        // Coordenadas para o Mapa
        table.decimal('latitude', 10, 7);
        table.decimal('longitude', 10, 7);
        table.uuid('user_id').references('id').inTable('Profiles').onDelete('SET NULL');
        table.timestamps(true, true);
      });
    })

    // --- 6. TABELA DE ELEIÇÕES (NOVA - Para metas de votos) ---
    .then(() => {
      return knex.schema.createTable('eleicoes', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('nome', 100).notNullable(); // Ex: "Eleição 2026"
        table.date('data_eleicao');
        table.string('cargo', 100); // Ex: "Vereador"
        table.integer('meta_votos').defaultTo(0);
        table.timestamps(true, true);
      });
    });
};

exports.down = function(knex) {
  // Ordem reversa para evitar erro de chave estrangeira
  return knex.schema
    .dropTableIfExists('eleicoes')
    .dropTableIfExists('acoes')
    .dropTableIfExists('financeiro')
    .dropTableIfExists('tarefas')
    .dropTableIfExists('contatos')
    .dropTableIfExists('Profiles');
};