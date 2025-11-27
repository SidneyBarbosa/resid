const db = require('../database/db');
const bcrypt = require('bcryptjs');

class UserController {
    static async create(req, res) {
        try {
            const { first_name, last_name, email, password, role = 'user' } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const query = `
                INSERT INTO "Profiles" (first_name, last_name, email, password, role)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, email, first_name, last_name, role;
            `;
            const params = [first_name, last_name, email, hashedPassword, role];
            const result = await db.query(query, params);

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error(error);
            if (error.code === '23505') {
                return res.status(409).json({ message: 'Este e-mail já está em uso.' });
            }
            res.status(500).json({ message: 'Erro ao criar usuário.', error: error.message });
        }
    }

    static async findAll(req, res) {
        try {
            const result = await db.query('SELECT id, first_name, last_name, email, role, created_at FROM "Profiles" ORDER BY first_name ASC');
            res.status(200).json(result.rows);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao buscar usuários.', error: error.message });
        }
    }

    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id; 

            const userRes = await db.query('SELECT password FROM "Profiles" WHERE id = $1', [userId]);
            if (userRes.rows.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            const user = userRes.rows[0];
            const isMatch = await bcrypt.compare(currentPassword, user.password.trim());
            if (!isMatch) {
                return res.status(400).json({ message: 'A senha atual está incorreta.' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await db.query('UPDATE "Profiles" SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);

            res.status(200).json({ message: 'Senha alterada com sucesso.' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao alterar senha.', error: error.message });
        }
    }
    
    static async delete(req, res) {
        try {
            const { id } = req.params;
            if (id === req.user.id) {
                return res.status(403).json({ message: 'Você não pode excluir seu próprio perfil por esta rota.' });
            }
            
            const result = await db.query('DELETE FROM "Profiles" WHERE id = $1 RETURNING *;', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
            res.status(200).json({ message: 'Usuário excluído com sucesso.' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao excluir usuário.', error: error.message });
        }
    }
}

module.exports = UserController;