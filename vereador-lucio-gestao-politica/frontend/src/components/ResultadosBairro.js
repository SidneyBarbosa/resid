import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';

const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};


const ResultadosBairro = () => {
    const [allBairros, setAllBairros] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBairroData = async () => {
            try {
                const response = await api.get('/eleicoes/stats', { params: { ano: 2024 } });
                setAllBairros(response.data.resultadosPorBairro || []);
            } catch (err) {
                setError('Falha ao carregar resultados por bairro.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBairroData();
    }, []);
    
    const filteredBairros = useMemo(() =>
        allBairros.filter(bairro =>
            bairro.bairro.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [allBairros, searchTerm]
    );

    const { items: sortedBairros, requestSort, sortConfig } = useSortableData(filteredBairros, { key: 'votos', direction: 'descending' });

    const getSortArrow = (name) => {
        if (!sortConfig || sortConfig.key !== name) {
          return null;
        }
        return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    };

    if (loading) return <p>Carregando resultados...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="resultados-bairro-container">
            <h3>Resultados por Bairro</h3>
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Buscar Bairro..."
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="table-wrapper">
                <table className="results-table">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('bairro')}>
                                BAIRRO {getSortArrow('bairro')}
                            </th>
                            <th onClick={() => requestSort('percentual')}>
                                PERCENTUAL {getSortArrow('percentual')}
                            </th>
                            <th onClick={() => requestSort('votos')}>
                                VOTOS ABSOLUTOS {getSortArrow('votos')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedBairros.map((bairro, index) => (
                            <tr key={index}>
                                <td>{bairro.bairro}</td>
                                <td>{bairro.percentual}%</td>
                                <td>{parseInt(bairro.votos).toLocaleString('pt-BR')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultadosBairro;