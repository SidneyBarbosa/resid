import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const result = await response.text();

      if (response.ok) {
        setMessage('Login bem-sucedido! Redirecionando...');
        setIsSuccess(true);
        if (onLogin()) {
          setTimeout(() => navigate('/'), 1000); // Redireciona para a raiz que agora é o dashboard
        }
      } else {
        setMessage(result);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Erro de conexão com o servidor. Tente novamente.');
      setIsSuccess(false);
      console.error('Erro:', error);
    }
  };

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