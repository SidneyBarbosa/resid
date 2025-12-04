const db = require('../database/db');
const bcrypt = require('bcryptjs');

class UserModel {
    
    // Busca os dados do usuário pelo ID (para preencher o formulário)
    static async findById(id) {
        const query = `
            SELECT id, name, email, role, created_at 
            FROM "users" 
            WHERE id = $1
        `;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Atualiza os dados básicos (Nome e Email)
    static async updateProfile(id, name, email) {
        const query = `
            UPDATE "users" 
            SET name = $1, email = $2, updated_at = NOW()
            WHERE id = $3
            RETURNING id, name, email;
        `;
        const result = await db.query(query, [name, email, id]);
        return result.rows[0];
    }

    // Verifica a senha atual (usado antes de trocar a senha)
    static async findByIdWithPassword(id) {
        const query = 'SELECT * FROM "users" WHERE id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Atualiza a senha
    static async updatePassword(id, newPasswordHash) {
        const query = `
            UPDATE "users" 
            SET password = $1, updated_at = NOW()
            WHERE id = $2
        `;
        await db.query(query, [newPasswordHash, id]);
    }
}

module.exports = UserModel;