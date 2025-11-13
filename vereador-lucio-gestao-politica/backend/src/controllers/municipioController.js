// backend/src/controllers/municipioController.js
const axios = require('axios');
// 1. Importe a conexão do banco de dados
const db = require('../database/db'); 

class MunicipioController {
  
  // Esta função continua buscando os MUNICÍPIOS da API do IBGE
  static async findAll(req, res) {
    try {
      const ibgeApiUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/28/municipios';
      const response = await axios.get(ibgeApiUrl);

      const municipios = response.data.map(municipio => ({
        id: municipio.id, // ID do IBGE (ex: 2800308)
        nome: municipio.nome
      }));
      municipios.sort((a, b) => a.nome.localeCompare(b.nome));

      res.status(200).json(municipios);
    } catch (error) {
      console.error("Erro ao buscar municípios no IBGE:", error);
      res.status(500).json({ message: 'Erro interno ao buscar municípios.' });
    }
  }

  // --- FUNÇÃO ATUALIZADA ---
  // Esta função agora busca os BAIRROS do seu banco de dados
  static async findBairrosByMunicipio(req, res) {
    try {
      const { municipioId } = req.params; // Este é o ID do IBGE

      // 2. Consulta o seu banco de dados
      const query = `
        SELECT id, nome FROM bairros 
        WHERE municipio_ibge_id = $1 
        ORDER BY nome ASC
      `;
      
      const result = await db.query(query, [municipioId]);
      
      // 3. Retorna os bairros encontrados
      res.status(200).json(result.rows);

    } catch (error) {
      console.error("Erro ao buscar bairros:", error);
      res.status(500).json({ message: 'Erro interno ao buscar bairros.' });
    }
  }
}

module.exports = MunicipioController;