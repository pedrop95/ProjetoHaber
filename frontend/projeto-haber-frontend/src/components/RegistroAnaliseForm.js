// PROJETOHABER/frontend/src/components/RegistroAnaliseForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function RegistroAnaliseForm() {
    const [registro, setRegistro] = useState({
        produto_mat_prima: '',
        data_analise: '',
        data_producao: '',
        data_validade: '',
        lote: '',
        nota_fiscal: '',
        fornecedor: '',
        status: 'EM_ANDAMENTO', // <-- NOVO: Valor padrão para o status
        detalhes: []
    });
    const [produtos, setProdutos] = useState([]);
    const [elementos, setElementos] = useState([]);
    const [configuracoesAnalise, setConfiguracoesAnalise] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const API_URL = 'http://localhost:8000/api/registros-analise/';
    const PRODUTOS_API_URL = 'http://localhost:8000/api/produtos/';
    const ELEMENTOS_API_URL = 'http://localhost:8000/api/elementos/';
    const CONFIGURACOES_API_URL = 'http://localhost:8000/api/configuracoes-analise/';

    // State para guardar o produto_mat_prima original em modo de edição
    const [originalProdutoMatPrimaId, setOriginalProdutoMatPrimaId] = useState(null);

    // Opções para o dropdown de Status
    const statusOptions = [
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
        { value: 'CONCLUIDO', label: 'Concluído' },
        { value: 'CANCELADO', label: 'Cancelado' },
    ];

    useEffect(() => {
        // Carrega produtos e elementos ao montar o componente
        axios.get(PRODUTOS_API_URL)
            .then(response => setProdutos(response.data))
            .catch(error => console.error("Erro ao buscar produtos:", error));

        axios.get(ELEMENTOS_API_URL)
            .then(response => setElementos(response.data))
            .catch(error => console.error("Erro ao buscar elementos:", error));

        // Se for modo de edição, carrega os dados do registro existente
        if (id) {
            setIsEditMode(true);
            axios.get(`${API_URL}${id}/`)
                .then(response => {
                    const formattedData = {
                        ...response.data,
                        data_analise: response.data.data_analise,
                        data_producao: response.data.data_producao || '',
                        data_validade: response.data.data_validade || '',
                        status: response.data.status || 'EM_ANDAMENTO', // <-- NOVO: Define o status ao carregar
                    };
                    setRegistro(formattedData);
                    setOriginalProdutoMatPrimaId(formattedData.produto_mat_prima); // Guarda o ID original

                    // A chamada para fetchConfiguracoesAnalise será feita pelo useEffect que observa registro.produto_mat_prima
                })
                .catch(error => console.error("Erro ao buscar registro:", error));
        } else {
            setRegistro(prevRegistro => ({
                ...prevRegistro,
                data_analise: new Date().toISOString().split('T')[0]
            }));
        }
    }, [id]);

    const fetchConfiguracoesAnalise = async (produtoId, currentDetalhes = []) => {
        if (!produtoId) {
            setConfiguracoesAnalise([]);
            return [];
        }
        try {
            const response = await axios.get(`${CONFIGURACOES_API_URL}?produto_mat_prima=${produtoId}`);
            setConfiguracoesAnalise(response.data);

            const newGeneratedDetalhes = response.data.map(config => {
                const existingDetail = currentDetalhes.find(
                    d => d.elemento_quimico === config.elemento_quimico
                );

                return {
                    id: existingDetail ? existingDetail.id : null,
                    elemento_quimico: config.elemento_quimico,
                    elemento_quimico_nome: config.elemento_quimico_nome,
                    resultado: existingDetail ? existingDetail.resultado : '',
                    massa_pesada: existingDetail ? existingDetail.massa_pesada : '',
                    absorbancia_medida: existingDetail ? existingDetail.absorbancia_medida : '',
                };
            }).sort((a,b) => a.elemento_quimico_nome.localeCompare(b.elemento_quimico_nome));

            return newGeneratedDetalhes;
        } catch (error) {
            console.error("Erro ao buscar configurações de análise:", error);
            return [];
        }
    };

    useEffect(() => {
        const updateDetalhes = async () => {
            if (registro.produto_mat_prima) {
                const updatedDetalhes = await fetchConfiguracoesAnalise(
                    registro.produto_mat_prima,
                    isEditMode ? registro.detalhes : []
                );
                setRegistro(prevRegistro => ({
                    ...prevRegistro,
                    detalhes: updatedDetalhes
                }));
            } else {
                setRegistro(prevRegistro => ({ ...prevRegistro, detalhes: [] }));
                setConfiguracoesAnalise([]);
            }
        };

        if (registro.produto_mat_prima && (registro.produto_mat_prima !== originalProdutoMatPrimaId || !isEditMode)) {
            updateDetalhes();
        } else if (!registro.produto_mat_prima) {
            setRegistro(prevRegistro => ({ ...prevRegistro, detalhes: [] }));
            setConfiguracoesAnalise([]);
        }
    }, [registro.produto_mat_prima, id, originalProdutoMatPrimaId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegistro(prevRegistro => ({
            ...prevRegistro,
            [name]: value
        }));
    };

    const handleDetalheChange = (index, e) => {
        const { name, value } = e.target;
        const newDetalhes = [...registro.detalhes];
        newDetalhes[index][name] = value;
        setRegistro(prevRegistro => ({
            ...prevRegistro,
            detalhes: newDetalhes
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = {
            ...registro,
            data_producao: registro.data_producao || null,
            data_validade: registro.data_validade || null,
            detalhes: registro.detalhes.map(detalhe => ({
                id: detalhe.id || undefined,
                elemento_quimico: detalhe.elemento_quimico,
                resultado: detalhe.resultado,
                massa_pesada: detalhe.massa_pesada,
                absorbancia_medida: detalhe.absorbancia_medida,
            }))
        };

        if (isEditMode) {
            axios.put(`${API_URL}${id}/`, dataToSubmit)
                .then(() => {
                    alert('Registro de Análise atualizado com sucesso!');
                    navigate('/registros-analise');
                })
                .catch(error => {
                    console.error("Erro ao atualizar registro:", error.response ? error.response.data : error);
                    alert('Erro ao atualizar registro. Verifique o console para mais detalhes.');
                });
        } else {
            axios.post(API_URL, dataToSubmit)
                .then(() => {
                    alert('Registro de Análise criado com sucesso!');
                    navigate('/registros-analise');
                })
                .catch(error => {
                    console.error("Erro ao criar registro:", error.response ? error.response.data : error);
                    alert('Erro ao criar registro. Verifique o console para mais detalhes.');
                });
        }
    };

    return (
        <div className="container mt-4">
            <h2>{isEditMode ? 'Editar Registro de Análise' : 'Adicionar Novo Registro de Análise'}</h2>
            <form onSubmit={handleSubmit}>
                {/* Campos do Registro de Análise */}
                <div className="mb-3">
                    <label htmlFor="produto_mat_prima" className="form-label">Produto Matéria Prima</label>
                    <select
                        className="form-control"
                        id="produto_mat_prima"
                        name="produto_mat_prima"
                        value={registro.produto_mat_prima}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um Produto</option>
                        {produtos.map(produto => (
                            <option key={produto.id} value={produto.id}>{produto.nome} ({produto.id_ou_op})</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="data_analise" className="form-label">Data da Análise</label>
                    <input
                        type="date"
                        className="form-control"
                        id="data_analise"
                        name="data_analise"
                        value={registro.data_analise}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* NOVO CAMPO DE STATUS */}
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status da Análise</label>
                    <select
                        className="form-control"
                        id="status"
                        name="status"
                        value={registro.status}
                        onChange={handleChange}
                        required
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                {/* OUTROS NOVOS CAMPOS DO REGISTRO DE ANÁLISE */}
                <div className="mb-3">
                    <label htmlFor="data_producao" className="form-label">Data de Produção</label>
                    <input
                        type="date"
                        className="form-control"
                        id="data_producao"
                        name="data_producao"
                        value={registro.data_producao}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="data_validade" className="form-label">Data de Validade</label>
                    <input
                        type="date"
                        className="form-control"
                        id="data_validade"
                        name="data_validade"
                        value={registro.data_validade}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="lote" className="form-label">Lote</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lote"
                        name="lote"
                        value={registro.lote}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="nota_fiscal" className="form-label">Nota Fiscal</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nota_fiscal"
                        name="nota_fiscal"
                        value={registro.nota_fiscal}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="fornecedor" className="form-label">Fornecedor</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fornecedor"
                        name="fornecedor"
                        value={registro.fornecedor}
                        onChange={handleChange}
                    />
                </div>

                {/* Seção de Detalhes da Análise */}
                <h3 className="mt-4">Detalhes da Análise</h3>
                {registro.produto_mat_prima ? (
                    registro.detalhes.length > 0 ? (
                        registro.detalhes.map((detalhe, index) => {
                            const config = configuracoesAnalise.find(
                                cfg => cfg.elemento_quimico === detalhe.elemento_quimico
                            );

                            return (
                                <div key={detalhe.id || `new-${index}`} className="border p-3 mb-3">
                                    <div className="row g-3 align-items-end">
                                        <div className="col-md-4">
                                            <label className="form-label">Elemento Químico</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={detalhe.elemento_quimico_nome || ''}
                                                readOnly
                                            />
                                            <input
                                                type="hidden"
                                                name="elemento_quimico"
                                                value={detalhe.elemento_quimico}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label className="form-label">Diluições Config.</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={config ? `1:${config.diluicao1_X} / 1:${config.diluicao2_X || 'N/A'}` : 'N/A'}
                                                readOnly
                                                title={config ? `Diluição 1: 1:${config.diluicao1_X} (Fator: ${config.diluicao1_Y}) / Diluição 2: 1:${config.diluicao2_X || 'N/A'} (Fator: ${config.diluicao2_Y || 'N/A'})` : ''}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label htmlFor={`massa_pesada-${index}`} className="form-label">Massa Pesada (g)</label>
                                            <input
                                                type="number"
                                                step="0.0001"
                                                className="form-control"
                                                id={`massa_pesada-${index}`}
                                                name="massa_pesada"
                                                value={detalhe.massa_pesada}
                                                onChange={(e) => handleDetalheChange(index, e)}
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label htmlFor={`absorbancia_medida-${index}`} className="form-label">Absorbância</label>
                                            <input
                                                type="number"
                                                step="0.0001"
                                                className="form-control"
                                                id={`absorbancia_medida-${index}`}
                                                name="absorbancia_medida"
                                                value={detalhe.absorbancia_medida}
                                                onChange={(e) => handleDetalheChange(index, e)}
                                            />
                                        </div>
                                        <div className="col-md-1">
                                            <label htmlFor={`resultado-${index}`} className="form-label">Resultado</label>
                                            <input
                                                type="number"
                                                step="0.0001"
                                                className="form-control"
                                                id={`resultado-${index}`}
                                                name="resultado"
                                                value={detalhe.resultado}
                                                onChange={(e) => handleDetalheChange(index, e)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-info">Nenhuma configuração de análise encontrada para este produto. Cadastre as configurações primeiro.</p>
                    )
                ) : (
                    <p className="text-muted">Selecione um Produto Matéria Prima para ver os detalhes da análise.</p>
                )}

                <button type="submit" className="btn btn-primary mt-4">
                    {isEditMode ? 'Atualizar Registro' : 'Adicionar Registro'}
                </button>
            </form>
        </div>
    );
}

export default RegistroAnaliseForm;