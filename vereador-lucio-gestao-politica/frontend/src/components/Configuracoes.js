// frontend/src/components/Configuracoes.js
import React, { useState } from 'react';

// Importe os componentes que representam o CONTEÚDO de cada aba
import AlteracaoSenha from './AlteracaoSenha';
import CadastroUsuario from './CadastroUsuario';
import AdminUsuarios from './AdminUsuarios';

// Importe o CSS que vai estilizar TODA esta página
import '../styles/Configuracoes.css';

const Configuracoes = () => {
    // Este estado controla qual aba está ativa no momento
    const [activeTab, setActiveTab] = useState('senha');

    return (
        <div className="config-container">
            <header className="page-header">
                <div>
                    <h1>Configurações</h1>
                    <p>Gerencie suas configurações de usuário</p>
                </div>
            </header>

            <div className="config-card">
                {/* Navegação das Abas */}
                <nav className="config-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'senha' ? 'active' : ''}`}
                        onClick={() => setActiveTab('senha')}
                    >
                        Alteração de Senha
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'cadastro' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cadastro')}
                    >
                        Cadastro de Usuário
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admin')}
                    >
                        Administração de Usuários
                    </button>
                </nav>

                {/* Área onde o conteúdo da aba ativa é exibido */}
                <div className="config-content">
                    {activeTab === 'senha' && <AlteracaoSenha />}
                    {activeTab === 'cadastro' && <CadastroUsuario />}
                    
                    {/* Conteúdo de exemplo para a terceira aba */}
                    {activeTab === 'admin' && (
                        <div className="tab-content">
                            <h3>Administração de Usuários</h3>
                            {activeTab === 'admin' && <AdminUsuarios />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Configuracoes;