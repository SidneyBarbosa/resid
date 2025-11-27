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
import { BsChatDots, BsDownload, BsPeopleFill, BsCheckCircleFill, BsListTask, BsMegaphoneFill } from 'react-icons/bs'; 
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

  const [reportSummary, setReportSummary] = useState(null);
  const [reportPeriod, setReportPeriod] = useState('Diário');

  const [tasksStatusChart, setTasksStatusChart] = useState({ datasets: [] });
  const [responsibleChart, setResponsibleChart] = useState({ datasets: [] });
  const [progressChart, setProgressChart] = useState({ datasets: [] });
  const [sexChart, setSexChart] = useState({ datasets: [] });
  const [ageChart, setAgeChart] = useState({ datasets: [] });

  const statusColorMap = {
    'A Fazer': '#0d6efd',
    'Em Andamento': '#c29306',
    'Concluído': '#28a745',
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [statsResponse, acoesResponse, summaryResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/acoes'),
        api.get('/dashboard/summary')
      ]);
      
      setDashboardData(statsResponse.data);
      setAcoes(acoesResponse.data);
      setReportSummary(summaryResponse.data);

      if (statsResponse.data.tasksByStatus) {
        const labels = statsResponse.data.tasksByStatus.map(item => item.status);
        const data = statsResponse.data.tasksByStatus.map(item => item.count);
        const backgroundColor = labels.map(label => statusColorMap[label] || '#CCCCCC');
        setTasksStatusChart({
          labels: labels,
          datasets: [{ data: data, backgroundColor: backgroundColor }]
        });
      }
      if (statsResponse.data.tasksByResponsible) {
        setResponsibleChart({
          labels: statsResponse.data.tasksByResponsible.map(item => item.responsible),
          datasets: [{
            label: 'Tarefas Atribuídas',
            data: statsResponse.data.tasksByResponsible.map(item => item.count),
            backgroundColor: '#4148CF'
          }]
        });
      }
      if (statsResponse.data.tasksProgress) {
          setProgressChart({
            labels: statsResponse.data.tasksProgress.map(item => formatMonth(item.month)),
            datasets: [
              { label: 'Tarefas Concluídas', data: statsResponse.data.tasksProgress.map(item => item.tarefas_concluidas), backgroundColor: '#2a9d8f' },
              { label: 'Novas Tarefas', data: statsResponse.data.tasksProgress.map(item => item.novas_tarefas), backgroundColor: '#ff5722' }
            ]
          });
      }
      if (statsResponse.data.distributionBySex) {
          setSexChart({
            labels: statsResponse.data.distributionBySex.map(item => item.sexo),
            datasets: [{
              data: statsResponse.data.distributionBySex.map(item => item.count),
              backgroundColor: ['#009DFF', '#FF5BC8']
            }]
          });
      }
      if (statsResponse.data.distributionByAge) {
          setAgeChart({
            labels: statsResponse.data.distributionByAge.map(item => item.age_group),
            datasets: [{
              label: 'Distribuição por Idade',
              data: statsResponse.data.distributionByAge.map(item => item.count),
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
    alert(`Gerando relatório PDF para: ${periodo}...`);
  };

  if (loading) return <p style={{padding: '20px'}}>Carregando dashboard...</p>;
  if (error) return <p style={{ color: 'red', padding: '20px' }}>{error}</p>;
  if (!dashboardData || !reportSummary) return <p style={{padding: '20px'}}>Não há dados para exibir.</p>;

  const currentData = reportSummary[reportPeriod.toLowerCase().replace('á', 'a')] || { 
    novosContatos: 0, tarefasConcluidas: 0, tarefasCriadas: 0, acoesCriadas: 0 
  };

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

      <div className="section-container">
        <h3 className="section-title">Resumo de Atividades</h3>
        
        <div className="report-time-selector">
          {['Diário', 'Semanal', 'Mensal', 'Anual'].map((periodo) => (
            <button 
              key={periodo}
              className={`time-btn ${reportPeriod === periodo ? 'active' : ''}`}
              onClick={() => setReportPeriod(periodo)}
            >
              {periodo}
            </button>
          ))}
        </div>

        <div className="dynamic-summary-card">
          <div className="summary-header">
            <h3>Resumo {reportPeriod}</h3>
            <button className="generate-report-btn" onClick={() => handleGenerateReport(reportPeriod)}>
              <BsDownload size={18} />
              Gerar Relatório
            </button>
          </div>
          
          <div className="summary-grid">
            <div className="summary-item">
                <div className="icon-badge blue"><BsPeopleFill /></div>
                <div>
                    <span>Novos Contatos</span>
                    <strong>{currentData.novosContatos}</strong>
                </div>
            </div>

            <div className="summary-item">
                <div className="icon-badge green"><BsCheckCircleFill /></div>
                <div>
                    <span>Tarefas Concluídas</span>
                    <strong>{currentData.tarefasConcluidas}</strong>
                </div>
            </div>

            <div className="summary-item">
                <div className="icon-badge purple"><BsListTask /></div>
                <div>
                    <span>Tarefas Criadas</span>
                    <strong>{currentData.tarefasCriadas}</strong>
                </div>
            </div>

            <div className="summary-item">
                <div className="icon-badge orange"><BsMegaphoneFill /></div>
                <div>
                    <span>Novas Ações</span>
                    <strong>{currentData.acoesCriadas}</strong>
                </div>
            </div>
          </div>
        </div>
      </div>

      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
      
    </div>
  );
}

export default Dashboard;