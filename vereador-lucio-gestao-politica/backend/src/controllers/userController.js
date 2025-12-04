const db = require('../database/db');
const bcrypt = require('bcryptjs');

class UserController {

    // --- LISTAR TODOS (Admin) ---
    static async findAll(req, res) {
        try {
            const query = 'SELECT id, first_name, last_name, email, role, created_at FROM "Profiles" ORDER BY id ASC';
            const result = await db.query(query);
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuários.', error: error.message });
        }
    }

    // --- CRIAR NOVO (Admin) ---
    static async create(req, res) {
        try {
            const { first_name, last_name, email, password, role = 'user' } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const query = `
                INSERT INTO "Profiles" (first_name, last_name, email, password, role)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, email, first_name, last_name, role;
            `;
            const result = await db.query(query, [first_name, last_name, email, hashedPassword, role]);
            res.status(201).json(result.rows[0]);
        } catch (error) {
            if (error.code === '23505') return res.status(409).json({ message: 'E-mail já existe.' });
            res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
        }
    }

    // --- ATUALIZAR OUTRO USUÁRIO (Admin) - NOVO! ---
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { first_name, last_name, email, role } = req.body;

            const query = `
                UPDATE "Profiles" 
                SET first_name = $1, last_name = $2, email = $3, role = $4
                WHERE id = $5
                RETURNING id, first_name, last_name, email, role;
            `;
            
            const result = await db.query(query, [first_name, last_name, email, role, id]);

            if (result.rows.length === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });

            res.json({ message: 'Usuário atualizado com sucesso!', user: result.rows[0] });

        } catch (error) {
            if (error.code === '23505') return res.status(409).json({ message: 'E-mail já em uso.' });
            res.status(500).json({ message: 'Erro ao atualizar.', error: error.message });
        }
    }

    // --- EXCLUIR (Admin) ---
    static async delete(req, res) {
        try {
            const { id } = req.params;
            if (id === req.user.id) return res.status(403).json({ message: 'Você não pode se excluir.' });
            
            const result = await db.query('DELETE FROM "Profiles" WHERE id = $1 RETURNING *', [id]);
            if (result.rows.length === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });
            
            res.status(200).json({ message: 'Usuário excluído.' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao excluir.', error: error.message });
        }
    }

    // --- MÉTODOS DO PERFIL PESSOAL (Mantidos) ---
    static async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const result = await db.query('SELECT id, first_name, last_name, email, role FROM "Profiles" WHERE id = $1', [userId]);
            if (result.rows.length === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });
            res.status(200).json(result.rows[0]);
        } catch (error) { res.status(500).json({ message: 'Erro ao buscar perfil.' }); }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { first_name, last_name, email } = req.body;
            const result = await db.query('UPDATE "Profiles" SET first_name = $1, last_name = $2, email = $3 WHERE id = $4 RETURNING *', [first_name, last_name, email, userId]);
            res.status(200).json({ message: 'Perfil atualizado!', user: result.rows[0] });
        } catch (error) { res.status(500).json({ message: 'Erro ao atualizar.' }); }
    }

    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id; 
            const userRes = await db.query('SELECT password FROM "Profiles" WHERE id = $1', [userId]);
            if (userRes.rows.length === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });
            const isMatch = await bcrypt.compare(currentPassword, userRes.rows[0].password);
            if (!isMatch) return res.status(400).json({ message: 'Senha atual incorreta.' });
            const hashedNew = await bcrypt.hash(newPassword, 10);
            await db.query('UPDATE "Profiles" SET password = $1 WHERE id = $2', [hashedNew, userId]);
            res.status(200).json({ message: 'Senha alterada.' });
        } catch (error) { res.status(500).json({ message: 'Erro ao mudar senha.' }); }
    }
}

module.exports = UserController;