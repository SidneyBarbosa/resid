import React from 'react';
import { Link } from 'react-router-dom';
import { BiHomeAlt, BiBullseye, BiTask, BiUser, BiMoney, BiTrophy, BiCog } from 'react-icons/bi';
import '../styles/Sidebar.css';

function Sidebar({ isOpen }) {
  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">Menu Principal</h2>
      </div>
      <ul className="sidebar-menu">
        <li>
          <Link to="/" className="menu-link">
            <BiHomeAlt className="menu-icon" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/acoes" className="menu-link">
            <BiBullseye className="menu-icon" />
            <span>Ações</span>
          </Link>
        </li>
        <li>
          <Link to="/gestao-de-tarefas" className="menu-link">
            <BiTask className="menu-icon" />
            <span>Gestão de Tarefas</span>
          </Link>
        </li>
        <li>
          <Link to="/cadastro" className="menu-link">
            <BiUser className="menu-icon" />
            <span>Cadastro</span>
          </Link>
        </li>
        <li>
          <Link to="/financeiro" className="menu-link">
            <BiMoney className="menu-icon" />
            <span>Financeiro</span>
          </Link>
        </li>
        <li>
          <Link to="/eleicoes" className="menu-link">
            <BiTrophy className="menu-icon" />
            <span>Eleição 2024</span>
          </Link>
        </li>
        <li>
          <Link to="/configuracoes" className="menu-link">
            <BiCog className="menu-icon" />
            <span>Configurações</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;