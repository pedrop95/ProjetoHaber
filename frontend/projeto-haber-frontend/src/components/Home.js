// PROJETOHABER/frontend/src/components/Home.js

import React from 'react';

function Home() {
  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h2>Bem-vindo ao Sistema de Gerenciamento de Análises de Laboratório</h2>
        </div>
        <div className="card-body">
          <p className="lead">Este sistema foi desenvolvido para auxiliar no controle e registro de análises laboratoriais da Brasil Química.</p>
          <p>Utilize a barra de navegação acima para acessar as diferentes seções do sistema:</p>
          <ul>
            <li>**Produtos:** Cadastre e gerencie as matérias-primas e produtos.</li>
            <li>**Elementos:** Gerencie os elementos químicos analisados.</li>
            <li>**Configurações de Análise:** Defina as especificações de análise para cada produto e elemento.</li>
            <li>**Registros de Análise:** Registre e consulte os resultados das análises realizadas.</li>
          </ul>
          <p>Nosso objetivo é fornecer uma ferramenta eficiente e intuitiva para otimizar seus processos de laboratório.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;