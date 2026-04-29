# Sistema de Matrícula em Cursos Online

Aplicação web para matrícula em cursos online, com frontend em Vue.js e backend em Node.js + Express + TypeScript.

## Estrutura do projeto

```
matricula/
├── backend/
│   ├── server.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.js
        ├── App.vue
        └── components/
            └── FormularioMatricula.vue
```

## Funcionalidades

- Listagem de cursos disponíveis via API
- Formulário de matrícula com campos: nome completo, e-mail e curso
- Validação imediata por campo no frontend (UX antecipada)
- Validação de formato de e-mail
- Feedback visual no botão durante o envio (loading / disabled)
- Mensagens de sucesso e erro separadas e estilizadas
- Interface responsiva (funciona em desktop e mobile)
- Validação e tipagem dos dados no backend via TypeScript

## Observações

- Os dados são armazenados em memória (banco de dados simulado). As matrículas são perdidas ao reiniciar o servidor.
- O frontend e o backend devem ser iniciados separadamente.

## Como rodar o backend

1. Entrar na pasta do backend:
cd backend

2. Instalar dependências:
npm install

3. Rodar em modo desenvolvimento:
npm run dev

Ou rodar diretamente:
npm start

Servidor rodará em:
http://localhost:3000

## Como rodar o frontend

1. Entrar na pasta do frontend:
cd frontend

2. Instalar dependências:
npm install

3. Rodar em modo desenvolvimento:
npm run dev

Aplicação rodará em:
http://localhost:5173

## Rotas da API

GET /cursos
Retorna a lista de cursos disponíveis.

POST /matricula
Recebe nome, email e curso.
Retorna 201 Created em caso de sucesso.
Retorna 400 Bad Request se algum campo estiver ausente.

## Frontend

Componente principal: src/components/FormularioMatricula.vue
Ao carregar, busca os cursos disponíveis via GET /cursos.
Ao submeter, envia os dados via POST /matricula e exibe o resultado ao usuário.
