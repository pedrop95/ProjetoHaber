// PROJETOHABER/frontend/src/components/RegistroAnaliseList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function RegistroAnaliseList() {
    const [registros, setRegistros] = useState([]);

    // estados do input antes de aplicar filtro
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [vereditoFilter, setVereditoFilter] = useState('');
    const [fornecedorFilter, setFornecedorFilter] = useState('');
    const [loteFilter, setLoteFilter] = useState('');
    const [nfFilter, setNfFilter] = useState('');

    // estados aplicados
    const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
    const [appliedStatusFilter, setAppliedStatusFilter] = useState('');
    const [appliedVereditoFilter, setAppliedVereditoFilter] = useState('');
    const [appliedFornecedorFilter, setAppliedFornecedorFilter] = useState('');
    const [appliedLoteFilter, setAppliedLoteFilter] = useState('');
    const [appliedNfFilter, setAppliedNfFilter] = useState('');

    const API_URL = 'http://localhost:8000/api/registros-analise/';

    useEffect(() => {
        fetchRegistros();
    }, []);

    const fetchRegistros = () => {
        axios.get(API_URL)
            .then(response => {
                // Verificar se a resposta é um array ou um objeto com results (paginação)
                const dadosRegistros = Array.isArray(response.data) ? response.data : (response.data.results || []);
                setRegistros(dadosRegistros);
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

    const filteredRegistros = registros.filter(registro => {
        const term = appliedSearchTerm.trim().toLowerCase();
        const fullText = `${registro.id} ${registro.produto_mat_prima_nome} ${new Date(registro.data_analise).toLocaleDateString()} ${registro.status} ${getVereditoLabel(registro.veredito)} ${registro.analista} ${registro.fornecedor || ''} ${registro.lote || ''} ${registro.nf || ''}`.toLowerCase();

        const matchesSearch = term === '' || fullText.includes(term);
        const matchesStatus = appliedStatusFilter === '' || registro.status === appliedStatusFilter;
        const matchesVeredito = appliedVereditoFilter === '' || registro.veredito === appliedVereditoFilter;
        const matchesFornecedor = appliedFornecedorFilter === '' || (registro.fornecedor || '').toLowerCase().includes(appliedFornecedorFilter.toLowerCase());
        const matchesLote = appliedLoteFilter === '' || (registro.lote || '').toLowerCase().includes(appliedLoteFilter.toLowerCase());
        const matchesNf = appliedNfFilter === '' || (registro.nf || '').toLowerCase().includes(appliedNfFilter.toLowerCase());

        return matchesSearch && matchesStatus && matchesVeredito && matchesFornecedor && matchesLote && matchesNf;
    });

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Registros de Análise</h2>
            <div className="row mb-3">
                <div className="col-md-4 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por ID, produto, data, status, veredito, analista..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-2 mb-2">
                    <select
                        className="form-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Filtro por status</option>
                        <option value="EM_ANDAMENTO">Em Andamento</option>
                        <option value="CONCLUIDO">Concluído</option>
                        <option value="CANCELADO">Cancelado</option>
                    </select>
                </div>
                <div className="col-md-2 mb-2">
                    <select
                        className="form-select"
                        value={vereditoFilter}
                        onChange={(e) => setVereditoFilter(e.target.value)}
                    >
                        <option value="">Filtro por veredito</option>
                        <option value="APROVADO">Aprovado</option>
                        <option value="APROVADO_COM_RESCALVAS">Aprovado com ressalvas</option>
                        <option value="REPROVADO">Reprovado</option>
                    </select>
                </div>
                <div className="col-md-2 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Fornecedor"
                        value={fornecedorFilter}
                        onChange={(e) => setFornecedorFilter(e.target.value)}
                    />
                </div>
                <div className="col-md-2 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Lote"
                        value={loteFilter}
                        onChange={(e) => setLoteFilter(e.target.value)}
                    />
                </div>
                <div className="col-md-2 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="NF"
                        value={nfFilter}
                        onChange={(e) => setNfFilter(e.target.value)}
                    />
                </div>
                <div className="col-md-2 mb-2">
                    <button
                        className="btn btn-primary w-100"
                        onClick={() => {
                            setAppliedSearchTerm(searchTerm);
                            setAppliedStatusFilter(statusFilter);
                            setAppliedVereditoFilter(vereditoFilter);
                            setAppliedFornecedorFilter(fornecedorFilter);
                            setAppliedLoteFilter(loteFilter);
                            setAppliedNfFilter(nfFilter);
                        }}
                    >
                        Aplicar filtros
                    </button>
                </div>
                <div className="col-md-2 mb-2">
                    <button
                        className="btn btn-outline-secondary w-100"
                        onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('');
                            setVereditoFilter('');
                            setFornecedorFilter('');
                            setLoteFilter('');
                            setNfFilter('');
                            setAppliedSearchTerm('');
                            setAppliedStatusFilter('');
                            setAppliedVereditoFilter('');
                            setAppliedFornecedorFilter('');
                            setAppliedLoteFilter('');
                            setAppliedNfFilter('');
                        }}
                    >
                        Limpar filtros
                    </button>
                </div>
            </div>
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
                                        <th>Fornecedor</th>
                                        <th>Lote</th>
                                        <th>NF</th>
                                        <th>Veredito</th>
                                        <th>Analista</th>
                                        <th className="text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRegistros.map(registro => (
                                        <React.Fragment key={registro.id}>
                                            <tr>
                                                <td>{registro.id}</td>
                                                <td>{registro.produto_mat_prima_nome}</td>
                                                <td>{new Date(registro.data_analise).toLocaleDateString()}</td>
                                                <td>{getStatusBadge(registro.status)}</td>
                                                <td>{registro.fornecedor || '-'}</td>
                                                <td>{registro.lote || '-'}</td>
                                                <td>{registro.nf || '-'}</td>
                                                <td>{getVereditoLabel(registro.veredito)}</td>
                                                <td>{registro.analista}</td>
                                                <td className="text-center">
                                                    <Link to={`/registros-analise/view/${registro.id}`} className="btn btn-sm btn-outline-primary me-2">Visualizar</Link>
                                                    <Link to={`/registros-analise/edit/${registro.id}`} className="btn btn-sm btn-info me-2">Editar</Link>
                                                    <button
                                                        onClick={() => handleDelete(registro.id)}
                                                        className="btn btn-sm btn-danger"
                                                    >
                                                        Excluir
                                                    </button>
                                                </td>
                                            </tr>
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