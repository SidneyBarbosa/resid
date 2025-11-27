// frontend/src/components/PrivateRoute.js (CORRIGIDO)

import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Esta função verifica se o token de autenticação
 * existe no localStorage do navegador.
 */
const useAuth = () => {
  const token = localStorage.getItem('authToken');
  // !! (dupla negação) transforma a string (ou null) em um booleano (true/false)
  return !!token; 
};

/**
 * Este componente é a sua "Rota Protegida".
 * Ele recebe { children } como prop.
 */
const PrivateRoute = ({ children }) => {
  const isAuth = useAuth(); // Verifica se o usuário está logado

  // Se 'isAuth' for true, ele renderiza os {children} (o seu DashboardLayout).
  // Se 'isAuth' for false, ele redireciona o usuário para a página de login.
  return isAuth ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;