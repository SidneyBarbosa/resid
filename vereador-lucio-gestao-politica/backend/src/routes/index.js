const express = require('express');
const router = express.Router();
const apiRoutes = require('./routes/api');

// Middleware para garantir que o corpo da requisição seja lido como JSON
router.use(express.json());

// Rota de teste
router.get('/', (req, res) => {
    res.send('Servidor do Vereador Lúcio Flávio está online!');
});

// Todas as rotas que começam com /api serão tratadas pelo arquivo api.js
router.use('/api', apiRoutes);

module.exports = router;