// frontend/src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';

// Este componente recebe os 'children', que são as rotas que ele está protegendo.
const PrivateRoute = ({ children }) => {
    // Verifica se o token de autenticação existe no localStorage.
    // O '!!' transforma o resultado em um booleano (true/false).
    const isAuthenticated = !!localStorage.getItem('authToken');

    // Se o usuário estiver autenticado, renderiza a rota filha.
    // Se não, redireciona para a página de login.
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;