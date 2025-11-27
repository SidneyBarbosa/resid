import React, { useState, useEffect, useCallback } from 'react';
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
import DataMap from './DataMap';
import api from '../services/api';
import { BsChatDots, BsDownload } from 'react-icons/bs'; 
import Chatbot from '../components/Chatbot'; 

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const formatMonth = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
};

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [acoes, setAcoes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Removido o state 'reportType', pois agora temos 4 cards
  
  const [tasksStatusChart, setTasksStatusChart] = useState({ datasets: [] });
  const [responsibleChart, setResponsibleChart] = useState({ datasets: [] });
  const [progressChart, setProgressChart] = useState({ datasets: [] });
  const [sexChart, setSexChart] = useState({ datasets: [] });
  const [ageChart, setAgeChart] = useState({ datasets: [] });

  // DADOS FICTÍCIOS para os resumos. 
  // No futuro, isso virá da sua API (api.get('/dashboard/report-summary'))
  const mockReportData = {
    diario: { novosContatos: 2, tarefasConcluidas: 3 },
    semanal: { novosContatos: 15, tarefasConcluidas: 12 },
    mensal: { novosContatos: 62, tarefasConcluidas: 55 },
    anual: { novosContatos: 410, tarefasConcluidas: 380 },
  };

  const statusColorMap = {
    'A Fazer': '#0d6efd',
    'Em Andamento': '#c29306',
    'Concluído': '#28a745',
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsResponse, acoesResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/acoes')
        // Quando a API estiver pronta, adicione a chamada aqui:
        // api.get('/dashboard/report-summary') 
      ]);
      
      const statsData = statsResponse.data;
      const acoesData = acoesResponse.data;
      // const reportData = reportSummaryResponse.data; // Descomente no futuro
      
      setDashboardData(statsData);
      setAcoes(acoesData);
      // setReportSummary(reportData); // Descomente no futuro

      // ... (Toda a sua lógica de gráficos permanece igual) ...
      if (statsData.tasksByStatus) {
        const labels = statsData.tasksByStatus.map(item => item.status);
        const data = statsData.tasksByStatus.map(item => item.count);
        const backgroundColor = labels.map(label => statusColorMap[label] || '#CCCCCC');
        setTasksStatusChart({
          labels: labels,
          datasets: [{ data: data, backgroundColor: backgroundColor }]
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
  }, []);

  useEffect(() => {
    fetchData();
    window.addEventListener('focus', fetchData);
    return () => {
      window.removeEventListener('focus', fetchData);
    };
  }, [fetchData]);

  const chartOptions = { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { position: 'top' } } };
  const doughnutOptions = { ...chartOptions, scales: {}, cutout: '70%' };

  const handleGenerateReport = (periodo) => {
    alert(`Gerando relatório ${periodo}...`);
    // No futuro, aqui você chamará a API: api.get(`/reports/download?periodo=${periodo}`)
  };

  if (loading) return <p>Carregando dashboard...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!dashboardData) return <p>Não há dados para exibir.</p>;

  return (
    <div className="dashboard-page">
      
      <div className="dashboard-header">
        <div>
          <h2 className="page-title">Dashboard de Gestão Política</h2>
          <p className="page-subtitle">Visão geral e desempenho da equipe.</p>
        </div>
        <button className="chatbot-button" onClick={() => setIsChatbotOpen(true)}>
          <BsChatDots size={18} />
          <span>Assistente Virtual</span>
        </button>
      </div>
      
      {/* ... (Gráficos, Stats, Mapa, Tabela - tudo igual) ... */}
      <div className="section-container">
        <div className="charts-grid">
          <div className="chart-card"><h4>Status das Tarefas</h4><Doughnut data={tasksStatusChart} options={doughnutOptions} /></div>
          <div className="chart-card"><h4>Tarefas por Responsável</h4><Bar data={responsibleChart} options={chartOptions} /></div>
          <div className="chart-card"><h4>Progresso de Tarefas</h4><Bar data={progressChart} options={chartOptions} /></div>
        </div>
      </div>
      <div className="section-container">
        <div className="stats-grid">
          <div className="card"><h4>Total de Tarefas</h4><p>{dashboardData.totalTarefas}</p></div>
          <div className="card"><h4>Usuários Ativos</h4><p>{dashboardData.totalUsuarios}</p></div>
          <div className="card"><h4>Ações Concluídas</h4><p>{dashboardData.totalAcoesConcluidas}</p></div>
        </div>
      </div>
      <div className="section-container">
        <div className="map-wrapper-dashboard">
          <h3>Distribuição Geográfica de Ações</h3>
          <DataMap 
            data={acoes}
            titleField="titulo"
            dateField="data"
            entityName="ações"
          />
        </div>
      </div>
      <div className="section-container">
        <div className="demographics-grid">
          <div className="chart-card"><h4>Distribuição por Sexo</h4><Doughnut data={sexChart} options={doughnutOptions} /></div>
          <div className="chart-card"><h4>Distribuição por Idade</h4><Bar data={ageChart} options={chartOptions} /></div>
        </div>
      </div>
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

      {/* --- NOVA SEÇÃO DE RELATÓRIO COM CARDS DE RESUMO --- */}
      <div className="section-container">
        <h3 className="section-title">Resumo de Atividades</h3>
        <div className="report-grid-container">
          
          {/* Card Diário */}
          <div className="report-summary-card">
            <h4>Resumo Diário</h4>
            <div className="summary-stats">
              <p><strong>{mockReportData.diario.novosContatos}</strong> Novos Contatos</p>
              <p><strong>{mockReportData.diario.tarefasConcluidas}</strong> Tarefas Concluídas</p>
            </div>
            <button className="generate-report-btn small" onClick={() => handleGenerateReport('Diário')}>
              <BsDownload size={16} /> Gerar
            </button>
          </div>

          {/* Card Semanal */}
          <div className="report-summary-card">
            <h4>Resumo Semanal</h4>
            <div className="summary-stats">
              <p><strong>{mockReportData.semanal.novosContatos}</strong> Novos Contatos</p>
              <p><strong>{mockReportData.semanal.tarefasConcluidas}</strong> Tarefas Concluídas</p>
            </div>
            <button className="generate-report-btn small" onClick={() => handleGenerateReport('Semanal')}>
              <BsDownload size={16} /> Gerar
            </button>
          </div>

          {/* Card Mensal */}
          <div className="report-summary-card">
            <h4>Resumo Mensal</h4>
            <div className="summary-stats">
              <p><strong>{mockReportData.mensal.novosContatos}</strong> Novos Contatos</p>
              <p><strong>{mockReportData.mensal.tarefasConcluidas}</strong> Tarefas Concluídas</p>
            </div>
            <button className="generate-report-btn small" onClick={() => handleGenerateReport('Mensal')}>
              <BsDownload size={16} /> Gerar
            </button>
          </div>

          {/* Card Anual */}
          <div className="report-summary-card">
            <h4>Resumo Anual</h4>
            <div className="summary-stats">
              <p><strong>{mockReportData.anual.novosContatos}</strong> Novos Contatos</p>
              <p><strong>{mockReportData.anual.tarefasConcluidas}</strong> Tarefas Concluídas</p>
            </div>
            <button className="generate-report-btn small" onClick={() => handleGenerateReport('Anual')}>
              <BsDownload size={16} /> Gerar
            </button>
          </div>

        </div>
      </div>

      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
      
    </div>
  );
}

export default Dashboard;