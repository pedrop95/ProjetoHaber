// PROJETOHABER/frontend/projeto-haber-frontend/src/pages/ConfiguracaoAnaliseForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ConfiguracaoAnaliseForm() {
    const [produtoMatPrima, setProdutoMatPrima] = useState('');
    const [elementoQuimico, setElementoQuimico] = useState('');
    const [diluicao1X, setDiluicao1X] = useState('');
    const [diluicao1Y, setDiluicao1Y] = useState('');
    const [diluicao2X, setDiluicao2X] = useState('');
    const [diluicao2Y, setDiluicao2Y] = useState('');

    const [produtos, setProdutos] = useState([]); // Para popular o dropdown de produtos
    const [elementos, setElementos] = useState([]); // Para popular o dropdown de elementos

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loadingForm, setLoadingForm] = useState(true); // Carregamento inicial do form (dados dos dropdowns)
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditing = id != null;

    // Efeito para carregar produtos, elementos e, se for edição, a config existente
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingForm(true);
                // Busca produtos
                const produtosRes = await axios.get('http://127.0.0.1:8000/api/produtos/');
                setProdutos(produtosRes.data);

                // Busca elementos
                const elementosRes = await axios.get('http://127.0.0.1:8000/api/elementos/');
                setElementos(elementosRes.data);

                // Se estiver editando, busca os dados da configuração
                if (isEditing) {
                    const configRes = await axios.get(`http://127.0.0.1:8000/api/configuracoes-analise/${id}/`);
                    setProdutoMatPrima(configRes.data.produto_mat_prima);
                    setElementoQuimico(configRes.data.elemento_quimico);
                    setDiluicao1X(configRes.data.diluicao1_X);
                    setDiluicao1Y(configRes.data.diluicao1_Y);
                    setDiluicao2X(configRes.data.diluicao2_X || ''); // Use '' para evitar null na input
                    setDiluicao2Y(configRes.data.diluicao2_Y || '');
                }
                setLoadingForm(false);
            } catch (err) {
                console.error("Erro ao carregar dados para o formulário:", err);
                setError(err.response ? JSON.stringify(err.response.data) : 'Erro ao carregar dados.');
                setLoadingForm(false);
            }
        };
        fetchData();
    }, [id, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const configData = {
            produto_mat_prima: produtoMatPrima,
            elemento_quimico: elementoQuimico,
            diluicao1_X: diluicao1X,
            diluicao1_Y: diluicao1Y,
            diluicao2_X: diluicao2X === '' ? null : diluicao2X, // Envia null se estiver vazio
            diluicao2_Y: diluicao2Y === '' ? null : diluicao2Y, // Envia null se estiver vazio
        };

        try {
            if (isEditing) {
                await axios.put(`http://127.0.0.1:8000/api/configuracoes-analise/${id}/`, configData);
                console.log('Configuração atualizada com sucesso!');
                setSuccess(true);
                setTimeout(() => {
                    navigate('/configuracoes-analise');
                }, 2000);
            } else {
                await axios.post('http://127.0.0.1:8000/api/configuracoes-analise/', configData);
                console.log('Configuração criada com sucesso!');
                setSuccess(true);
                // Limpa o formulário após criação
                setProdutoMatPrima('');
                setElementoQuimico('');
                setDiluicao1X('');
                setDiluicao1Y('');
                setDiluicao2X('');
                setDiluicao2Y('');
                setTimeout(() => {
                    navigate('/configuracoes-analise');
                }, 2000);
            }
        } catch (err) {
            console.error("Erro ao salvar configuração:", err.response ? err.response.data : err.message);
            setError(err.response ? JSON.stringify(err.response.data) : 'Ocorreu um erro ao salvar a configuração.');
        }
    };

    if (loadingForm) return <div>Carregando dados para o formulário...</div>;

    return (
        <div>
            <h2>{isEditing ? 'Editar Configuração de Análise' : 'Adicionar Nova Configuração de Análise'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="produtoMatPrima">Produto/Matéria-Prima:</label>
                    <select
                        id="produtoMatPrima"
                        value={produtoMatPrima}
                        onChange={(e) => setProdutoMatPrima(e.target.value)}
                        required
                        disabled={isEditing} // Desabilita edição de Fk em edicao para evitar unique_together
                    >
                        <option value="">Selecione um Produto/Matéria-Prima</option>
                        {produtos.map(prod => (
                            <option key={prod.id} value={prod.id}>{prod.nome} ({prod.id_ou_op})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="elementoQuimico">Elemento Químico:</label>
                    <select
                        id="elementoQuimico"
                        value={elementoQuimico}
                        onChange={(e) => setElementoQuimico(e.target.value)}
                        required
                        disabled={isEditing} // Desabilita edição de Fk em edicao
                    >
                        <option value="">Selecione um Elemento Químico</option>
                        {elementos.map(elem => (
                            <option key={elem.id} value={elem.id}>{elem.nome}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <h3>Diluição 1</h3>
                    <label htmlFor="diluicao1X">X:</label>
                    <input
                        type="number"
                        step="0.0001"
                        id="diluicao1X"
                        value={diluicao1X}
                        onChange={(e) => setDiluicao1X(e.target.value)}
                        required
                    />
                    <label htmlFor="diluicao1Y" style={{ marginLeft: '10px' }}>Y:</label>
                    <input
                        type="number"
                        step="0.0001"
                        id="diluicao1Y"
                        value={diluicao1Y}
                        onChange={(e) => setDiluicao1Y(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <h3>Diluição 2 (Opcional)</h3>
                    <label htmlFor="diluicao2X">X:</label>
                    <input
                        type="number"
                        step="0.0001"
                        id="diluicao2X"
                        value={diluicao2X}
                        onChange={(e) => setDiluicao2X(e.target.value)}
                    />
                    <label htmlFor="diluicao2Y" style={{ marginLeft: '10px' }}>Y:</label>
                    <input
                        type="number"
                        step="0.0001"
                        id="diluicao2Y"
                        value={diluicao2Y}
                        onChange={(e) => setDiluicao2Y(e.target.value)}
                    />
                </div>
                <button type="submit">{isEditing ? 'Atualizar Configuração' : 'Salvar Configuração'}</button>
            </form>

            {success && <p style={{ color: 'green' }}>{isEditing ? 'Configuração atualizada com sucesso!' : 'Configuração criada com sucesso!'} Redirecionando...</p>}
            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
        </div>
    );
}

export default ConfiguracaoAnaliseForm;