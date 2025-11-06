// backend/src/controllers/acaoController.js
const db = require('../database/db');

exports.findAll = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM "Acoes" ORDER BY data DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send('Erro no servidor ao buscar ações');
    }
};

exports.create = async (req, res) => {
    const { titulo, descricao, tipo, data, municipioId, bairro, concluida } = req.body;
    try {
        const result = await db.query(
        'INSERT INTO "Acoes" (titulo, descricao, tipo, data, "municipioId", bairro, concluida) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [titulo, descricao, tipo, data, municipioId, bairro, concluida]
    );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Erro no servidor ao criar ação');
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
   const { titulo, descricao, tipo, data, municipioId, bairro, concluida } = req.body;
    try {
         const result = await db.query(
        'UPDATE "Acoes" SET titulo = $1, descricao = $2, tipo = $3, data = $4, "municipioId" = $5, bairro = $6, concluida = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
        [titulo, descricao, tipo, data, municipioId, bairro, concluida, id]
    );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Ação não encontrada.' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send('Erro no servidor ao atualizar ação');
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM "Acoes" WHERE id = $1', [id]);
        res.status(204).send(); // 204 No Content
    } catch (err) {
        res.status(500).send('Erro no servidor ao deletar ação');
    }
};