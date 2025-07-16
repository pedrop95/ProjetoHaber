// PROJETOHABER/frontend/src/components/ProdutoMatPrimaList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ProdutoMatPrimaList() {
    const [produtos, setProdutos] = useState([]);
    const API_URL = 'http://localhost:8000/api/produtos/';

    useEffect(() => {
        fetchProdutos();
    }, []);

    const fetchProdutos = () => {
        axios.get(API_URL)
            .then(response => {
                setProdutos(response.data);
            })
            .catch(error => console.error("Erro ao buscar produtos:", error));
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            axios.delete(`${API_URL}${id}/`)
                .then(() => {
                    alert('Produto excluído com sucesso!');
                    fetchProdutos();
                })
                .catch(error => {
                    console.error("Erro ao excluir produto:", error.response ? error.response.data : error);
                    alert('Erro ao excluir produto. Verifique o console para mais detalhes.');
                });
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Produtos Matéria Prima</h2> {/* Aumentei mb */}
            <Link to="/produtos/add" className="btn btn-primary mb-4">Adicionar Novo Produto</Link> {/* Aumentei mb */}

            <div className="card">
                <div className="card-body">
                    {produtos.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover table-bordered align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>ID ou OP</th>
                                        <th className="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {produtos.map(produto => (
                                        <tr key={produto.id}>
                                            <td>{produto.id}</td>
                                            <td>{produto.nome}</td>
                                            <td>{produto.id_ou_op}</td>
                                            <td className="text-center">
                                                <Link to={`/produtos/edit/${produto.id}`} className="btn btn-sm btn-info me-2">Editar</Link>
                                                <button
                                                    onClick={() => handleDelete(produto.id)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted">Nenhum produto cadastrado ainda. Adicione um novo!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProdutoMatPrimaList;