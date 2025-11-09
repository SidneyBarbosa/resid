import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/AcaoFormModal.css';

const AcaoFormModal = ({ onClose, onSave, acaoToEdit }) => {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [tipo, setTipo] = useState('Reunião com Lideranças');
    const [data, setData] = useState('');
    const [municipioId, setMunicipioId] = useState('');
    const [bairro, setBairro] = useState('');
    
    const [concluida, setConcluida] = useState(false);

    const [municipios, setMunicipios] = useState([]);

    useEffect(() => {
        if (acaoToEdit) {
            setTitulo(acaoToEdit.titulo || '');
            setDescricao(acaoToEdit.descricao || '');
            setTipo(acaoToEdit.tipo || 'Reunião com Lideranças');
            setData(acaoToEdit.data ? new Date(acaoToEdit.data).toISOString().split('T')[0] : '');
            setMunicipioId(acaoToEdit.municipioId || '');
            setBairro(acaoToEdit.bairro || '');
            
            setConcluida(!!acaoToEdit.concluida); 
        }
    }, [acaoToEdit]);

    useEffect(() => {
        const fetchMunicipios = async () => {
            try {
                const response = await api.get('/municipios');
                setMunicipios(response.data);
            } catch (error) {
                console.error("Falha ao buscar municípios", error);
            }
        };
        fetchMunicipios();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const acaoData = { titulo, descricao, tipo, data, municipioId, bairro, concluida };
        onSave(acaoData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{acaoToEdit ? 'Editar Ação' : 'Nova Ação'}</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="titulo">Título</label>
                        <input type="text" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="descricao">Descrição</label>
                        <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="tipo">Tipo de Ação</label>
                        <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                            <option>Reunião com Lideranças</option>
                            <option>Visita a Bairro</option>
                            <option>Evento Comunitário</option>
                            <option>Gabinete na Rua</option>
                            <option>Outro</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="data">Data</label>
                        <input type="date" id="data" value={data} onChange={(e) => setData(e.target.value)} required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="municipio">Município *</label>
                            <select id="municipio" value={municipioId} onChange={(e) => setMunicipioId(e.target.value)} required>
                                <option value="">Selecione o município</option>
                                {municipios.map(mun => (
                                    <option key={mun.id} value={mun.id}>{mun.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bairro">Bairro *</label>
                            <input type="text" id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
                        </div>
                    </div>

                    {}
                    <div className="form-group">
                        <label htmlFor="concluida">Criar Tarefa?</label>
                        <select 
                            id="concluida" 
                            value={concluida} 
                            onChange={(e) => setConcluida(e.target.value === 'true')}
                        >
                            <option value="false">Não</option>
                            <option value="true">Sim</option>
                        </select>
                    </div>
                    
                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                        <button type="submit" className="btn-save">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AcaoFormModal;