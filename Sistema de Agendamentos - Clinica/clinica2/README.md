# ClínicaApp — Sistema de Agendamento Médico

Aplicação web fullstack para gerenciamento de consultas médicas, desenvolvida com **Vue.js** (frontend) e **Node.js + Express + TypeScript** (backend), integrada ao **MongoDB**, **ViaCEP** e **OpenWeatherMap**.

---

## Funcionalidades

- Cadastro e login seguro de usuários (paciente e secretário)
- Agendamento de consultas com verificação de conflito de horário
- Consulta automática de endereço por CEP (ViaCEP)
- Alerta de chuva no dia da consulta (OpenWeatherMap)
- Painel administrativo para secretários gerenciarem os atendimentos

---

## Estrutura do Projeto

```
clinica/
├── backend/
│   ├── src/
│   │   ├── server.ts               # Ponto de entrada, Express + MongoDB
│   │   ├── middleware/auth.ts      # Proteção de rotas com JWT
│   │   ├── models/
│   │   │   ├── Usuario.ts          # Model de usuário
│   │   │   └── Agendamento.ts      # Model de agendamento
│   │   └── routes/
│   │       ├── auth.ts             # Registro e login
│   │       ├── agendamentos.ts     # CRUD de consultas
│   │       └── integracoes.ts      # CEP e clima
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── main.js
    │   ├── App.vue                 # Layout base e navegação
    │   ├── router/index.js         # Rotas e guards de autenticação
    │   ├── stores/auth.js          # Estado global (Pinia)
    │   ├── services/api.js         # Axios configurado
    │   └── views/
    │       ├── LoginView.vue
    │       ├── RegistroView.vue
    │       ├── AgendamentosView.vue
    │       ├── NovoAgendamentoView.vue
    │       └── PainelView.vue
    ├── index.html
    ├── vite.config.js
    └── .env.example
```

---

## Como Rodar

### Pré-requisitos

- Node.js v18+
- MongoDB local ou conta no [MongoDB Atlas](https://mongodb.com/atlas)
- Chave de API gratuita no [OpenWeatherMap](https://openweathermap.org/api)

### Backend

```bash
cd backend
npm install
cp .env.example .env   # edite com suas credenciais
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

---

## Variáveis de Ambiente (backend/.env)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/clinica_db
JWT_SECRET=sua_chave_secreta
OPENWEATHER_API_KEY=sua_chave_aqui
FRONTEND_URL=http://localhost:5173
```

---

## Endpoints da API

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/registro` | Cadastrar usuário | Não |
| POST | `/api/auth/login` | Login | Não |
| GET | `/api/agendamentos` | Listar agendamentos | JWT |
| POST | `/api/agendamentos` | Criar agendamento | JWT |
| PUT | `/api/agendamentos/:id/status` | Atualizar status | JWT |
| GET | `/api/cep/:cep` | Buscar endereço | JWT |
| GET | `/api/clima/:cidade` | Previsão do tempo | JWT |

---

## Tecnologias

**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Axios

**Frontend:** Vue.js 3, Vite, Pinia, Vue Router, Axios

**APIs externas:** ViaCEP, OpenWeatherMap
