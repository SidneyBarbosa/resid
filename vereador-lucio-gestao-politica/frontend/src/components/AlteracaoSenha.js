import React, { useState } from 'react';
import api from '../services/api';

const AlteracaoSenha = () => {
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setIsError(false);

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('As senhas não coincidem.'); setIsError(true); return;
        }
        
        try {
            setLoading(true);
            await api.post('/profile/change-password', { 
                currentPassword: formData.currentPassword, 
                newPassword: formData.newPassword 
            });
            setMessage('Senha alterada com sucesso!');
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setIsError(true);
            setMessage(error.response?.data?.message || 'Erro ao alterar senha.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tab-content-inner">
            <h3>Alteração de Senha</h3>
            <p className="subtitle">Defina uma nova senha.</p>
            <form onSubmit={handleSubmit} className="config-form">
                <div className="form-group"><label>Senha atual</label><input type="password" value={formData.currentPassword} onChange={e => setFormData({...formData, currentPassword: e.target.value})} required /></div>
                <div className="form-group"><label>Nova senha</label><input type="password" value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} required minLength={6} /></div>
                <div className="form-group"><label>Confirmar senha</label><input type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} required /></div>
                
                {message && <div className={`alert ${isError ? 'error' : 'success'}`}>{message}</div>}
                
                <div className="form-footer">
                    <button type="submit" className="btn-save" disabled={loading}>{loading ? 'Salvando...' : 'Alterar Senha'}</button>
                </div>
            </form>
        </div>
    );
};
export default AlteracaoSenha;