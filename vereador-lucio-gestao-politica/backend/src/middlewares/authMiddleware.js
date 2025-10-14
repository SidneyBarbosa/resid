// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // O token vem no formato "Bearer TOKEN"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        // Verifica se o token é válido usando o segredo do .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona os dados do usuário (id, role) à requisição
        next(); // Permite que a requisição continue para o controller
    } catch (err) {
        res.status(403).json({ message: 'Token inválido.' });
    }
};

exports.isAdmin = (req, res, next) => {
    // Este middleware roda DEPOIS do ensureAuthenticated
    if (req.user.role !== 'admin' && req.user.role !== 'vereador') {
        return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
    }
    next();
};