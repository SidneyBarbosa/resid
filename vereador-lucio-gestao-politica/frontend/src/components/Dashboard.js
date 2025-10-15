// frontend/src/components/Dashboard.js

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
import ContatoMap from './ContatoMap'; // <-- MUDANÇA: Importa o mapa reutilizável
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
  // --- ESTADOS DO COMPONENTE ---
  const [dashboardData, setDashboardData] = useState(null);
  const [contatos, setContatos] = useState([]); // <-- NOVO ESTADO: Para guardar os contatos do mapa
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para os dados dos gráficos
  const [tasksStatusChart, setTasksStatusChart] = useState({ datasets: [] });
  const [responsibleChart, setResponsibleChart] = useState({ datasets: [] });
  const [progressChart, setProgressChart] = useState({ datasets: [] });
  const [sexChart, setSexChart] = useState({ datasets: [] });
  const [ageChart, setAgeChart] = useState({ datasets: [] });

  // --- LÓGICA DE BUSCA DE DADOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // MUDANÇA: Busca os dados dos gráficos e dos contatos em paralelo para mais performance
        const [statsResponse, contatosResponse] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/contatos')
        ]);
        
        const statsData = statsResponse.data;
        const contatosData = contatosResponse.data;

        setDashboardData(statsData);
        setContatos(contatosData); // <-- SALVA OS DADOS DOS CONTATOS NO NOVO ESTADO

        // --- Transformação dos dados para os gráficos (lógica original mantida) ---
        if (statsData.tasksByStatus) {
          setTasksStatusChart({
            labels: statsData.tasksByStatus.map(item => item.status),
            datasets: [{
              data: statsData.tasksByStatus.map(item => item.count),
              backgroundColor: ['#C9552C', '#2F7F83', '#246E9E']
            }]
          });
        }
        
        if (statsData.tasksByResponsible) {
          setResponsibleChart({
            labels: statsData.tasksByResponsible.map(item => item.responsible),
            datasets: [{
              label: 'Tarefas Atribuídas',
              data: statsData.tasksByResponsible.map(item => item.count),
              backgroundColor: '#4148CF'
            }]
          });
        }

        if (statsData.tasksProgress) {
            setProgressChart({
                labels: statsData.tasksProgress.map(item => formatMonth(item.month)),
                datasets: [
                    { label: 'Tarefas Concluídas', data: statsData.tasksProgress.map(item => item.tarefas_concluidas), backgroundColor: '#2a9d8f' },
                    { label: 'Novas Tarefas', data: statsData.tasksProgress.map(item => item.novas_tarefas), backgroundColor: '#ff5722' }
                ]
            });
        }

        if (statsData.distributionBySex) {
            setSexChart({
                labels: statsData.distributionBySex.map(item => item.sexo),
                datasets: [{
                    data: statsData.distributionBySex.map(item => item.count),
                    backgroundColor: ['#009DFF', '#FF5BC8']
                }]
            });
        }

        if (statsData.distributionByAge) {
            setAgeChart({
                labels: statsData.distributionByAge.map(item => item.age_group),
                datasets: [{
                    label: 'Distribuição por Idade',
                    data: statsData.distributionByAge.map(item => item.count),
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

  // --- RENDERIZAÇÃO DO COMPONENTE ---
  const chartOptions = { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } };
  const doughnutOptions = { ...chartOptions, scales: {}, cutout: '70%' };

  if (loading) return <p>Carregando dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!dashboardData) return <p>Não há dados para exibir.</p>;

  return (
    <div className="dashboard-page">
      <h2 className="page-title">Dashboard de Gestão Política</h2>
      <p className="page-subtitle">Visão geral e desempenho da equipe.</p>
      
      {/* SEÇÃO DE TAREFAS (Original) */}
      <div className="section-container">
        <div className="charts-grid">
          {/* ... seus cards de gráficos de tarefas ... */}
          <div className="chart-card"><h4>Status das Tarefas</h4><Doughnut data={tasksStatusChart} options={doughnutOptions} /></div>
          <div className="chart-card"><h4>Tarefas por Responsável</h4><Bar data={responsibleChart} options={chartOptions} /></div>
          <div className="chart-card"><h4>Progresso de Tarefas</h4><Bar data={progressChart} options={chartOptions} /></div>
        </div>
      </div>
      
      {/* SEÇÃO DE ESTATÍSTICAS (Original) */}
      <div className="section-container">
        <div className="stats-grid">
          <div className="card"><h4>Total de Tarefas</h4><p>{dashboardData.totalTarefas}</p></div>
          <div className="card"><h4>Usuários Ativos</h4><p>{dashboardData.totalUsuarios}</p></div>
          <div className="card"><h4>Ações Concluídas</h4><p>{dashboardData.totalAcoesConcluidas}</p></div>
        </div>
      </div>

      {/* SEÇÃO DO MAPA (Atualizada) */}
      <div className="section-container">
        <div className="map-wrapper-dashboard">
          <h3>Distribuição Geográfica de Contatos</h3>
          {/* MUDANÇA: Renderiza o ContatoMap passando a lista de contatos como prop */}
          <ContatoMap contatos={contatos} />
        </div>
      </div>

      {/* SEÇÃO DEMOGRÁFICA (Original) */}
      <div className="section-container">
        <div className="demographics-grid">
          <div className="chart-card"><h4>Distribuição por Sexo</h4><Doughnut data={sexChart} options={doughnutOptions} /></div>
          <div className="chart-card"><h4>Distribuição por Idade</h4><Bar data={ageChart} options={chartOptions} /></div>
        </div>
      </div>
      
      {/* SEÇÃO DE TABELA POR BAIRRO (Original) */}
      <div className="section-container">
        <div className="table-card">
          <h3>Pessoas por Bairro</h3>
          <table className="neighborhood-table">
            <thead><tr><th>BAIRRO</th><th>QUANTIDADE</th></tr></thead>
            <tbody>
              {dashboardData.peopleByNeighborhood.map((row, index) => (
                <tr key={index}><td>{row.bairro}</td><td>{row.count}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;