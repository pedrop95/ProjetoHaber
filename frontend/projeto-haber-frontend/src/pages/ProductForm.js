// PROJETOHABER/frontend/projeto-haber-frontend/src/pages/ProductForm.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirecionar após o sucesso

function ProductForm() {
    const [idOuOp, setIdOuOp] = useState('');
    const [nome, setNome] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate(); // Hook para navegação

    const handleSubmit = async (e) => {
        e.preventDefault(); // Previne o comportamento padrão de recarregar a página
        setError(null); // Limpa erros anteriores
        setSuccess(false); // Limpa sucesso anterior

        try {
            // Envia uma requisição POST para a API do Django
            const response = await axios.post('http://127.0.0.1:8000/api/produtos/', {
                id_ou_op: idOuOp,
                nome: nome,
            });
            console.log('Produto criado com sucesso:', response.data);
            setSuccess(true);
            // Opcional: Limpar o formulário após o sucesso
            setIdOuOp('');
            setNome('');
            // Redireciona para a lista de produtos após 2 segundos
            setTimeout(() => {
                navigate('/produtos');
            }, 2000);

        } catch (err) {
            console.error("Erro ao criar produto:", err.response ? err.response.data : err.message);
            // Exibe uma mensagem de erro mais amigável
            setError(err.response ? JSON.stringify(err.response.data) : 'Ocorreu um erro ao criar o produto.');
        }
    };

    return (
        <div>
            <h2>Adicionar Novo Produto/Matéria-Prima</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="idOuOp">ID ou OP:</label>
                    <input
                        type="text"
                        id="idOuOp"
                        value={idOuOp}
                        onChange={(e) => setIdOuOp(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit">Salvar Produto</button>
            </form>

            {success && <p style={{ color: 'green' }}>Produto criado com sucesso! Redirecionando...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
        </div>
    );
}

export default ProductForm;