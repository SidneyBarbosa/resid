import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import '../styles/login.css'; 

// 1. IMPORTAMOS A IMAGEM DIRETAMENTE AQUI
import backgroundImage from '../assets/sergipe-conexao123.jpg'; 

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
            const response = await api.post('/login', { email, senha });

            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem('authToken', token);
                
                setMessage('Login bem-sucedido! Redirecionando...');
                setIsSuccess(true);
                
                if (onLogin) {
                    onLogin(); 
                }
                
                setTimeout(() => {
                    navigate('/'); 
                }, 1000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro de conexão. Verifique suas credenciais.';
            setMessage(errorMessage);
            setIsSuccess(false);
            console.error('Erro no login:', error);
        }
    };

    return (
        <div className="login-page-container">
            
            {/* 2. APLICAMOS A IMAGEM COMO UM 'STYLE' INLINE */}
            <div 
                className="login-visual-side" 
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="login-visual-overlay">
                    <h1>Plataforma de Gestão</h1>
                    <p>Gerenciador de Tarefas Inteligente</p>
                </div>
            </div>

            <div className="login-form-side">
                <div className="login-form-box">
                    <h2>Login</h2>
                    <p className="login-subtitle">Bem-vindo(a) de volta. Entre com suas credenciais.</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="seuemail@exemplo.com"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="senha">Senha</label>
                            <input
                                type="password"
                                id="senha" 
                                value={senha} 
                                onChange={(e) => setSenha(e.target.value)} 
                                required
                                placeholder="Sua senha"
                            />
                        </div>

                        {message && (
                            <p className={`login-message ${isSuccess ? 'success' : 'error'}`}>
                                {message}
                            </p>
                        )}
                        
                        <div className="form-options">
                            <label>
                                <input type="checkbox" id="remember" />
                                Lembrar-me
                            </label>
                        </div>
                        
                        <button type="submit" className="login-button">
                            Entrar
                        </button>
                    </form>
                    
                    <p className="login-footer-text">
                        Sistema de gestão política v 1.0.1
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;