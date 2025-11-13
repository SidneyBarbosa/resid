// frontend/src/components/Financeiro.js
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import CurrencyInput from 'react-currency-input-field';
import '../styles/Financeiro.css';

// --- FUNÇÕES AUXILIARES PARA FORMATAÇÃO ---
// Formata a data para o padrão brasileiro (DD/MM/AAAA)
const formatDateForDisplay = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};

// Formata um número para o padrão de moeda brasileiro (R$ 1.234,56)
const formatCurrency = (value) => {
    const number = Number(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(number);
};
// -----------------------------------------

const Financeiro = () => {
    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        data_registro: today,
        valor_locacao_imovel: '',
        valor_assessoria_juridica: '',
        valor_assessoria_comunicacao: '',
        valor_combustivel: '',
        despesas_debito: '',
        despesas_credito: '',
        outras_despesas: '',
    });

    // --- NOVOS ESTADOS PARA A TABELA ---
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    // -----------------------------------
    
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // --- FUNÇÃO PARA BUSCAR OS DADOS DA TABELA ---
    const fetchRegistros = useCallback(async () => {
        try {
            const response = await api.get('/financeiro');
            setRegistros(response.data);
        } catch (error) {
            console.error("Erro ao buscar registros financeiros:", error);
        }
    }, []);

    // --- useEffect PARA CARREGAR OS DADOS QUANDO A PÁGINA ABRIR ---
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchRegistros();
            setLoading(false);
        };
        loadData();
    }, [fetchRegistros]);
    // -----------------------------------------------------------

    const handleValueChange = (value, name) => {
        setFormData(prevState => ({ ...prevState, [name]: value || '' }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        try {
            const dataToSend = { ...formData };
            // Converte valores para número antes de enviar
            Object.keys(dataToSend).forEach(key => {
                if (key !== 'data_registro') {
                    dataToSend[key] = parseFloat(String(dataToSend[key]).replace(/\./g, '').replace(',', '.')) || 0;
                }
            });

            await api.post('/financeiro', dataToSend);
            setMessage('Informações salvas com sucesso!');
            
            // Limpa o formulário
            setFormData({ data_registro: today, valor_locacao_imovel: '', valor_assessoria_juridica: '', valor_assessoria_comunicacao: '', valor_combustivel: '', despesas_debito: '', despesas_credito: '', outras_despesas: '' });
            
            // --- ATUALIZA A TABELA COM O NOVO REGISTRO ---
            await fetchRegistros();
            // --------------------------------------------

        } catch (error) {
            console.error("Erro ao salvar informações:", error);
            setMessage(error.response?.data?.message || 'Falha ao salvar. Tente novamente.');
            setIsError(true);
        }
    };
    
    // Função para calcular o total de cada linha da tabela
    const calcularTotal = (registro) => {
        return (
            Number(registro.valor_locacao_imovel) +
            Number(registro.valor_assessoria_juridica) +
            Number(registro.valor_assessoria_comunicacao) +
            Number(registro.valor_combustivel) +
            Number(registro.despesas_debito) +
            Number(registro.despesas_credito) +
            Number(registro.outras_despesas)
        );
    };

    return (
        <div className="financeiro-container">
            {/* ... Seu cabeçalho e formulário continuam aqui ... */}
            <header className="page-header"><div><h1>Financeiro</h1><p>Gerencie informações financeiras</p></div></header>
            <form className="financeiro-form" onSubmit={handleSubmit}>
                <div className="form-header"><h2>Novo Registro Financeiro</h2><button type="button" className="btn-export">Exportar Excel</button></div>
                <div className="form-grid">
                    <div className="form-group"><label htmlFor="data_registro">Data do Registro</label><input type="date" id="data_registro" name="data_registro" value={formData.data_registro} onChange={handleChange} required /></div>
                    <div className="form-group"><label htmlFor="valor_locacao_imovel">Valor da Locação do Imóvel</label><CurrencyInput id="valor_locacao_imovel" name="valor_locacao_imovel" placeholder="R$ 0,00" decimalsLimit={2} prefix="R$ " groupSeparator="." decimalSeparator="," value={formData.valor_locacao_imovel} onValueChange={handleValueChange} /></div>
                    <div className="form-group"><label htmlFor="valor_assessoria_juridica">Valor da Assessoria Jurídica</label><CurrencyInput id="valor_assessoria_juridica" name="valor_assessoria_juridica" placeholder="R$ 0,00" decimalsLimit={2} prefix="R$ " groupSeparator="." decimalSeparator="," value={formData.valor_assessoria_juridica} onValueChange={handleValueChange} /></div>
                    <div className="form-group"><label htmlFor="valor_assessoria_comunicacao">Valor da Assessoria de Comunicação</label><CurrencyInput id="valor_assessoria_comunicacao" name="valor_assessoria_comunicacao" placeholder="R$ 0,00" decimalsLimit={2} prefix="R$ " groupSeparator="." decimalSeparator="," value={formData.valor_assessoria_comunicacao} onValueChange={handleValueChange} /></div>
                    <div className="form-group"><label htmlFor="valor_combustivel">Valor do Combustível</label><CurrencyInput id="valor_combustivel" name="valor_combustivel" placeholder="R$ 0,00" decimalsLimit={2} prefix="R$ " groupSeparator="." decimalSeparator="," value={formData.valor_combustivel} onValueChange={handleValueChange} /></div>
                    <div className="form-group"><label htmlFor="despesas_debito">Despesas no Débito</label><CurrencyInput id="despesas_debito" name="despesas_debito" placeholder="R$ 0,00" decimalsLimit={2} prefix="R$ " groupSeparator="." decimalSeparator="," value={formData.despesas_debito} onValueChange={handleValueChange} /></div>
                    <div className="form-group"><label htmlFor="despesas_credito">Despesas no Crédito</label><CurrencyInput id="despesas_credito" name="despesas_credito" placeholder="R$ 0,00" decimalsLimit={2} prefix="R$ " groupSeparator="." decimalSeparator="," value={formData.despesas_credito} onValueChange={handleValueChange} /></div>
                    <div className="form-group"><label htmlFor="outras_despesas">Outras Despesas</label><CurrencyInput id="outras_despesas" name="outras_despesas" placeholder="R$ 0,00" decimalsLimit={2} prefix="R$ " groupSeparator="." decimalSeparator="," value={formData.outras_despesas} onValueChange={handleValueChange} /></div>
                </div>
                {message && <p className={`form-message ${isError ? 'error' : 'success'}`}>{message}</p>}
                <div className="form-footer"><button type="submit" className="btn-save">Salvar Informações</button></div>
            </form>

            {/* --- NOVA SEÇÃO DA TABELA --- */}
            <div className="registros-container">
                <h2>Registros Financeiros</h2>
                {loading ? (
                    <p>Carregando registros...</p>
                ) : (
                    <table className="registros-table">
                        <thead>
                            <tr>
                                <th>DATA</th>
                                <th>LOCAÇÃO</th>
                                <th>ASS. JURÍDICA</th>
                                <th>ASS. COMUNICAÇÃO</th>
                                <th>COMBUSTÍVEL</th>
                                <th>DÉBITO</th>
                                <th>CRÉDITO</th>
                                <th>OUTROS</th>
                                <th>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.length > 0 ? (
                                registros.map(registro => (
                                    <tr key={registro.id}>
                                        <td>{formatDateForDisplay(registro.data_registro)}</td>
                                        <td>{formatCurrency(registro.valor_locacao_imovel)}</td>
                                        <td>{formatCurrency(registro.valor_assessoria_juridica)}</td>
                                        <td>{formatCurrency(registro.valor_assessoria_comunicacao)}</td>
                                        <td>{formatCurrency(registro.valor_combustivel)}</td>
                                        <td>{formatCurrency(registro.despesas_debito)}</td>
                                        <td>{formatCurrency(registro.despesas_credito)}</td>
                                        <td>{formatCurrency(registro.outras_despesas)}</td>
                                        <td>{formatCurrency(calcularTotal(registro))}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" style={{ textAlign: 'center' }}>Nenhum registro encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            {/* --- FIM DA SEÇÃO DA TABELA --- */}
        </div>
    );
};

export default Financeiro;