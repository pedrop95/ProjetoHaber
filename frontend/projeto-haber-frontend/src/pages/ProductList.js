// PROJETOHABER/frontend/projeto-haber-frontend/src/pages/ProductList.js

import React, { useEffect, useState, useCallback } from 'react'; // Adicione useCallback
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importe Link para navegação de edição

function ProductList() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null); // Para mensagens de sucesso/erro na exclusão

    // Use useCallback para memorizar a função de busca
    const fetchProdutos = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/produtos/');
            setProdutos(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Erro ao buscar produtos:", err);
            setError(err.message);
            setLoading(false);
        }
    }, []); // Dependências vazias, pois não depende de nada externo

    useEffect(() => {
        fetchProdutos(); // Chame a função quando o componente for montado
    }, [fetchProdutos]); // fetchProdutos é uma dependência, mas é memorizada por useCallback

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este produto?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/produtos/${id}/`);
                setMessage('Produto excluído com sucesso!');
                // Atualiza a lista removendo o produto excluído
                setProdutos(produtos.filter(produto => produto.id !== id));
                setTimeout(() => setMessage(null), 3000); // Limpa a mensagem após 3 segundos
            } catch (err) {
                console.error("Erro ao excluir produto:", err);
                setMessage('Erro ao excluir produto: ' + (err.response ? JSON.stringify(err.response.data) : err.message));
                setTimeout(() => setMessage(null), 5000);
            }
        }
    };

    if (loading) return <div>Carregando produtos...</div>;
    if (error) return <div>Erro ao carregar produtos: {error}</div>;

    return (
        <div>
            <h2>Lista de Produtos/Matérias-Primas</h2>
            {message && <p style={{ color: message.startsWith('Erro') ? 'red' : 'green' }}>{message}</p>}
            {produtos.length === 0 ? (
                <p>Nenhum produto encontrado. Adicione alguns!</p>
            ) : (
                <ul>
                    {produtos.map(produto => (
                        <li key={produto.id}>
                            {produto.nome} (ID: {produto.id_ou_op})
                            <Link to={`/produtos/${produto.id}/editar`} style={{ marginLeft: '10px' }}>Editar</Link>
                            <button onClick={() => handleDelete(produto.id)} style={{ marginLeft: '10px' }}>Excluir</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProductList;