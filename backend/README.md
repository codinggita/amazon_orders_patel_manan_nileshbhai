# Amazon Orders — Backend API

Production-oriented Express + MongoDB API for the **Amazon Orders** full stack project.

> Full project guide (backend + frontend checklist + deadlines): see [`../README.md`](../README.md)

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

## Quick start

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
npm run dev
```

Server: `http://localhost:5000`  
API base: `http://localhost:5000/api/v1`

## Scripts

| Script        | Description                          |
|---------------|--------------------------------------|
| `npm run dev` | Start with nodemon (auto-reload)     |
| `npm start`   | Start production-style (no reload) |
| `npm run start:prod` | Same as `npm start` (set `NODE_ENV=production` in `.env`) |

## API routes (initialization)

| Method | Path              | Description        |
|--------|-------------------|--------------------|
| GET    | `/api/v1`         | API metadata       |
| GET    | `/api/v1/health`  | Health + DB status |

## Project structure

```
src/
├── config/       # env + database
├── controllers/  # route handlers
├── middlewares/  # cross-cutting concerns
├── models/       # Mongoose schemas
├── routes/       # Express routers
├── services/     # business logic
├── validations/  # request validation
├── utils/        # shared helpers
├── seed/         # database seeding
├── app.js        # Express app (no listen)
└── server.js     # DB connect + HTTP server
```

## Environment variables

See `.env.example` for all supported variables.
