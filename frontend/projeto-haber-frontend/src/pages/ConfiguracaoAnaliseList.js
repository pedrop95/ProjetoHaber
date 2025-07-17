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
                    fetchConfiguracoes();
                })
                .catch(error => {
                    console.error("Erro ao excluir configuração:", error.response ? error.response.data : error);
                    alert('Erro ao excluir configuração. Verifique o console para mais detalhes.');
                });
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Configurações de Análise</h2>
            <Link to="/configuracoes-analise/add" className="btn btn-primary mb-4">Adicionar Nova Configuração</Link>

            <div className="card">
                <div className="card-body">
                    {configuracoes.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover table-bordered align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Produto</th>
                                        <th>Elemento Químico</th>
                                        <th className="text-center">Diluição 1 (X:Y)</th>
                                        <th className="text-center">Diluição 2 (X:Y)</th>
                                        <th className="text-center">Limite Min</th>
                                        <th className="text-center">Limite Max</th>
                                        <th className="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {configuracoes.map(config => (
                                        <tr key={config.id}>
                                            <td>{config.id}</td>
                                            <td>{config.produto_mat_prima_nome} ({config.produto_mat_prima_id_ou_op})</td>
                                            <td>{config.elemento_quimico_nome} ({config.elemento_quimico_simbolo})</td>
                                            {/* Alteração aqui */}
                                            <td className="text-center">
                                                {config.diluicao1_X}mL:{config.diluicao1_Y}mL
                                            </td>
                                            <td className="text-center">
                                                {config.diluicao2_X ? `${config.diluicao2_X}mL:${config.diluicao2_Y}mL` : 'N/A'}
                                            </td>
                                            {/* Fim da alteração */}
                                            <td className="text-center">{config.limite_min || 'N/A'}</td>
                                            <td className="text-center">{config.limite_max || 'N/A'}</td>
                                            <td className="text-center">
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
                        </div>
                    ) : (
                        <p className="text-muted">Nenhuma configuração de análise cadastrada ainda. Adicione uma nova!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ConfiguracaoAnaliseList;