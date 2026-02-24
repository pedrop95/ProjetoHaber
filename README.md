# ProjetoHaber - Sistema de Análises Químicas

Sistema web para gerenciar análises químicas com Laravel e ReactJS.

## 📋 Pré-requisitos

- Python 3.13+
- Node.js 18.x+ (LTS recomendado)
- MySQL 8.0+

## 🚀 Instalação e Setup

### 1. Backend (Django)

#### a) Criar e ativar virtualenv
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
```

#### b) Instalar dependências
```powershell
pip install -r requirements.txt
```

#### c) Configurar banco de dados
Crie o arquivo `.env` no diretório `backend/` (use `.env.example` como referência):
```
DB_NAME=projeto_haber
DB_USER=haber_user
DB_PASSWORD=sua_senha
DB_HOST=localhost
DB_PORT=3307
```

No MySQL, execute:
```sql
CREATE DATABASE projeto_haber CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'haber_user'@'localhost' IDENTIFIED BY 'sua_senha';
GRANT ALL PRIVILEGES ON projeto_haber.* TO 'haber_user'@'localhost';
FLUSH PRIVILEGES;
```

#### d) Executar migrations
```powershell
python manage.py migrate
```

#### e) Criar superuser (admin)
```powershell
python manage.py createsuperuser
```

#### f) Popular elementos químicos (opcional)
```powershell
python atualiza_simbolos.py
```

#### g) Rodar servidor de desenvolvimento
```powershell
python manage.py runserver
```
Backend estará em `http://127.0.0.1:8000/`

---

### 2. Frontend (React)

#### a) Instalar dependências
```powershell
cd frontend\projeto-haber-frontend
npm install
```

#### b) Rodar servidor de desenvolvimento
```powershell
npm start
```
Frontend estará em `http://localhost:3000/`

(Opcional: se quiser usar porta 3001, execute: `$env:PORT=3001; npm start`)

---

## 🔄 Estrutura de Diluições e Cálculo de Concentração

### Fórmula de Concentração

**Sem Diluição 2:**
```
Concentração = Absorbância Medida / (Massa Pesada / Volume Final Diluição 1)
```

**Com Diluição 2:**
```
Concentração = Absorbância Medida / ((Massa Pesada / Volume Final Diluição 1) * (Volume Inicial Diluição 2 / Volume Final Diluição 2))
```

### Campos no DetalheAnalise (Backend)
- `absorbancia_medida`: Valor de absorbância medido
- `massa_pesada`: Massa pesada em gramas (ou unidade do padrão)
- `volume_final_diluicao_1`: Volume final da diluição 1 (mL)
- `volume_inicial_diluicao_2`: Volume inicial da diluição 2 (mL) - opcional
- `volume_final_diluicao_2`: Volume final da diluição 2 (mL) - opcional

### Uso na API
O endpoint `/api/analises/registros/` retorna um campo `concentracao_calculada` que é computado automaticamente:
```json
{
  "id": 1,
  "elemento_quimico": 1,
  "absorbancia_medida": 0.5,
  "massa_pesada": 2.0,
  "volume_final_diluicao_1": 50,
  "volume_inicial_diluicao_2": null,
  "volume_final_diluicao_2": null,
  "concentracao_calculada": 0.625
}
```

---

## 🎨 Menu Principal

O menu foi reorganizado em dropdowns:
- **Home**: Página inicial
- **Cadastros** (dropdown):
  - Produtos
  - Elementos Químicos
  - Configurações de Análise
- **Registros de Análise**: Análises realizadas

---

## 📁 Estrutura do Projeto

```
ProjetoHaber/
├── backend/
│   ├── projeto_haber_backend/  (settings, urls, wsgi)
│   ├── analises/               (modelos e serializers)
│   ├── api/
│   ├── produtos/
│   ├── elementos/
│   ├── configuracoes/
│   ├── manage.py
│   ├── requirements.txt
│   └── .env                    (criar via .env.example)
│
└── frontend/
    └── projeto-haber-frontend/
        ├── src/
        │   ├── components/     (componentes reutilizáveis)
        │   ├── pages/          (páginas principais)
        │   ├── App.js
        │   └── index.js
        ├── package.json
        └── public/
```

---

## 🔧 Troubleshooting

### Erro: "Access denied for user 'haber_user'"
- Verifique se o MySQL está rodando
- Confirme a senha em `.env`
- Verifique se o usuário foi criado no MySQL

### Erro: "Network Error" no frontend
- Certifique-se de que o backend (`python manage.py runserver`) está rodando
- Verifique CORS em `backend/projeto_haber_backend/settings.py`

### Erro ao instalar `mysqlclient`
- Alternativa: Já está configurado para usar `PyMySQL` automaticamente
- Se necessário, instale: `pip install cryptography`

---

## 📚 APIs Principais

- `GET /api/produtos/` - Listar produtos
- `POST /api/produtos/` - Criar produto
- `GET /api/elementos/` - Listar elementos químicos
- `GET /api/configuracoes-analise/` - Listar configurações
- `GET /api/analises/registros/` - Listar registros de análise
- `POST /api/analises/registros/` - Criar registro de análise

---

## 🛡️ Notas de Segurança

- `DEBUG` está ativado por padrão (ajuste em `.env` ou `settings.py` para produção)
- `SECRET_KEY` deve ser alterada para produção (em `settings.py` ou `.env`)
- Credenciais sensíveis devem estar em `.env` (não commitar no git)

---

## 📝 Licença

Todos os direitos reservados © 2025 ProjetoHaber
