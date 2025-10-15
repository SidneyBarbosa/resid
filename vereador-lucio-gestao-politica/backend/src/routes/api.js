// backend/src/routes/api.js

const express = require('express');
const router = express.Router();

// Importar todos os controladores e middlewares
const authController = require('../controllers/authController');
const eleicoesController = require('../controllers/eleicoesController');
const tarefaController = require('../controllers/tarefaController');
const dashboardController = require('../controllers/DashboardController');
const contatoController = require('../controllers/contatoController');
const acaoController = require('../controllers/acaoController');
const { ensureAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// --- ROTA DE AUTENTICAÇÃO (PÚBLICA) ---
// Esta rota DEVE VIR ANTES do middleware de segurança.
router.post('/login', authController.login);

// --- APLICAÇÃO DO MIDDLEWARE DE SEGURANÇA ---
// A partir daqui, todas as rotas abaixo exigirão um token válido.
router.use(ensureAuthenticated);

// --- ROTAS PROTEGIDAS ---
router.get('/eleicoes', eleicoesController.getAllEleicoes);
router.get('/eleicoes/stats', eleicoesController.getEleicaoStats);

router.post('/tarefas', tarefaController.createTarefa);
router.get('/tarefas', tarefaController.getAllTarefas);
router.get('/tarefas/:id', tarefaController.getTarefaById);
router.put('/tarefas/:id', tarefaController.updateTarefa);
router.delete('/tarefas/:id', tarefaController.deleteTarefa);

router.get('/dashboard/stats', dashboardController.getDashboardStats);

router.get('/contatos', contatoController.getAllContatos);
router.post('/contatos', contatoController.createContato);
router.put('/contatos/:id', contatoController.updateContato);
router.delete('/contatos/:id', isAdmin, contatoController.deleteContato); // Exemplo de rota apenas para admin

router.get('/acoes', acaoController.findAll);
router.post('/acoes', acaoController.create);
router.put('/acoes/:id', acaoController.update);
router.delete('/acoes/:id', acaoController.delete);

module.exports = router;