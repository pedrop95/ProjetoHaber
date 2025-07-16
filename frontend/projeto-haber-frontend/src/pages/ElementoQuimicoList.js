// PROJETOHABER/frontend/projeto-haber-frontend/src/pages/ElementoQuimicoList.js

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ElementoQuimicoList() {
    const [elementos, setElementos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const fetchElementos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/elementos/');
            setElementos(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Erro ao buscar elementos:", err);
            setError(err.message);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchElementos();
    }, [fetchElementos]);

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este elemento químico?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/elementos/${id}/`);
                setMessage('Elemento químico excluído com sucesso!');
                setElementos(elementos.filter(elemento => elemento.id !== id));
                setTimeout(() => setMessage(null), 3000);
            } catch (err) {
                console.error("Erro ao excluir elemento:", err);
                setMessage('Erro ao excluir elemento: ' + (err.response ? JSON.stringify(err.response.data) : err.message));
                setTimeout(() => setMessage(null), 5000);
            }
        }
    };

    if (loading) return <div>Carregando elementos químicos...</div>;
    if (error) return <div>Erro ao carregar elementos químicos: {error}</div>;

    return (
        <div>
            <h2>Lista de Elementos Químicos</h2>
            {message && <p style={{ color: message.startsWith('Erro') ? 'red' : 'green' }}>{message}</p>}
            {elementos.length === 0 ? (
                <p>Nenhum elemento químico encontrado. Adicione alguns!</p>
            ) : (
                <ul>
                    {elementos.map(elemento => (
                        <li key={elemento.id}>
                            {elemento.nome}
                            <Link to={`/elementos/${elemento.id}/editar`} style={{ marginLeft: '10px' }}>Editar</Link>
                            <button onClick={() => handleDelete(elemento.id)} style={{ marginLeft: '10px' }}>Excluir</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ElementoQuimicoList;