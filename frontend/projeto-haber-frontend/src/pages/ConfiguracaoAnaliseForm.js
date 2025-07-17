// PROJETOHABER/frontend/src/components/ConfiguracaoAnaliseForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ConfiguracaoAnaliseForm() {
    const [configuracao, setConfiguracao] = useState({
        produto_mat_prima: '',
        elemento_quimico: '', // Este campo será alterado em uma etapa futura para aceitar múltiplos
        diluicao1_X: '',
        diluicao1_Y: '',
        diluicao2_X: '',
        diluicao2_Y: '',
        limite_min: '',
        limite_max: '',
    });
    const [produtos, setProdutos] = useState([]);
    const [elementos, setElementos] = useState([]);
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
            .then(response => setElementos(response.data))
            .catch(error => console.error("Erro ao buscar elementos:", error));

        if (id) {
            setIsEditMode(true);
            axios.get(`${API_URL}${id}/`)
                .then(response => {
                    setConfiguracao({
                        ...response.data,
                        diluicao1_X: response.data.diluicao1_X || '',
                        diluicao1_Y: response.data.diluicao1_Y || '',
                        diluicao2_X: response.data.diluicao2_X || '',
                        diluicao2_Y: response.data.diluicao2_Y || '',
                        limite_min: response.data.limite_min || '',
                        limite_max: response.data.limite_max || '',
                    });
                })
                .catch(error => console.error("Erro ao buscar configuração de análise:", error));
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfiguracao(prevConfig => ({
            ...prevConfig,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const dataToSubmit = {
            ...configuracao,
            diluicao1_X: configuracao.diluicao1_X === '' ? null : Number(configuracao.diluicao1_X),
            diluicao1_Y: configuracao.diluicao1_Y === '' ? null : Number(configuracao.diluicao1_Y),
            diluicao2_X: configuracao.diluicao2_X === '' ? null : Number(configuracao.diluicao2_X),
            diluicao2_Y: configuracao.diluicao2_Y === '' ? null : Number(configuracao.diluicao2_Y),
            limite_min: configuracao.limite_min === '' ? null : Number(configuracao.limite_min),
            limite_max: configuracao.limite_max === '' ? null : Number(configuracao.limite_max),
        };

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
                            <label htmlFor="elemento_quimico" className="form-label">Elemento Químico</label>
                            <select
                                className="form-control"
                                id="elemento_quimico"
                                name="elemento_quimico"
                                value={configuracao.elemento_quimico}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Selecione um Elemento</option>
                                {elementos.map(elemento => (
                                    <option key={elemento.id} value={elemento.id}>{elemento.nome} ({elemento.simbolo})</option>
                                ))}
                            </select>
                        </div>

                        {/* Campos de Diluição - Rótulos alterados */}
                        <h4 className="mt-4 mb-3">Diluição 1</h4>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="diluicao1_X" className="form-label">Volume Inicial (mL)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    id="diluicao1_X"
                                    name="diluicao1_X"
                                    value={configuracao.diluicao1_X}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="diluicao1_Y" className="form-label">Volume Final (mL)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    id="diluicao1_Y"
                                    name="diluicao1_Y"
                                    value={configuracao.diluicao1_Y}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <h4 className="mt-4 mb-3">Diluição 2 (Opcional)</h4>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="diluicao2_X" className="form-label">Volume Inicial (mL)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    id="diluicao2_X"
                                    name="diluicao2_X"
                                    value={configuracao.diluicao2_X}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="diluicao2_Y" className="form-label">Volume Final (mL)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    id="diluicao2_Y"
                                    name="diluicao2_Y"
                                    value={configuracao.diluicao2_Y}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Limites */}
                        <h4 className="mt-4 mb-3">Limites de Tolerância (Opcional)</h4>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="limite_min" className="form-label">Limite Mínimo</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    className="form-control"
                                    id="limite_min"
                                    name="limite_min"
                                    value={configuracao.limite_min}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="limite_max" className="form-label">Limite Máximo</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    className="form-control"
                                    id="limite_max"
                                    name="limite_max"
                                    value={configuracao.limite_max}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

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