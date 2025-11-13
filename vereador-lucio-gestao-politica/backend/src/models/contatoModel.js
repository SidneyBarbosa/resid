const db = require('../database/db');

class ContatoModel {
    static async create(data) {
        const { 
            user_id, nome_completo, telefone, bairro, latitude, longitude,
            data_nascimento, sexo, email, cidade, escolaridade, 
            assessor_parlamentar, assunto, observacao 
        } = data;
        
        const query = `
            INSERT INTO "contatos" (
                user_id, nome_completo, telefone, bairro, latitude, longitude,
                data_nascimento, sexo, email, cidade, escolaridade, 
                assessor_parlamentar, assunto, observacao
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;
        `;
        
        const params = [
            user_id, nome_completo, telefone, bairro, latitude, longitude,
            data_nascimento || null, sexo || null, email || null, 
            cidade || null, escolaridade || null, 
            assessor_parlamentar || null, assunto || null, 
            observacao || null
        ];

        const result = await db.query(query, params);
        return result.rows[0];
    }

    static async findAll() {
        const query = 'SELECT * FROM "contatos" ORDER BY created_at DESC';
        const result = await db.query(query);
        return result.rows;
    }

    static async update(id, data) {
        const { nome_completo, telefone, bairro, email, data_nascimento, sexo, latitude, longitude } = data;
        const query = `
            UPDATE "contatos"
            SET nome_completo = $1, telefone = $2, bairro = $3, 
                email = $4, data_nascimento = $5, sexo = $6, 
                latitude = $7, longitude = $8, updated_at = NOW()
            WHERE id = $9
            RETURNING *;
        `;
        const params = [
            nome_completo, telefone, bairro, 
            email || null, data_nascimento || null, sexo || null,
            latitude || null, longitude || null,
            id
        ];
        
        const result = await db.query(query, params);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM "contatos" WHERE id = $1 RETURNING *;';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = ContatoModel;