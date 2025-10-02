// frontend/src/components/ContatoForm.js
import React, { useState, useEffect } from 'react';
import '../styles/TaskForm.css'; // Reutilizando o estilo do formulário de tarefas

const ContatoForm = ({ onClose, onSave, contatoToEdit }) => {
    const [contatoData, setContatoData] = useState({
        nome_completo: '', email: '', telefone: '', endereco: '', bairro: '',
        cidade: 'Aracaju', estado: 'SE', cep: '', data_nascimento: '', sexo: '',
        latitude: '', longitude: ''
    });

    useEffect(() => {
        if (contatoToEdit) {
            setContatoData({
                ...contatoToEdit,
                data_nascimento: contatoToEdit.data_nascimento ? new Date(contatoToEdit.data_nascimento).toISOString().split('T')[0] : ''
            });
        }
    }, [contatoToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContatoData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(contatoData);
    };

    return (
        <div className="task-form-overlay">
            <div className="task-form-container">
                <div className="task-form-header">
                    <h2>{contatoToEdit ? 'Editar Contato' : 'Novo Contato'}</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="task-form-body">
                    {/* Adicione os campos do formulário aqui. Exemplo para nome: */}
                    <div className="form-group">
                        <label>Nome Completo</label>
                        <input type="text" name="nome_completo" value={contatoData.nome_completo} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Telefone</label>
                        <input type="text" name="telefone" value={contatoData.telefone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Bairro</label>
                        <input type="text" name="bairro" value={contatoData.bairro} onChange={handleChange} />
                    </div>
                    {/* Adicione outros campos conforme necessário (email, endereço, etc.) */}
                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="submit-button">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContatoForm;