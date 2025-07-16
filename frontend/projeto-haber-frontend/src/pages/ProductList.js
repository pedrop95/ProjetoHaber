// PROJETOHABER/frontend/projeto-haber-frontend/src/pages/ProductList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductList() {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/produtos/');
                setProdutos(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar produtos:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchProdutos();
    }, []);

    if (loading) return <div>Carregando produtos...</div>;
    if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

    return (
        <div>
            <h2>Lista de Produtos/Matérias-Primas</h2>
            {produtos.length === 0 ? (
                <p>Nenhum produto encontrado. Adicione alguns via Django Admin ou API!</p>
            ) : (
                <ul>
                    {produtos.map(produto => (
                        <li key={produto.id}>{produto.nome} (ID: {produto.id_ou_op})</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProductList;