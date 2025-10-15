import React, { useState } from 'react';

const AlteracaoSenha = () => {
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (formData.newPassword.length !== 8) {
            setMessage('A nova senha deve ter exatamente 8 caracteres.');
            setIsError(true);
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('A nova senha e a confirmação não coincidem.');
            setIsError(true);
            return;
        }
        
        console.log("Dados da senha a serem enviados:", { currentPassword: formData.currentPassword, newPassword: formData.newPassword });
        setMessage('Senha alterada com sucesso! (Simulação)');
        setIsError(false);
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <div className="tab-content">
            <h3>Alteração de Senha</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Senha atual</label>
                    <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Nova senha (exatamente 8 caracteres)</label>
                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Confirmar nova senha</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                {message && <p className={`form-message ${isError ? 'error' : 'success'}`}>{message}</p>}
                <div className="form-footer">
                    <button type="submit" className="btn-save">Alterar Senha</button>
                </div>
            </form>
        </div>
    );
};

export default AlteracaoSenha;