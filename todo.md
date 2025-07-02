🟢 BACKEND - API (Node + Prisma + Express)

📌 Setup Inicial

 [x] Finalizar configuração de linters/formatters (Biome, etc)

 [] Criar arquivo .env.example com as envs necessárias (incluindo DB_URL)

 [x] Garantir estrutura clara de pastas: src/config, src/routes, src/controllers, src/services, src/middlewares, src/utils

📌 Prisma + DB
 [x] Modelar entidade principal: Book

[x] Campos: id, title, author, publishedAt, description, createdAt, updatedAt

 [x] Criar migration (npx prisma migrate dev --name init)

 [x] Gerar Prisma Client (npx prisma generate)

📌 Middlewares
 [x] Criar middleware de Error Handling global

 [x] Criar middleware para validar payloads (ex: com Zod)

📌 CRUD de Books (Rotas REST)
 [x] GET /books → Listar livros

 [x] GET /books/:id → Detalhe de um livro

 [x] POST /books → Criar livro

 [x] PUT /books/:id → Atualizar livro

 [x] DELETE /books/:id → Remover livro

📌 Auth (Story 2 do desafio)
 [] Criar User no Prisma Schema

 [] Migrations + Seed (criar um user de teste)

 [] Criar JWT Auth flow (signup, login)

 [] Criar middleware de proteção de rotas

 [] Proteger rotas de Book (ex.: apenas usuários autenticados podem criar ou deletar livros)

📌 Extra (Opcional, se tiver tempo)
 [] Rate limiting (ex.: Express Rate Limit)

 [] Unit tests (Vitest)

 [] Swagger ou outro esquema de API docs

 [] Seed inicial de Books (prisma/seed.ts)

🟢 FRONTEND - React + Vite + Tailwind + DaisyUI
📌 Setup Inicial
 [x] Garantir Tailwind + DaisyUI funcionando

 [x] Criar Service Layer para comunicação com a API (ex: axios ou fetch wrappers)

 [x] Configurar React Query (com QueryClient)

📌 Pages / Routes
 [] /login → Form de login

 [x] /books → Listagem de livros

 [x] /books/new → Formulário de criação

 [x] /books/:id → Detalhe + botão de delete ou edit

 [x] /books/:id/edit → Formulário de edição (pode reusar o mesmo do create)

📌 State & React Query
 [] Criar hook para autenticação (com Context API ou Zustand)

 Queries:

 [x] Buscar lista de books

 [x] Buscar detalhe de book

 Mutations:

 [x] Criar book

 [x] Editar book

 [x] Deletar book

 [] Login / Signup

📌 UI + UX
 [] Criar loading states com Skeleton ou Spinners

 [] Criar error boundaries ou mensagens de erro

 [x] Formulários com validação (Zod + React Hook Form ou só State manual mesmo)

 [x] Toast de sucesso / erro (DaisyUI Toast ou lib leve como Sonner)

📌 Bonus Points (Se Sobrar Tempo)
 [] Optimistic UI para criar/editar/deletar livros

 [] Testes com React Testing Library

 [] Documentação rápida de API e setup no README