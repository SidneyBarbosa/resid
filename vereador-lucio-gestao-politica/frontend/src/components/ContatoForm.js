import React, { useState, useEffect } from 'react';
import '../styles/TaskForm.css';

const ContatoForm = ({ onClose, onSave, contatoToEdit }) => {
    
    const initialState = {
        nome_completo: '',
        data_nascimento: '',
        sexo: '',
        email: '',
        telefone: '',
        cidade: '',
        bairro: '',
        escolaridade: '',
        assunto: '',
        observacao: '',
        latitude: '',
        longitude: ''
    };
    
    const [contatoData, setContatoData] = useState(initialState);

    useEffect(() => {
        if (contatoToEdit) {
            const safeData = { ...initialState, id: contatoToEdit.id };

            for (const key in initialState) {
                if (contatoToEdit[key] !== null && contatoToEdit[key] !== undefined) {
                    safeData[key] = contatoToEdit[key];
                }
            }
            
            if (contatoToEdit.data_nascimento) {
                safeData.data_nascimento = new Date(contatoToEdit.data_nascimento).toISOString().split('T')[0];
            }

            setContatoData(safeData);
        }
    }, [contatoToEdit, initialState]); // Adicionando initialState às dependências

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
                    
                    <div className="form-group">
                        <label>Nome Completo</label>
                        <input type="text" name="nome_completo" value={contatoData.nome_completo} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Data de Nascimento</label>
                        <input type="date" name="data_nascimento" value={contatoData.data_nascimento} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Sexo</label>
                        <select name="sexo" value={contatoData.sexo} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>E-mail</label>
                        <input type="email" name="email" value={contatoData.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Telefone</label>
                        <input type="text" name="telefone" value={contatoData.telefone} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Município</label>
                        <input type="text" name="cidade" value={contatoData.cidade} onChange={handleChange} />
                    </div>
                    
                    <div className="form-group">
                        <label>Bairro</label>
                        <input type="text" name="bairro" value={contatoData.bairro} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Escolaridade</label>
                        <select name="escolaridade" value={contatoData.escolaridade} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option value="Analfabeto">Analfabeto</option>
                            <option value="Fundamental Incompleto">Fundamental Incompleto</option>
                            <option value="Fundamental Completo">Fundamental Completo</option>
                            <option value="Médio Incompleto">Médio Incompleto</option>
                            <option value="Médio Completo">Médio Completo</option>
                            <option value="Superior Incompleto">Superior Incompleto</option>
                            <option value="Superior Completo">Superior Completo</option>
                            <option value="Pós-graduação">Pós-graduação</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Assunto</label>
                        <textarea name="assunto" value={contatoData.assunto} onChange={handleChange} rows="3"></textarea>
                    </div>
                     
                    <div className="form-group">
                        <label>Observação</label>
                        <textarea name="observacao" value={contatoData.observacao} onChange={handleChange} rows="4"></textarea>
                    </div>
                    
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