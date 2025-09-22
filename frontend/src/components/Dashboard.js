import React from 'react';
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

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

function Dashboard() {
  const tasksData = {
    labels: ['A fazer', 'Em andamento', 'Concluído'],
    datasets: [{
      data: [5, 3, 12],
      backgroundColor: ['#C9552C', '#2F7F83', '#246E9E']
    }]
  };

  const responsibleData = {
    labels: ['João', 'Maria', 'Carlos'],
    datasets: [{
      label: 'Tarefas Atribuídas',
      data: [10, 8, 7],
      backgroundColor: '#4148CF'
    }]
  };

  const newProgressData = {
    labels: ['abr.', 'mai.', 'jun.', 'jul.', 'ago.'],
    datasets: [
      {
        label: 'Tarefas Concluídas',
        data: [0, 0, 0, 6, 1],
        backgroundColor: '#2a9d8f'
      },
      {
        label: 'Novas Tarefas',
        data: [3, 4, 2, 7, 15],
        backgroundColor: '#ff5722'
      }
    ]
  };

  const sexData = {
    labels: ['Masculino', 'Feminino'],
    datasets: [{
      data: [70, 30],
      backgroundColor: ['#009DFF', '#FF5BC8']
    }]
  };

  const ageData = {
    labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    datasets: [{
      label: 'Distribuição por Idade',
      data: [0, 4, 3, 1, 1, 1],
      backgroundColor: '#4148CF'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
          position: 'top',
          labels: {
              boxWidth: 20,
              padding: 20
          }
      }
    },
    scales: {
        y: {
            beginAtZero: true
        }
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 0,
        bottom: 0
      }
    }
  };

  const doughnutOptions = {
    ...chartOptions,
    scales: {
      y: {
          display: false
      }
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };
  
  const peopleByNeighborhoodData = [
    { bairro: 'Eduardo Gomes', quantidade: 2, percentual: '20%' },
    { bairro: 'Atalaia', quantidade: 2, percentual: '20%' },
    { bairro: 'Centro', quantidade: 1, percentual: '10%' },
    { bairro: 'Jabotiana', quantidade: 1, percentual: '10%' },
    { bairro: 'Ponto Novo', quantidade: 1, percentual: '10%' },
    { bairro: 'Inácio Barbosa', quantidade: 1, percentual: '10%' },
    { bairro: 'Conjunto João Alves', quantidade: 1, percentual: '10%' },
    { bairro: 'Farolândia', quantidade: 1, percentual: '10%' },
  ];

  return (
    <div className="dashboard-page">
      <h2 className="page-title">Dashboard de Gestão Política</h2>
      <p className="page-subtitle">Visão geral e desempenho da equipe.</p>

      <div className="section-container">
        <div className="charts-grid">
          <div className="chart-card">
            <h4>Status das Tarefas</h4>
            <Doughnut data={tasksData} options={doughnutOptions} />
          </div>
          <div className="chart-card">
            <h4>Tarefas por Responsável</h4>
            <Bar data={responsibleData} options={chartOptions} />
          </div>
          <div className="chart-card">
            <h4>Progresso de Tarefas</h4>
            <Bar data={newProgressData} options={chartOptions} />
          </div>
        </div>
      </div>
      
      <div className="section-container">
        <div className="stats-grid">
          <div className="card">
            <h4>Total de Tarefas</h4>
            <p>20</p>
          </div>
          <div className="card">
            <h4>Usuários Ativos</h4>
            <p>5</p>
          </div>
          <div className="card">
            <h4>Ações Concluídas</h4>
            <p>12</p>
          </div>
        </div>
      </div>

      <div className="section-container">
        <MapPage />
      </div>

      <div className="section-container">
        <div className="demographics-grid">
          <div className="chart-card">
            <h4>Distribuição por Sexo</h4>
            <Doughnut data={sexData} options={doughnutOptions} />
          </div>
          <div className="chart-card">
            <h4>Distribuição por Idade</h4>
            <Bar data={ageData} options={chartOptions} />
          </div>
        </div>
      </div>
      
      <div className="section-container">
        <div className="table-card">
          <h3>Pessoas por Bairro</h3>
          <table className="neighborhood-table">
            <thead>
              <tr>
                <th>BAIRRO</th>
                <th>QUANTIDADE</th>
                <th>PERCENTUAL</th>
              </tr>
            </thead>
            <tbody>
              {peopleByNeighborhoodData.map((row, index) => (
                <tr key={index}>
                  <td>{row.bairro}</td>
                  <td>{row.quantidade}</td>
                  <td>{row.percentual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-container">
        <div className="stats-grid">
          <div className="card">
            <h4>Total de Cadastros</h4>
            <p>10</p>
          </div>
          <div className="card">
            <h4>Média de Idade</h4>
            <p>40</p>
          </div>
          <div className="card">
            <h4>Bairros Atendidos</h4>
            <p>8</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;