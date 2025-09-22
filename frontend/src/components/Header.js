import React from 'react';
import '../styles/Header.css';

function Header({ isOpen, toggleSidebar }) {
  return (
    <header className={`header ${isOpen ? 'shifted' : ''}`}>
      <div className="mobile-menu-toggle" onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </div>
      <div className="header-content">
        <div className="user-info">
          <h3>Gestor de Tarefas </h3>
          <p>V.1.10</p>
        </div>
        <div className="admin-info">
          <p>Olá, Admin</p>
        </div>
      </div>
    </header>
  );
}

export default Header;