// PROJETOHABER/frontend/projeto-haber-frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import ElementoQuimicoList from './pages/ElementoQuimicoList';
import ElementoQuimicoForm from './pages/ElementoQuimicoForm';
import ConfiguracaoAnaliseList from './pages/ConfiguracaoAnaliseList'; // << NOVO IMPORT
import ConfiguracaoAnaliseForm from './pages/ConfiguracaoAnaliseForm'; // << NOVO IMPORT
import './App.css';

function Home() {
  return (
    <div>
      <h2>Bem-vindo ao Projeto Haber!</h2>
      <p>Selecione uma opção no menu de navegação.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/produtos">Produtos</Link>
              </li>
              <li>
                <Link to="/produtos/novo">Adicionar Produto</Link>
              </li>
              <li>
                <Link to="/elementos">Elementos Químicos</Link>
              </li>
              <li>
                <Link to="/elementos/novo">Adicionar Elemento</Link>
              </li>
              {/* << NOVOS LINKS PARA CONFIGURAÇÕES DE ANÁLISE >> */}
              <li>
                <Link to="/configuracoes-analise">Configurações de Análise</Link>
              </li>
              <li>
                <Link to="/configuracoes-analise/novo">Adicionar Configuração</Link>
              </li>
              {/* Você adicionará links para outros módulos aqui futuramente */}
            </ul>
          </nav>
          <hr />
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<ProductList />} />
            <Route path="/produtos/novo" element={<ProductForm />} />
            <Route path="/produtos/:id/editar" element={<ProductForm />} />
            <Route path="/elementos" element={<ElementoQuimicoList />} />
            <Route path="/elementos/novo" element={<ElementoQuimicoForm />} />
            <Route path="/elementos/:id/editar" element={<ElementoQuimicoForm />} />
            {/* << NOVAS ROTAS PARA CONFIGURAÇÕES DE ANÁLISE >> */}
            <Route path="/configuracoes-analise" element={<ConfiguracaoAnaliseList />} />
            <Route path="/configuracoes-analise/novo" element={<ConfiguracaoAnaliseForm />} />
            <Route path="/configuracoes-analise/:id/editar" element={<ConfiguracaoAnaliseForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;