import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Importe o axios
import logo from './logo.svg';
import './App.css';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar os produtos da API Django
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/produtos/');
        setProdutos(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchProdutos(); // Chame a função quando o componente for montado
  }, []); // O array vazio garante que o efeito só rode uma vez (ao montar)

  if (loading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro ao carregar produtos: {error.message}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Produtos/Matérias-Primas do Projeto Haber</h1>
        {produtos.length === 0 ? (
          <p>Nenhum produto encontrado. Adicione alguns via Django Admin ou API!</p>
        ) : (
          <ul>
            {produtos.map(produto => (
              <li key={produto.id}>{produto.nome} (ID: {produto.id_ou_op})</li>
            ))}
          </ul>
        )}
      </header>
    </div>
  );
}

export default App;