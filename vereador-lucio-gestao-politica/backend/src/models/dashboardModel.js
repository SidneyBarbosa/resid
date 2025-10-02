const db = require('../database/db');

class DashboardModel {
    static async getStats() {
        const [
            statusRes, responsavelRes, totalTarefasRes, totalUsuariosRes, acoesConcluidasRes,
            sexoRes, bairroRes, idadeRes, progressoRes
        ] = await Promise.all([
            db.query('SELECT status, COUNT(*) as count FROM "tarefas" GROUP BY status'),
            db.query('SELECT responsible, COUNT(*) as count FROM "tarefas" WHERE responsible IS NOT NULL AND responsible != \'\' GROUP BY responsible ORDER BY count DESC LIMIT 5'),
            db.query('SELECT COUNT(*) as count FROM "tarefas"'),
            db.query('SELECT COUNT(*) as count FROM "Profiles"'),
            db.query('SELECT COUNT(*) as count FROM "acoes" WHERE status = $1', ['concluida']),
            db.query('SELECT sexo, COUNT(*) as count FROM "contatos" WHERE sexo IS NOT NULL GROUP BY sexo'),
            db.query('SELECT bairro, COUNT(*) as count FROM "contatos" WHERE bairro IS NOT NULL AND bairro != \'\' GROUP BY bairro ORDER BY count DESC'),
            // CONSULTA DE IDADE COMPLETA:
            db.query(`
                SELECT 
                    CASE
                        WHEN DATE_PART('year', age(data_nascimento)) BETWEEN 18 AND 24 THEN '18-24'
                        WHEN DATE_PART('year', age(data_nascimento)) BETWEEN 25 AND 34 THEN '25-34'
                        WHEN DATE_PART('year', age(data_nascimento)) BETWEEN 35 AND 44 THEN '35-44'
                        WHEN DATE_PART('year', age(data_nascimento)) BETWEEN 45 AND 54 THEN '45-54'
                        WHEN DATE_PART('year', age(data_nascimento)) BETWEEN 55 AND 64 THEN '55-64'
                        WHEN DATE_PART('year', age(data_nascimento)) >= 65 THEN '65+'
                    END as age_group,
                    COUNT(*) as count
                FROM "contatos"
                WHERE data_nascimento IS NOT NULL
                GROUP BY age_group
                ORDER BY age_group;
            `),
            //QUERY PARA PROGRESSO DE TAREFAS
            db.query(`
                SELECT
                    to_char(date_trunc('month', d.month), 'YYYY-MM') AS month,
                    COALESCE(new_tasks.count, 0) AS novas_tarefas,
                    COALESCE(completed_tasks.count, 0) AS tarefas_concluidas
                FROM
                    generate_series(date_trunc('month', NOW() - interval '5 months'), date_trunc('month', NOW()), '1 month') AS d(month)
                LEFT JOIN
                    (SELECT date_trunc('month', created_at) AS month, COUNT(*) AS count FROM "tarefas" GROUP BY 1) AS new_tasks ON d.month = new_tasks.month
                LEFT JOIN
                    (SELECT date_trunc('month', updated_at) AS month, COUNT(*) AS count FROM "tarefas" WHERE status = 'Concluído' GROUP BY 1) AS completed_tasks ON d.month = completed_tasks.month
                ORDER BY d.month;
            `)
        ]).catch(err => {
            console.error("Erro em uma das consultas do dashboard:", err);
            throw err;
        });

        const stats = {
            tasksByStatus: statusRes.rows,
            tasksByResponsible: responsavelRes.rows,
            totalTarefas: parseInt(totalTarefasRes.rows[0].count, 10),
            totalUsuarios: parseInt(totalUsuariosRes.rows[0].count, 10),
            totalAcoesConcluidas: parseInt(acoesConcluidasRes.rows[0].count, 10),
            distributionBySex: sexoRes.rows,
            peopleByNeighborhood: bairroRes.rows,
            distributionByAge: idadeRes.rows,
            tasksProgress: progressoRes.rows
        };

        return stats;
    }
}

module.exports = DashboardModel;