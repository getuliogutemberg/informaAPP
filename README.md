# Plataforma - Backend e Frontend

Este projeto contém o **backend** e o **frontend** de uma plataforma com diversas funcionalidades, incluindo autenticação, gerenciamento de usuários, rotas dinâmicas, integração com Power BI e comunicação em tempo real via **Socket.IO**.


![Platform Architecture](platform-architecture.svg)

## Backend

**Tecnologias Utilizadas**:
* **Node.js**, **Express**, **MongoDB**
* **Socket.IO** para comunicação em tempo real
* **JWT** para autenticação
* **MSAL Node** para integração com Power BI
* **Bcrypt.js** para criptografia de senhas

**Instalação**:
1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
cd <diretorio_do_projeto>
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env`:
```plaintext
MONGO_URI=mongodb://<usuário>:<senha>@localhost:27017/<nome_do_banco>
JWT_SECRET=<seu_segredo_para_token>
JWT_REFRESH_SECRET=<seu_segredo_para_refresh_token>
POWER_BI_CLIENT_ID=<client_id>
POWER_BI_CLIENT_SECRET=<client_secret>
POWER_BI_WORKSPACE_ID=<workspace_id>
```

4. Execute o servidor:
```bash
npm start
```

**Principais Endpoints**:
* **POST /register**: Registrar um novo usuário
* **POST /login**: Login de usuário
* **POST /refresh**: Renovar o token
* **GET /me**: Informações do usuário autenticado
* **GET /admin**: Endpoint para administradores
* **GET /getPBIToken/:pageId**: Token para relatórios Power BI
* **GET /users**: Listar usuários
* **GET /routes**: Listar rotas

## Frontend

**Tecnologias Utilizadas**:
* **React**, **TypeScript**, **Vite**
* **Socket.IO** para comunicação em tempo real
* **Material UI**, **Framer Motion** para UI e animações
* **Axios** para requisições HTTP
* **Leaflet**, **Mapbox** para visualizações de mapas

**Instalação**:
1. Clone o repositório:
```bash
git clone https://seu-repositorio.git
cd nome-do-repositorio
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o ambiente de desenvolvimento:
```bash
npm run dev
```

**Rotas principais**:
* `/login`: Página de login
* `/registro`: Página de registro
* `/admin`: Página de administração
* `/perfil`: Perfil do usuário
* `/opções`: Configurações da plataforma

**Proteção de Rotas**:
* O componente **ProtectedRoute** garante que rotas restritas (como `/admin`) sejam acessíveis apenas por usuários com a permissão adequada (ADMIN ou BOSS).

**Configurações**:
* As configurações da plataforma são dinamicamente obtidas do backend e incluem opções como habilitar registro de usuários e definir o tema visual.

## Estrutura de Diretórios

**Backend**:
```bash
├── src/
│   ├── controllers  # Controladores das rotas
│   ├── models       # Modelos de dados
│   ├── routes       # Definições das rotas
│   ├── middleware   # Middlewares
│   └── utils        # Funções auxiliares
├── .env             # Variáveis de ambiente
├── package.json     # Dependências e scripts
└── README.md        # Este arquivo
```

**Frontend**:
```bash
/src
  /components  # Componentes reutilizáveis
  /pages       # Páginas da aplicação
  /services    # Comunicação com a API
  /utils       # Funções utilitárias
  App.tsx      # Componente principal
  index.tsx    # Ponto de entrada
```

## Como Contribuir

1. Faça o **fork** do projeto.
2. Crie uma branch com a sua feature:
```bash
git checkout -b minha-feature
```

3. Faça as alterações e commit:
```bash
git commit -am 'Adiciona nova feature'
```

4. Envie para o seu fork:
```bash
git push origin minha-feature
```

5. Abra um **pull request**.

## Licença

Este projeto está sob a licença **MIT**. Veja o arquivo LICENSE para mais informações.
