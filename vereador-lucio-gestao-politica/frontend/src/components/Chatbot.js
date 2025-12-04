import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chatbot.css';
import { IoClose, IoSend, IoTrashOutline } from 'react-icons/io5'; // Adicionei ícone de lixeira
import api from '../services/api';

const Chatbot = ({ onClose }) => {
    // 1. INICIALIZAÇÃO INTELIGENTE
    // Ao iniciar, tenta ler do localStorage. Se não tiver nada, usa a mensagem padrão.
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chat_history');
        if (savedMessages) {
            return JSON.parse(savedMessages);
        }
        return [
            { id: 1, text: 'Olá! Sou seu assistente de gestão política. Posso ajudar a redigir ofícios, pensar em estratégias ou tirar dúvidas. Como posso ajudar?', sender: 'bot' }
        ];
    });

    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // 2. SALVAMENTO AUTOMÁTICO
    // Toda vez que 'messages' mudar, salvamos no localStorage
    useEffect(() => {
        localStorage.setItem('chat_history', JSON.stringify(messages));
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]); // Adicionei a rolagem aqui também

    // Função para limpar o histórico (Opcional, mas útil)
    const handleClearHistory = () => {
        const defaultMsg = [{ id: Date.now(), text: 'Histórico limpo. Como posso ajudar agora?', sender: 'bot' }];
        setMessages(defaultMsg);
        localStorage.removeItem('chat_history');
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '') return;

        const userMsg = { id: Date.now(), text: inputMessage, sender: 'user' };
        setMessages((prev) => [...prev, userMsg]);
        
        const messageToSend = inputMessage;
        setInputMessage('');
        setIsTyping(true);

        try {
            const response = await api.post('/chatbot', { message: messageToSend });
            
            const botMsg = { 
                id: Date.now() + 1, 
                text: response.data.reply, 
                sender: 'bot' 
            };
            setMessages((prev) => [...prev, botMsg]);

        } catch (error) {
            console.error("Erro no chat:", error);
            const errorMsg = { 
                id: Date.now() + 1, 
                text: "Desculpe, tive um problema de conexão. Tente novamente.", 
                sender: 'bot' 
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3>Assistente IA</h3>
                    {/* Botãozinho discreto para limpar histórico se precisar */}
                    <button onClick={handleClearHistory} className="chatbot-action-btn" title="Limpar conversa">
                        <IoTrashOutline size={16} />
                    </button>
                </div>
                <button onClick={onClose} className="chatbot-close-btn">
                    <IoClose size={20} />
                </button>
            </div>
            
            <div className="chatbot-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.text.split('\n').map((line, i) => (
                            <span key={i}>{line}<br/></span>
                        ))}
                    </div>
                ))}
                
                {isTyping && (
                    <div className="message bot typing-indicator">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>
            
            <form className="chatbot-input-form" onSubmit={handleSend}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    disabled={isTyping}
                />
                <button type="submit" disabled={isTyping}>
                    <IoSend size={18} />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;