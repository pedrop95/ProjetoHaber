// PROJETOHABER/frontend/src/components/ConfiguracaoAnaliseList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ConfiguracaoAnaliseList() {
    const [configuracoes, setConfiguracoes] = useState([]);
    const API_URL = 'http://localhost:8000/api/configuracoes-analise/';

    useEffect(() => {
        fetchConfiguracoes();
    }, []);

    const fetchConfiguracoes = () => {
        axios.get(API_URL)
            .then(response => {
                setConfiguracoes(response.data);
            })
            .catch(error => console.error("Erro ao buscar configurações de análise:", error));
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta configuração de análise?')) {
            axios.delete(`${API_URL}${id}/`)
                .then(() => {
                    alert('Configuração de Análise excluída com sucesso!');
                    fetchConfiguracoes(); // Atualiza a lista após a exclusão
                })
                .catch(error => {
                    console.error("Erro ao excluir configuração:", error.response ? error.response.data : error);
                    alert('Erro ao excluir configuração. Verifique o console para mais detalhes.');
                });
        }
    };

    return (
        <div className="container mt-4">
            <h2>Lista de Configurações de Análise</h2>
            <Link to="/configuracoes-analise/add" className="btn btn-primary mb-3">Adicionar Nova Configuração</Link>
            {configuracoes.length > 0 ? (
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Produto</th>
                            <th>Elemento Químico</th>
                            <th>Diluição 1 (X:Y)</th>
                            <th>Diluição 2 (X:Y)</th>
                            <th>Limite Min</th>
                            <th>Limite Max</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {configuracoes.map(config => (
                            <tr key={config.id}>
                                <td>{config.id}</td>
                                <td>{config.produto_mat_prima_nome} ({config.produto_mat_prima_id_ou_op})</td>
                                <td>{config.elemento_quimico_nome} ({config.elemento_quimico_simbolo})</td>
                                <td>{config.diluicao1_X}:{config.diluicao1_Y}</td>
                                <td>{config.diluicao2_X ? `${config.diluicao2_X}:${config.diluicao2_Y}` : 'N/A'}</td>
                                <td>{config.limite_min || 'N/A'}</td>
                                <td>{config.limite_max || 'N/A'}</td>
                                <td>
                                    <Link to={`/configuracoes-analise/edit/${config.id}`} className="btn btn-sm btn-info me-2">Editar</Link>
                                    <button
                                        onClick={() => handleDelete(config.id)}
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
                <p>Nenhuma configuração de análise cadastrada ainda. Adicione uma nova!</p>
            )}
        </div>
    );
}

export default ConfiguracaoAnaliseList;