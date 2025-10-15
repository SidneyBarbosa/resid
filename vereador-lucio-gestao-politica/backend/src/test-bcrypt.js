// backend/src/test-bcrypt.js
const bcrypt = require('bcryptjs');

const senhaDigitada = 'senha123';
const hashDoBanco = '$2b$10$y.i3L7kS76K43DFoH4.l5.nE.wUKM10vP.yO0.3h7yJzQ8.j9G/C.';

async function testarComparacao() {
    console.log("Iniciando teste de sanidade do bcrypt...");
    const resultado = await bcrypt.compare(senhaDigitada, hashDoBanco);
    console.log("A comparação deu:", resultado);
}

testarComparacao();