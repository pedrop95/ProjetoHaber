// PROJETOHABER/frontend/src/components/Navbar.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation(); // Para saber qual rota está ativa

  return (
    <nav className="navbar navbar-expand-lg navbar-dark"> {/* Removido bg-dark para usar custom.css */}
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <span style={{ color: '#fff' }}>BR</span>
          <span style={{ color: 'var(--brq-blue)' }}>Q</span>{' '}
          <small style={{ fontSize: '0.8em', fontWeight: '400' }}>Brasil Química</small>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto"> {/* ms-auto para alinhar à direita */}
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname.startsWith('/produtos') ? 'active' : ''}`} to="/produtos">Produtos</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname.startsWith('/elementos') ? 'active' : ''}`} to="/elementos">Elementos</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname.startsWith('/configuracoes-analise') ? 'active' : ''}`} to="/configuracoes-analise">Configurações de Análise</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname.startsWith('/registros-analise') ? 'active' : ''}`} to="/registros-analise">Registros de Análise</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;