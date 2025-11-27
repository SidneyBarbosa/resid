// frontend/src/components/ConfirmModal.js
import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/ConfirmModal.css'; // Vamos criar este CSS no próximo passo

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="custom-modal-overlay">
      <div className="custom-modal-content">
        <div className="custom-modal-header">
          <h2>Confirmação</h2>
          <button onClick={onCancel} className="close-button">&times;</button>
        </div>
        <div className="custom-modal-body">
          <p>{message}</p>
        </div>
        <div className="custom-modal-footer">
          <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
          <button className="btn-confirm" onClick={onConfirm}>OK</button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') // Usamos o mesmo root dos outros modais
  );
};

export default ConfirmModal;