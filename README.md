# Amazon Orders — Full Stack Dashboard Project

**Amazon-style order management system** with a scalable **Node.js + Express + MongoDB** backend and a **React (Vite)** admin + user dashboard frontend.

| Layer    | Stack |
|----------|--------|
| Backend  | Node.js, Express.js, MongoDB, Mongoose, JWT |
| Frontend | React (Vite), Tailwind CSS, MUI, Redux Toolkit, Axios |

---

## Project timeline (strict deadlines)

| Phase | Period | Focus |
|-------|--------|--------|
| **Backend** | First 15 days (mandatory first) | APIs, auth, CRUD, MongoDB models, Postman testing |
| **Frontend** | **29 May 2026 – 13 June 2026** (15 days) | Dashboard UI, API integration, auth flow, deployment-ready build |

> **Rule:** Frontend must **not** start until backend APIs are clear, tested in Postman, and documented. Every UI screen must use **real MongoDB data** via backend APIs — **no static/mock data** in the final project.

---

## Repository structure

```
amazon_orders_patel_manan_nileshbhai/
├── backend/          # Express API (MongoDB)
├── frontend/         # React dashboard (to be built)
└── README.md         # This file — full project guide
```

---

# Part 1 — Backend (Express + MongoDB)

## Current status

| Area | Status |
|------|--------|
| Project initialization | Done |
| Express server + middleware (helmet, cors, morgan, rate limit) | Done |
| MongoDB connection (Mongoose, async/await, graceful shutdown) | Done |
| Environment config (`dotenv`, `env.js`) | Done |
| Centralized error handling | Done |
| Health check + API base routes | Done |
| JWT auth APIs | Pending |
| CRUD APIs (users, products, orders, analytics) | Pending |
| Role-based access (admin / user / seller) | Pending |
| Seed data | Pending |

## Prerequisites

- Node.js **18+**
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

## Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI and JWT_SECRET
npm run dev
```

| URL | Purpose |
|-----|---------|
| `http://localhost:5000` | Redirects to API root |
| `http://localhost:5000/api/v1` | API metadata |
| `http://localhost:5000/api/v1/health` | Health + database status |

## NPM scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development with nodemon |
| `npm start` | Production-style start |
| `npm run health` | Quick health check (server must be running) |

## Environment variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` / `production` |
| `PORT` | Server port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `CORS_ORIGIN` | Frontend URL(s), comma-separated |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window |

See `backend/.env.example` for a template.

## Backend folder structure

```
backend/src/
├── config/         # env.js, db.js
├── controllers/    # route handlers
├── middlewares/    # auth, errors, rate limit, validation
├── models/         # User, Product, Order, Customer, Seller
├── routes/         # API routers (versioned under /api/v1)
├── services/       # business logic
├── validations/    # express-validator schemas
├── utils/          # ApiError, ApiResponse, asyncHandler, tokens
├── seed/           # database seeding
├── app.js          # Express app (middleware + routes)
└── server.js       # DB connect + HTTP server + graceful shutdown
```

## Planned API domains (Amazon Orders)

Map these to frontend screens during integration:

| Domain | Purpose | Frontend screens |
|--------|---------|------------------|
| **Auth** | Register, login, JWT, profile | Login, Register, Protected routes |
| **Users** | Admin user management | Users Management Dashboard |
| **Products** | Catalog CRUD | Product listing, create/edit modals |
| **Orders** | Amazon-style order lifecycle | Orders table, order detail, status updates |
| **Customers** | Buyer records | Customer listing / profile |
| **Sellers** | Seller records | Seller management (admin) |
| **Analytics** | Aggregation from MongoDB | Charts, stat cards, totals |

## Backend completion checklist (before frontend)

- [ ] All endpoints tested in **Postman**
- [ ] Endpoints documented (method, path, body, response)
- [ ] Auth APIs: register, login, me, logout flow
- [ ] CRUD for orders, products, users (as per scope)
- [ ] Pagination, filtering, search on list APIs
- [ ] Role-based middleware: **admin** vs **user** (and seller if applicable)
- [ ] Seed script with realistic Amazon order sample data
- [ ] CORS allows frontend origin (`http://localhost:5173` for Vite)

More detail: [`backend/README.md`](./backend/README.md)

---

# Part 2 — Frontend (React Dashboard)

## Important rules

1. Start frontend **only after** backend APIs are tested and understood.
2. Connect every screen to **real backend APIs** — data from **MongoDB**.
3. Final deliverable: **fully functional admin + user dashboard** for **Amazon Orders**.
4. No static placeholder data in the final submission.

## Frontend phase deadline

**29 May 2026 – 13 June 2026** (15 days)

Includes: dashboard UI, API integration, authentication flow, and deployment-ready build.

---

## 0. Backend integration & API mapping (mandatory first step)

- [ ] Backend APIs fully tested using **Postman** before any UI work
- [ ] All backend endpoints documented and understood
- [ ] Authentication APIs (JWT login/register) — integration plan written
- [ ] CRUD APIs mapped to frontend screens (orders, products, users, etc.)
- [ ] Pagination, filtering, search APIs mapped to table/filter components
- [ ] Role-based access flow defined (**admin** vs **user**)
- [ ] API base URL configured: `http://localhost:5000/api/v1`

**Amazon Orders mapping example:**

| UI screen | Backend API (planned) |
|-----------|-------------------------|
| Login / Register | `POST /api/v1/auth/login`, `register` |
| Admin — Orders table | `GET /api/v1/orders?page&limit&search&status` |
| Admin — Products CRUD | `/api/v1/products` |
| Admin — Users | `/api/v1/users` |
| User — My orders | `GET /api/v1/orders/me` |
| Analytics dashboard | `GET /api/v1/analytics/*` (aggregations) |
| Profile | `GET/PATCH /api/v1/auth/me` |

---

## 1. Project setup & structure

- [ ] Project created using **Vite (React)**
- [ ] **Tailwind CSS** configured
- [ ] **MUI** integrated for UI components
- [ ] **Axios** setup for backend communication
- [ ] Folder structure:

```
frontend/src/
├── components/     # reusable UI (Button, Table, Modal, Input, Cards)
├── pages/          # route-level views
├── features/       # feature modules (orders, auth, analytics)
├── hooks/          # custom hooks
├── services/       # API layer (Axios)
└── store/          # Redux Toolkit slices
```

- [ ] Feature-based architecture
- [ ] Reusable components: Button, Table, Modal, Input, Cards

**Setup commands (when starting):**

```bash
cd frontend
npm create vite@latest . -- --template react
npm install
npm install @mui/material @emotion/react @emotion/styled
npm install @reduxjs/toolkit react-redux axios react-router-dom
npm install formik yup react-helmet-async
npm install -D tailwindcss postcss autoprefixer eslint prettier
```

---

## 2. Dashboard UI system (core requirement)

- [ ] **Admin Dashboard** layout
- [ ] **User Dashboard** layout
- [ ] Sidebar navigation
- [ ] Top navbar (user info + logout)
- [ ] Responsive layout (desktop-first)

### Dashboard modules (must match backend)

| Module | Amazon Orders focus |
|--------|------------------------|
| Users management | CRUD from MongoDB `User` collection |
| Orders listing | Real order data — status, totals, dates |
| Products / catalog | Product CRUD tied to backend |
| Analytics | Aggregation APIs (order counts, revenue, etc.) |
| Profile | Logged-in user from JWT |
| Settings | Theme + preferences |

---

## 3. Routing system

- [ ] **React Router** implemented
- [ ] Public routes: login, register
- [ ] Protected routes (JWT required)
- [ ] Role-based routing (Admin vs User)
- [ ] Lazy loading for routes
- [ ] Route guards

**Suggested routes:**

| Path | Access | Page |
|------|--------|------|
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/admin/*` | Admin | Admin dashboard |
| `/dashboard/*` | User | User dashboard |
| `/orders` | Authenticated | Orders list |
| `/analytics` | Admin | Analytics |

---

## 4. State management (Redux Toolkit)

- [ ] Redux Toolkit store configured
- [ ] Slices:
  - [ ] **auth** — JWT, user, login/logout
  - [ ] **user** — backend user profile data
  - [ ] **data** — orders, products, MongoDB-driven lists
  - [ ] **ui** — loading, theme, alerts
- [ ] No duplicated global state

---

## 5. API integration layer

- [ ] Centralized Axios service (`services/api.js`)
- [ ] Request interceptor — attach JWT from `localStorage`
- [ ] Response interceptor — handle 401, 403, 5xx
- [ ] Backend error shape aligned with `ApiError` / `ApiResponse`
- [ ] Loading states per request
- [ ] Basic retry for failed requests (optional)

```javascript
// Example base config
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
```

---

## 6. Authentication system (backend linked)

- [ ] Login → backend JWT endpoint
- [ ] Register → backend register endpoint
- [ ] Token in `localStorage`
- [ ] Auto-login on refresh (validate token / call `/me`)
- [ ] Logout clears token and Redux state
- [ ] Protected dashboard routes enforced

---

## 7. CRUD dashboard system (core feature)

- [ ] **Create** — forms → POST APIs (orders, products, users as scoped)
- [ ] **Read** — tables/cards from MongoDB via GET APIs
- [ ] **Update** — edit modals → PATCH/PUT APIs
- [ ] **Delete** — confirmation modal → DELETE APIs
- [ ] UI updates immediately after successful API calls

---

## 8. Data display system (MongoDB-driven UI)

- [ ] Tables for orders, users, products
- [ ] Cards for summary / KPI views
- [ ] Pagination from backend (`page`, `limit`, `total`)
- [ ] Sorting via API query params
- [ ] Search connected to backend
- [ ] Filters (order status, date range, seller, etc.)

---

## 9. Forms & validation

- [ ] **Formik** for forms
- [ ] **Yup** validation schemas
- [ ] Dynamic forms aligned with backend schema (order items, addresses, etc.)
- [ ] Multi-step form (optional advanced)
- [ ] Clear inline error messages

---

## 10. UI / UX dashboard design

- [ ] Fully responsive dashboard
- [ ] Clean admin panel design

**Core components:** Sidebar, Navbar, Stat cards, Data tables, Modals, Forms

**UX enhancements:**

- [ ] Skeleton loaders during API calls
- [ ] Empty state (no orders / no data)
- [ ] Error state (API failure)

---

## 11. Theme system

- [ ] Light / dark mode
- [ ] Theme persisted in `localStorage`
- [ ] Tailwind + MUI theme consistency

---

## 12. Performance optimization

- [ ] Code splitting (lazy routes)
- [ ] `useMemo` for heavy computations (charts, filtered lists)
- [ ] `useCallback` for stable handlers
- [ ] Avoid unnecessary re-renders
- [ ] Advanced: virtualized tables for large order datasets
- [ ] Image optimization if file uploads exist

---

## 13. Error handling system

- [ ] Global **Error Boundary**
- [ ] API error UI (message from backend)
- [ ] Toast notifications on errors

---

## 14. Notifications system

- [ ] Toast library (e.g. MUI Snackbar, react-hot-toast)
- [ ] Success / error / warning from API responses

---

## 15. Analytics dashboard (backend aggregation)

- [ ] Charts fed by backend aggregation endpoints
- [ ] Totals: users, orders, revenue, products
- [ ] Dynamic stats from MongoDB aggregations
- [ ] Real-time or refresh-on-load visualization

**Amazon Orders metrics examples:** orders per day, revenue by status, top products, orders by region.

---

## 16. Storage system

| Storage | Use |
|---------|-----|
| `localStorage` | Auth token, theme, user session snapshot |
| `sessionStorage` | Temporary filters, multi-step form progress |

- [ ] Secure handling — never store password; minimal PII

---

## 17. SEO implementation

- [ ] Dynamic page titles per route
- [ ] Meta descriptions on major pages
- [ ] Open Graph tags
- [ ] **React Helmet** (or `react-helmet-async`)
- [ ] Sitemap for app routes
- [ ] Google Search Console verification
- [ ] Structured data ([schema.org](https://schema.org)) where applicable

---

## 18. Code quality

- [ ] ESLint configured
- [ ] Prettier configured
- [ ] Reusable, consistently named components
- [ ] Feature-based modules, no god-components

---

## 19. Frontend documentation

- [ ] `frontend/README.md` with setup steps
- [ ] Folder structure explained
- [ ] Features and env vars documented (`VITE_API_URL`)

---

# Part 3 — Integration & evaluation

## Final evaluation criteria

The project is **complete and industry-ready** only when:

| Criteria | Required |
|----------|----------|
| Responsive, clean dashboard UI | Yes |
| All backend APIs integrated | Yes |
| CRUD works with real-time UI updates | Yes |
| JWT authentication fully functional | Yes |
| Redux state structured correctly | Yes |
| Loading + error states everywhere | Yes |
| MongoDB data visible in UI (no fake data) | Yes |
| Dashboard reflects real dataset (orders, products, users) | Yes |
| Modular, scalable code | Yes |

## Development workflow

```text
1. Complete & test backend APIs (Postman)
2. Document endpoints → map to screens
3. Scaffold Vite + Tailwind + MUI + Redux
4. Build API service layer + auth flow
5. Build admin dashboard → user dashboard
6. Wire CRUD + analytics to live APIs
7. Polish UX, SEO, performance, docs
8. Production build & deploy
```

## Environment variables (full stack)

**Backend** (`backend/.env`): see Part 1.

**Frontend** (`frontend/.env` — when created):

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Amazon Orders Dashboard
```

---

## Authors

Patel Manan Nileshbhai — Full Stack Dashboard Project (2026)

## License

ISC (backend). Update as needed for the full monorepo.
