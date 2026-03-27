import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function RegistroAnaliseView() {
    const { id } = useParams();
    const [registro, setRegistro] = useState(null);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:8000/api/registros-analise/';

    useEffect(() => {
        axios.get(`${API_URL}${id}/`)
            .then(response => setRegistro(response.data))
            .catch(err => {
                console.error('Erro ao buscar registro de análise:', err);
                setError('Não foi possível carregar o registro.');
            });
    }, [id]);

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

    const getVereditoLabel = (veredito) => {
        switch (veredito) {
            case 'APROVADO':
                return 'Aprovado';
            case 'APROVADO_COM_RESCALVAS':
                return 'Aprovado com ressalvas';
            case 'REPROVADO':
                return 'Reprovado';
            default:
                return '-';
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!registro) {
        return <p>Carregando registro de análise...</p>;
    }

    return (
        <div className="container mt-4">
            <h2>Visualizar Registro de Análise #{registro.id}</h2>
            <Link to="/registros-analise" className="btn btn-secondary mb-3">Voltar à Lista</Link>
            <div className="card mb-3">
                <div className="card-body">
                    <p><strong>Produto:</strong> {registro.produto_mat_prima_nome || '-'}</p>
                    <p><strong>OP/ID:</strong> {registro.id_ou_op || '-'}</p>
                    <p><strong>Data da Análise:</strong> {registro.data_analise ? new Date(registro.data_analise).toLocaleDateString() : '-'}</p>
                    <p><strong>Status:</strong> {getStatusBadge(registro.status)}</p>
                    <p><strong>Veredito:</strong> {getVereditoLabel(registro.veredito)}</p>
                    <p><strong>Analista:</strong> {registro.analista || '-'}</p>
                    <p><strong>Fornecedor:</strong> {registro.fornecedor || '-'}</p>
                    <p><strong>Lote:</strong> {registro.lote || '-'}</p>
                    <p><strong>NF:</strong> {registro.nf || '-'}</p>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <h5>Detalhes da Análise</h5>
                    {registro.detalhes && registro.detalhes.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Elemento</th>
                                        <th>Absorbância</th>
                                        <th>Massa Pesada</th>
                                        <th>Dilu.1 (mL)</th>
                                        <th>Dilu.2 Inicial</th>
                                        <th>Dilu.2 Final</th>
                                        <th>Concentração (ppm)</th>
                                        <th>Concentração (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {registro.detalhes.map((detalhe, idx) => (
                                        <tr key={idx}>
                                            <td>{detalhe.elemento_quimico_nome || detalhe.elemento_quimico_simbolo || '-'}</td>
                                            <td>{detalhe.absorbancia_medida ?? '-'}</td>
                                            <td>{detalhe.massa_pesada ?? '-'}</td>
                                            <td>{detalhe.volume_final_diluicao_1 ?? '-'}</td>
                                            <td>{detalhe.volume_inicial_diluicao_2 ?? '-'}</td>
                                            <td>{detalhe.volume_final_diluicao_2 ?? '-'}</td>
                                            <td>{detalhe.concentracao_ppm !== null && detalhe.concentracao_ppm !== undefined ? Number(detalhe.concentracao_ppm).toFixed(2) : '-'}</td>
                                            <td>{detalhe.concentracao_porcentagem !== null && detalhe.concentracao_porcentagem !== undefined ? Number(detalhe.concentracao_porcentagem).toFixed(2) : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted">Nenhum detalhe disponível para esse registro.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RegistroAnaliseView;
