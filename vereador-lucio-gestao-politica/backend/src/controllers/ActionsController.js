const db = require('../database/db');

exports.getActions = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tarefas');
        res.json(result.rows);
    } catch (err) {
        console.error('Erro ao obter ações:', err.message);
        res.status(500).send('Erro no servidor ao buscar ações');
    }
};

exports.createAction = async (req, res) => {
    const { name, status, responsible, date } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO tarefas (name, status, responsible, date) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, status, responsible, date]
        );
        res.status(201).json({ message: 'Ação criada com sucesso!', action: result.rows[0] });
    } catch (err) {
        console.error('Erro ao criar ação:', err.message);
        res.status(500).send('Erro no servidor ao criar ação');
    }
};

exports.deleteAction = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM tarefas WHERE id = $1', [id]);
        res.status(200).json({ message: 'Ação excluída com sucesso!', deletedId: id });
    } catch (err) {
        console.error('Erro ao deletar ação:', err.message);
        res.status(500).send('Erro no servidor ao deletar ação');
    }
};

exports.updateAction = async (req, res) => {
    const { id } = req.params;
    const { name, status, responsible, date } = req.body;
    try {
        const result = await db.query(
            'UPDATE tarefas SET name = $1, status = $2, responsible = $3, date = $4 WHERE id = $5 RETURNING *',
            [name, status, responsible, date, id]
        );
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Ação atualizada com sucesso!', action: result.rows[0] });
        } else {
            res.status(404).json({ message: 'Ação não encontrada.' });
        }
    } catch (err) {
        console.error('Erro ao atualizar ação:', err.message);
        res.status(500).send('Erro no servidor ao atualizar ação');
    }
};