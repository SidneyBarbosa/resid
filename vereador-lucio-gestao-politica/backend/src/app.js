const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares - IMPORTANTE: A ordem importa!
app.use(express.json()); // Habilita o servidor a ler o corpo das requisições em formato JSON
app.use(cors());         // Permite que o frontend (em outra porta) se comunique com o backend

// Importa e usa as rotas
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); // Todas as suas rotas de API começarão com /api

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});