# Book Vault Project

## Fullstack App (Node.js + React + PostgreSQL) - Curotec Technical Assessment

This project is a fullstack technical challenge involving the creation of a book management application with user authentication.

---

## Tech Stack

### Backend

* Node.js 20
* Express 4
* TypeScript 5
* Prisma ORM
* PostgreSQL (via Supabase)
* Zod (validation)
* Vitest (unit testing)

### Frontend

* React 18
* Vite
* TypeScript
* Tailwind CSS 4 + DaisyUI
* React Query (TanStack)
* React Router

---

## Features

* JWT-based authentication
* Book CRUD operations
* Data persistence with PostgreSQL
* Global authentication state management on the frontend
* Data fetching and mutations with React Query
* Responsive UI with DaisyUI

---

## How to Run Locally

### Running backend

```bash
cd backend
npm install
npm run dev
```

Configure `.env` with `DATABASE_URL` and `JWT_SECRET`.

### Running frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Prisma Migrations

```bash
npm run migrate
```

---

## Running Tests

```bash
npm run test
```

---

## Example Environment Variables (.env.example)

```env
DATABASE_URL=
JWT_SECRET=
PORT=4000
```

---

## Project Structure (Backend)

```md
src/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── services/
├── utils/
└── index.ts
```
