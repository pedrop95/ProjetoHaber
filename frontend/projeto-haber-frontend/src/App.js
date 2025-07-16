import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProdutoMatPrimaList from './components/ProdutoMatPrimaList';
import ProdutoMatPrimaForm from './components/ProdutoMatPrimaForm';
import ElementoQuimicoList from './components/ElementoQuimicoList';
import ElementoQuimicoForm from './components/ElementoQuimicoForm';
import ConfiguracaoAnaliseList from './components/ConfiguracaoAnaliseList';
import ConfiguracaoAnaliseForm from './components/ConfiguracaoAnaliseForm';
import RegistroAnaliseList from './components/RegistroAnaliseList';
import RegistroAnaliseForm from './components/RegistroAnaliseForm';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Rotas para Produtos */}
          <Route path="/produtos" element={<ProdutoMatPrimaList />} />
          <Route path="/produtos/add" element={<ProdutoMatPrimaForm />} />
          <Route path="/produtos/edit/:id" element={<ProdutoMatPrimaForm />} />

          {/* Rotas para Elementos Químicos */}
          <Route path="/elementos" element={<ElementoQuimicoList />} />
          <Route path="/elementos/add" element={<ElementoQuimicoForm />} />
          <Route path="/elementos/edit/:id" element={<ElementoQuimicoForm />} />

          {/* Rotas para Configurações de Análise */}
          <Route path="/configuracoes-analise" element={<ConfiguracaoAnaliseList />} />
          <Route path="/configuracoes-analise/add" element={<ConfiguracaoAnaliseForm />} />
          <Route path="/configuracoes-analise/edit/:id" element={<ConfiguracaoAnaliseForm />} />

          {/* Rotas para Registros de Análise */}
          <Route path="/registros-analise" element={<RegistroAnaliseList />} />
          <Route path="/registros-analise/add" element={<RegistroAnaliseForm />} />
          <Route path="/registros-analise/edit/:id" element={<RegistroAnaliseForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;