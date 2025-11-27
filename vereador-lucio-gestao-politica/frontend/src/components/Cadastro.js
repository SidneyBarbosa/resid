import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import DataMap from './DataMap';
import ContatoForm from './ContatoForm';
import NovoContatoForm from './NovoContatoForm';
import ConfirmModal from './ConfirmModal';
import '../styles/Cadastro.css';
import '../styles/NovoContatoForm.css';

const Cadastro = () => {
    const [contatos, setContatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [contatoToEdit, setContatoToEdit] = useState(null);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [contatoToDeleteId, setContatoToDeleteId] = useState(null);
    
    // Estado para o mapa de Ações
    const [acoes, setAcoes] = useState([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [contatosResponse, acoesResponse] = await Promise.all([
                api.get('/contatos'),
                api.get('/acoes')
            ]);
            
            setContatos(contatosResponse.data);
            setAcoes(acoesResponse.data); // Define as ações para o mapa
            setError(null);
        } catch (err) {
            setError('Falha ao carregar dados da página.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async (contatoData) => {
        try {
            if (contatoToEdit) {
                await api.put(`/contatos/${contatoToEdit.id}`, contatoData);
            } else {
                await api.post('/contatos', { ...contatoData, profile_id: 'b9988984-6aab-44b6-9d81-f86d95a4ceb3' });
            }
            // Apenas recarrega os contatos, pois o mapa de ações não mudou
            const contatosResponse = await api.get('/contatos');
            setContatos(contatosResponse.data);

            setIsEditFormOpen(false);
            setContatoToEdit(null);
        } catch (err) {
            alert('Falha ao salvar o contato.');
            console.error(err);
        }
    };

    const handleEdit = (contato) => {
        setContatoToEdit(contato);
        setIsEditFormOpen(true);
    };

    const handleOpenConfirmModal = (id) => {
        setContatoToDeleteId(id);
        setIsConfirmModalOpen(true);
    };

    const handleCloseConfirmModal = () => {
        setContatoToDeleteId(null);
        setIsConfirmModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (contatoToDeleteId) {
            try {
                await api.delete(`/contatos/${contatoToDeleteId}`);
                
                // Apenas recarrega os contatos
                const contatosResponse = await api.get('/contatos');
                setContatos(contatosResponse.data);

                handleCloseConfirmModal();
            } catch (err) {
                alert('Falha ao deletar o contato.');
                console.error(err);
                handleCloseConfirmModal();
            }
        }
    };

    if (loading) return <p>Carregando dados...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="cadastro-page">
            {isEditFormOpen && <ContatoForm onClose={() => setIsEditFormOpen(false)} onSave={handleSave} contatoToEdit={contatoToEdit} />}
            
            <div className="cadastro-header">
                <div>
                    <h2>Cadastro</h2>
                    <p>Cadastre novos contatos e gerencie informações</p>
                </div>
            </div>
            
            <div className="map-container-cadastro">
                <DataMap 
                    data={acoes} // Mostra o mapa de AÇÕES
                    titleField="titulo"
                    dateField="data"
                    entityName="ações"
                />
            </div>

            <NovoContatoForm onSave={handleSave} />

            <div className="table-container-cadastro">
                <h3>Contatos Cadastrados ({contatos.length})</h3>
                <div className="table-wrapper">
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>NOME</th>
                                <th>BAIRRO</th>
                                <th>TELEFONE</th>
                                <th>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contatos.length > 0 ? (
                                contatos.map(contato => (
                                    <tr key={contato.id}>
                                        <td>{contato.nome_completo}</td>
                                        <td>{contato.bairro || '-'}</td>
                                        <td>{contato.telefone || '-'}</td>
                                        <td>
                                            <button className="action-btn edit-btn" onClick={() => handleEdit(contato)}>Editar</button>
                                            <button className="action-btn delete-btn" onClick={() => handleOpenConfirmModal(contato.id)}>Deletar</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center' }}>Nenhum contato cadastrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                message="Tem certeza que deseja deletar este contato?"
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseConfirmModal}
            />
        </div>
    );
};

export default Cadastro;