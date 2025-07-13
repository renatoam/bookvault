# 📝 Unified Task List

## Backend

### Setup & Architecture

- [x] Finalize linters/formatters (Biome, etc)
- [x] Ensure clear folder structure (`src/config`, `src/routes`, `src/controllers`, `src/services`, `src/middlewares`, `src/utils`)
- [x] Create `.env.example` with all required environment variables (including `DATABASE_URL`)
- [x] Refactor backend to implement an actual architectural design

### Prisma & Database

- [x] Model main entity: Book (fields: id, title, author, publishedAt, description, createdAt, updatedAt)
- [x] Create initial migration
- [x] Generate Prisma Client
- [x] Add User model to Prisma schema
- [ ] Migrations + Seed (create a test user)
- [ ] Initial seed for Books (`prisma/seed.ts`)

### Authentication

- [x] Implement JWT Auth flow (signup, login)
- [x] Create route protection middleware
- [x] Protect Book routes (only authenticated users can create/delete)
- [x] Implement refresh token with httpOnly cookie
- [x] Implement logout (delete refresh token, clear cookie)
- [ ] Implement rate limiting (e.g., Express Rate Limit)
- [x] Implement `/me` endpoint for user info

### Book CRUD (REST)

- [x] GET /books → List books
- [x] GET /books/:id → Book details
- [x] POST /books → Create book
- [x] PUT /books/:id → Update book
- [x] DELETE /books/:id → Delete book

### Search & Autocomplete

- [ ] Implement autocomplete endpoint for book search
- [ ] Cache autocomplete results with Redis
- [ ] Cache book search results with Redis

### Async & Messaging

- [ ] Integrate RabbitMQ for async tasks (e.g., email sending)
- [ ] Move email sending to queue/worker

### Testing & Documentation

- [ ] Unit tests (Vitest)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Health checks and basic metrics

---

## Frontend

### [FE] Setup & Architecture

- [x] Tailwind CSS + DaisyUI working
- [x] Service layer for API communication (fetch/axios wrappers)
- [x] Configure React Query (TanStack)
- [ ] Refactor frontend to use feature-based (vertical slice) structure
- [ ] Memoize and use lazy loading for components/pages

### Pages & Routing

- [x] /login → Login form
- [x] /books → Book list
- [x] /books/new → Create book form
- [x] /books/:id → Book details (+ delete/edit buttons)
- [x] /books/:id/edit → Edit book form (reuse create form)
- [ ] Implement protected routes (PrivateRoot) for authenticated pages

### State & Data Fetching

- [x] Auth hook (Context API or Zustand)
- [x] Fetch book list
- [x] Fetch book details
- [x] Create book
- [x] Edit book
- [x] Delete book
- [ ] Login / Signup mutations

### UI & UX

- [x] Forms with validation (Zod + React Hook Form)
- [x] Success/error toasts (DaisyUI Toast or Sonner)
- [ ] Loading states (Skeletons/Spinners)
- [ ] Error boundaries or error messages
- [ ] Optimistic UI for create/edit/delete
- [ ] Autocomplete in book search

### [FE] Testing & Documentation

- [ ] Component tests (React Testing Library)
- [ ] Quick API/setup documentation in README

---

## DevOps & Observability

- [ ] Add initial CI/CD (lint, test, deploy)
- [ ] Add logging (Winston/Pino)
- [ ] Add error monitoring (Sentry)
- [ ] Add feature flags (if needed)
- [ ] Add i18n (if needed)
- [ ] Add accessibility improvements (a11y)
