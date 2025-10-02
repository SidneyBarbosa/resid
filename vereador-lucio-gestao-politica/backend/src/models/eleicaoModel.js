const db = require('../database/db');

class EleicaoModel {
    static async getStatsByYear(ano) {
        const eleicaoRes = await db.query('SELECT id, total_votos_validos FROM eleicoes WHERE ano = $1 LIMIT 1', [ano]);
        if (eleicaoRes.rows.length === 0) {
            throw new Error(`Eleição para o ano ${ano} não encontrada.`);
        }
        const { id: eleicao_id, total_votos_validos } = eleicaoRes.rows[0];

        const query = `
            SELECT 
                lv.bairro, 
                SUM(re.quantidade_votos) as votos
            FROM 
                resultados_eleitorais re
            JOIN 
                locais_votacao lv ON re.local_votacao_id = lv.id
            WHERE 
                re.eleicao_id = $1
            GROUP BY 
                lv.bairro
            ORDER BY 
                votos DESC;
        `;
        
        const bairrosRes = await db.query(query, [eleicao_id]);
        
        const totalVotosCandidato = bairrosRes.rows.reduce((sum, row) => sum + parseInt(row.votos, 10), 0);
        
        //Mapeia os resultados para calcular o percentual de cada bairro
        const bairrosComPercentual = bairrosRes.rows.map(bairro => ({
            ...bairro,
            percentual: totalVotosCandidato > 0 ? ((parseInt(bairro.votos, 10) / totalVotosCandidato) * 100).toFixed(2) : 0
        }));

        const mediaPercentualGeral = total_votos_validos > 0 ? (totalVotosCandidato / total_votos_validos) * 100 : 0;
        
        return {
            totalVotosAbsolutos: totalVotosCandidato,
            mediaPercentualPorBairro: mediaPercentualGeral.toFixed(2) + '%',
            resultadosPorBairro: bairrosComPercentual
        };
    }
}

module.exports = EleicaoModel;