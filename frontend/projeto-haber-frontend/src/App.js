// PROJETOHABER/frontend/projeto-haber-frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import ElementoQuimicoList from './pages/ElementoQuimicoList';
import ElementoQuimicoForm from './pages/ElementoQuimicoForm';
import ConfiguracaoAnaliseList from './pages/ConfiguracaoAnaliseList';
import ConfiguracaoAnaliseForm from './pages/ConfiguracaoAnaliseForm';
import RegistroAnaliseList from './pages/RegistroAnaliseList'; // << NOVO IMPORT
// import RegistroAnaliseForm from './pages/RegistroAnaliseForm'; // Será criado no próximo passo
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
              <li>
                <Link to="/configuracoes-analise">Configurações de Análise</Link>
              </li>
              <li>
                <Link to="/configuracoes-analise/novo">Adicionar Configuração</Link>
              </li>
              {/* << NOVOS LINKS PARA REGISTROS DE ANÁLISE >> */}
              <li>
                <Link to="/registros-analise">Registros de Análise</Link>
              </li>
              <li>
                <Link to="/registros-analise/novo">Adicionar Registro</Link>
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
            <Route path="/configuracoes-analise" element={<ConfiguracaoAnaliseList />} />
            <Route path="/configuracoes-analise/novo" element={<ConfiguracaoAnaliseForm />} />
            <Route path="/configuracoes-analise/:id/editar" element={<ConfiguracaoAnaliseForm />} />
            {/* << NOVAS ROTAS PARA REGISTROS DE ANÁLISE >> */}
            <Route path="/registros-analise" element={<RegistroAnaliseList />} />
            {/* A rota de formulário será adicionada no próximo passo */}
            {/* <Route path="/registros-analise/novo" element={<RegistroAnaliseForm />} /> */}
            {/* <Route path="/registros-analise/:id/editar" element={<RegistroAnaliseForm />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;