// backend/src/controllers/acaoController.js
const AcaoModel = require('../models/acaoModel');
const TarefaModel = require('../models/tarefaModel');
const db = require('../database/db');

class AcaoController {
    
    // Função interna para buscar lat/lng do bairro
    static async getCoordsFromBairro(bairroNome, municipioIbgeId) {
        if (!bairroNome || !municipioIbgeId) {
            return { latitude: null, longitude: null };
        }
        try {
            const query = `
                SELECT latitude, longitude 
                FROM public.bairros 
                WHERE nome = $1 AND municipio_ibge_id = $2;
            `;
            const result = await db.query(query, [bairroNome, municipioIbgeId]);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            return { latitude: null, longitude: null };
        } catch (error) {
            console.error("Erro ao buscar coordenadas do bairro:", error);
            return { latitude: null, longitude: null };
        }
    }

    static async create(req, res) {
        try {
            // Separa os dados do form
            const { criar_tarefa, municipio_id, tipo_acao, ...acaoData } = req.body;
            
            // Busca coordenadas
            const { latitude, longitude } = await AcaoController.getCoordsFromBairro(acaoData.bairro, municipio_id);

            // "Traduz" os nomes para o banco de dados 'acoes' (minúscula)
            const acaoDataCompleta = {
                ...acaoData,             
                cidade: municipio_id,    // 'municipio_id' (do form) vira 'cidade' (do banco)
                tipo: tipo_acao,         // 'tipo_acao' (do form) vira 'tipo' (do banco)
                profile_id: req.user.id,
                latitude: latitude,      
                longitude: longitude     
            };

            const novaAcao = await AcaoModel.create(acaoDataCompleta);

            // Lógica da Tarefa (correta)
            if (criar_tarefa === 'SIM') {
                const novaTarefaData = {
                    titulo: `Ação: ${acaoDataCompleta.titulo || 'Nova Ação'}`,
                    descricao: acaoDataCompleta.descricao || 'Verificar detalhes...',
                    data: acaoDataCompleta.data,
                    status: 'A Fazer',
                    priority: 'Média',
                    responsible: '',
                    category: acaoDataCompleta.tipo || 'Ações',
                    user_id: req.user.id 
                };
                await TarefaModel.create(novaTarefaData);
            }

            res.status(201).json(novaAcao);

        } catch (error) {
            console.error("ERRO AO CRIAR AÇÃO (Controller):", error.message);
            res.status(500).json({ message: error.message });
        }
    }

    static async findAll(req, res) {
        try {
            const data = await AcaoModel.findAll();
            res.status(200).json(data);
        } catch (error) {
            console.error("ERRO AO BUSCAR AÇÕES (Controller):", error.message);
            res.status(500).json({ message: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { municipio_id, tipo_acao, criar_tarefa, ...data } = req.body;

            const { latitude, longitude } = await AcaoController.getCoordsFromBairro(data.bairro, municipio_id);

            // "Traduz" no update também
            const dataToUpdate = {
                ...data,
                cidade: municipio_id,
                tipo: tipo_acao,
                latitude: latitude,
                longitude: longitude
            };
            
            delete dataToUpdate.profile_id;
            delete dataToUpdate.id;
            
            const updatedAcao = await AcaoModel.update(id, dataToUpdate);
            res.status(200).json(updatedAcao);

        } catch (error) {
            console.error("ERRO AO ATUALIZAR AÇÃO (Controller):", error.message);
            res.status(500).json({ message: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            await AcaoModel.delete(id);
            res.status(204).json();
        } catch (error) {
            console.error("ERRO AO DELETAR AÇÃO (Controller):", error.message);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = AcaoController;