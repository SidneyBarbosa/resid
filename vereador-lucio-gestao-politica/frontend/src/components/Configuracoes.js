import React, { useState } from 'react';
import MeusDados from './MeusDados';
import AlteracaoSenha from './AlteracaoSenha';
import CadastroUsuario from './CadastroUsuario';
import AdminUsuarios from './AdminUsuarios';
import '../styles/Configuracoes.css';

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState('meus-dados');

  return (
    <div className="config-container">
      <header className="page-header">
        <div>
          <h1>Configurações</h1>
          <p>Gerencie suas configurações de usuário</p>
        </div>
      </header>

      <div className="config-card">
        <nav className="config-tabs">
          <button className={`tab-button ${activeTab === 'meus-dados' ? 'active' : ''}`} onClick={() => setActiveTab('meus-dados')}>Meus Dados</button>
          <button className={`tab-button ${activeTab === 'senha' ? 'active' : ''}`} onClick={() => setActiveTab('senha')}>Alteração de Senha</button>
          <button className={`tab-button ${activeTab === 'cadastro' ? 'active' : ''}`} onClick={() => setActiveTab('cadastro')}>Cadastro de Usuário</button>
          <button className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>Administração</button>
        </nav>

        <div className="config-content">
          {activeTab === 'meus-dados' && <MeusDados />}
          {activeTab === 'senha' && <AlteracaoSenha />}
          {activeTab === 'cadastro' && <CadastroUsuario />}
          {activeTab === 'admin' && <AdminUsuarios />}
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;