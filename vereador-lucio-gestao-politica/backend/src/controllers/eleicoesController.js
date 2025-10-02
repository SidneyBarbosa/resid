const db = require('../database/db');
const EleicaoModel = require('../models/eleicaoModel');

exports.getEleicaoStats = async (req, res) => {
    try {
        const { ano } = req.query;
        if (!ano) {
            return res.status(400).json({ message: 'O ano é um parâmetro obrigatório.' });
        }
        const stats = await EleicaoModel.getStatsByYear(parseInt(ano, 10));
        res.status(200).json(stats);
    } catch (err) {
        console.error('Erro ao buscar estatísticas da eleição:', err.message);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};


exports.getAllEleicoes = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM eleicoes');
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar eleições:', error);
        res.status(500).send('Erro no servidor ao buscar eleições.');
    }
};