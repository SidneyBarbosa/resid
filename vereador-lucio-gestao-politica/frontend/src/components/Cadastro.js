import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import ContatoMap from './ContatoMap';
import ContatoForm from './ContatoForm';
import NovoContatoForm from './NovoContatoForm';
import '../styles/Cadastro.css';
import '../styles/NovoContatoForm.css';

const Cadastro = () => {
    const [contatos, setContatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Controla o modal de EDIÇÃO
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [contatoToEdit, setContatoToEdit] = useState(null);

    const fetchContatos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/contatos');
            setContatos(response.data);
            setError(null);
        } catch (err) {
            setError('Falha ao carregar contatos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContatos();
    }, [fetchContatos]);

    const handleSave = async (contatoData) => {
        try {
            if (contatoToEdit) { // Editando um contato existente
                await api.put(`/contatos/${contatoToEdit.id}`, contatoData);
            } else { // Criando um novo contato
                await api.post('/contatos', { ...contatoData, profile_id: 'b9988984-6aab-44b6-9d81-f86d95a4ceb3' });
            }
            fetchContatos();
            setIsEditFormOpen(false);
            setContatoToEdit(null);
        } catch (err) {
            alert('Falha ao salvar o contato. Verifique o console para mais detalhes.');
            console.error(err);
        }
    };

    const handleEdit = (contato) => {
        setContatoToEdit(contato);
        setIsEditFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este contato?')) {
            try {
                await api.delete(`/contatos/${id}`);
                fetchContatos();
            } catch (err) {
                alert('Falha ao deletar o contato.');
                console.error(err);
            }
        }
    };

    if (loading) return <p>Carregando contatos...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="cadastro-page">
            {/* O modal de edição só abre quando o botão 'Editar' na tabela é clicado */}
            {isEditFormOpen && <ContatoForm onClose={() => setIsEditFormOpen(false)} onSave={handleSave} contatoToEdit={contatoToEdit} />}
            
            <div className="cadastro-header">
                <div>
                    <h2>Cadastro</h2>
                    <p>Cadastre novos contatos e gerencie informações</p>
                </div>
            </div>
            
            <div className="map-container-cadastro">
                <ContatoMap contatos={contatos} />
            </div>

            {/* FORMULÁRIO FIXO PARA NOVO CADASTRO SENDO RENDERIZADO AQUI */}
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
                                            <button className="action-btn delete-btn" onClick={() => handleDelete(contato.id)}>Deletar</button>
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
        </div>
    );
};

export default Cadastro;