// PROJETOHABER/frontend/projeto-haber-frontend/src/pages/ElementoQuimicoForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ElementoQuimicoForm() {
    const [nome, setNome] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditing = id != null;

    useEffect(() => {
        if (isEditing) {
            const fetchElemento = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://127.0.0.1:8000/api/elementos/${id}/`);
                    setNome(response.data.nome);
                    setLoading(false);
                } catch (err) {
                    console.error("Erro ao carregar elemento para edição:", err);
                    setError(err.response ? JSON.stringify(err.response.data) : 'Erro ao carregar elemento.');
                    setLoading(false);
                }
            };
            fetchElemento();
        } else {
            setLoading(false);
        }
    }, [id, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const elementoData = {
            nome: nome,
        };

        try {
            if (isEditing) {
                await axios.put(`http://127.0.0.1:8000/api/elementos/${id}/`, elementoData);
                console.log('Elemento atualizado com sucesso!');
                setSuccess(true);
                setTimeout(() => {
                    navigate('/elementos');
                }, 2000);
            } else {
                await axios.post('http://127.0.0.1:8000/api/elementos/', elementoData);
                console.log('Elemento criado com sucesso!');
                setSuccess(true);
                setNome(''); // Limpa o formulário após criação
                setTimeout(() => {
                    navigate('/elementos');
                }, 2000);
            }
        } catch (err) {
            console.error("Erro ao salvar elemento:", err.response ? err.response.data : err.message);
            setError(err.response ? JSON.stringify(err.response.data) : 'Ocorreu um erro ao salvar o elemento.');
        }
    };

    if (loading) return <div>Carregando dados do elemento...</div>;

    return (
        <div>
            <h2>{isEditing ? 'Editar Elemento Químico' : 'Adicionar Novo Elemento Químico'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{isEditing ? 'Atualizar Elemento' : 'Salvar Elemento'}</button>
            </form>

            {success && <p style={{ color: 'green' }}>{isEditing ? 'Elemento atualizado com sucesso!' : 'Elemento criado com sucesso!'} Redirecionando...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
        </div>
    );
}

export default ElementoQuimicoForm;