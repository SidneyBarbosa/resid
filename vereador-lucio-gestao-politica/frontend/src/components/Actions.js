import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import '../styles/Actions.css';
import ContatoMap from './ContatoMap';
import AcaoFormModal from './AcaoFormModal';

const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

function Actions() {
    const [actions, setActions] = useState([]);
    const [contatos, setContatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroBairro, setFiltroBairro] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [acaoToEdit, setAcaoToEdit] = useState(null);

    const fetchActions = useCallback(async () => {
        try {
            const response = await api.get('/acoes');
            setActions(response.data);
        } catch (error) {
            console.error("Erro ao buscar ações:", error);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const contatosResponse = await api.get('/contatos');
            setContatos(contatosResponse.data);
            await fetchActions();
            setLoading(false);
        };
        fetchData();
    }, [fetchActions]);

    const filteredActions = useMemo(() => {
        return actions.filter(action =>
            action.bairro?.toLowerCase().includes(filtroBairro.toLowerCase())
        );
    }, [actions, filtroBairro]);

   
    const handleSave = async (formData) => {
        try {
            if (acaoToEdit) {
                
                await api.put(`/acoes/${acaoToEdit.id}`, formData);
            } else {
                
                await api.post('/acoes', formData);
            }
            await fetchActions();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao salvar ação:", error);
            alert("Falha ao salvar a ação. Verifique o console.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta ação?')) {
            try {
                await api.delete(`/acoes/${id}`);
                setActions(actions.filter(a => a.id !== id));
            } catch (error) {
                console.error("Erro ao excluir ação:", error);
            }
        }
    };

    const handleOpenCreateModal = () => {
        setAcaoToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (action) => {
        setAcaoToEdit(action);
        setIsModalOpen(true);
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <>
            <div className="map-wrapper-actions">
                <h3>Mapa de Contatos em Aracaju</h3>
                <ContatoMap contatos={contatos} />
            </div>

            <div className="page-container">
                <div className="actions-header">
                    <div className="header-title"><h2>Registro de Ações</h2></div>
                    <div className="header-actions">
                        <input type="text" placeholder="Filtrar por bairro..." className="filter-input" value={filtroBairro} onChange={e => setFiltroBairro(e.target.value)} />
                        <button className="add-button" onClick={handleOpenCreateModal}>+ Nova Ação</button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="data-table">
                        <thead><tr><th>TÍTULO</th><th>BAIRRO</th><th>TIPO DA AÇÃO</th><th>DATA</th><th>AÇÕES</th></tr></thead>
                        <tbody>
                            {filteredActions.map(action => (
                                <tr key={action.id}>
                                    <td>{action.titulo || '-'}</td>
                                    <td>{action.bairro}</td>
                                    <td>{action.tipo}</td>
                                    <td>{formatDateForDisplay(action.data)}</td>
                                    <td className="actions-cell">
                                        <button className="icon-btn edit-btn" title="Editar" onClick={() => handleOpenEditModal(action)}>✏️</button>
                                        <button className="icon-btn delete-btn" title="Excluir" onClick={() => handleDelete(action.id)}>🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- RENDERIZA O NOVO MODAL --- */}
                {/* O modal só é mostrado quando isModalOpen é true */}
                {isModalOpen && (
                    <AcaoFormModal
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSave}
                        acaoToEdit={acaoToEdit}
                    />
                )}
            </div>
        </>
    );
}

export default Actions;