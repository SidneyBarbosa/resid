import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import '../styles/Dashboard.css';
import api from '../services/api';
import ResultadosBairro from './ResultadosBairro';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Eleicoes() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({ datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEleicaoData = async () => {
      try {
        const response = await api.get('/eleicoes/stats', { params: { ano: 2024 } });
        const data = response.data;
        setStats(data);

        if (data.resultadosPorBairro) {
          const top10 = data.resultadosPorBairro.slice(0, 10);

          setChartData({
            labels: top10.map(bairro => bairro.bairro.toUpperCase()),
            datasets: [{
              label: 'Votos',
              data: top10.map(bairro => bairro.votos),
              backgroundColor: '#3661EB'
            }]
          });
        }
      } catch (err) {
        setError('Falha ao carregar dados da eleição.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEleicaoData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) return <p>Carregando dados da eleição...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!stats) return <p>Não há dados para exibir.</p>;

  return (
    <div className="eleicao-page">
      <div className="eleicao-header">
        <h2>Eleição 2024</h2>
        <p>Resultado Eleitoral 2024 - Vereador Lúcio Flávio</p>
      </div>

      <div className="stats-cards-row">
        <div className="stat-card-eleicao">
          <h4>Total de Votos Absolutos</h4>
          <p>{stats.totalVotosAbsolutos.toLocaleString('pt-BR')}</p>
        </div>
        <div className="stat-card-eleicao">
          <h4>Média Percentual</h4>
          <p>{stats.mediaPercentualPorBairro}</p>
        </div>
      </div>

      <div className="chart-container-eleicao">
        <h3>10 Bairros com Mais Votos em 2024</h3>
        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/*Adicionar o componente da tabela de resultados */}
      <ResultadosBairro />

    </div>
  );
}

export default Eleicoes;