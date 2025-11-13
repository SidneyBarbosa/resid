const eleicaoModel = require('../models/eleicaoModel');

class EleicoesController {
    static async getAllEleicoes(req, res) {
        try {
            const data = await eleicaoModel.getAll();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getEleicaoStats(req, res) {
        try {
            // Correção: Tornamos o 'ano' opcional.
            // Se o frontend não enviar um ano, ele usará 2024 como padrão.
            const { ano = 2024 } = req.query; 
            
            const data = await eleicaoModel.getStats(ano);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = EleicoesController;