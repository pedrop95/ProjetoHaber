// PROJETOHABER/frontend/projeto-haber-frontend/src/pages/RegistroAnaliseList.js

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function RegistroAnaliseList() {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const fetchRegistros = useCallback(async () => {
        try {
            setLoading(true);
            // Ajuste a URL da API se necessário para buscar Registros de Análise
            const response = await axios.get('http://127.0.0.1:8000/api/registros-analise/');
            setRegistros(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Erro ao buscar registros de análise:", err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRegistros();
    }, [fetchRegistros]);

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este registro de análise e todos os seus detalhes?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/registros-analise/${id}/`);
                setMessage('Registro de análise excluído com sucesso!');
                setRegistros(registros.filter(registro => registro.id !== id));
                setTimeout(() => setMessage(null), 3000);
            } catch (err) {
                console.error("Erro ao excluir registro:", err);
                setMessage('Erro ao excluir registro: ' + (err.response ? JSON.stringify(err.response.data) : err.message));
                setTimeout(() => setMessage(null), 5000);
            }
        }
    };

    if (loading) return <div>Carregando registros de análise...</div>;
    if (error) return <div>Erro ao carregar registros de análise: {error}</div>;

    return (
        <div>
            <h2>Lista de Registros de Análises</h2>
            {message && <p style={{ color: message.startsWith('Erro') ? 'red' : 'green' }}>{message}</p>}
            {registros.length === 0 ? (
                <p>Nenhum registro de análise encontrado. Adicione alguns!</p>
            ) : (
                <ul>
                    {registros.map(registro => (
                        <li key={registro.id}>
                            Produto: {registro.produto_mat_prima_nome} | Data: {registro.data_analise} | Lote: {registro.lote}
                            <ul>
                                {/* Exibir alguns detalhes da análise aqui, se existirem */}
                                {registro.detalhes_analise && registro.detalhes_analise.map(detalhe => (
                                    <li key={detalhe.id}>
                                        - {detalhe.elemento_quimico_nome}: {detalhe.resultado}
                                    </li>
                                ))}
                            </ul>
                            <Link to={`/registros-analise/${registro.id}/editar`} style={{ marginLeft: '10px' }}>Editar</Link>
                            <button onClick={() => handleDelete(registro.id)} style={{ marginLeft: '10px' }}>Excluir</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default RegistroAnaliseList;