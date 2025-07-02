# Book Vault

A fullstack book management application built for the Curotec technical assessment.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [How to Run Locally](#how-to-run-locally)
- [Environment Variables](#environment-variables)
- [Prisma Migrations & Seeding](#prisma-migrations--seeding)
- [Testing](#testing)
- [API Overview](#api-overview)
- [Authentication & Security](#authentication--security)
- [Caching & Performance](#caching--performance)
- [Async Processing](#async-processing)
- [DevOps & Observability](#devops--observability)
- [What's Missing / To Do](#whats-missing--to-do)

---

## Tech Stack

### Backend

- Node.js 20
- Express 4
- TypeScript 5
- Prisma ORM
- PostgreSQL (Supabase)
- Zod (validation)
- Redis (planned, for caching)
- RabbitMQ (planned, for async tasks)
- Vitest (unit testing)

### Frontend

- React 18
- Vite
- TypeScript
- Tailwind CSS 4 + DaisyUI
- React Query (TanStack)
- React Router
- React Hook Form + Zod
- Zustand or Context API (for auth state)

---

## Features

- JWT-based authentication (access & refresh tokens)
- Secure refresh token flow (httpOnly, Secure cookies)
- Book CRUD operations (list, detail, create, update, delete)
- User registration and login
- Protected routes (backend & frontend)
- Data persistence with PostgreSQL
- Global authentication state management on the frontend
- Data fetching and mutations with React Query
- Responsive UI with DaisyUI
- Form validation with Zod + React Hook Form
- Toast notifications for success/error
- Planned: Autocomplete and search with Redis caching
- Planned: Async email sending with RabbitMQ
- Planned: Unit and component tests

---

## Project Structure

### Backend

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── config/
│   ├── controllers/
│   ├── errors/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   └── index.ts
├── package.json
└── tsconfig.json
```

### Frontend

```
frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── main.tsx
├── public/
├── package.json
└── tailwind.config.js
```

---

## How to Run Locally

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB and JWT secrets
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory. Example:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_jwt_secret
PORT=4000
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost
EMAIL_API_KEY=your_email_provider_key
```

---

## Prisma Migrations & Seeding

Run migrations:

```bash
cd backend
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

Seed the database (if seed script is implemented):

```bash
npx ts-node prisma/seed.ts
```

---

## Testing

### Backend

```bash
cd backend
npm run test
```

### Frontend

```bash
cd frontend
npm run test
```

---

## API Overview

- `POST /auth/signup` — Register new user
- `POST /auth/signin` — Login, returns access/refresh tokens
- `POST /auth/signout` — Logout, invalidates refresh token
- `GET /auth/me` — Get current user info (protected)
- `GET /books` — List books (protected)
- `GET /books/:id` — Book details (protected)
- `POST /books` — Create book (protected)
- `PUT /books/:id` — Update book (protected)
- `DELETE /books/:id` — Delete book (protected)
- `GET /books/autocomplete?query=...` — Autocomplete suggestions (planned)

---

## Authentication & Security

- **Access Token:** Stored in localStorage or memory (frontend), sent as Bearer token.
- **Refresh Token:** Stored in httpOnly, Secure cookie, used only for refreshing access tokens.
- **Logout:** Backend deletes refresh token and clears cookie; frontend removes access token.
- **CORS:** Configured for cross-origin requests with credentials.
- **Password Reset:** Secure, expiring, single-use tokens (planned).

---

## Caching & Performance

- **Redis:** Planned for caching autocomplete and search results.
- **Memoization & Lazy Loading:** Planned for frontend components/pages.

---

## Async Processing

- **RabbitMQ:** Planned for async tasks (e.g., email sending).
- **Email Sending:** To be handled via queue/worker for reliability.

---

## DevOps & Observability

- **Linters/Formatters:** Biome, ESLint, Prettier
- **Testing:** Vitest, React Testing Library (planned)
- **CI/CD:** To be added (GitHub Actions, etc.)
- **Logging:** To be improved (Winston/Pino)
- **Error Monitoring:** To be added (Sentry)
- **API Documentation:** To be added (Swagger/OpenAPI)

---

## What's Missing / To Do

- [ ] `.env.example` with all required variables
- [ ] Backend/Frontend refactor to vertical slice + clean architecture
- [ ] Autocomplete endpoint and Redis caching
- [ ] Book search caching with Redis
- [ ] Async processing with RabbitMQ (email, etc.)
- [ ] Unit and integration tests (backend & frontend)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Health checks and metrics
- [ ] Loading states, error boundaries, optimistic UI (frontend)
- [ ] Protected routes and improved auth flow (frontend)
- [ ] CI/CD pipeline
- [ ] Logging and error monitoring
- [ ] Feature flags, i18n, accessibility improvements

---

**This project is a work in progress. Contributions and suggestions are welcome!**
