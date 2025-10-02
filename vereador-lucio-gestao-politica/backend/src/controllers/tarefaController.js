// backend/src/controllers/tarefaController.js

const Tarefa = require('../models/tarefaModel');

// Criar uma nova tarefa
exports.createTarefa = async (req, res) => {
    try {
        const novaTarefa = await Tarefa.create(req.body);
        res.status(201).json(novaTarefa);
    } catch (err) {
        console.error('Erro ao criar tarefa:', err.message);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// Obter todas as tarefas
exports.getAllTarefas = async (req, res) => {
    try {
        const tarefas = await Tarefa.findAll();
        res.status(200).json(tarefas);
    } catch (err) {
        console.error('Erro ao buscar tarefas:', err.message);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// Obter uma tarefa por ID
exports.getTarefaById = async (req, res) => {
    try {
        const { id } = req.params;
        const tarefa = await Tarefa.findById(id);
        if (!tarefa) {
            return res.status(404).json({ message: 'Tarefa não encontrada.' });
        }
        res.status(200).json(tarefa);
    } catch (err) {
        console.error('Erro ao buscar tarefa por ID:', err.message);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// Atualizar uma tarefa
exports.updateTarefa = async (req, res) => {
    try {
        const { id } = req.params;
        const tarefaAtualizada = await Tarefa.update(id, req.body);
        if (!tarefaAtualizada) {
            return res.status(404).json({ message: 'Tarefa não encontrada para atualizar.' });
        }
        res.status(200).json(tarefaAtualizada);
    } catch (err) {
        console.error('Erro ao atualizar tarefa:', err.message);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

// Deletar uma tarefa
exports.deleteTarefa = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Tarefa.deleteById(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Tarefa não encontrada para deletar.' });
        }
        res.status(204).send(); // 204 No Content - sucesso, sem corpo de resposta
    } catch (err) {
        console.error('Erro ao deletar tarefa:', err.message);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};