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
    // Agora configuracoesElementosDisponiveis conterá os objetos ConfiguracaoElementoDetalhe
    const [configuracoesElementosDisponiveis, setConfiguracoesElementosDisponiveis] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const API_URL = 'http://localhost:8000/api/registros-analise/';
    const PRODUTOS_API_URL = 'http://localhost:8000/api/produtos/';
    // Agora vamos buscar os detalhes diretamente por produto, não a configuração base
    const CONFIGS_ELEMENTO_DETALHE_API_URL = 'http://localhost:8000/api/configuracoes-elemento-detalhe/';

    // Opções de status
    const STATUS_OPTIONS = [
        { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
        { value: 'CONCLUIDO', label: 'Concluído' },
        { value: 'CANCELADO', label: 'Cancelado' },
    ];

    // Função para buscar configurações de elementos para um produto específico
    const fetchConfiguracoesElementosPorProduto = useCallback((produtoId) => {
        if (!produtoId) {
            setConfiguracoesElementosDisponiveis([]);
            return;
        }
        // Filtra por produto_mat_prima que está na ConfiguracaoAnalise que contém o detalhe
        axios.get(`${CONFIGS_ELEMENTO_DETALHE_API_URL}?configuracao_analise__produto_mat_prima=${produtoId}`)
            .then(response => {
                setConfiguracoesElementosDisponiveis(response.data);
            })
            .catch(error => console.error("Erro ao buscar configurações de elementos por produto:", error));
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
                        data_analise: data.data_analise ? new Date(data.data_analise).toISOString().split('T')[0] : '',
                        detalhes: data.detalhes || [],
                    });
                    // Busca configurações para o produto do registro carregado
                    if (data.produto_mat_prima) {
                        fetchConfiguracoesElementosPorProduto(data.produto_mat_prima);
                    }
                })
                .catch(error => console.error("Erro ao buscar registro de análise:", error));
        }
    }, [id, fetchConfiguracoesElementosPorProduto]);

    const handleRegistroChange = (e) => {
        const { name, value } = e.target;
        setRegistro(prevRegistro => ({
            ...prevRegistro,
            [name]: value
        }));

        if (name === "produto_mat_prima") {
            fetchConfiguracoesElementosPorProduto(value);
            // Limpa os detalhes se o produto for alterado
            setRegistro(prev => ({ ...prev, detalhes: [] }));
        }
    };

    const handleAddDetalhe = () => {
        setRegistro(prevRegistro => ({
            ...prevRegistro,
            detalhes: [
                ...prevRegistro.detalhes,
                { configuracao_elemento_detalhe: '', massa_pesada: '', absorbancia_medida: '', resultado: null }
            ]
        }));
    };

    const handleDetalheChange = (index, e) => {
        const { name, value } = e.target;
        const newDetalhes = [...registro.detalhes];
        newDetalhes[index][name] = value;

        // Se mudou a configuração do elemento, pode-se usar para info
        if (name === "configuracao_elemento_detalhe") {
            const detalheConfigSelecionada = configuracoesElementosDisponiveis.find(
                config => config.id.toString() === value
            );
            if (detalheConfigSelecionada) {
                // Aqui você pode definir valores padrão se houver, ou deixar em branco
                // newDetalhes[index].massa_pesada = detalheConfigSelecionada.massa_padrao || '';
                // newDetalhes[index].absorbancia_medida = detalheConfigSelecionada.absorbancia_padrao || '';
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

        // Validar se há pelo menos um detalhe de análise
        if (registro.detalhes.length === 0) {
            alert('Por favor, adicione pelo menos um detalhe de análise ao registro.');
            return;
        }

        // Limpeza dos dados: converter strings vazias para null para campos numéricos
        const cleanedDetalhes = registro.detalhes.map(detalhe => ({
            ...detalhe,
            ...(detalhe.id && { id: detalhe.id }),
            configuracao_elemento_detalhe: Number(detalhe.configuracao_elemento_detalhe),
            massa_pesada: detalhe.massa_pesada === '' ? null : Number(detalhe.massa_pesada),
            absorbancia_medida: detalhe.absorbancia_medida === '' ? null : Number(detalhe.absorbancia_medida),
            resultado: detalhe.resultado === '' ? null : Number(detalhe.resultado),
        }));

        // Payload corrigido: campo 'detalhes' sempre presente e preenchido
        const dataToSubmit = {
            produto_mat_prima: registro.produto_mat_prima,
            data_analise: registro.data_analise,
            analista: registro.analista,
            status: registro.status,
            detalhes: cleanedDetalhes,
        };

        // Debug detalhado do payload
        console.log("[DEBUG] Dados a serem enviados:", JSON.stringify(dataToSubmit, null, 2));

        const handleError = (error, acao) => {
            if (error.response) {
                console.error(`[DEBUG] Erro do backend ao ${acao}:`, error.response.data);
                alert(`Erro ao ${acao}:\n` + JSON.stringify(error.response.data, null, 2));
            } else {
                console.error(`[DEBUG] Erro de rede ao ${acao}:`, error.message);
                alert(`Erro de rede ao ${acao}: ` + error.message);
            }
        };

        if (isEditMode) {
            axios.put(`${API_URL}${id}/`, dataToSubmit, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(() => {
                    alert('Registro de Análise atualizado com sucesso!');
                    navigate('/registros-analise');
                })
                .catch(error => handleError(error, 'atualizar registro de análise'));
        } else {
            axios.post(API_URL, dataToSubmit, {
                headers: { 'Content-Type': 'application/json' }
            })
                .then(() => {
                    alert('Registro de Análise adicionado com sucesso!');
                    navigate('/registros-analise');
                })
                .catch(error => handleError(error, 'adicionar registro de análise'));
        }
    };

    // Função para filtrar as configurações de elemento já selecionadas em outros detalhes do mesmo registro
    const getAvailableConfiguracoesElementos = (currentIndex) => {
        const selectedConfigIds = registro.detalhes
            .filter((_, i) => i !== currentIndex) // Excluir o item atual da verificação
            .map(detalhe => detalhe.configuracao_elemento_detalhe);
        
        return configuracoesElementosDisponiveis.filter(config => !selectedConfigIds.includes(String(config.id)));
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
                            <p className="text-muted">Nenhum detalhe de análise adicionado. Selecione um Produto e clique em "Adicionar Detalhe" para começar.</p>
                        )}
                        {registro.detalhes.map((detalhe, index) => (
                            <div key={index} className="card mb-3 p-3 border-secondary"> {/* Use card para cada detalhe */}
                                <h5 className="mb-3">Detalhe #{index + 1}</h5>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor={`configuracao_elemento_detalhe_${index}`} className="form-label">Configuração de Elemento (Produto-Elemento)</label>
                                        <select
                                            className="form-control"
                                            id={`configuracao_elemento_detalhe_${index}`}
                                            name="configuracao_elemento_detalhe"
                                            value={detalhe.configuracao_elemento_detalhe}
                                            onChange={(e) => handleDetalheChange(index, e)}
                                            required
                                            disabled={!registro.produto_mat_prima} // Desabilita se nenhum produto for selecionado
                                        >
                                            <option value="">Selecione uma Configuração de Elemento</option>
                                            {getAvailableConfiguracoesElementos(index).map(configElem => (
                                                <option key={configElem.id} value={configElem.id}>
                                                    {configElem.elemento_quimico_simbolo} - Diluição 1: {configElem.diluicao1_X}mL:{configElem.diluicao1_Y}mL
                                                    {configElem.diluicao2_X && configElem.diluicao2_Y && ` / Diluição 2: ${configElem.diluicao2_X}mL:${configElem.diluicao2_Y}mL`}
                                                </option>
                                            ))}
                                            {/* Se o detalhe atual já tem uma config selecionada, mas ela não está mais nas opções disponíveis (porque já foi selecionada em outro detalhe), ainda a mostramos */}
                                            {detalhe.configuracao_elemento_detalhe && configuracoesElementosDisponiveis.find(ce => String(ce.id) === String(detalhe.configuracao_elemento_detalhe)) &&
                                            !getAvailableConfiguracoesElementos(index).find(ce => String(ce.id) === String(detalhe.configuracao_elemento_detalhe)) && (
                                                <option value={detalhe.configuracao_elemento_detalhe}>
                                                    {configuracoesElementosDisponiveis.find(ce => String(ce.id) === String(detalhe.configuracao_elemento_detalhe))?.elemento_quimico_simbolo} - Diluição 1: {configuracoesElementosDisponiveis.find(ce => String(ce.id) === String(detalhe.configuracao_elemento_detalhe))?.diluicao1_X}mL:{configuracoesElementosDisponiveis.find(ce => String(ce.id) === String(detalhe.configuracao_elemento_detalhe))?.diluicao1_Y}mL
                                                </option>
                                            )}
                                        </select>
                                        {/* Mensagem de ajuda se nenhum produto for selecionado */}
                                        {!registro.produto_mat_prima && <small className="form-text text-muted">Selecione um Produto acima para carregar as configurações de elementos disponíveis.</small>}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
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
                                    <div className="col-md-6 mb-3">
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
                        ))}
                        <button
                            type="button"
                            className="btn btn-secondary mt-3 mb-4"
                            onClick={handleAddDetalhe}
                            disabled={!registro.produto_mat_prima} // Desabilita se nenhum produto for selecionado
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