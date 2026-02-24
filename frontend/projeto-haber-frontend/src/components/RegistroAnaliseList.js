// PROJETOHABER/frontend/src/components/RegistroAnaliseList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function RegistroAnaliseList() {
    const [registros, setRegistros] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const API_URL = 'http://localhost:8000/api/registros-analise/';

    useEffect(() => {
        fetchRegistros();
    }, []);

    const fetchRegistros = () => {
        axios.get(API_URL)
            .then(response => {
                setRegistros(response.data);
            })
            .catch(error => console.error("Erro ao buscar registros de análise:", error));
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este registro de análise?')) {
            axios.delete(`${API_URL}${id}/`)
                .then(() => {
                    alert('Registro de Análise excluído com sucesso!');
                    fetchRegistros();
                })
                .catch(error => {
                    console.error("Erro ao excluir registro:", error.response ? error.response.data : error);
                    alert('Erro ao excluir registro. Verifique o console para mais detalhes.');
                });
        }
    };

    // Função auxiliar para obter a classe de badge para o status
    const getStatusBadge = (status) => {
        switch (status) {
            case 'EM_ANDAMENTO':
                return <span className="badge bg-warning text-dark">Em Andamento</span>;
            case 'CONCLUIDO':
                return <span className="badge bg-success">Concluído</span>;
            case 'CANCELADO':
                return <span className="badge bg-danger">Cancelado</span>;
            default:
                return <span className="badge bg-secondary">Desconhecido</span>;
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Registros de Análise</h2>
            <Link to="/registros-analise/add" className="btn btn-success mb-4">Adicionar Novo Registro de Análise</Link>

            <div className="card">
                <div className="card-body">
                    {registros.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover table-bordered align-middle">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Produto</th>
                                        <th>Data Análise</th>
                                        <th>Status</th>
                                        <th>Analista</th>
                                        <th className="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registros.map(registro => (
                                        <React.Fragment key={registro.id}>
                                            <tr>
                                                <td>{registro.id}</td>
                                                <td>{registro.produto_mat_prima_nome}</td>
                                                <td>{new Date(registro.data_analise).toLocaleDateString()}</td>
                                                <td>{getStatusBadge(registro.status)}</td>
                                                <td>{registro.analista}</td>
                                                <td className="text-center">
                                                    <button
                                                        onClick={() => toggleExpand(registro.id)}
                                                        className="btn btn-sm btn-outline-primary me-2"
                                                        title="Expandir/Retrair detalhes"
                                                    >
                                                        {expandedId === registro.id ? '−' : '+'}
                                                    </button>
                                                    <Link to={`/registros-analise/edit/${registro.id}`} className="btn btn-sm btn-info me-2">Editar</Link>
                                                    <button
                                                        onClick={() => handleDelete(registro.id)}
                                                        className="btn btn-sm btn-danger"
                                                    >
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedId === registro.id && (
                                                <tr>
                                                    <td colSpan="6">
                                                        <div className="p-3 bg-light">
                                                            <h6>Detalhes da Análise:</h6>
                                                            {registro.detalhes && registro.detalhes.length > 0 ? (
                                                                <table className="table table-sm table-bordered">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Elemento</th>
                                                                            <th>Absorbância</th>
                                                                            <th>Massa Pesada</th>
                                                                            <th>Vol. Final Diluição 1</th>
                                                                            <th>Vol. Inic. Diluição 2</th>
                                                                            <th>Vol. Final Diluição 2</th>
                                                                            <th>Concentração (ppm)</th>
                                                                            <th>Concentração (%)</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {registro.detalhes.map((detalhe, idx) => (
                                                                            <tr key={idx}>
                                                                                <td>{detalhe.elemento_quimico_nome}</td>
                                                                                <td>{detalhe.absorbancia_medida ? Number(detalhe.absorbancia_medida).toFixed(4) : 'N/A'}</td>
                                                                                <td>{detalhe.massa_pesada ? Number(detalhe.massa_pesada).toFixed(4) : 'N/A'}</td>
                                                                                <td>{detalhe.volume_final_diluicao_1 ? Number(detalhe.volume_final_diluicao_1).toFixed(4) : 'N/A'}</td>
                                                                                <td>{detalhe.volume_inicial_diluicao_2 ? Number(detalhe.volume_inicial_diluicao_2).toFixed(4) : '-'}</td>
                                                                                <td>{detalhe.volume_final_diluicao_2 ? Number(detalhe.volume_final_diluicao_2).toFixed(4) : '-'}</td>
                                                                                <td>
                                                                                    <strong>
                                                                                        {detalhe.concentracao_ppm !== null && detalhe.concentracao_ppm !== undefined
                                                                                            ? `${Number(detalhe.concentracao_ppm).toFixed(6)} ppm`
                                                                                            : 'Dados incompletos'}
                                                                                    </strong>
                                                                                </td>
                                                                                <td>
                                                                                    <strong>
                                                                                        {detalhe.concentracao_porcentagem !== null && detalhe.concentracao_porcentagem !== undefined
                                                                                            ? `${Number(detalhe.concentracao_porcentagem).toFixed(8)} %`
                                                                                            : 'Dados incompletos'}
                                                                                    </strong>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <p className="text-muted">Sem detalhes registrados.</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted">Nenhum registro de análise cadastrado ainda. Adicione um novo!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RegistroAnaliseList;