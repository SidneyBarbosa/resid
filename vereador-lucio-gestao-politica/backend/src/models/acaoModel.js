// backend/src/models/acaoModel.js
const db = require('../database/db');

// O NOME CORRETO DA TABELA É 'acoes' (minúsculo)
const TABLE_NAME = 'acoes'; 

class AcaoModel {
    
    static async create(data) {
        const chaves = Object.keys(data);
        const valores = Object.values(data);
        const placeholders = chaves.map((_, i) => `$${i + 1}`).join(', ');
        
        // As aspas duplas ("") garantem que ele encontre a tabela minúscula
        const query = `
            INSERT INTO "${TABLE_NAME}" (${chaves.map(c => `"${c}"`).join(', ')})
            VALUES (${placeholders})
            RETURNING id;
        `;
        
        try {
            const result = await db.query(query, valores);
            return result.rows[0];
        } catch (error) {
            console.error("Erro ao criar Ação:", error);
            throw error;
        }
    }

    static async findAll() {
        const query = `
            SELECT * FROM "${TABLE_NAME}"
            ORDER BY data DESC;
        `;
        
        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error("Erro ao buscar Ações:", error);
            throw error;
        }
    }

    static async update(id, data) {
        delete data.updated_at; // Evita o erro de 'updated_at' duplicado

        const campos = Object.keys(data).map((chave, i) => `"${chave}" = $${i + 1}`).join(', ');
        const valores = Object.values(data);
        
        const query = `
            UPDATE "${TABLE_NAME}"
            SET ${campos}, updated_at = NOW() 
            WHERE id = $${valores.length + 1}
            RETURNING *;
        `;
        
        try {
            const result = await db.query(query, [...valores, id]);
            return result.rows[0];
        } catch (error) {
            console.error("Erro ao atualizar Ação:", error);
            throw error;
        }
    }

    static async delete(id) {
        const query = `DELETE FROM "${TABLE_NAME}" WHERE id = $1 RETURNING *;`;
        try {
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error("Erro ao deletar Ação:", error);
            throw error;
        }
    }
}

module.exports = AcaoModel;