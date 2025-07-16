// PROJETOHABER/frontend/src/components/RegistroAnaliseForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function RegistroAnaliseForm() {
    const [registro, setRegistro] = useState({
        produto_mat_prima: '',
        data_analise: '',
        data_producao: '', // NOVO CAMPO
        data_validade: '', // NOVO CAMPO
        lote: '',
        nota_fiscal: '',
        fornecedor: '',    // NOVO CAMPO
        detalhes: []
    });
    const [produtos, setProdutos] = useState([]);
    const [elementos, setElementos] = useState([]); // Ainda precisamos da lista de elementos para o dropdown
    const [configuracoesAnalise, setConfiguracoesAnalise] = useState([]); // Para armazenar as configurações do produto selecionado
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const API_URL = 'http://localhost:8000/api/registros-analise/';
    const PRODUTOS_API_URL = 'http://localhost:8000/api/produtos/';
    const ELEMENTOS_API_URL = 'http://localhost:8000/api/elementos/';
    const CONFIGURACOES_API_URL = 'http://localhost:8000/api/configuracoes-analise/'; // Nova URL para buscar configurações

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
                    // Formata as datas para o formato 'YYYY-MM-DD' esperado pelos inputs type="date"
                    const formattedData = {
                        ...response.data,
                        data_analise: response.data.data_analise,
                        data_producao: response.data.data_producao || '', // Garante string vazia se null
                        data_validade: response.data.data_validade || '', // Garante string vazia se null
                    };
                    setRegistro(formattedData);
                    // Quando o registro é carregado, também busca as configurações de análise para o produto
                    if (response.data.produto_mat_prima) {
                        fetchConfiguracoesAnalise(response.data.produto_mat_prima);
                    }
                })
                .catch(error => console.error("Erro ao buscar registro:", error));
        } else {
            // Define a data_analise padrão para hoje em modo de criação
            setRegistro(prevRegistro => ({
                ...prevRegistro,
                data_analise: new Date().toISOString().split('T')[0]
            }));
        }
    }, [id]);

    // Função para buscar as configurações de análise de um produto específico
    const fetchConfiguracoesAnalise = (produtoId) => {
        if (!produtoId) {
            setConfiguracoesAnalise([]);
            setRegistro(prevRegistro => ({ ...prevRegistro, detalhes: [] })); // Limpa detalhes se nenhum produto
            return;
        }
        axios.get(`${CONFIGURACOES_API_URL}?produto_mat_prima=${produtoId}`)
            .then(response => {
                setConfiguracoesAnalise(response.data);
                // Gera os detalhes iniciais com base nas configurações
                // Se estiver em modo de edição, mescla com os detalhes existentes
                if (isEditMode && registro.detalhes.length > 0) {
                    const newDetalhes = response.data.map(config => {
                        const existingDetail = registro.detalhes.find(d => d.elemento_quimico === config.elemento_quimico);
                        return existingDetail || {
                            id: null, // Para novos detalhes na edição
                            elemento_quimico: config.elemento_quimico,
                            elemento_quimico_nome: config.elemento_quimico_nome,
                            resultado: '',
                            massa_pesada: '', // Novo campo
                            absorbancia_medida: '', // Novo campo
                        };
                    });
                     // Garante que detalhes carregados do backend (se tiverem IDs e não forem de uma configuração)
                     // sejam mantidos se o produto não mudou
                    const finalDetalhes = [...new Set([...newDetalhes, ...registro.detalhes])].filter(d => 
                        response.data.some(config => config.elemento_quimico === d.elemento_quimico) || d.id
                    );


                    setRegistro(prevRegistro => ({
                        ...prevRegistro,
                        detalhes: finalDetalhes.sort((a,b) => a.elemento_quimico_nome.localeCompare(b.elemento_quimico_nome))
                    }));

                } else {
                    const generatedDetalhes = response.data.map(config => ({
                        id: null, // Novos detalhes não têm ID ainda
                        elemento_quimico: config.elemento_quimico,
                        elemento_quimico_nome: config.elemento_quimico_nome, // Para exibição
                        resultado: '',
                        massa_pesada: '', // Novo campo
                        absorbancia_medida: '', // Novo campo
                    }));
                    setRegistro(prevRegistro => ({
                        ...prevRegistro,
                        detalhes: generatedDetalhes.sort((a,b) => a.elemento_quimico_nome.localeCompare(b.elemento_quimico_nome))
                    }));
                }
            })
            .catch(error => console.error("Erro ao buscar configurações de análise:", error));
    };

    // Executa fetchConfiguracoesAnalise quando o produto_mat_prima muda
    useEffect(() => {
        // Apenas busca configurações se não estiver em modo de edição e já houver detalhes carregados (evita loop)
        // Ou se estiver em edição e o produto mudar (limpa os detalhes existentes para recarregar do produto)
        if (!isEditMode || (isEditMode && registro.produto_mat_prima !== (registro.id ? registro.produto_mat_prima : ''))) {
            fetchConfiguracoesAnalise(registro.produto_mat_prima);
        }
    }, [registro.produto_mat_prima, isEditMode]);


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

    // Remove o botão 'Adicionar Detalhe' e 'Remover Detalhe' para forçar a criação via ConfiguraçãoAnalise
    // Se precisar de flexibilidade para adicionar mais detalhes que não estão na configuração
    // podemos reintroduzir a lógica de 'handleAddDetalhe' e 'handleRemoveDetalhe',
    // mas a requisição é que os detalhes sejam pré-definidos pelo produto.

    // A função 'handleSubmit' precisará garantir que os IDs de detalhes existentes sejam mantidos
    // e os novos detalhes sejam enviados sem ID.

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSubmit = {
            ...registro,
            // Ajusta o formato da data para garantir que o backend aceite
            data_analise: registro.data_analise,
            data_producao: registro.data_producao || null, // Garante null se vazio
            data_validade: registro.data_validade || null, // Garante null se vazio
            detalhes: registro.detalhes.map(detalhe => ({
                id: detalhe.id || undefined, // Mantém ID para PUT, undefined para POST
                elemento_quimico: detalhe.elemento_quimico,
                resultado: detalhe.resultado,
                massa_pesada: detalhe.massa_pesada, // Novo campo
                absorbancia_medida: detalhe.absorbancia_medida, // Novo campo
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

                {/* NOVOS CAMPOS DO REGISTRO DE ANÁLISE */}
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
                            // Encontrar a configuração de análise correspondente para exibir as diluições
                            const config = configuracoesAnalise.find(
                                cfg => cfg.elemento_quimico === detalhe.elemento_quimico
                            );

                            return (
                                <div key={detalhe.id || `new-${index}`} className="border p-3 mb-3">
                                    <div className="row g-3 align-items-end">
                                        <div className="col-md-4">
                                            <label className="form-label">Elemento Químico</label>
                                            {/* Elemento químico vindo da configuração, read-only */}
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={detalhe.elemento_quimico_nome || ''}
                                                readOnly
                                            />
                                            {/* Campo oculto para enviar o ID do elemento */}
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
                                                value={config ? `1:${config.diluicao1_X} / 1:${config.diluicao2_X}` : 'N/A'}
                                                readOnly
                                                title={config ? `Diluição 1: 1:${config.diluicao1_X} (Fator: ${config.diluicao1_Y}) / Diluição 2: 1:${config.diluicao2_X} (Fator: ${config.diluicao2_Y})` : ''}
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