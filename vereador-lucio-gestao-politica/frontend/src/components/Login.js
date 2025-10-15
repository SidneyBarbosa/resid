// frontend/src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // <-- MUDANÇA: Importa a instância 'api' em vez de 'axios'
import '../styles/login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setIsSuccess(false);

    try {
      // MUDANÇA: Usa a instância 'api' para a chamada, que já sabe a baseURL.
      const response = await api.post('/login', { email, senha });

      if (response.status === 200) {
        // --- CORREÇÃO PRINCIPAL AQUI ---
        
        // PASSO 1: Extrai o token da resposta que o servidor enviou.
        const { token } = response.data;

        // PASSO 2: Guarda o token no localStorage do navegador para ser usado em outras páginas.
        localStorage.setItem('authToken', token);
        
        // O resto da sua lógica original é mantido.
        setMessage('Login bem-sucedido! Redirecionando...');
        setIsSuccess(true);
        if (onLogin) {
          onLogin();
        }
        setTimeout(() => {
          navigate('/'); // Redireciona para o Dashboard (página inicial)
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro de conexão com o servidor. Tente novamente.';
      setMessage(errorMessage);
      setIsSuccess(false);
      console.error('Erro no login:', error);
    }
  };

  // O seu JSX (a parte visual do componente) continua exatamente o mesmo.
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="header-login">
          <h1>Mandatuum</h1>
          <p>Consultoria e Inteligência de dados</p>
        </div>
        <div className="content">
          <h2>Login</h2>
          <form id="login-form" onSubmit={handleSubmit}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <div className="checkbox">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" className="remember-label">Lembrar-me</label>
            </div>
            <button type="submit">Entrar</button>
          </form>
          <div id="message" className={`message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
          <div className="footer">
            Sistema de gestão política v 1.0.1
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;