// backend/src/controllers/DashboardController.js

const DashboardModel = require('../models/dashboardModel');

// A função é exportada diretamente aqui com o nome 'getDashboardStats'
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await DashboardModel.getStats();
        res.status(200).json(stats);
    } catch (err) {
        console.error('Erro ao buscar estatísticas do dashboard:', err.message);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};