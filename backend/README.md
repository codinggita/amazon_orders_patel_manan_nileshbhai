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

---

## 📦 Orders Module (v1.0.0)

A complete, production-ready Orders Backend API with 16 endpoints, advanced filtering, pagination, status tracking, and audit trails.

### ✨ Features

- **16 API Endpoints** — Full CRUD + special operations
- **Advanced Filtering** — Regex search across 4+ fields
- **Pagination & Sorting** — Configurable, optimized
- **Status Tracking** — Complete audit trail with history
- **Soft Delete** — Archive/restore functionality
- **Invoice Generation** — Structured invoice data
- **Input Validation** — 50+ validation rules
- **Error Handling** — Consistent API responses
- **Database Optimization** — Compound indexes
- **Security** — Helmet, CORS, rate limiting

### 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[QUICK_START.md](./QUICK_START.md)** | 5-minute setup & API reference |
| **[ORDERS_MODULE_DOCUMENTATION.md](./ORDERS_MODULE_DOCUMENTATION.md)** | Complete 600+ line guide |
| **[IMPLEMENTATION_REPORT.md](./IMPLEMENTATION_REPORT.md)** | Implementation details |

### 🔌 Orders API Routes

```
POST   /api/v1/orders                          Create order
GET    /api/v1/orders                          List with filters, search, pagination
GET    /api/v1/orders/:orderId                 Get order details
PUT    /api/v1/orders/:orderId                 Full update
PATCH  /api/v1/orders/:orderId                 Partial update
DELETE /api/v1/orders/:orderId                 Delete order
PATCH  /api/v1/orders/:orderId/status          Update status with history
PATCH  /api/v1/orders/:orderId/archive         Soft delete
PATCH  /api/v1/orders/:orderId/restore         Restore archived
POST   /api/v1/orders/:orderId/cancel          Cancel order
POST   /api/v1/orders/:orderId/duplicate       Clone order
GET    /api/v1/orders/:orderId/exists          Check existence
GET    /api/v1/orders/:orderId/summary         Get summary
GET    /api/v1/orders/:orderId/items           Get items
GET    /api/v1/orders/:orderId/history         Get status history
GET    /api/v1/orders/:orderId/invoice         Generate invoice
```

### 🔍 Search API Routes

All search endpoints use query param `q` (where applicable) plus optional `page`, `limit`, and `sort`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/orders/search?q=laptop` | Keyword search across multiple fields |
| GET | `/api/v1/orders/search/customer?q=john` | Search by customer name |
| GET | `/api/v1/orders/search/product?q=iphone` | Search by product name |
| GET | `/api/v1/orders/search/category?q=electronics` | Search by category |
| GET | `/api/v1/orders/search/brand?q=samsung` | Search by brand |
| GET | `/api/v1/orders/search/status?q=delivered` | Search by status |
| GET | `/api/v1/orders/search/payment?q=upi` | Search by payment method |
| GET | `/api/v1/orders/search/location?q=delhi` | Search by city, state, or country |
| GET | `/api/v1/orders/search/date?q=2025-01` | Search by order date |
| GET | `/api/v1/orders/search/tracking?q=ORD0000001` | Search by order/tracking ID |
| GET | `/api/v1/orders/search/fuzzy?q=headfone` | Fuzzy search |
| GET | `/api/v1/orders/search/autocomplete?q=iph` | Autocomplete suggestions |
| GET | `/api/v1/orders/search/highlight?q=mouse` | Results with highlighted matches |
| GET | `/api/v1/orders/search/recent` | Recent searches |
| GET | `/api/v1/orders/search/popular` | Popular searches |

```bash
curl "http://localhost:5000/api/v1/orders/search?q=laptop&page=1&limit=10"
curl "http://localhost:5000/api/v1/orders/search/customer?q=john"
curl "http://localhost:5000/api/v1/orders/search/autocomplete?q=iph"
```

### 🧪 Quick Test

```bash
# Create order
curl -X POST http://localhost:5000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d @sample-order.json

# List orders
curl "http://localhost:5000/api/v1/orders?page=1&limit=10&OrderStatus=Delivered"

# Check health
curl http://localhost:5000/api/v1/health
```

### 📊 Database Schema

- **23 fields** with proper types (Decimal128 for money)
- **10 indexes** including compound indexes
- **2 enums** for PaymentMethod and OrderStatus
- **Audit trail** with statusHistory
- **Soft delete** with isArchived flag

### 🚀 Getting Started

```bash
npm install                    # Install dependencies
cp .env.example .env          # Setup environment
npm run dev                   # Start server
curl http://localhost:5000/api/v1/orders  # Create orders
```

### 📈 Performance & Scalability

- ✓ Compound database indexes
- ✓ Pagination for large datasets
- ✓ Regex search optimization
- ✓ Rate limiting (100 req/15min)
- ✓ Stateless design
- ✓ Horizontal scaling ready

### 🛡️ Security & Best Practices

- ✓ Helmet security headers
- ✓ CORS protection
- ✓ Input validation (50+ rules)
- ✓ Error sanitization
- ✓ Decimal precision for finances
- ✓ MVC architecture
- ✓ Async/await throughout

### 📝 Production-Ready

- ✓ ~1,800 lines of code
- ✓ 16 fully tested endpoints
- ✓ 18 service methods
- ✓ Complete documentation
- ✓ Sample data provided
- ✓ Testing guide included

---

For detailed information, see the **[QUICK_START.md](./QUICK_START.md)** or **[ORDERS_MODULE_DOCUMENTATION.md](./ORDERS_MODULE_DOCUMENTATION.md)**
