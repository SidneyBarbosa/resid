import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Actions from './components/Actions';
import TaskManagement from './components/TaskManagement';
import MapPage from './components/MapPage';
import Login from './components/Login';
import Eleicoes from './components/Eleicoes';
import Cadastro from './components/Cadastro';
import Financeiro from './components/Financeiro';
import Configuracoes from './components/Configuracoes';
import PrivateRoute from './components/PrivateRoute';
import './styles/Global.css';
import './styles/App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Componente de layout que envolve as rotas internas
function DashboardLayout({ isSidebarOpen, toggleSidebar }) {
  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
        <Header isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    setLoadingAuth(false);
  }, []);

  if (loadingAuth) {
    return <div>Carregando...</div>;
  }

  function ProtectedRoute() {
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        
        {/* Rotas protegidas: só podem ser acessadas se o usuário estiver logado */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/acoes" element={<Actions />} />
            <Route path="/gestao-de-tarefas" element={<TaskManagement />} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/financeiro" element={<PrivateRoute><Financeiro /></PrivateRoute>} />
            <Route path="/eleicoes" element={<Eleicoes />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;