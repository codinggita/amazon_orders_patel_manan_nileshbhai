# Amazon Orders Dashboard — Backend API Documentation

Welcome to the comprehensive backend documentation for the **Amazon Orders E-Commerce System**. This backend is built to replicate the scale and functionality of an enterprise-level e-commerce application. It is engineered with **Node.js, Express, and MongoDB**, utilizing modern ES6+ modules, strict validation, centralized error handling, and robust security practices.

---

## 🔗 Live Links & Documentation

- **Live API Endpoint:** [https://amazon-orders.onrender.com/api/v1/orders](https://amazon-orders.onrender.com/api/v1/orders)
- **Postman Documentation:** [View Postman Collection Docs](https://documenter.getpostman.com/view/50840763/2sBXwntsU8#78bc843d-e6ac-48eb-8e5e-4c8c3265ea24)

---

## 📑 Table of Contents

1. [System Architecture & Tech Stack](#1-system-architecture--tech-stack)
2. [Project Structure Deep Dive](#2-project-structure-deep-dive)
3. [Environment Variables](#3-environment-variables)
4. [Database Models & Schemas](#4-database-models--schemas)
5. [API Routing & Endpoints Detailed Breakdown](#5-api-routing--endpoints-detailed-breakdown)
6. [Core System Features](#6-core-system-features)
   - Pagination & Sorting
   - Security & Authentication
   - Validation Pipeline
   - Error Handling
7. [Standard API Responses](#7-standard-api-responses)
8. [Scripts & Deployment](#8-scripts--deployment)

---

## 1. System Architecture & Tech Stack

This backend follows a **Model-View-Controller (MVC)** architectural pattern adapted for RESTful APIs (Model-Controller-Route).

### Core Technologies
- **Runtime:** Node.js (v18.0.0+)
- **Web Framework:** Express.js (v5.2.1)
- **Database:** MongoDB
- **ODM (Object Data Modeling):** Mongoose (v9.6.2)

### Dependencies & Their Purposes
- **`bcryptjs`**: Cryptographically secures user passwords using salting and hashing.
- **`jsonwebtoken`**: Issues stateless, cryptographically signed tokens for user sessions (JWT).
- **`express-validator`**: Provides strict schema-based payload validation at the route level.
- **`helmet`**: Automatically sets over a dozen essential HTTP security headers (e.g., XSS Protection, NoSniff).
- **`cors`**: Manages Cross-Origin Resource Sharing rules to safely accept requests from the frontend dashboard.
- **`express-rate-limit`**: Protects the API from brute-force and DDoS attacks by throttling IPs.
- **`mongoose-paginate-v2`**: Injects cursor-based and offset-based pagination directly into Mongoose queries.
- **`morgan`**: Middleware that logs HTTP requests (IP, method, URL, status) to the terminal for debugging.
- **`dotenv`**: Injects variables from the `.env` file into `process.env`.

---

## 2. Project Structure Deep Dive

The backend directory (`backend/src/`) is meticulously organized by domain concern:

```text
backend/
├── src/
│   ├── config/             # Configuration Singletons
│   │   ├── db.js           # Mongoose connection logic and retry mechanism
│   │   └── env.js          # Centralized parsing of process.env variables
│   │
│   ├── controllers/        # Business Logic Handlers (The "Brain")
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── order.controller.js
│   │   └── ... (analytics, bulk, filter, search, shipping, stats, etc.)
│   │
│   ├── middlewares/        # Express Request Interceptors
│   │   ├── admin.middleware.js # RBAC: Rejects non-admin users
│   │   ├── auth.middleware.js  # JWT validation and Session checking
│   │   └── error.middleware.js # Global catch block for untrapped errors
│   │
│   ├── models/             # Mongoose Schemas & Database Entities
│   │   ├── Order.js        # E-commerce orders with indexing
│   │   ├── Session.js      # Tracks active JWTs for remote logout
│   │   └── User.js         # Customers and Admins
│   │
│   ├── routes/             # Endpoint Definitions
│   │   ├── auth.routes.js
│   │   ├── order.routes.js
│   │   └── ... (12 modular routers in total)
│   │
│   ├── services/           # Reusable Logic (Decoupled from HTTP req/res)
│   │   ├── analytics.service.js
│   │   └── shipping.service.js
│   │
│   ├── utils/              # Helper Classes
│   │   ├── ApiError.js     # Standardized error throwing class
│   │   ├── ApiResponse.js  # Standardized success JSON formatter
│   │   ├── asyncHandler.js # Wraps async controllers to pass errors to Express
│   │   └── pagination.js   # Custom pagination logic
│   │
│   ├── validations/        # Express-Validator Schemas
│   │   └── (Corresponding files for auth, order, admin, filter payload validation)
│   │
│   ├── app.js              # Express application factory (Mounts middleware & routes)
│   └── server.js           # The Entry Point (Boots DB, starts port listener)
│
├── .env.example            # Boilerplate environment keys
├── package.json            # Node module manifest
└── README.md               # You are here
```

---

## 3. Environment Variables

To run this backend securely, you need a `.env` file at the root of the `backend/` directory.

| Variable | Type | Default / Example | Purpose |
|----------|------|-------------------|---------|
| `PORT` | Number | `5000` | The port the Express server binds to. |
| `NODE_ENV` | String | `development` | Triggers verbose logging locally or strict behaviors in `production`. |
| `MONGODB_URI` | URI | `mongodb://localhost:27017/amazon` | Connection string for MongoDB Atlas or local DB. |
| `JWT_SECRET` | String | (Random string) | Cryptographic key used to sign Auth tokens. DO NOT EXPOSE. |
| `JWT_EXPIRE` | String | `7d` | Lifespan of an authentication token. |
| `CORS_ORIGIN` | String | `*` | Allowed origins (e.g., `http://localhost:5173` for Vite frontend). |

---

## 4. Database Models & Schemas

The system relies on three highly normalized MongoDB collections:

### A. User (`User.js`)
Handles identity for both Admins and Standard Users.
- **Fields:** `name`, `email` (indexed, unique), `password` (hashed).
- **Security:** Pre-save hooks automatically hash passwords using `bcrypt` before writing to the database. Includes methods like `isPasswordCorrect()`.
- **Status tracking:** `isEmailVerified`, `otp` (for resets), `isBanned`, `role` (`user` vs `admin`).

### B. Order (`Order.js`)
The heaviest, most robust model simulating Amazon's supply chain tracking.
- **Indexing:** Heavily indexed by `CustomerID`, `OrderDate`, `ProductID`, and `OrderStatus` to ensure rapid dashboard loading times.
- **Data Types:** Uses `mongoose.Decimal128` for financial fields (`UnitPrice`, `Discount`, `Tax`, `TotalAmount`) to prevent floating-point calculation errors.
- **Audit Logging:** Includes a `statusHistory` array. Every time an order status changes (e.g., "Pending" -> "Shipped"), a pre-save hook records the timestamp and reason.

### C. Session (`Session.js`)
Tracks active logins to allow users to remotely log out of other devices.
- **Fields:** `userId`, `token`, `userAgent` (Browser info), `ipAddress`, `expiresAt`.

---

## 5. API Routing & Endpoints Detailed Breakdown

All API routes are prefixed globally with `/api/v1` in `app.js`. The routing is split logically by domain to prevent monolithic file structures.

### 🔐 Authentication (`/api/v1/auth`)
- `POST /register`: Creates a new user, hashes password.
- `POST /login`: Issues a JWT and creates a `Session` document.
- `POST /logout`: Destroys the active session.
- `GET /profile`: Retrieves the logged-in user's data (requires JWT).
- `POST /send-otp` / `POST /verify-otp`: Password reset flow.

### 📦 Orders CRUD (`/api/v1/orders`)
- `POST /`: Submit a new order.
- `GET /`: Retrieve orders with query-based pagination (`?page=1&limit=10`).
- `GET /:orderId`: Retrieve a single order.
- `PATCH /:orderId/status`: Update order status (automatically logs history).
- `GET /paged` & `/infinite`: Specialized variants for frontend virtualized tables and infinite scroll.

### 🔍 Search & Filters (`/api/v1/orders/search` & `/api/v1/orders/filter`)
*(Mounted before regular orders to prevent `:orderId` path collisions)*
- **Search:** Dedicated paths for searching by `customer`, `product`, `location`, or even `autocomplete` and `fuzzy` search strings.
- **Filter:** Isolate orders by `status` (Delivered, Pending), `payment` type, `price` range, or `date` constraints.

### 📊 Analytics & Stats (`/api/v1/analytics` & `/api/v1/stats`)
Real-time dashboard data powered by MongoDB Aggregation Pipelines (highly performant).
- `/revenue/total`, `/revenue/monthly`
- `/customers/top`, `/products/top-selling`
- Aggregates massive datasets without crushing Node.js memory.

### 👑 Admin Management (`/api/v1/admin`)
*(Protected by `verifyJWT` AND `verifyAdmin` middlewares)*
- `/users`: View all users.
- `/users/:id/ban`: Instantly block a user from logging in.
- `/users/:id/role`: Promote a user to admin.
- `/system/health`: Diagnostics for the dashboard.

### 🚚 Shipping (`/api/v1/shipping`)
Simulates third-party logistics.
- `/tracking/:orderId`: Get shipping status.
- `/create-label`: Generate simulated shipping manifest.

### 📚 Bulk Operations (`/api/v1/orders/bulk`)
Allows admin dashboard to process thousands of orders at once (e.g., bulk update status to "Shipped").

---

## 6. Core System Features

### Validation Pipeline (express-validator)
No bad data reaches the controllers or the database. Every endpoint has a schema in the `src/validations/` folder.
- If a user sends a `quantity` of `-5`, the `express-validator` middleware halts the request immediately, returning a `400 Bad Request` with an array of specific field errors.

### Security & Authentication (JWT)
1. User logs in.
2. Server validates password and generates a JWT payload `(userId, sessionId)`.
3. Server signs token with `JWT_SECRET`.
4. Frontend sends token in `Authorization: Bearer <token>` header.
5. `auth.middleware.js` verifies the signature, fetches the User, checks if they are banned, checks if the Session is still active, and binds `req.user` for the controller to use.

### Centralized Error Handling
Instead of writing `try/catch` in every single controller, we use the custom `asyncHandler` wrapper.
- If a controller throws an `ApiError(404, "Order not found")`, the `asyncHandler` catches it and forwards it to `error.middleware.js`.
- The error middleware formats it gracefully into the standardized JSON response.

---

## 7. Standard API Responses

The frontend can expect a 100% predictable JSON shape for every request, generated by the `ApiResponse` and `ApiError` utility classes.

**✅ Success Response Structure:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [...]
  },
  "pagination": {
    "totalDocs": 524,
    "limit": 10,
    "totalPages": 53,
    "page": 1,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**❌ Error Response Structure:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ],
  "data": null
}
```

---

## 8. Scripts & Deployment

### Local Development
```bash
npm install
npm run dev
```
*(Uses `nodemon` to watch for file changes and restart the server instantly).*

### Production Deployment (e.g., Render, Heroku)
```bash
npm install
npm start
```
*(Uses standard `node src/server.js` for optimal memory usage and performance).*

**Troubleshooting Render Deploys:**
If the server crashes immediately (`Exited with status 1`), it is almost exclusively a Database Connection issue:
1. Ensure your MongoDB Atlas Cluster **Network Access** allows `0.0.0.0/0` (Render IPs change dynamically).
2. Ensure you have manually configured `MONGODB_URI` and `JWT_SECRET` in your hosting provider's Environment Variables settings.

---
*End of Documentation. Developed for the Amazon Orders Full Stack Dashboard Project.*
