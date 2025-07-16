// PROJETOHABER/frontend/src/components/ElementoQuimicoForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ElementoQuimicoForm() {
    const [elemento, setElemento] = useState({
        nome: '',
        simbolo: '',
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const API_URL = 'http://localhost:8000/api/elementos/';

    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            axios.get(`${API_URL}${id}/`)
                .then(response => {
                    setElemento(response.data);
                })
                .catch(error => console.error("Erro ao buscar elemento químico:", error));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setElemento(prevElemento => ({
            ...prevElemento,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditMode) {
            axios.put(`${API_URL}${id}/`, elemento)
                .then(() => {
                    alert('Elemento Químico atualizado com sucesso!');
                    navigate('/elementos');
                })
                .catch(error => {
                    console.error("Erro ao atualizar elemento químico:", error.response ? error.response.data : error);
                    alert('Erro ao atualizar elemento químico. Verifique o console para mais detalhes.');
                });
        } else {
            axios.post(API_URL, elemento)
                .then(() => {
                    alert('Elemento Químico adicionado com sucesso!');
                    navigate('/elementos');
                })
                .catch(error => {
                    console.error("Erro ao adicionar elemento químico:", error.response ? error.response.data : error);
                    alert('Erro ao adicionar elemento químico. Verifique o console para mais detalhes.');
                });
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h2>{isEditMode ? 'Editar Elemento Químico' : 'Adicionar Novo Elemento Químico'}</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">Nome do Elemento</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nome"
                                name="nome"
                                value={elemento.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="simbolo" className="form-label">Símbolo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="simbolo"
                                name="simbolo"
                                value={elemento.simbolo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3">
                            {isEditMode ? 'Atualizar Elemento' : 'Adicionar Elemento'}
                        </button>
                        <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => navigate('/elementos')}>
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ElementoQuimicoForm;