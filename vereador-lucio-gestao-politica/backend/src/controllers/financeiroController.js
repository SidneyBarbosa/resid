const FinanceiroModel = require('../models/financeiroModel');

class FinanceiroController {
    static async create(req, res) {
        try {
            const profile_id = req.user.id; 
            const data = { ...req.body, profile_id };

            const registro = await FinanceiroModel.create(data);
            res.status(201).json(registro);
        } catch (error) {
            console.error("Erro ao criar registro financeiro:", error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }

    static async findAll(req, res) {
        try {
            const registros = await FinanceiroModel.findAll();
            res.status(200).json(registros);
        } catch (error) {
            console.error("Erro ao buscar registros financeiros:", error);
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}

module.exports = FinanceiroController;