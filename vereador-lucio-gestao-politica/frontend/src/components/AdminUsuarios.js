import React, { useState, useEffect, useCallback } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

// --- DADOS SIMULADOS ATUALIZADOS ---
const mockUsers = [
    {
        id: '1a2b3c-admin',
        first_name: 'Administrador',
        last_name: 'Sistema',
        email: 'administrador@sistema.local',
        role: 'admin',
        created_at: '2025-05-11T10:00:00.000Z',
        last_access: {
            date: '2025-06-24T18:33:00.000Z',
            page: 'login'
        }
    },
    {
        id: '4d5e6f-user',
        first_name: 'Usuário',
        last_name: 'Comum',
        email: 'usuario.comum@email.com',
        role: 'user',
        created_at: '2025-10-15T12:00:00.000Z',
        last_access: null
    }
];
// --------------------------------------------------

// Função para formatar a data (DD/MM/AAAA)
const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
};

const formatLastAccess = (accessInfo) => {
    if (!accessInfo || !accessInfo.date) {
        return <span>-</span>;
    }
    const date = new Date(accessInfo.date);
    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="last-access-cell">
            <span>{`${formattedDate}, ${formattedTime}`}</span>
            <span className="page-info">{`Página: ${accessInfo.page}`}</span>
        </div>
    );
};

const AdminUsuarios = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setUsers(mockUsers);
            setLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div className="tab-content">
            <h3>Administração de Usuários</h3>
            <p className="subtitle">Gerencie usuários e suas permissões de acesso às páginas do sistema</p>
            
            <div className="admin-header">
                <span>{users.length} usuário(s) encontrado(s)</span>
                <button onClick={fetchUsers} className="btn-refresh" disabled={loading}>
                    {loading ? 'Atualizando...' : 'Atualizar Lista'}
                </button>
            </div>
            
            <div className="table-wrapper">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Perfil</th>
                            <th>Data de Criação</th>
                            <th>Último Acesso</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td>{`${user.first_name} ${user.last_name}`}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`profile-tag ${user.role}`}>
                                            {user.role === 'admin' ? 'Administrador' : 'Usuário Comum'}
                                        </span>
                                    </td>
                                    <td>{formatDate(user.created_at)}</td>
                                    <td>{formatLastAccess(user.last_access)}</td>
                                    <td className="actions-cell">
                                        <button className="icon-btn" title="Editar"><FiEdit /></button>
                                        <button className="icon-btn" title="Excluir"><FiTrash2 /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsuarios;