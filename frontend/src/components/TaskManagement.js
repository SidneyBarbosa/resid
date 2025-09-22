import React from 'react';
import '../styles/TaskManagement.css';

function TaskManagement() {
  // Dados fictícios para a tabela de tarefas
  const mockTasks = [
    { id: 1, name: 'Reunião semanal com a equipe', responsible: 'Carlos', date: '2025-10-18', status: 'Em Andamento' },
    { id: 2, name: 'Planejamento de campanha', responsible: 'Jéssica', date: '2025-10-25', status: 'Pendente' },
    { id: 3, name: 'Atualizar site oficial', responsible: 'João', date: '2025-10-10', status: 'Concluído' },
    { id: 4, name: 'Responder emails dos eleitores', responsible: 'Maria', date: '2025-10-17', status: 'Em Andamento' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Gestão de Tarefas</h2>
        <button className="add-button">+ Nova Tarefa</button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Responsável</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockTasks.map(task => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.responsible}</td>
                <td>{task.date}</td>
                <td><span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>{task.status}</span></td>
                <td>
                  <button className="edit-btn">Editar</button>
                  <button className="delete-btn">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskManagement;