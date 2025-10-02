// frontend/src/components/TaskManagement.js

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import '../styles/TaskManagement.css';
import TaskForm from './TaskForm';
import api from '../services/api';

const TaskManagement = () => {
  // 2. Removemos 'initialTasks' e começamos com o estado vazio
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // 3. Adicionamos estados de loading e erro para uma melhor experiência do usuário
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statuses = ['A Fazer', 'Em Andamento', 'Concluído']; // No backend, o ENUM deve corresponder a estes valores

  // 4. useEffect para buscar os dados da API quando o componente é montado
  useEffect(() => {
    const fetchTasks = async () => {
        try {
            setLoading(true);
            // Agora chamamos a rota real das tarefas
            const response = await api.get('/tarefas');
            setTasks(response.data); // Atualiza o estado com os dados reais
            setError(null);
        } catch (err) {
            setError('Falha ao carregar as tarefas.');
            console.error('Erro detalhado ao buscar tarefas:', err);
        } finally {
            setLoading(false);
        }
    };

    fetchTasks();
}, []);

  // 5. Funções de CRUD agora são assíncronas e usam o 'api'

  const handleAddTask = async (newTask) => {
    try {
      const response = await api.post('/tarefas', newTask);
      setTasks([...tasks, response.data]); // Adiciona a nova tarefa retornada pela API
      handleCloseForm();
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
      setError("Falha ao criar a tarefa.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tarefas/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId)); // Remove a tarefa da lista no frontend
    } catch (err) {
      console.error("Erro ao deletar tarefa:", err);
      setError("Falha ao deletar a tarefa.");
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      const response = await api.put(`/tarefas/${updatedTask.id}`, updatedTask);
      setTasks(tasks.map(task => 
        task.id === updatedTask.id ? response.data : task
      ));
      handleCloseForm();
    } catch (err) {
      console.error("Erro ao editar tarefa:", err);
      setError("Falha ao editar a tarefa.");
    }
  };

  // 6. onDragEnd agora também atualiza o status no backend
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const task = tasks.find(t => t.id === draggableId);
    if (task) {
      const updatedTask = { ...task, status: destination.droppableId };
      
      // Atualização otimista: atualiza a UI primeiro para uma resposta rápida
      setTasks(tasks.map(t => t.id === draggableId ? updatedTask : t));

      // Depois, envia a atualização para o backend
      try {
        await api.put(`/tarefas/${draggableId}`, updatedTask);
      } catch (err) {
        console.error("Erro ao atualizar status da tarefa:", err);
        setError("Não foi possível salvar a mudança de status.");
        // Reverte a mudança na UI se a API falhar
        setTasks(tasks.map(t => t.id === draggableId ? task : t)); 
      }
    }
  };


  // Funções que não mudam (visuais)
  const handleOpenForm = (task = null) => {
    setTaskToEdit(task);
    setShowTaskForm(true);
  };
  const handleCloseForm = () => {
    setTaskToEdit(null);
    setShowTaskForm(false);
  };
  const getPriorityColorClass = (priority) => {
    switch (priority) {
      case 'Alta': return 'priority-high';
      case 'Média': return 'priority-medium';
      case 'Baixa': return 'priority-low';
      default: return '';
    }
  };

  // Renderização condicional para loading e erro
  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  // O JSX do seu componente continua praticamente o mesmo
  return (
    <div className="task-management-container">
      <div className="kanban-header">
        <div className="kanban-header-text">
          <h1>Gestão de Tarefas</h1>
          <p>Organize e acompanhe o progresso das tarefas</p>
        </div>
        <button className="new-task-button" onClick={() => handleOpenForm()}>
          Nova Tarefa
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`kanban-column ${status.toLowerCase().replace(' ', '-')}`}
                >
                  <h3 className={`column-title ${status.toLowerCase().replace(' ', '-')}`}>
                    {status}
                  </h3>
                  <div className="task-list">
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="task-card"
                            >
                              <div className="task-header">
                                <span className="task-category">{task.category}</span>
                              </div>
                              <h4>{task.titulo}</h4> {/* Alterado de title para titulo */}
                              <p className="task-description">{task.descricao}</p> {/* Alterado de description para descricao */}
                              <div className="task-card-footer">
                                <div className="task-details">
                                  <span className={`task-priority ${getPriorityColorClass(task.priority)}`}>{task.priority}</span>
                                  {/* Formatação da data pode ser necessária aqui */}
                                  <span className="task-date">{new Date(task.data).toLocaleDateString()}</span>
                                </div>
                                <div className="task-actions">
                                  <i className="fas fa-pen edit-icon" onClick={() => handleOpenForm(task)}></i>
                                  <i className="fas fa-trash-alt delete-icon" onClick={() => handleDeleteTask(task.id)}></i>
                                  <span className={`responsible-initials ${getPriorityColorClass(task.priority)}`}>
                                    {task.responsible ? task.responsible.charAt(0).toUpperCase() : '?'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {showTaskForm && <TaskForm onClose={handleCloseForm} onAddTask={handleAddTask} onEditTask={handleEditTask} taskToEdit={taskToEdit} />}
    </div>
  );
};

export default TaskManagement;