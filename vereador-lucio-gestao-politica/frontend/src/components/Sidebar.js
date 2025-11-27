import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const MenuLink = ({ to, icon, label }) => (
  <li>
    <Link to={to} className="menu-link">
      <i className={`menu-icon bi ${icon}`}></i>
      <span>{label}</span>
    </Link>
  </li>
);

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault(); // Impede a navegação padrão do link
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">Menu</span>
      </div>
      
      {/* 4. Wrapper para o conteúdo (menu + logout) */}
      <div className="sidebar-content-wrapper">
        <ul className="sidebar-menu">
          <MenuLink to="/" icon="bi-grid-fill" label="Dashboard" />
          <MenuLink to="/acoes" icon="bi-briefcase-fill" label="Ações" />
          <MenuLink to="/gestao-de-tarefas" icon="bi-list-task" label="Gestão de Tarefas" />
          <MenuLink to="/cadastro" icon="bi-person-plus-fill" label="Cadastro" />
          <MenuLink to="/financeiro" icon="bi-cash-coin" label="Financeiro" />
          <MenuLink to="/eleicoes" icon="bi-archive-fill" label="Eleições" />
          <MenuLink to="/configuracoes" icon="bi-gear-fill" label="Configurações" />
        </ul>

        {/* 5. Botão de Sair (fora do menu principal) */}
        <div className="sidebar-logout">
          <a href="/login" onClick={handleLogout} className="menu-link logout-link">
            <i className="menu-icon bi bi-box-arrow-left"></i>
            <span>Sair</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;