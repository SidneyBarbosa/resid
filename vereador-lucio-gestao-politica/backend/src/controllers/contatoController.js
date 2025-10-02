// backend/src/controllers/contatoController.js
const Contato = require('../models/contatoModel');
const Tarefa = require('../models/tarefaModel');

exports.createContato = async (req, res) => {
    try {
        // O campo 'criar_tarefa' virá do formulário
        const { criar_tarefa, ...contatoData } = req.body;

        // 1. Cria o contato
        const novoContato = await Contato.create(contatoData);

        // 2. Se a flag 'criar_tarefa' for 'SIM', cria a tarefa associada
        if (criar_tarefa === 'SIM' && novoContato) {
            const tarefaData = {
                title: `Acompanhar contato: ${novoContato.nome_completo}`,
                description: novoContato.assunto || 'Realizar primeiro contato e acompanhamento.',
                dueDate: null, // Sem data de vencimento inicial
                priority: 'Média',
                responsible: novoContato.assessor_parlamentar || null,
                status: 'A Fazer',
                createdBy: novoContato.profile_id, // Criado pelo mesmo usuário que cadastrou o contato
                contato_id: novoContato.id // Vincula a tarefa ao contato recém-criado
            };
            await Tarefa.create(tarefaData);
        }

        res.status(201).json(novoContato);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar contato.', error: err.message });
    }
};

exports.getAllContatos = async (req, res) => {
    try {
        const contatos = await Contato.findAll();
        res.status(200).json(contatos);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar contatos.', error: err.message });
    }
};

exports.updateContato = async (req, res) => {
    try {
        const { id } = req.params;
        const contatoAtualizado = await Contato.update(id, req.body);
        if (!contatoAtualizado) return res.status(404).json({ message: 'Contato não encontrado.' });
        res.status(200).json(contatoAtualizado);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar contato.', error: err.message });
    }
};

exports.deleteContato = async (req, res) => {
    try {
        const { id } = req.params;
        const contatoDeletado = await Contato.delete(id);
        if (!contatoDeletado) return res.status(404).json({ message: 'Contato não encontrado.' });
        res.status(200).json({ message: 'Contato deletado com sucesso.' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar contato.', error: err.message });
    }
};