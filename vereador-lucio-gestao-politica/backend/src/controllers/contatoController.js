const Contato = require('../models/contatoModel');

exports.createContato = async (req, res) => {
    try {
        const user_id = req.user.id;
        const dadosCompletos = {
            ...req.body,
            user_id: user_id 
        };
        
        const novoContato = await Contato.create(dadosCompletos);
        res.status(201).json(novoContato);

    } catch (err) {
        console.error("ERRO AO CRIAR CONTATO:", err); 
        res.status(500).json({ message: 'Erro ao criar contato.', error: err.message });
    }
};

exports.getAllContatos = async (req, res) => {
    try {
        const contatos = await Contato.findAll();
        res.status(200).json(contatos);
    } catch (err) {
        console.error("ERRO AO BUSCAR CONTATOS:", err); 
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
        console.error("ERRO AO ATUALIZAR CONTATO:", err); 
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
        console.error("ERRO AO DELETAR CONTATO:", err); 
        res.status(500).json({ message: 'Erro ao deletar contato.', error: err.message });
    }
};