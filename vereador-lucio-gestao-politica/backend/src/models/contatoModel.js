const db = require('../database/db');

class Contato {
    static async create(data) {
        const { profile_id, nome_completo, email, telefone, endereco, bairro, cidade, estado, cep, data_nascimento, sexo, latitude, longitude, escolaridade, assessor_parlamentar, assunto, observacao } = data;
        const query = `
            INSERT INTO "contatos" (profile_id, nome_completo, email, telefone, endereco, bairro, cidade, estado, cep, data_nascimento, sexo, latitude, longitude, escolaridade, assessor_parlamentar, assunto, observacao)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
            RETURNING *;
        `;
        const params = [profile_id, nome_completo, email, telefone, endereco, bairro, cidade, estado, cep, data_nascimento, sexo, latitude, longitude, escolaridade, assessor_parlamentar, assunto, observacao];
        const result = await db.query(query, params);
        return result.rows[0];
    }

    static async findAll() {
        const result = await db.query('SELECT * FROM "contatos" ORDER BY nome_completo ASC');
        return result.rows;
    }

    static async update(id, data) {
        const { nome_completo, email, telefone, endereco, bairro, cidade, estado, cep, data_nascimento, sexo, latitude, longitude, escolaridade, assessor_parlamentar, assunto, observacao } = data;
        const query = `
            UPDATE "contatos"
            SET nome_completo = $1, email = $2, telefone = $3, endereco = $4, bairro = $5, cidade = $6, estado = $7, cep = $8, data_nascimento = $9, sexo = $10, latitude = $11, longitude = $12, escolaridade = $13, assessor_parlamentar = $14, assunto = $15, observacao = $16, updated_at = NOW()
            WHERE id = $17
            RETURNING *;
        `;
        const params = [nome_completo, email, telefone, endereco, bairro, cidade, estado, cep, data_nascimento, sexo, latitude, longitude, escolaridade, assessor_parlamentar, assunto, observacao, id];
        const result = await db.query(query, params);
        return result.rows[0];
    }

    static async delete(id) {
        const result = await db.query('DELETE FROM "contatos" WHERE id = $1 RETURNING *;', [id]);
        return result.rows[0];
    }
}

module.exports = Contato;