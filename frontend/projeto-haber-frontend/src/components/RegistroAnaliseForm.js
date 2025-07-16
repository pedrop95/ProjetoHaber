// PROJETOHABER/frontend/src/components/RegistroAnaliseForm.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function RegistroAnaliseForm() {
    const initialRegistroState = {
        produto_mat_prima: '',
        data_analise: new Date().toISOString().split('T')[0], // Data atual por padrão
        analista: '',
        status: 'EM_ANDAMENTO', // Default status
        detalhes: [],
    };
    const [registro, setRegistro] = useState(initialRegistroState);
    const [produtos, setProdutos] = useState([]);
    const [configuracoesAnalise, setConfiguracoesAnalise] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const API_URL = 'http://localhost:8000/api/registros-analise/';
    const PRODUTOS_API_URL = 'http://localhost:8000/api/produtos/';
    const CONFIGS_API_URL = 'http://localhost:8000/api/configuracoes-analise/';

    // Opções de status
    const STATUS_OPTIONS = [
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
        { value: 'CONCLUIDO', label: 'Concluído' },
        { value: 'CANCELADO', label: 'Cancelado' },
    ];

    // Função para buscar configurações de análise para um produto específico
    const fetchConfiguracoesPorProduto = useCallback((produtoId) => {
        if (!produtoId) {
            setConfiguracoesAnalise([]);
            return;
        }
        axios.get(`${CONFIGS_API_URL}?produto_mat_prima=${produtoId}`)
            .then(response => {
                setConfiguracoesAnalise(response.data);
            })
            .catch(error => console.error("Erro ao buscar configurações por produto:", error));
    }, []);

    useEffect(() => {
        // Carregar produtos
        axios.get(PRODUTOS_API_URL)
            .then(response => setProdutos(response.data))
            .catch(error => console.error("Erro ao buscar produtos:", error));

        // Se for modo de edição, carregar registro existente
        if (id) {
            setIsEditMode(true);
            axios.get(`${API_URL}${id}/`)
                .then(response => {
                    const data = response.data;
                    setRegistro({
                        ...data,
                        // Garante que a data esteja no formato YYYY-MM-DD
                        data_analise: data.data_analise ? new Date(data.data_analise).toISOString().split('T')[0] : '',
                        detalhes: data.detalhes || [],
                    });
                    // Busca configurações para o produto do registro carregado
                    if (data.produto_mat_prima) {
                        fetchConfiguracoesPorProduto(data.produto_mat_prima);
                    }
                })
                .catch(error => console.error("Erro ao buscar registro de análise:", error));
        }
    }, [id, fetchConfiguracoesPorProduto]); // Inclui fetchConfiguracoesPorProduto nas dependências

    const handleRegistroChange = (e) => {
        const { name, value } = e.target;
        setRegistro(prevRegistro => ({
            ...prevRegistro,
            [name]: value
        }));

        if (name === "produto_mat_prima") {
            fetchConfiguracoesPorProduto(value);
            // Limpa os detalhes se o produto for alterado
            setRegistro(prev => ({ ...prev, detalhes: [] }));
        }
    };

    const handleAddDetalhe = () => {
        setRegistro(prevRegistro => ({
            ...prevRegistro,
            detalhes: [
                ...prevRegistro.detalhes,
                { configuracao_analise: '', massa_pesada: '', absorbancia_medida: '', resultado: null }
            ]
        }));
    };

    const handleDetalheChange = (index, e) => {
        const { name, value } = e.target;
        const newDetalhes = [...registro.detalhes];
        newDetalhes[index][name] = value;

        // Se mudou a configuração, tenta pré-preencher massas/absorbancias baseadas na config
        if (name === "configuracao_analise") {
            const configSelecionada = configuracoesAnalise.find(
                config => config.id.toString() === value
            );
            if (configSelecionada) {
                // Aqui você pode definir valores padrão se houver, ou deixar em branco
                // Por exemplo, newDetalhes[index].massa_pesada = configSelecionada.massa_padrao || '';
                // newDetalhes[index].absorbancia_medida = configSelecionada.absorbancia_padrao || '';
            }
        }

        setRegistro(prevRegistro => ({
            ...prevRegistro,
            detalhes: newDetalhes
        }));
    };

    const handleRemoveDetalhe = (index) => {
        const newDetalhes = registro.detalhes.filter((_, i) => i !== index);
        setRegistro(prevRegistro => ({
            ...prevRegistro,
            detalhes: newDetalhes
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Limpeza dos dados: converter strings vazias para null para campos numéricos
        const cleanedDetalhes = registro.detalhes.map(detalhe => ({
            ...detalhe,
            massa_pesada: detalhe.massa_pesada === '' ? null : Number(detalhe.massa_pesada),
            absorbancia_medida: detalhe.absorbancia_medida === '' ? null : Number(detalhe.absorbancia_medida),
            // O resultado será calculado no backend, então podemos enviar null ou o valor atual se já foi calculado
            resultado: detalhe.resultado === '' ? null : Number(detalhe.resultado),
        }));

        const dataToSubmit = {
            ...registro,
            detalhes: cleanedDetalhes,
            // produto_mat_prima já é enviado como ID, não precisa de conversão
        };

        if (isEditMode) {
            axios.put(`${API_URL}${id}/`, dataToSubmit)
                .then(() => {
                    alert('Registro de Análise atualizado com sucesso!');
                    navigate('/registros-analise');
                })
                .catch(error => {
                    console.error("Erro ao atualizar registro de análise:", error.response ? error.response.data : error);
                    alert('Erro ao atualizar registro de análise. Verifique o console para mais detalhes.');
                });
        } else {
            axios.post(API_URL, dataToSubmit)
                .then(() => {
                    alert('Registro de Análise adicionado com sucesso!');
                    navigate('/registros-analise');
                })
                .catch(error => {
                    console.error("Erro ao adicionar registro de análise:", error.response ? error.response.data : error);
                    alert('Erro ao adicionar registro de análise. Verifique o console para mais detalhes.');
                });
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h2>{isEditMode ? 'Editar Registro de Análise' : 'Adicionar Novo Registro de Análise'}</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Seção de Dados do Registro Principal */}
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="produto_mat_prima" className="form-label">Produto Matéria Prima</label>
                                <select
                                    className="form-control"
                                    id="produto_mat_prima"
                                    name="produto_mat_prima"
                                    value={registro.produto_mat_prima}
                                    onChange={handleRegistroChange}
                                    required
                                >
                                    <option value="">Selecione um Produto</option>
                                    {produtos.map(produto => (
                                        <option key={produto.id} value={produto.id}>{produto.nome} ({produto.id_ou_op})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="data_analise" className="form-label">Data da Análise</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="data_analise"
                                    name="data_analise"
                                    value={registro.data_analise}
                                    onChange={handleRegistroChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="analista" className="form-label">Analista</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="analista"
                                    name="analista"
                                    value={registro.analista}
                                    onChange={handleRegistroChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    className="form-control"
                                    id="status"
                                    name="status"
                                    value={registro.status}
                                    onChange={handleRegistroChange}
                                    required
                                >
                                    {STATUS_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Seção de Detalhes da Análise */}
                        <h3 className="mt-4 mb-3">Detalhes da Análise</h3>
                        {registro.detalhes.length === 0 && (
                            <p className="text-muted">Nenhum detalhe de análise adicionado. Clique em "Adicionar Detalhe" para começar.</p>
                        )}
                        {registro.detalhes.map((detalhe, index) => (
                            <div key={index} className="card mb-3"> {/* Use card para cada detalhe */}
                                <div className="card-body">
                                    <h5 className="card-title">Detalhe #{index + 1}</h5>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor={`configuracao_analise_${index}`} className="form-label">Configuração de Análise</label>
                                            <select
                                                className="form-control"
                                                id={`configuracao_analise_${index}`}
                                                name="configuracao_analise"
                                                value={detalhe.configuracao_analise}
                                                onChange={(e) => handleDetalheChange(index, e)}
                                                required
                                            >
                                                <option value="">Selecione uma Configuração</option>
                                                {configuracoesAnalise.map(config => (
                                                    <option key={config.id} value={config.id}>
                                                        {config.elemento_quimico_simbolo} - Dil. 1({config.diluicao1_X}:{config.diluicao1_Y})
                                                        {config.diluicao2_X && ` / Dil. 2(${config.diluicao2_X}:${config.diluicao2_Y})`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor={`massa_pesada_${index}`} className="form-label">Massa Pesada (g)</label>
                                            <input
                                                type="number"
                                                step="0.0001"
                                                className="form-control"
                                                id={`massa_pesada_${index}`}
                                                name="massa_pesada"
                                                value={detalhe.massa_pesada}
                                                onChange={(e) => handleDetalheChange(index, e)}
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label htmlFor={`absorbancia_medida_${index}`} className="form-label">Absorbância Medida</label>
                                            <input
                                                type="number"
                                                step="0.0001"
                                                className="form-control"
                                                id={`absorbancia_medida_${index}`}
                                                name="absorbancia_medida"
                                                value={detalhe.absorbancia_medida}
                                                onChange={(e) => handleDetalheChange(index, e)}
                                            />
                                        </div>
                                        {detalhe.resultado !== null && (
                                            <div className="col-md-12 mb-3">
                                                <label className="form-label">Resultado (Concentração)</label>
                                                <p className="form-control-static">
                                                    {detalhe.resultado !== undefined && detalhe.resultado !== null ? detalhe.resultado.toFixed(4) : 'N/A'}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleRemoveDetalhe(index)}
                                    >
                                        Remover Detalhe
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="btn btn-secondary mt-3 mb-4"
                            onClick={handleAddDetalhe}
                        >
                            Adicionar Detalhe
                        </button>

                        <hr className="my-4" /> {/* Separador visual */}

                        <button type="submit" className="btn btn-success mt-3">
                            {isEditMode ? 'Atualizar Registro' : 'Adicionar Registro'}
                        </button>
                        <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => navigate('/registros-analise')}>
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegistroAnaliseForm;