// PROJETOHABER/frontend/src/components/ElementoQuimicoList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ElementoQuimicoList() {
    const [elementos, setElementos] = useState([]);
    const API_URL = 'http://localhost:8000/api/elementos/';

    useEffect(() => {
        fetchElementos();
    }, []);

    const fetchElementos = () => {
        axios.get(API_URL)
            .then(response => {
                setElementos(response.data);
            })
            .catch(error => console.error("Erro ao buscar elementos químicos:", error));
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este elemento químico?')) {
            axios.delete(`${API_URL}${id}/`)
                .then(() => {
                    alert('Elemento Químico excluído com sucesso!');
                    fetchElementos(); // Atualiza a lista após a exclusão
                })
                .catch(error => {
                    console.error("Erro ao excluir elemento químico:", error.response ? error.response.data : error);
                    alert('Erro ao excluir elemento químico. Verifique o console para mais detalhes.');
                });
        }
    };

    return (
        <div className="container mt-4">
            <h2>Lista de Elementos Químicos</h2>
            <Link to="/elementos/add" className="btn btn-primary mb-3">Adicionar Novo Elemento</Link>
            {elementos.length > 0 ? (
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Símbolo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elementos.map(elemento => (
                            <tr key={elemento.id}>
                                <td>{elemento.id}</td>
                                <td>{elemento.nome}</td>
                                <td>{elemento.simbolo}</td>
                                <td>
                                    <Link to={`/elementos/edit/${elemento.id}`} className="btn btn-sm btn-info me-2">Editar</Link>
                                    <button
                                        onClick={() => handleDelete(elemento.id)}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhum elemento químico cadastrado ainda. Adicione um novo!</p>
            )}
        </div>
    );
}

export default ElementoQuimicoList;