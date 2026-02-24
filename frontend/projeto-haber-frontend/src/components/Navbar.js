// PROJETOHABER/frontend/src/components/Navbar.js

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const isDropdownActive = () => {
    return location.pathname.startsWith('/produtos') ||
           location.pathname.startsWith('/elementos') ||
           location.pathname.startsWith('/configuracoes-analise');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/">Home</Link>
            </li>

            {/* Dropdown Cadastros */}
            <li className="nav-item dropdown">
              <button
                className={`nav-link dropdown-toggle ${isDropdownActive() ? 'active' : ''}`}
                id="cadastrosDropdown"
                type="button"
                onClick={toggleDropdown}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Cadastros
              </button>
              <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} aria-labelledby="cadastrosDropdown">
                <li>
                  <Link className="dropdown-item" to="/produtos" onClick={closeDropdown}>
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/elementos" onClick={closeDropdown}>
                    Elementos Químicos
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/configuracoes-analise" onClick={closeDropdown}>
                    Configurações de Análise
                  </Link>
                </li>
              </ul>
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