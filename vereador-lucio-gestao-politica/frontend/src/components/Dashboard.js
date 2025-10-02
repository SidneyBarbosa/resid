import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
} from 'chart.js';
import '../styles/Dashboard.css';
import MapPage from './MapPage';
import api from '../services/api';

// Registrar os componentes do ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

// Função auxiliar para formatar os meses em Português
const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
};

function Dashboard() {
  // Estado para armazenar todos os dados brutos do dashboard
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para os dados já formatados dos gráficos
  const [tasksStatusChart, setTasksStatusChart] = useState({ datasets: [] });
  const [responsibleChart, setResponsibleChart] = useState({ datasets: [] });
  const [progressChart, setProgressChart] = useState({ datasets: [] }); // <-- NOVO ESTADO
  const [sexChart, setSexChart] = useState({ datasets: [] });
  const [ageChart, setAgeChart] = useState({ datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        const data = response.data;
        setDashboardData(data);

        // --- Transformação dos dados para os gráficos ---

        if (data.tasksByStatus) {
          setTasksStatusChart({
            labels: data.tasksByStatus.map(item => item.status),
            datasets: [{
              data: data.tasksByStatus.map(item => item.count),
              backgroundColor: ['#C9552C', '#2F7F83', '#246E9E']
            }]
          });
        }
        
        if (data.tasksByResponsible) {
          setResponsibleChart({
            labels: data.tasksByResponsible.map(item => item.responsible),
            datasets: [{
              label: 'Tarefas Atribuídas',
              data: data.tasksByResponsible.map(item => item.count),
              backgroundColor: '#4148CF'
            }]
          });
        }

        // GRÁFICO DE PROGRESSO DE TAREFAS
        if (data.tasksProgress) {
            setProgressChart({
                labels: data.tasksProgress.map(item => formatMonth(item.month)),
                datasets: [
                    { label: 'Tarefas Concluídas', data: data.tasksProgress.map(item => item.tarefas_concluidas), backgroundColor: '#2a9d8f' },
                    { label: 'Novas Tarefas', data: data.tasksProgress.map(item => item.novas_tarefas), backgroundColor: '#ff5722' }
                ]
            });
        }

        if (data.distributionBySex) {
            setSexChart({
                labels: data.distributionBySex.map(item => item.sexo),
                datasets: [{
                    data: data.distributionBySex.map(item => item.count),
                    backgroundColor: ['#009DFF', '#FF5BC8']
                }]
            });
        }

        if (data.distributionByAge) {
            setAgeChart({
                labels: data.distributionByAge.map(item => item.age_group),
                datasets: [{
                    label: 'Distribuição por Idade',
                    data: data.distributionByAge.map(item => item.count),
                    backgroundColor: '#4148CF'
                }]
            });
        }

      } catch (err) {
        setError('Falha ao carregar dados do dashboard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartOptions = { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } };
  const doughnutOptions = { ...chartOptions, scales: {}, cutout: '70%' };

  if (loading) return <p>Carregando dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!dashboardData) return <p>Não há dados para exibir.</p>;

  return (
    <div className="dashboard-page">
      <h2 className="page-title">Dashboard de Gestão Política</h2>
      <p className="page-subtitle">Visão geral e desempenho da equipe.</p>
      
      {/* SEÇÃO DE TAREFAS */}
      <div className="section-container">
        <div className="charts-grid">
          <div className="chart-card">
            <h4>Status das Tarefas</h4>
            <Doughnut data={tasksStatusChart} options={doughnutOptions} />
          </div>
          <div className="chart-card">
            <h4>Tarefas por Responsável</h4>
            <Bar data={responsibleChart} options={chartOptions} />
          </div>
          <div className="chart-card">
            <h4>Progresso de Tarefas</h4>
            {/* GRÁFICO REAL RENDERIZADO */}
            <Bar data={progressChart} options={chartOptions} />
          </div>
        </div>
      </div>
      
      <div className="section-container">
        <div className="stats-grid">
          <div className="card">
            <h4>Total de Tarefas</h4>
            <p>{dashboardData.totalTarefas}</p>
          </div>
          <div className="card">
            <h4>Usuários Ativos</h4>
            <p>{dashboardData.totalUsuarios}</p>
          </div>
          <div className="card">
            <h4>Ações Concluídas</h4>
            <p>{dashboardData.totalAcoesConcluidas}</p>
          </div>
        </div>
      </div>

      {/* SEÇÃO DO MAPA */}
      <div className="section-container">
        <MapPage />
      </div>

      {/* SEÇÃO DEMOGRÁFICA */}
      <div className="section-container">
        <div className="demographics-grid">
          <div className="chart-card">
            <h4>Distribuição por Sexo</h4>
            <Doughnut data={sexChart} options={doughnutOptions} />
          </div>
          <div className="chart-card">
            <h4>Distribuição por Idade</h4>
            <Bar data={ageChart} options={chartOptions} />
          </div>
        </div>
      </div>
      
      {/* SEÇÃO DE TABELA POR BAIRRO */}
      <div className="section-container">
        <div className="table-card">
          <h3>Pessoas por Bairro</h3>
          <table className="neighborhood-table">
            <thead>
              <tr>
                <th>BAIRRO</th>
                <th>QUANTIDADE</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.peopleByNeighborhood.map((row, index) => (
                <tr key={index}>
                  <td>{row.bairro}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;