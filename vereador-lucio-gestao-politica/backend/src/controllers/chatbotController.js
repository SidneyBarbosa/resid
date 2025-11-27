// backend/src/controllers/chatbotController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const DashboardModel = require('../models/dashboardModel'); // 1. Importamos o Model
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Mensagem é obrigatória' });
        }

        // 2. BUSCAMOS OS DADOS ATUAIS DO SISTEMA
        // Aproveitamos a função que já alimenta o dashboard
        const stats = await DashboardModel.getStats();

        // 3. FORMATAMOS OS DADOS PARA A IA ENTENDER
        // Transformamos o objeto JSON em um texto legível para o Gemini
        const dadosDoSistema = `
            RESUMO DOS DADOS DO SISTEMA HOJE:
            - Total de Tarefas: ${stats.totalTarefas}
            - Total de Usuários/Eleitores Cadastrados: ${stats.totalUsuarios} (Nota: no banco chamamos de Profiles ou Contatos)
            - Ações Concluídas: ${stats.totalAcoesConcluidas}
            
            - Distribuição por Sexo:
              ${stats.distributionBySex.map(s => `${s.sexo}: ${s.count}`).join(', ') || 'Sem dados'}
            
            - Principais Bairros (Top 5):
              ${stats.peopleByNeighborhood.slice(0, 5).map(b => `${b.bairro}: ${b.count}`).join(', ') || 'Sem dados'}
            
            - Status das Tarefas:
              ${stats.tasksByStatus.map(t => `${t.status}: ${t.count}`).join(', ')}
        `;

        // Configura o modelo (Use o que funcionou pra você, ex: gemini-2.0-flash ou gemini-1.5-flash)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // 4. INJETAMOS OS DADOS NO PROMPT
        const promptContexto = `
            Você é um assistente virtual inteligente especializado em Gestão Política e Estratégia Eleitoral.
            Seu nome é "Assistente Vereador Lúcio".
            Você tem acesso aos dados estatísticos do sistema em tempo real.
            
            DADOS REAIS DO SISTEMA (Use-os para responder perguntas sobre quantidades):
            ${dadosDoSistema}

            Diretrizes:
            1. Se o usuário perguntar "Quantos homens tem?", olhe os dados acima (Distribuição por Sexo) e responda o número exato.
            2. Se perguntarem sobre dados que NÃO estão na lista acima, explique educadamente que você só tem acesso aos resumos estatísticos (tarefas, sexo, bairro, totais).
            3. Além de dados, ajude com redação de ofícios, ideias de projetos de lei e estratégias.
            4. Seja conciso, direto e profissional.

            Mensagem do usuário: ${message}
        `;

        const result = await model.generateContent(promptContexto);
        const response = await result.response;
        const text = response.text();

        return res.json({ reply: text });

    } catch (error) {
        console.error("ERRO NO CHATBOT:", error);
        return res.status(500).json({ 
            error: 'Erro na IA.',
            details: error.message 
        });
    }
};