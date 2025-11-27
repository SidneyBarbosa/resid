// frontend/src/components/AcaoFormModal.js

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import api from '../services/api';
import '../styles/AcaoFormModal.css';

const AcaoFormModal = ({ onClose, onSave, acaoEmEdicao }) => {
  const initialState = {
    titulo: '',
    descricao: '',
    tipo: 'Reunião com Lideranças', // O formulário usa 'tipo'
    data: '',
    municipio_id: '',
    bairro: '',
    // latitude e longitude removidos daqui
    criar_tarefa: 'NÃO',
  };

  const [formData, setFormData] = useState(initialState);
  const [municipios, setMunicipios] = useState([]);
  const [bairros, setBairros] = useState([]);
  const [loadingBairros, setLoadingBairros] = useState(false);
  const [message, setMessage] = useState('');

  // Busca municípios (igual)
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await api.get('/municipios');
        setMunicipios(response.data);
      } catch (error) {
        console.error("Erro ao buscar municípios:", error);
      }
    };
    fetchMunicipios();
  }, []);

  // Preenche dados de edição (corrigido)
  useEffect(() => {
    if (acaoEmEdicao) {
      const dataFormatada = acaoEmEdicao.data ? new Date(acaoEmEdicao.data).toISOString().split('T')[0] : '';
      setFormData({
        ...initialState, 
        ...acaoEmEdicao,
        data: dataFormatada,
        municipio_id: acaoEmEdicao.cidade || '', 
        tipo: acaoEmEdicao.tipo || 'Reunião com Lideranças',
        // latitude e longitude não são mais necessários aqui
        criar_tarefa: 'NÃO' 
      });
    } else {
      setFormData(initialState);
    }
  }, [acaoEmEdicao]);

  // Busca bairros quando o município muda (correto)
  useEffect(() => {
    const fetchBairros = async () => {
      const municipioId = formData.municipio_id;
      if (municipioId) {
        setLoadingBairros(true);
        setBairros([]); 
        try {
          const response = await api.get(`/municipios/${municipioId}/bairros`);
          setBairros(response.data);
        } catch (error) {
          console.error("Erro ao buscar bairros:", error);
        } finally {
          setLoadingBairros(false);
        }
      } else {
        setBairros([]); 
      }
    };
    fetchBairros();
  }, [formData.municipio_id]);

  
  // handleChange (correto)
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      if (name === 'municipio_id') {
        return {
          ...prev,
          municipio_id: value,
          bairro: '' 
        };
      }
      return { ...prev, [name]: value };
    });
  };

  // handleSubmit (corrigido)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Traduz 'tipo' (do form) para 'tipo_acao' (que o controller espera)
    const dataToSend = {
      ...formData,
      tipo_acao: formData.tipo, 
    };
    delete dataToSend.tipo; // Remove o campo 'tipo' duplicado

    try {
      await onSave(dataToSend);
      onClose();
    } catch (error) {
      setMessage('Falha ao salvar a ação. ' + (error.response?.data?.message || ''));
      console.error("Erro ao salvar ação:", error);
    }
  };

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{acaoEmEdicao ? 'Editar Ação' : 'Nova Ação'}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="titulo">Título</label>
            <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição</label>
            <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange}></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipo">Tipo de Ação</label>
              <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange}>
                <option>Reunião com Lideranças</option>
                <option>Visita à Comunidade</option>
                <option>Evento Político</option>
                <option>Atendimento no Gabinete</option>
                <option>Outro</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="data">Data</label>
              <input type="date" id="data" name="data" value={formData.data} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="municipio_id">Município *</label>
              <select id="municipio_id" name="municipio_id" value={formData.municipio_id} onChange={handleChange} required>
                <option value="">Selecione o município</option>
                {municipios.map(m => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bairro">Bairro *</label>
              <select
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                required
                disabled={!formData.municipio_id || loadingBairros}
              >
                <option value="">
                  {loadingBairros
                    ? "Carregando bairros..."
                    : (formData.municipio_id ? "Selecione o bairro" : "Escolha um município primeiro")}
                </option>
                {bairros.map(b => (
                  <option key={b.id} value={b.nome}>{b.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {/* --- LATITUDE E LONGITUDE REMOVIDOS DESTA ÁREA --- */}

          <div className="form-group">
            <label htmlFor="criar_tarefa">Criar Tarefa?</label>
            <select id="criar_tarefa" name="criar_tarefa" value={formData.criar_tarefa} onChange={handleChange}>
              <option value="NÃO">Não</option>
              <option value="SIM">Sim</option>
            </select>
          </div>

          {message && <p className="form-message error">{message}</p>}
          
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById('modal-root')
  );
};

export default AcaoFormModal;