// PROJETOHABER/frontend/src/components/ProdutoMatPrimaForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ProdutoMatPrimaForm() {
    const [produto, setProduto] = useState({
        nome: '',
        id_ou_op: '',
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const API_URL = 'http://localhost:8000/api/produtos/';

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            axios.get(`${API_URL}${id}/`)
                .then(response => {
                    setProduto(response.data);
                })
                .catch(error => console.error("Erro ao buscar produto:", error));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduto(prevProduto => ({
            ...prevProduto,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            axios.put(`${API_URL}${id}/`, produto)
                .then(() => {
                    alert('Produto atualizado com sucesso!');
                    navigate('/produtos');
                })
                .catch(error => {
                    console.error("Erro ao atualizar produto:", error.response ? error.response.data : error);
                    alert('Erro ao atualizar produto. Verifique o console para mais detalhes.');
                });
        } else {
            axios.post(API_URL, produto)
                .then(() => {
                    alert('Produto adicionado com sucesso!');
                    navigate('/produtos');
                })
                .catch(error => {
                    console.error("Erro ao adicionar produto:", error.response ? error.response.data : error);
                    alert('Erro ao adicionar produto. Verifique o console para mais detalhes.');
                });
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h2>{isEditMode ? 'Editar Produto Matéria Prima' : 'Adicionar Novo Produto Matéria Prima'}</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">Nome do Produto</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nome"
                                name="nome"
                                value={produto.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="id_ou_op" className="form-label">ID ou OP</label>
                            <input
                                type="text"
                                className="form-control"
                                id="id_ou_op"
                                name="id_ou_op"
                                value={produto.id_ou_op}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">
                            {isEditMode ? 'Atualizar Produto' : 'Adicionar Produto'}
                        </button>
                        <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => navigate('/produtos')}>
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProdutoMatPrimaForm;