# Spacetime

Spacetime é uma aplicação para registrar e revisitar memórias. A pessoa entra
com uma conta do GitHub, escreve relatos, envia fotos ou vídeos e pode marcar
cada memória como pública. O frontend em Next.js apresenta as memórias e o
backend em Fastify fornece a API, autentica usuários e salva os dados em SQLite
usando Prisma.

## Tecnologias

- **Frontend:** Next.js 14, React 18, TypeScript e Tailwind CSS.
- **Backend:** Fastify, TypeScript e Prisma.
- **Banco local:** SQLite.
- **Login:** OAuth do GitHub.
- **Mídia:** arquivos enviados são armazenados em `server/uploads/`.

## Pre-requisitos

- Node.js e npm.
- Uma GitHub OAuth App para habilitar o login.

## Configurar o OAuth do GitHub

Crie uma OAuth App nas configurações de desenvolvedor do GitHub. Para rodar
localmente, configure a **Authorization callback URL** como:

```text
http://localhost:3000/api/auth/callback
```

Copie o Client ID para os dois arquivos de ambiente; o Client Secret deve ficar
somente no backend. Os valores nos arquivos `.env.example` são fictícios e não
autenticam. Substitua-os pelos valores da sua OAuth App.

## Configurar e executar o backend

Em um terminal, a partir da raiz do repositório:

```bash
cd server
npm install
cp .env.example .env
```

Edite `server/.env` e informe suas credenciais reais:

```dotenv
GITHUB_CLIENT_ID=seu-client-id
GITHUB_CLIENT_SECRET=seu-client-secret
DATABASE_URL="file:./dev.db"
```

O schema Prisma está em `server/prisma/schema.prisma` e usa SQLite. Com
`DATABASE_URL="file:./dev.db"`, o banco fica em `server/prisma/dev.db`.
Crie ou atualize o banco aplicando as migrations existentes e gere o Prisma
Client:

```bash
npx prisma migrate dev
npx prisma generate
```

O comando `migrate dev` cria o arquivo SQLite se ele ainda não existir e aplica
as migrations pendentes. Para criar uma migration depois de alterar o schema:

```bash
npx prisma migrate dev --name descricao-da-mudanca
```

Para inspecionar o banco local:

```bash
npx prisma studio
```

Inicie a API:

```bash
npm run dev
```

O backend escuta na porta `3333`.

### Usar outro arquivo SQLite ou banco existente

Para usar outro arquivo SQLite, altere `DATABASE_URL` no `server/.env`. O caminho
relativo `file:./outro-arquivo.db` é relativo ao diretório do schema
(`server/prisma/`). Se recebeu um banco existente, aponte a URL para esse arquivo
e confira o estado das migrations antes de aplicar novas:

```bash
npx prisma migrate status
```

O projeto está configurado para SQLite. Usar outro tipo de banco exige alterar o
datasource do Prisma e preparar a configuração e as migrations correspondentes; não
basta trocar a URL.

## Configurar e executar o frontend

Em outro terminal, a partir da raiz:

```bash
cd front-end
npm install
cp .env.example .env
```

Edite `front-end/.env` e coloque o Client ID da mesma GitHub OAuth App:

```dotenv
NEXT_PUBLIC_GITHUB_CLIENT_ID=seu-client-id
```

O frontend chama a API em `http://localhost:3333` (configurado em
`front-end/src/lib/api.ts`). Rode o site:

```bash
npm run dev
```

Abra `http://localhost:3000`. Para evitar URLs de upload com endereços diferentes
entre a imagem e a configuração do Next.js, use `localhost` tanto no frontend
quanto nas requisições locais. Se mudar host ou porta, ajuste a configuração da
API e as permissões de imagens em `front-end/next.config.js`.

## Fluxo principal

1. O usuário inicia o login pelo GitHub.
2. O GitHub retorna para `/api/auth/callback` no frontend, que envia o código
   OAuth para `POST /register` no backend.
3. O backend valida o código com o GitHub, cria ou encontra o usuário e devolve
   um token.
4. O frontend grava o token em cookie e usa-o nas chamadas autenticadas.
5. Uploads são enviados para `POST /upload`; as memórias são criadas e lidas
   pelas rotas `/memories`.

## Rotas principais da API

- `POST /register` — troca o código OAuth por um token da aplicação.
- `POST /upload` — recebe um arquivo de imagem ou video.
- `GET /memories` — lista as memórias do usuário autenticado.
- `POST /memories` — cria uma memória.
- `GET /memories/:id` — consulta uma memória.
- `PUT /memories/:id` — atualiza uma memória.
- `DELETE /memories/:id` — remove uma memória.

## Estrutura do repositório

```text
front-end/
  src/app/                 Páginas e rota de callback do Next.js
  src/components/          Componentes da interface
  src/lib/                 Cliente HTTP e leitura do usuário autenticado
  next.config.js           Configuração do Next.js e domínios de imagem
server/
  prisma/schema.prisma     Modelos User e Memory
  prisma/migrations/       Historico versionado de migrations
  src/routes/              Rotas de autenticação, memórias e uploads
  src/server.ts            Inicializacao do Fastify
  uploads/                 Arquivos enviados localmente
```

## Dados locais e segurança

O banco SQLite (`server/prisma/*.db`), os uploads e os arquivos `.env` são dados
locais e não devem ser enviados ao Git. As migrations, por outro lado, devem ser
versionadas. Os arquivos `.env.example` contêm apenas placeholders fictícios:
copie-os para `.env` e nunca coloque credenciais reais nos exemplos ou no
repositório.

O segredo JWT está atualmente definido no código do backend. Antes de publicar
o projeto em produção, substitua essa configuração por um segredo forte vindo do
ambiente e revise as configurações de OAuth, cookies e URLs públicas.
