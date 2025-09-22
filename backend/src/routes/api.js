const express = require('express');
const router = express.Router();

const actionsController = require('../controllers/ActionsController');

// Rota de Login
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const emailCorreto = 'usuario@teste.com';
    const senhaCorreta = 'senha123';

    if (email === emailCorreto && senha === senhaCorreta) {
        return res.status(200).send('Login bem-sucedido!');
    } else {
        return res.status(401).send('Credenciais inválidas. Verifique seu e-mail e senha.');
    }
});

// Rotas de Ações (o código que você já tinha)
router.get('/actions', actionsController.getActions);
router.post('/actions', actionsController.createAction);
router.delete('/actions/:id', actionsController.deleteAction);
router.put('/actions/:id', actionsController.updateAction);

module.exports = router;