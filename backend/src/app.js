const express = require('express');
const cors = require('cors');
require('dotenv').config();

// O caminho foi ajustado para refletir a estrutura de pastas do seu projeto
// A pasta 'routes' está dentro de 'src'
const routes = require('./routes/api');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// A rota do frontend espera o prefixo '/api', então o Express precisa usá-lo
app.use('/api', routes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});