import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Esta função verifica se o token existe no localStorage
const useAuth = () => {
  const token = localStorage.getItem('authToken');
  return !!token; // Retorna true se o token existir, false se não
};

const ProtectedRoute = () => {
  const isAuth = useAuth();


  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;