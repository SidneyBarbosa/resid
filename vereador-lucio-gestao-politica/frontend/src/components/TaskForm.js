import React, { useState, useEffect } from 'react';
import '../styles/TaskForm.css';

const TaskForm = ({ onClose, onAddTask, onEditTask, taskToEdit }) => {
  // AJUSTE 1: Padronizamos os nomes dos campos para bater com o banco de dados
  const [taskData, setTaskData] = useState({
    titulo: '',      // Alterado de 'title'
    descricao: '',   // Alterado de 'description'
    data: '',
    responsible: '',
    priority: 'Média',
    category: '',
    status: 'A Fazer',
  });

  // Este hook detecta se uma tarefa foi passada para edição
  useEffect(() => {
    if (taskToEdit) {
      // Formata a data para o formato YYYY-MM-DD que o input type="date" espera
      const formattedData = {
          ...taskToEdit,
          data: taskToEdit.data ? new Date(taskToEdit.data).toISOString().split('T')[0] : ''
      };
      setTaskData(formattedData);
    } else {
      // Reseta o formulário para o estado inicial
      setTaskData({
        titulo: '',
        descricao: '',
        data: '',
        responsible: '',
        priority: 'Média',
        category: '',
        status: 'A Fazer',
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  // Esta função agora decide se é uma adição ou edição
  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskToEdit) {
      onEditTask(taskData);
    } else {
      onAddTask(taskData);
    }
    // onClose(); // Comentado para não fechar imediatamente em caso de erro, o pai deve chamar
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <div className="task-form-header">
          <h2>{taskToEdit ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* AJUSTE 2: Atualizamos os campos 'name' e 'value' para 'titulo' */}
          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={taskData.titulo}
              onChange={handleChange}
              required
            />
          </div>

          {/* AJUSTE 3: Atualizamos os campos 'name' e 'value' para 'descricao' */}
          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              name="descricao"
              value={taskData.descricao}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="data">Data *</label>
              <input
                type="date"
                id="data"
                name="data"
                value={taskData.data}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="responsible">Responsável</label>
              <input
                type="text"
                id="responsible"
                name="responsible"
                value={taskData.responsible}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Prioridade</label>
            <select
              id="priority"
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
            >
              <option>Baixa</option>
              <option>Média</option>
              <option>Alta</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={taskData.status}
              onChange={handleChange}
            >
              <option>A Fazer</option>
              <option>Em Andamento</option>
              <option>Concluído</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="category">Categorias</label>
            <input
              type="text"
              id="category"
              name="category"
              value={taskData.category}
              onChange={handleChange}
              placeholder="Ex: Planejamento, Reunião"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              {taskToEdit ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;