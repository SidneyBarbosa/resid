const db = require('../database/db');

class FinanceiroModel {
    static async create(data) {
        const {
            profile_id, data_registro, valor_locacao_imovel, valor_assessoria_juridica,
            valor_assessoria_comunicacao, valor_combustivel, despesas_debito,
            despesas_credito, outras_despesas
        } = data;

        const query = `
            INSERT INTO "registros_financeiros" (
                user_id, data_registro, valor_locacao_imovel, valor_assessoria_juridica,
                valor_assessoria_comunicacao, valor_combustivel, despesas_debito,
                despesas_credito, outras_despesas
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;
        
        const params = [
            profile_id, data_registro, valor_locacao_imovel, valor_assessoria_juridica,
            valor_assessoria_comunicacao, valor_combustivel, despesas_debito,
            despesas_credito, outras_despesas
        ];

        try {
            const result = await db.query(query, params);
            return result.rows[0];
        } catch (error) {
            console.error("ERRO AO CRIAR (Model):", error);
            throw error;
        }
    }

    static async findAll() {
        const query = 'SELECT * FROM "registros_financeiros" ORDER BY data_registro DESC';
        
        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            console.error("ERRO AO BUSCAR (Model):", error);
            throw error;
        }
    }
}

module.exports = FinanceiroModel;