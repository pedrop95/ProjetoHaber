// PROJETOHABER/frontend/projeto-haber-frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm'; // << Importe o novo componente ProductForm
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
          {/* Navegação */}
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/produtos">Produtos</Link>
              </li>
              <li>
                <Link to="/produtos/novo">Adicionar Produto</Link> {/* << Novo link */}
              </li>
              {/* Você adicionará links para outros módulos aqui futuramente */}
            </ul>
          </nav>
          <hr />
        </header>

        <main>
          {/* Definição das rotas */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<ProductList />} />
            <Route path="/produtos/novo" element={<ProductForm />} /> {/* << Nova rota */}
            {/* Adicione outras rotas aqui */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;