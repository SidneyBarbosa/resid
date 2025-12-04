// frontend/src/App.js (Limpo e Correto)

import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
import PrivateRoute from './components/PrivateRoute'; // Este arquivo agora está correto
import './styles/Global.css';
import './styles/App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// O DashboardLayout está perfeito. O <Outlet/> aqui é o que renderiza 
// as páginas filhas (Dashboard, Acoes, etc.)
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // A função handleLogin e a prop onLogin foram removidas.
  // Elas não são mais necessárias.

  return (
    <Router>
      <Routes>
        {/* Rota Pública */}
        <Route path="/login" element={<Login />} />
        
        {/* Rota Pai Protegida */}
        <Route 
          path="/" 
          element={
            <PrivateRoute> {/* O PrivateRoute agora renderiza o DashboardLayout como 'children' */}
              <DashboardLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </PrivateRoute>
          }
        >
          {/* Rotas Filhas (que aparecem dentro do DashboardLayout) */}
          <Route index element={<Dashboard />} /> {/* Rota inicial */}
          <Route path="acoes" element={<Actions />} />
          <Route path="gestao-de-tarefas" element={<TaskManagement />} />
          <Route path="mapa" element={<MapPage />} />
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="eleicoes" element={<Eleicoes />} />
          <Route path="cadastro" element={<Cadastro />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;