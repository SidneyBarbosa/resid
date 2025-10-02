// frontend/src/components/NovoContatoForm.js
import React, { useState } from 'react';
import '../styles/NovoContatoForm.css';

const NovoContatoForm = ({ onSave }) => {
    // Estado inicial com TODOS os campos do formulário
    const initialState = {
        nome_completo: '', data_nascimento: '', sexo: '', email: '', telefone: '',
        cidade: 'Aracaju', bairro: '', escolaridade: '', assessor_parlamentar: '',
        assunto: '', observacao: '', latitude: '-10.9167', longitude: '-37.0500', // Coordenadas padrão
        criar_tarefa: 'NÃO'
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
        handleClear(); // Limpa o formulário após salvar
    };

    return (
        <div className="form-container">
            <h3>Novo Cadastro</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    {/* --- LINHA 1 --- */}
                    <div className="form-group">
                        <label>Nome Completo *</label>
                        <input type="text" name="nome_completo" value={formData.nome_completo} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Data de Nascimento</label>
                        <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} />
                    </div>
                    {/* --- LINHA 2 --- */}
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
                    {/* --- LINHA 3 --- */}
                    <div className="form-group">
                        <label>Celular</label>
                        <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(DDD) XXXXX-XXXX" />
                    </div>
                    <div className="form-group">
                        <label>Município *</label>
                        <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />
                    </div>
                    {/* --- LINHA 4 --- */}
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
                    {/* --- LINHA 5 --- */}
                     <div className="form-group">
                        <label>Assessor Parlamentar</label>
                        <select name="assessor_parlamentar" value={formData.assessor_parlamentar} onChange={handleChange}>
                            <option value="">Selecione um assessor</option>
                            {/* No futuro, esta lista pode vir do banco de dados */}
                            <option value="Carlos">Carlos</option>
                            <option value="Maria">Maria</option>
                            <option value="João">João</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Criar Tarefa *</label>
                        <select name="criar_tarefa" value={formData.criar_tarefa} onChange={handleChange}>
                            <option value="NÃO">NÃO</option>
                            <option value="SIM">SIM</option>
                        </select>
                        <small>Selecione "SIM" para criar uma tarefa automática.</small>
                    </div>
                    {/* --- LINHA 6 (Largura Total) --- */}
                    <div className="form-group full-width">
                        <label>Assunto</label>
                        <textarea name="assunto" value={formData.assunto} onChange={handleChange} rows="3"></textarea>
                    </div>
                     {/* --- LINHA 7 (Largura Total) --- */}
                    <div className="form-group full-width">
                        <label>Observação</label>
                        <textarea name="observacao" value={formData.observacao} onChange={handleChange} rows="4" placeholder="Descreva detalhes da ocorrência..."></textarea>
                    </div>
                </div>
                {/* --- BOTÕES --- */}
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