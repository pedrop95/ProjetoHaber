// PROJETOHABER/frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Mantenha este se você tiver um CSS padrão do create-react-app
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css'; // Importa seu CSS personalizado
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);