import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chatbot.css';
import { IoClose, IoSend } from 'react-icons/io5';

const Chatbot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Olá! 👋 Sou seu assistente virtual. Como posso ajudar hoje?', sender: 'bot' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Efeito para rolar para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (inputMessage.trim() === '') return;

        // Adiciona a mensagem do usuário
        const newUserMessage = {
            id: messages.length + 1,
            text: inputMessage,
            sender: 'user'
        };
        
        // Adiciona a resposta (simulada) do bot
        const botResponse = {
            id: messages.length + 2,
            text: `Estou processando sua mensagem: "${inputMessage}"`,
            sender: 'bot'
        };

        setMessages([...messages, newUserMessage, botResponse]);
        setInputMessage('');
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h3>Assistente Virtual</h3>
                <button onClick={onClose} className="chatbot-close-btn">
                    <IoClose size={20} />
                </button>
            </div>
            
            <div className="chatbot-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                {/* Elemento para auto-scroll */}
                <div ref={messagesEndRef} />
            </div>
            
            <form className="chatbot-input-form" onSubmit={handleSend}>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                />
                <button type="submit">
                    <IoSend size={18} />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;