// PROJETOHABER/frontend/projeto-haber-frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './pages/ProductList';
import ProductForm from './pages/ProductForm';
import ElementoQuimicoList from './pages/ElementoQuimicoList'; // << NOVO IMPORT
import ElementoQuimicoForm from './pages/ElementoQuimicoForm'; // << NOVO IMPORT
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
              {/* << NOVOS LINKS PARA ELEMENTOS >> */}
              <li>
                <Link to="/elementos">Elementos Químicos</Link>
              </li>
              <li>
                <Link to="/elementos/novo">Adicionar Elemento</Link>
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
            {/* << NOVAS ROTAS PARA ELEMENTOS >> */}
            <Route path="/elementos" element={<ElementoQuimicoList />} />
            <Route path="/elementos/novo" element={<ElementoQuimicoForm />} />
            <Route path="/elementos/:id/editar" element={<ElementoQuimicoForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;