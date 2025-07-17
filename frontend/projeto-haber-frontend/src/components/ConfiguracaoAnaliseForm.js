// PROJETOHABER/frontend/src/components/ConfiguracaoAnaliseForm.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ConfiguracaoAnaliseForm() {
    const [configuracao, setConfiguracao] = useState({
        produto_mat_prima: '',
        detalhes_elementos: [] // AGORA É UM ARRAY PARA MÚLTIPLOS ELEMENTOS
    });
    const [produtos, setProdutos] = useState([]);
    const [elementosDisponiveis, setElementosDisponiveis] = useState([]); // Todos os elementos para a seleção
    const [isEditMode, setIsEditMode] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const API_URL = 'http://localhost:8000/api/configuracoes-analise/';
    const PRODUTOS_API_URL = 'http://localhost:8000/api/produtos/';
    const ELEMENTOS_API_URL = 'http://localhost:8000/api/elementos/';

    useEffect(() => {
        axios.get(PRODUTOS_API_URL)
            .then(response => setProdutos(response.data))
            .catch(error => console.error("Erro ao buscar produtos:", error));

        axios.get(ELEMENTOS_API_URL)
            .then(response => setElementosDisponiveis(response.data))
            .catch(error => console.error("Erro ao buscar elementos:", error));

        if (id) {
            setIsEditMode(true);
            axios.get(`${API_URL}${id}/`)
                .then(response => {
                    // Adaptar a resposta do backend para o estado do frontend
                    setConfiguracao({
                        produto_mat_prima: response.data.produto_mat_prima,
                        detalhes_elementos: response.data.detalhes_elementos.map(detalhe => ({
                            id: detalhe.id, // Manter o ID para edições
                            elemento_quimico: detalhe.elemento_quimico,
                            // Certificar-se de que os valores numéricos são strings para os inputs
                            // e null/'' para campos vazios
                            diluicao1_X: detalhe.diluicao1_X !== null ? String(detalhe.diluicao1_X) : '',
                            diluicao1_Y: detalhe.diluicao1_Y !== null ? String(detalhe.diluicao1_Y) : '',
                            diluicao2_X: detalhe.diluicao2_X !== null ? String(detalhe.diluicao2_X) : '',
                            diluicao2_Y: detalhe.diluicao2_Y !== null ? String(detalhe.diluicao2_Y) : '',
                            limite_min: detalhe.limite_min !== null ? String(detalhe.limite_min) : '',
                            limite_max: detalhe.limite_max !== null ? String(detalhe.limite_max) : '',
                        }))
                    });
                })
                .catch(error => console.error("Erro ao buscar configuração de análise:", error));
        }
    }, [id]);

    const handleConfiguracaoChange = (e) => {
        const { name, value } = e.target;
        setConfiguracao(prevConfig => ({
            ...prevConfig,
            [name]: value
        }));
    };

    const handleAddElementoDetalhe = () => {
        setConfiguracao(prevConfig => ({
            ...prevConfig,
            detalhes_elementos: [
                ...prevConfig.detalhes_elementos,
                {
                    elemento_quimico: '', // ID do elemento
                    diluicao1_X: '',
                    diluicao1_Y: '',
                    diluicao2_X: '',
                    diluicao2_Y: '',
                    limite_min: '',
                    limite_max: '',
                }
            ]
        }));
    };

    const handleElementoDetalheChange = (index, e) => {
        const { name, value } = e.target;
        const newDetalhesElementos = [...configuracao.detalhes_elementos];
        
        // Se for um campo numérico, trate o valor vazio como string vazia para o input,
        // mas o campo elemento_quimico pode ser tratado como numérico se for um ID.
        let parsedValue = value;
        if (['diluicao1_X', 'diluicao1_Y', 'diluicao2_X', 'diluicao2_Y', 'limite_min', 'limite_max'].includes(name)) {
            // Permite string vazia para o input, mas converte para Number ou mantém como string vazia
            parsedValue = value; // Manter como string para o input. A conversão para null/Number será no submit.
        } else if (name === "elemento_quimico") {
            // Certifica-se de que o ID do elemento é tratado como string no estado, mas será Number no submit
            parsedValue = value; 
            const selectedElementoId = value;
            const existingElementosInForm = newDetalhesElementos
                .filter((_, i) => i !== index) // Excluir o item atual da verificação
                .map(detalhe => detalhe.elemento_quimico);

            if (selectedElementoId && existingElementosInForm.includes(selectedElementoId)) { // Adicionado selectedElementoId && para evitar alerta ao selecionar a opção vazia
                alert('Este elemento químico já foi adicionado a esta configuração. Por favor, selecione outro ou edite o existente.');
                parsedValue = ''; // Resetar a seleção se duplicado
            }
        }
        
        newDetalhesElementos[index][name] = parsedValue;
        
        setConfiguracao(prevConfig => ({
            ...prevConfig,
            detalhes_elementos: newDetalhesElementos
        }));
    };

    const handleRemoveElementoDetalhe = (index) => {
        const newDetalhesElementos = configuracao.detalhes_elementos.filter((_, i) => i !== index);
        setConfiguracao(prevConfig => ({
            ...prevConfig,
            detalhes_elementos: newDetalhesElementos
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar se há pelo menos um detalhe de elemento
        if (configuracao.detalhes_elementos.length === 0) {
            alert('Por favor, adicione pelo menos um elemento químico à configuração.');
            return;
        }

        // VALIDAR SE CADA DETALHE DE ELEMENTO TEM UM ELEMENTO SELECIONADO
        const hasUnselectedElement = configuracao.detalhes_elementos.some(detalhe => !detalhe.elemento_quimico);
        if (hasUnselectedElement) {
            alert('Por favor, selecione um Elemento Químico para cada detalhe adicionado.');
            return;
        }

        // Limpeza e formatação dos dados para o backend:
        // Converter strings vazias para null para campos numéricos, e IDs para Number
        const cleanedDetalhesElementos = configuracao.detalhes_elementos.map(detalhe => ({
            ...(detalhe.id && { id: detalhe.id }), // Inclui ID apenas se existir (para PUT)
            elemento_quimico: Number(detalhe.elemento_quimico), // O ID do FK precisa ser Number
            
            // Tratamento para diluições e limites: se for string vazia, vira null. Senão, vira Number.
            diluicao1_X: detalhe.diluicao1_X === '' ? null : Number(detalhe.diluicao1_X),
            diluicao1_Y: detalhe.diluicao1_Y === '' ? null : Number(detalhe.diluicao1_Y),
            diluicao2_X: detalhe.diluicao2_X === '' ? null : Number(detalhe.diluicao2_X),
            diluicao2_Y: detalhe.diluicao2_Y === '' ? null : Number(detalhe.diluicao2_Y),
            limite_min: detalhe.limite_min === '' ? null : Number(detalhe.limite_min),
            limite_max: detalhe.limite_max === '' ? null : Number(detalhe.limite_max),
        }));

        const dataToSubmit = {
            produto_mat_prima: Number(configuracao.produto_mat_prima), // O ID do FK precisa ser Number
            detalhes_elementos: cleanedDetalhesElementos,
        };

        console.log("Dados a serem enviados:", dataToSubmit); // Para depuração

        if (isEditMode) {
            axios.put(`${API_URL}${id}/`, dataToSubmit)
                .then(() => {
                    alert('Configuração de Análise atualizada com sucesso!');
                    navigate('/configuracoes-analise');
                })
                .catch(error => {
                    console.error("Erro ao atualizar configuração:", error.response ? error.response.data : error);
                    alert('Erro ao atualizar configuração. Verifique o console para mais detalhes.');
                });
        } else {
            axios.post(API_URL, dataToSubmit)
                .then(() => {
                    alert('Configuração de Análise adicionada com sucesso!');
                    navigate('/configuracoes-analise');
                })
                .catch(error => {
                    console.error("Erro ao adicionar configuração:", error.response ? error.response.data : error);
                    alert('Erro ao adicionar configuração. Verifique o console para mais detalhes.');
                });
        }
    };

    // Função para filtrar elementos já selecionados
    const getAvailableElementos = (currentIndex) => {
        const selectedElementIds = configuracao.detalhes_elementos
            .filter((_, i) => i !== currentIndex) // Exclui o elemento que está sendo editado atualmente
            .map(detalhe => String(detalhe.elemento_quimico)); // Converte para String para comparação consistente
        
        return elementosDisponiveis.filter(elemento => !selectedElementIds.includes(String(elemento.id)));
    };


    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header">
                    <h2>{isEditMode ? 'Editar Configuração de Análise' : 'Adicionar Nova Configuração de Análise'}</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="produto_mat_prima" className="form-label">Produto Matéria Prima</label>
                            <select
                                className="form-control"
                                id="produto_mat_prima"
                                name="produto_mat_prima"
                                value={configuracao.produto_mat_prima}
                                onChange={handleConfiguracaoChange}
                                required
                            >
                                <option value="">Selecione um Produto</option>
                                {produtos.map(produto => (
                                    <option key={produto.id} value={produto.id}>{produto.nome} ({produto.id_ou_op})</option>
                                ))}
                            </select>
                        </div>

                        <h3 className="mt-4 mb-3">Detalhes dos Elementos Químicos</h3>
                        {configuracao.detalhes_elementos.length === 0 && (
                            <p className="text-muted">Nenhum elemento químico adicionado a esta configuração. Clique em "Adicionar Elemento" para começar.</p>
                        )}

                        {configuracao.detalhes_elementos.map((detalhe, index) => (
                            <div key={index} className="card mb-3 p-3 border-secondary"> {/* Estilizado como card interno */}
                                <h5 className="mb-3">Elemento #{index + 1}</h5>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor={`elemento_quimico_${index}`} className="form-label">Elemento Químico</label>
                                        <select
                                            className="form-control"
                                            id={`elemento_quimico_${index}`}
                                            name="elemento_quimico"
                                            value={detalhe.elemento_quimico}
                                            onChange={(e) => handleElementoDetalheChange(index, e)}
                                            required
                                        >
                                            <option value="">Selecione um Elemento</option>
                                            {getAvailableElementos(index).map(elemento => (
                                                <option key={elemento.id} value={elemento.id}>{elemento.nome} ({elemento.simbolo})</option>
                                            ))}
                                            {/* Se o elemento atual já estiver selecionado, ele ainda deve aparecer na lista para não sumir ao editar */}
                                            {detalhe.elemento_quimico && elementosDisponiveis.find(e => String(e.id) === String(detalhe.elemento_quimico)) &&
                                                !getAvailableElementos(index).find(e => String(e.id) === String(detalhe.elemento_quimico)) && (
                                                    <option value={detalhe.elemento_quimico}>
                                                        {elementosDisponiveis.find(e => String(e.id) === String(detalhe.elemento_quimico))?.nome} ({elementosDisponiveis.find(e => String(e.id) === String(detalhe.elemento_quimico))?.simbolo})
                                                    </option>
                                                )
                                            }
                                        </select>
                                    </div>
                                </div>
                                
                                <h6 className="mt-3 mb-2">Diluição 1</h6>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor={`diluicao1_X_${index}`} className="form-label">Volume Inicial (mL)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            id={`diluicao1_X_${index}`}
                                            name="diluicao1_X"
                                            value={detalhe.diluicao1_X}
                                            onChange={(e) => handleElementoDetalheChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor={`diluicao1_Y_${index}`} className="form-label">Volume Final (mL)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            id={`diluicao1_Y_${index}`}
                                            name="diluicao1_Y"
                                            value={detalhe.diluicao1_Y}
                                            onChange={(e) => handleElementoDetalheChange(index, e)}
                                            required
                                        />
                                    </div>
                                </div>

                                <h6 className="mt-3 mb-2">Diluição 2 (Opcional)</h6>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor={`diluicao2_X_${index}`} className="form-label">Volume Inicial (mL)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            id={`diluicao2_X_${index}`}
                                            name="diluicao2_X"
                                            value={detalhe.diluicao2_X}
                                            onChange={(e) => handleElementoDetalheChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor={`diluicao2_Y_${index}`} className="form-label">Volume Final (mL)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            id={`diluicao2_Y_${index}`}
                                            name="diluicao2_Y"
                                            value={detalhe.diluicao2_Y}
                                            onChange={(e) => handleElementoDetalheChange(index, e)}
                                        />
                                    </div>
                                </div>

                                <h6 className="mt-3 mb-2">Limites de Tolerância (Opcional)</h6>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor={`limite_min_${index}`} className="form-label">Limite Mínimo</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            className="form-control"
                                            id={`limite_min_${index}`}
                                            name="limite_min"
                                            value={detalhe.limite_min}
                                            onChange={(e) => handleElementoDetalheChange(index, e)}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor={`limite_max_${index}`} className="form-label">Limite Máximo</label>
                                        <input
                                            type="number"
                                            step="0.0001"
                                            className="form-control"
                                            id={`limite_max_${index}`}
                                            name="limite_max"
                                            value={detalhe.limite_max}
                                            onChange={(e) => handleElementoDetalheChange(index, e)}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-danger mt-2"
                                    onClick={() => handleRemoveElementoDetalhe(index)}
                                >
                                    Remover Elemento
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-secondary mt-3 mb-4"
                            onClick={handleAddElementoDetalhe}
                        >
                            Adicionar Elemento
                        </button>

                        <hr className="my-4" />

                        <button type="submit" className="btn btn-primary mt-3">
                            {isEditMode ? 'Atualizar Configuração' : 'Adicionar Configuração'}
                        </button>
                        <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={() => navigate('/configuracoes-analise')}>
                            Cancelar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ConfiguracaoAnaliseForm;