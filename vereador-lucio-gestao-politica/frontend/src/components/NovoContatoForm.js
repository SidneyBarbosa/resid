import React, { useState } from 'react';
import '../styles/NovoContatoForm.css';

const NovoContatoForm = ({ onSave }) => {
    const initialState = {
        nome_completo: '', data_nascimento: '', sexo: '', email: '', telefone: '',
        cidade: 'Aracaju', bairro: '', escolaridade: '',
        assunto: '', observacao: '', latitude: '-10.9167', longitude: '-37.0500'
    };
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClear = () => {
        setFormData(initialState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        handleClear();
    };

    return (
        <div className="form-container">
            <h3>Novo Cadastro</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    
                    <div className="form-group">
                        <label>Nome Completo *</label>
                        <input type="text" name="nome_completo" value={formData.nome_completo} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Data de Nascimento</label>
                        <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Sexo</label>
                        <select name="sexo" value={formData.sexo} onChange={handleChange}>
                            <option value="">Selecione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Feminino">Feminino</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>E-mail</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Celular</label>
                        <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(DDD) XXXXX-XXXX" />
                    </div>
                    <div className="form-group">
                        <label>Município *</label>
                        <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Bairro *</label>
                        <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Escolaridade</label>
                        <select name="escolaridade" value={formData.escolaridade} onChange={handleChange}>
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
                    
                    <div className="form-group full-width">
                        <label>Assunto</label>
                        <textarea name="assunto" value={formData.assunto} onChange={handleChange} rows="3"></textarea>
                    </div>
                     
                    <div className="form-group full-width">
                        <label>Observação</label>
                        <textarea name="observacao" value={formData.observacao} onChange={handleChange} rows="4" placeholder="Descreva detalhes da ocorrência..."></textarea>
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="button" className="secondary-button" onClick={handleClear}>Limpar</button>
                    <button type="button" className="secondary-button" disabled>Imprimir Modelo</button>
                    <button type="submit" className="submit-button">Salvar Cadastro</button>
                </div>
            </form>
        </div>
    );
};

export default NovoContatoForm;