const DashboardModel = require('../models/dashboardModel'); 

exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await DashboardModel.getStats();
        res.status(200).json(stats);
    } catch (err) {
        console.error('Erro ao buscar estatísticas do dashboard:', err.message);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

exports.getReportSummary = async (req, res) => {
    try {
        const raw = await DashboardModel.getReportSummary();
        
        const n = (val) => parseInt(val, 10) || 0;

        const formattedData = {
            diario: {
                novosContatos: n(raw.contatos_diario),
                tarefasConcluidas: n(raw.tarefas_conc_diario),
                tarefasCriadas: n(raw.tarefas_criadas_diario),
                acoesCriadas: n(raw.acoes_diario)
            },
            semanal: {
                novosContatos: n(raw.contatos_semanal),
                tarefasConcluidas: n(raw.tarefas_conc_semanal),
                tarefasCriadas: n(raw.tarefas_criadas_semanal),
                acoesCriadas: n(raw.acoes_semanal)
            },
            mensal: {
                novosContatos: n(raw.contatos_mensal),
                tarefasConcluidas: n(raw.tarefas_conc_mensal),
                tarefasCriadas: n(raw.tarefas_criadas_mensal),
                acoesCriadas: n(raw.acoes_mensal)
            },
            anual: {
                novosContatos: n(raw.contatos_anual),
                tarefasConcluidas: n(raw.tarefas_conc_anual),
                tarefasCriadas: n(raw.tarefas_criadas_anual),
                acoesCriadas: n(raw.acoes_anual)
            }
        };

        res.status(200).json(formattedData);

    } catch (err) {
        console.error("Erro ao buscar resumo do dashboard:", err);
        res.status(500).json({ message: 'Erro interno ao calcular resumo.' });
    }
};