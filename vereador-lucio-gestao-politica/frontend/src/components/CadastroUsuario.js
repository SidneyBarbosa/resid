// frontend/src/components/CadastroUsuario.js
import React, { useState } from 'react';
import api from '../services/api';

const CadastroUsuario = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        role: 'user',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        
        if (formData.password !== formData.confirmPassword) {
            setMessage('As senhas não coincidem.');
            setIsError(true);
            return;
        }

        try {
            const { confirmPassword, ...dataToSend } = formData;
            const response = await api.post('/users', dataToSend);
            setMessage(response.data.message);
            setFormData({ first_name: '', last_name: '', email: '', role: 'user', password: '', confirmPassword: '' });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Ocorreu um erro ao cadastrar.');
            setIsError(true);
        }
    };

    return (
        <div className="tab-content">
            <h3>Cadastro de Novo Usuário</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Nome *</label>
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Sobrenome *</label>
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </div>
                </div>
                <div className="form-group">
                    <label>E-mail *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                {/* --- MUDANÇA APLICADA AQUI --- */}
                {/* Removemos a div "form-row" que agrupava os dois campos abaixo */}

                <div className="form-group">
                    <label>Tipo de Perfil *</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="user">Usuário Comum</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Senha *</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                
                {/* ---------------------------------- */}
                
                 <div className="form-group">
                    <label>Confirmar Senha *</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>

                {message && <p className={`form-message ${isError ? 'error' : 'success'}`}>{message}</p>}
                
                <div className="form-footer">
                    <button type="submit" className="btn-save">Cadastrar Usuário</button>
                </div>
            </form>
        </div>
    );
};

export default CadastroUsuario;