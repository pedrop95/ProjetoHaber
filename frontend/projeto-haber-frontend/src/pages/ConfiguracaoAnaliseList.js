// PROJETOHABER/frontend/projeto-haber-frontend/src/pages/ConfiguracaoAnaliseList.js

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ConfiguracaoAnaliseList() {
    const [configuracoes, setConfiguracoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const fetchConfiguracoes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/configuracoes-analise/');
            setConfiguracoes(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Erro ao buscar configurações de análise:", err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConfiguracoes();
    }, [fetchConfiguracoes]);

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta configuração de análise?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/configuracoes-analise/${id}/`);
                setMessage('Configuração de análise excluída com sucesso!');
                setConfiguracoes(configuracoes.filter(config => config.id !== id));
                setTimeout(() => setMessage(null), 3000);
            } catch (err) {
                console.error("Erro ao excluir configuração:", err);
                setMessage('Erro ao excluir configuração: ' + (err.response ? JSON.stringify(err.response.data) : err.message));
                setTimeout(() => setMessage(null), 5000);
            }
        }
    };

    if (loading) return <div>Carregando configurações de análise...</div>;
    if (error) return <div>Erro ao carregar configurações de análise: {error}</div>;

    return (
        <div>
            <h2>Lista de Configurações de Análises</h2>
            {message && <p style={{ color: message.startsWith('Erro') ? 'red' : 'green' }}>{message}</p>}
            {configuracoes.length === 0 ? (
                <p>Nenhuma configuração de análise encontrada. Adicione algumas!</p>
            ) : (
                <ul>
                    {configuracoes.map(config => (
                        <li key={config.id}>
                            {config.produto_mat_prima_nome} - {config.elemento_quimico_nome} |
                            Dil.1: {config.diluicao1_X}/{config.diluicao1_Y}
                            {config.diluicao2_X && config.diluicao2_Y && ` | Dil.2: ${config.diluicao2_X}/${config.diluicao2_Y}`}
                            <Link to={`/configuracoes-analise/${config.id}/editar`} style={{ marginLeft: '10px' }}>Editar</Link>
                            <button onClick={() => handleDelete(config.id)} style={{ marginLeft: '10px' }}>Excluir</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ConfiguracaoAnaliseList;