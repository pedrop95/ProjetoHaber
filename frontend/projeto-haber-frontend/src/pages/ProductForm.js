// PROJETOHABER/frontend/projeto-haber-frontend/src/pages/ProductForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Importe useParams

function ProductForm() {
    const [idOuOp, setIdOuOp] = useState('');
    const [nome, setNome] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true); // Para carregar dados na edição
    const navigate = useNavigate();
    const { id } = useParams(); // Hook para pegar o ID da URL se estiver em modo edição

    const isEditing = id != null; // Verifica se estamos em modo de edição (ID existe na URL)

    useEffect(() => {
        if (isEditing) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`http://127.0.0.1:8000/api/produtos/${id}/`);
                    setIdOuOp(response.data.id_ou_op);
                    setNome(response.data.nome);
                    setLoading(false);
                } catch (err) {
                    console.error("Erro ao carregar produto para edição:", err);
                    setError(err.response ? JSON.stringify(err.response.data) : 'Erro ao carregar produto.');
                    setLoading(false);
                }
            };
            fetchProduct();
        } else {
            setLoading(false); // Não está editando, então não precisa carregar, já pode renderizar o formulário vazio
        }
    }, [id, isEditing]); // Refaz o efeito se o ID ou o modo de edição mudar

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const productData = {
            id_ou_op: idOuOp,
            nome: nome,
        };

        try {
            if (isEditing) {
                // Requisição PUT para atualizar um produto existente
                await axios.put(`http://127.0.0.1:8000/api/produtos/${id}/`, productData);
                console.log('Produto atualizado com sucesso!');
                setSuccess(true);
                setTimeout(() => {
                    navigate('/produtos');
                }, 2000);
            } else {
                // Requisição POST para criar um novo produto
                await axios.post('http://127.0.0.1:8000/api/produtos/', productData);
                console.log('Produto criado com sucesso!');
                setSuccess(true);
                setIdOuOp(''); // Limpa o formulário após criação
                setNome('');
                setTimeout(() => {
                    navigate('/produtos');
                }, 2000);
            }
        } catch (err) {
            console.error("Erro ao salvar produto:", err.response ? err.response.data : err.message);
            setError(err.response ? JSON.stringify(err.response.data) : 'Ocorreu um erro ao salvar o produto.');
        }
    };

    if (loading) return <div>Carregando dados do produto...</div>;

    return (
        <div>
            <h2>{isEditing ? 'Editar Produto/Matéria-Prima' : 'Adicionar Novo Produto/Matéria-Prima'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="idOuOp">ID ou OP:</label>
                    <input
                        type="text"
                        id="idOuOp"
                        value={idOuOp}
                        onChange={(e) => setIdOuOp(e.target.value)}
                        required
                        // Desabilitar o campo ID/OP se estiver editando para evitar alteração do identificador único
                        disabled={isEditing}
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
                <button type="submit">{isEditing ? 'Atualizar Produto' : 'Salvar Produto'}</button>
            </form>

            {success && <p style={{ color: 'green' }}>{isEditing ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!'} Redirecionando...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
        </div>
    );
}

export default ProductForm;