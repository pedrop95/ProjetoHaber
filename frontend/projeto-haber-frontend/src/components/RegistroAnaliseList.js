import React from 'react';
import { Link } from 'react-router-dom';

function RegistroAnaliseList() {
  return (
    <div className="container mt-4">
      <h2>Lista de Registros de Análise</h2>
      <Link to="/registros-analise/add" className="btn btn-success mb-3">Adicionar Novo Registro de Análise</Link>
      <p>Esta é a página de listagem de registros de análise. (Em desenvolvimento)</p>
      {/* Aqui virá a tabela de registros */}
    </div>
  );
}

export default RegistroAnaliseList;