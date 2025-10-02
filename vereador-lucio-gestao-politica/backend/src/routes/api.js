// backend/src/routes/api.js

const express = require('express');
const router = express.Router();

// Importar os controladores
const authController = require('../controllers/authController');
const eleicoesController = require('../controllers/eleicoesController');
const tarefaController = require('../controllers/tarefaController');
const dashboardController = require('../controllers/DashboardController');

// --- Rotas de Autenticação ---
router.post('/login', authController.login);

// --- Rotas de Eleições ---
router.get('/eleicoes', eleicoesController.getAllEleicoes);
router.get('/eleicoes/stats', eleicoesController.getEleicaoStats);

// --- Rotas de Tarefas (CRUD Completo) ---
router.post('/tarefas', tarefaController.createTarefa);         // Criar uma nova tarefa
router.get('/tarefas', tarefaController.getAllTarefas);           // Listar todas as tarefas
router.get('/tarefas/:id', tarefaController.getTarefaById);       // Obter uma tarefa específica
router.put('/tarefas/:id', tarefaController.updateTarefa);        // Atualizar uma tarefa
router.delete('/tarefas/:id', tarefaController.deleteTarefa);   // Deletar uma tarefa

// --- Rota do Dashboard ---
router.get('/dashboard/stats', dashboardController.getDashboardStats);

module.exports = router;