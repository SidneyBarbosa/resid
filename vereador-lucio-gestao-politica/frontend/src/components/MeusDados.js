import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { BsPersonFill, BsEnvelopeFill, BsCheckCircle } from 'react-icons/bs';

const MeusDados = () => {
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/config/profile').then(res => {
        setFormData(res.data);
        setLoading(false);
    }).catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await api.put('/config/profile', formData);
      setMessage({ type: 'success', text: 'Dados atualizados!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar.' });
    }
  };

  if (loading) return <p style={{padding:'20px'}}>Carregando...</p>;

  return (
    <div className="tab-content-inner">
      <h3>Meus Dados</h3>
      <p className="subtitle">Atualize suas informações.</p>
      {message && <div className={`alert ${message.type}`}>{message.text}</div>}
      <form className="config-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group half">
            <label>Nome</label>
            <div className="input-wrapper"><BsPersonFill className="input-icon" /><input type="text" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} /></div>
          </div>
          <div className="form-group half">
            <label>Sobrenome</label>
            <div className="input-wrapper"><BsPersonFill className="input-icon" /><input type="text" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} /></div>
          </div>
        </div>
        <div className="form-group">
          <label>E-mail</label>
          <div className="input-wrapper"><BsEnvelopeFill className="input-icon" /><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
        </div>
        <div className="form-footer"><button type="submit" className="btn-save"><BsCheckCircle /> Salvar</button></div>
      </form>
    </div>
  );
};
export default MeusDados;