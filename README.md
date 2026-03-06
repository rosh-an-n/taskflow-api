# TaskFlow API

REST API with JWT auth + React frontend for task management.

## Tech Stack

- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Auth:** JWT + bcrypt
- **Frontend:** React (Vite), Axios
- **Docs:** Swagger (auto-generated)

## Getting Started

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Set up environment

```bash
cd backend
cp .env.example .env
# Edit .env with your database URL
```

### 3. Run database migration

```bash
cd backend
npx prisma migrate dev --name init
```

### 4. Start servers

```bash
# Backend (http://localhost:5000)
cd backend && npm run dev

# Frontend (http://localhost:5173)
cd frontend && npm run dev
```

## API Endpoints

### Auth

| Method | Endpoint               | Description      |
|--------|------------------------|------------------|
| POST   | `/api/v1/auth/register`| Register user    |
| POST   | `/api/v1/auth/login`   | Login, get JWT   |

### Tasks (auth required)

| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| POST   | `/api/v1/tasks`     | Create task              |
| GET    | `/api/v1/tasks`     | List tasks               |
| GET    | `/api/v1/tasks/:id` | Get task                 |
| PUT    | `/api/v1/tasks/:id` | Update task              |
| DELETE | `/api/v1/tasks/:id` | Delete task (admin only) |

## Swagger

API docs available at: `http://localhost:5000/api-docs`

## Environment Variables

| Variable         | Description                |
|------------------|----------------------------|
| `DATABASE_URL`   | PostgreSQL connection URL  |
| `JWT_SECRET`     | JWT signing key            |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d) |
| `PORT`           | Server port (default: 5000)|
