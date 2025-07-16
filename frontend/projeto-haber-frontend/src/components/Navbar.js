import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Projeto Haber</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/produtos">Produtos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/elementos">Elementos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/configuracoes-analise">Configurações de Análise</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/registros-analise">Registros de Análise</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;