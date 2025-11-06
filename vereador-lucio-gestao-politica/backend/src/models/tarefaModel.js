const db = require('../database/db');

class Tarefa {
    static async create({ user_id, titulo, descricao, data, status = 'pendente', category, priority, responsible }) {
        const query = `
            INSERT INTO "tarefas" (user_id, titulo, descricao, data, status, category, priority, responsible)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *;
        `;
        const params = [user_id, titulo, descricao, data, status, category, priority, responsible];
        const result = await db.query(query, params);
        return result.rows[0];
    }

    static async findAll() {
        const query = `
            SELECT t.*, p.first_name, p.last_name FROM "tarefas" t
            LEFT JOIN "Profiles" p ON t.user_id = p.id
            ORDER BY t.created_at DESC;
        `;
        const result = await db.query(query);
        return result.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM "tarefas" WHERE id = $1;';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

   static async update(id, { titulo, descricao, data, status, category, priority, responsible }) {
        const query = `
            UPDATE "tarefas"
            SET titulo = $1, descricao = $2, data = $3, status = $4, category = $5, priority = $6, responsible = $7, updated_at = NOW()
            WHERE id = $8
            RETURNING *;
        `;
        const params = [titulo, descricao, data, status, category, priority, responsible, id];
        const result = await db.query(query, params);
        return result.rows[0];
    }

    static async deleteById(id) {
        const query = 'DELETE FROM "tarefas" WHERE id = $1 RETURNING *;';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = Tarefa;