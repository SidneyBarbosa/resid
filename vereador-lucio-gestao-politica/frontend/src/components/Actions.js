import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Actions.css';
import MapPage from './MapPage';

function Actions() {
  const [actions, setActions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAction, setNewAction] = useState({ name: '', responsible: '', date: '' });
  const [editingAction, setEditingAction] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/actions')
      .then(response => {
        setActions(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar ações:", error);
      });
  }, []);

  const handleInputChange = (e) => {
    setNewAction({ ...newAction, [e.target.name]: e.target.value });
  };

  const handleCreateAction = () => {
    axios.post('http://localhost:3001/actions', newAction)
      .then(response => {
        console.log("Ação criada:", response.data.action);
        setActions([...actions, response.data.action]);
        setShowModal(false);
        setNewAction({ name: '', responsible: '', date: '' });
      })
      .catch(error => {
        console.error("Erro ao criar ação:", error);
      });
  };

  const handleDeleteAction = (id) => {
    axios.delete(`http://localhost:3001/actions/${id}`)
      .then(response => {
        console.log("Ação excluída:", response.data);
        setActions(actions.filter(action => action.id !== id));
      })
      .catch(error => {
        console.error("Erro ao excluir ação:", error);
      });
  };

  const handleEditClick = (action) => {
    setEditingAction(action);
    setNewAction(action);
    setShowModal(true);
  };

  const handleUpdateAction = () => {
    axios.put(`http://localhost:3001/actions/${editingAction.id}`, newAction)
      .then(response => {
        console.log("Ação atualizada:", response.data.action);
        setActions(actions.map(action =>
            action.id === editingAction.id ? response.data.action : action
        ));
        setShowModal(false);
        setEditingAction(null);
        setNewAction({ name: '', responsible: '', date: '' });
      })
      .catch(error => {
        console.error("Erro ao atualizar ação:", error);
      });
  };

  return (
    <>
      <MapPage /> {/* Adicione o mapa aqui */}

      <div className="page-container">
        <div className="page-header">
          <h2 className="page-title">Gestão de Ações</h2>
          <button className="add-button" onClick={() => {
              setEditingAction(null);
              setNewAction({ name: '', responsible: '', date: '' });
              setShowModal(true);
          }}>+ Nova Ação</button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Ação</th>
                <th>Responsável</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {actions.map(action => (
                <tr key={action.id}>
                  <td>{action.name}</td>
                  <td>{action.responsible}</td>
                  <td>{action.date}</td>
                  <td><span className={`status-badge ${action.status.toLowerCase().replace(' ', '-')}`}>{action.status}</span></td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditClick(action)}>Editar</button>
                    <button 
                      className="delete-btn" 
                      onClick={() => handleDeleteAction(action.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{editingAction ? 'Editar Ação' : 'Criar Nova Ação'}</h3>
              <label>Nome da Ação</label>
              <input type="text" name="name" value={newAction.name} onChange={handleInputChange} />
              <label>Responsável</label>
              <input type="text" name="responsible" value={newAction.responsible} onChange={handleInputChange} />
              <label>Data</label>
              <input type="date" name="date" value={newAction.date} onChange={handleInputChange} />

              <div className="modal-buttons">
                <button 
                  className="create-btn"
                  onClick={editingAction ? handleUpdateAction : handleCreateAction}
                >
                  {editingAction ? 'Salvar' : 'Criar'}
                </button>
                <button className="cancel-btn" onClick={() => {
                    setShowModal(false);
                    setEditingAction(null);
                    setNewAction({ name: '', responsible: '', date: '' });
                }}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Actions;