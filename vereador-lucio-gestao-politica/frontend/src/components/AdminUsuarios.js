import React, { useState, useEffect, useCallback } from 'react';
import { FiEdit, FiTrash2, FiX, FiAlertTriangle } from 'react-icons/fi'; // Adicionei FiAlertTriangle
import api from '../services/api';

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

const formatLastAccess = (accessInfo) => {
    if (!accessInfo || !accessInfo.date) return <span>-</span>;
    // Lógica futura se o backend enviar o objeto de acesso
    return <span>-</span>;
};

const AdminUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- ESTADOS DE EDIÇÃO ---
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '', role: 'user' });

    // --- ESTADOS DE EXCLUSÃO (NOVO) ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // 1. BUSCAR USUÁRIOS
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar lista de usuários.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    // --- LÓGICA DE EXCLUSÃO ---
    
    // Passo 1: O usuário clica na lixeira -> Abre o modal
    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    // Passo 2: O usuário clica em "Sim, Excluir" -> Chama a API
    const executeDelete = async () => {
        if (!userToDelete) return;

        try {
            await api.delete(`/users/${userToDelete.id}`);
            
            // Remove da lista visualmente
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            
            // Fecha modal e limpa estado
            setShowDeleteModal(false);
            setUserToDelete(null);
        } catch (err) {
            alert(err.response?.data?.message || 'Erro ao excluir.');
            setShowDeleteModal(false); // Fecha mesmo com erro para não travar
        }
    };

    // --- LÓGICA DE EDIÇÃO ---
    const handleEditClick = (user) => {
        setEditingId(user.id);
        setEditForm({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        });
        setShowEditModal(true);
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${editingId}`, editForm);
            alert('Usuário atualizado com sucesso!');
            setShowEditModal(false);
            setEditingId(null);
            fetchUsers(); 
        } catch (err) {
            alert(err.response?.data?.message || 'Erro ao atualizar.');
        }
    };

    return (
        <div className="tab-content-inner">
            <h3>Administração de Usuários</h3>
            
            <div className="admin-header">
                <span>{users.length} usuários cadastrados</span>
                <button onClick={fetchUsers} className="btn-refresh" disabled={loading}>
                    {loading ? 'Carregando...' : 'Atualizar Lista'}
                </button>
            </div>

            {error && <div className="alert error">{error}</div>}

            <div className="table-wrapper">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nome</th><th>E-mail</th><th>Perfil</th><th>Data Criação</th><th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.first_name} {user.last_name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`profile-tag ${user.role}`}>
                                        {user.role === 'admin' ? 'Admin' : 'Usuário'}
                                    </span>
                                </td>
                                <td>{formatDate(user.created_at)}</td>
                                <td className="actions-cell">
                                    <button className="icon-btn" onClick={() => handleEditClick(user)} title="Editar">
                                        <FiEdit />
                                    </button>
                                    <button className="icon-btn delete" onClick={() => openDeleteModal(user)} title="Excluir">
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!loading && users.length === 0 && (
                            <tr><td colSpan="5" style={{textAlign:'center', padding:'20px'}}>Nenhum usuário encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- MODAL DE EDIÇÃO --- */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4>Editar Usuário</h4>
                            <button onClick={() => setShowEditModal(false)} className="close-modal"><FiX /></button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="config-form">
                            <div className="form-group">
                                <label>Nome</label>
                                <input type="text" value={editForm.first_name} onChange={e => setEditForm({...editForm, first_name: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Sobrenome</label>
                                <input type="text" value={editForm.last_name} onChange={e => setEditForm({...editForm, last_name: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>E-mail</label>
                                <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Perfil</label>
                                <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                                    <option value="user">Usuário Comum</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowEditModal(false)} className="btn-cancel">Cancelar</button>
                                <button type="submit" className="save-btn">Salvar Alterações</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- MODAL DE EXCLUSÃO (NOVO DESIGN) --- */}
            {showDeleteModal && userToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal">
                        <div className="delete-icon-wrapper">
                            <FiAlertTriangle size={40} />
                        </div>
                        <h4>Excluir Usuário?</h4>
                        <p>
                            Você tem certeza que deseja remover o usuário <strong>{userToDelete.first_name} {userToDelete.last_name}</strong>?
                            <br/>
                            <span style={{fontSize: '0.9rem', color: '#e53e3e'}}>Essa ação não poderá ser desfeita.</span>
                        </p>
                        
                        <div className="form-actions center">
                            <button onClick={() => setShowDeleteModal(false)} className="btn-cancel">
                                Cancelar
                            </button>
                            <button onClick={executeDelete} className="btn-danger">
                                Sim, Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminUsuarios;