import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Actions from './components/Actions';
import TaskManagement from './components/TaskManagement';
import MapPage from './components/MapPage';
import Login from './components/Login';
import './styles/Global.css';
import './styles/App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    return true;
  };

  function ProtectedRoute({ children }) {
    return isLoggedIn ? children : <Navigate to="/login" />;
  }

  const DashboardLayout = ({ isSidebarOpen, toggleSidebar }) => (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
        <Header isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/acoes" element={<Actions />} />
            <Route path="/gestao-de-tarefas" element={<TaskManagement />} />
            <Route path="/mapa" element={<MapPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <DashboardLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;