import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import AcaoFormModal from '../components/AcaoFormModal';
import ConfirmModal from '../components/ConfirmModal';
import DataMap from '../components/DataMap'; // Usa o mapa unificado
import '../styles/Actions.css';

// --- Função Auxiliar (Tabela) ---
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};
// ---------------------------------

const Actions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acaoEmEdicao, setAcaoEmEdicao] = useState(null); // Estado-chave para o ícone
  const [acoes, setAcoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [acaoToDeleteId, setAcaoToDeleteId] = useState(null);

  const fetchAcoes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/acoes');
      setAcoes(response.data);
    } catch (err) {
      setError('Falha ao carregar ações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcoes();
  }, []);

  const handleOpenModal = (acao = null) => {
    setAcaoEmEdicao(acao); // Define qual ação está em edição
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setAcaoEmEdicao(null); // Limpa a ação em edição
    setIsModalOpen(false);
  };

  const handleSave = async (acaoData) => {
    try {
      if (acaoEmEdicao) {
        await api.put(`/acoes/${acaoEmEdicao.id}`, acaoData);
      } else {
        await api.post('/acoes', acaoData);
      }
      await fetchAcoes();
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao salvar ação:", error);
      throw error; 
    }
  };

  const handleOpenConfirmModal = (id) => {
    setAcaoToDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setAcaoToDeleteId(null);
    setIsConfirmModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (acaoToDeleteId) {
      try {
        await api.delete(`/acoes/${acaoToDeleteId}`);
        await fetchAcoes();
        handleCloseConfirmModal();
      } catch (error) {
        console.error("Erro ao deletar ação:", error);
        handleCloseConfirmModal();
      }
    }
  };

  const filteredAcoes = useMemo(() =>
    acoes.filter(acao =>
      (acao.bairro && acao.bairro.toLowerCase().includes(filter.toLowerCase())) ||
      (acao.titulo && acao.titulo.toLowerCase().includes(filter.toLowerCase()))
    ), [acoes, filter]
  );

  return (
    <div className="page-container">
      <div className="actions-header">
        <div className="header-title">
          <h2>Registro de Ações</h2>
        </div>
        <div className="header-actions">
          <input
            type="text"
            className="filter-input"
            placeholder="Filtrar por título ou bairro..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button className="add-button" onClick={() => handleOpenModal(null)}>
            + Nova Ação
          </button>
        </div>
      </div>

      <div className="map-page-container">
        <div className="map-header">
          <h2 className="map-title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Mapa de Ações</h2>
        </div>
        
        <DataMap 
          data={acoes} 
          titleField="titulo"
          dateField="data"
          entityName="ações"
        />
      </div>


      {/* --- TABELA DE AÇÕES --- */}
      <div className="table-container" style={{ marginTop: '2rem' }}>
        {loading ? (
          <p>Carregando...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>TÍTULO</th>
                <th>BAIRRO</th>
                <th>TIPO DA AÇÃO</th>
                <th>DATA</th>
                {/* CUSTO REMOVIDO */}
                <th>AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {filteredAcoes.map(acao => {
                // Lógica para destacar o ícone
                const isEditing = acaoEmEdicao?.id === acao.id;

                return (
                  <tr key={acao.id}>
                    <td>{acao.titulo}</td>
                    <td>{acao.bairro || '-'}</td>
                    <td>{acao.tipo}</td>
                    <td>{formatDate(acao.data)}</td>
                    {/* CUSTO REMOVIDO */}
                    <td className="actions-cell">
                      
                      <button 
                        className={`action-icon-button edit-btn ${isEditing ? 'active' : ''}`} 
                        onClick={() => handleOpenModal(acao)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>

                      <button 
                        className="action-icon-button delete-btn" 
                        onClick={() => handleOpenConfirmModal(acao.id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {/* --- FIM DA TABELA --- */}

      {/* --- MODAIS --- */}
      {isModalOpen && (
        <AcaoFormModal
          onClose={handleCloseModal}
          onSave={handleSave}
          acaoEmEdicao={acaoEmEdicao}
        />
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        message="Tem certeza que deseja excluir esta ação?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseConfirmModal}
      />
    </div>
  );
};

export default Actions;