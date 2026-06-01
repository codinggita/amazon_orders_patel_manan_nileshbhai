# Amazon E-Commerce Backend API

A robust, scalable, and secure backend API built for an Amazon-style order management and e-commerce system. This RESTful API handles authentication, user management, product cataloging, order processing, complex querying, and analytics.

---

## 🛠️ Tech Stack & Architecture

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js 5.2.1
- **Database:** MongoDB
- **ODM:** Mongoose 9.6.2
- **Module System:** ES Modules (ESM)

---

## 📦 Core Libraries & Dependencies

This project relies on carefully selected packages to ensure security, performance, and maintainability:

### Core Framework & Database
- **`express` (v5.2.1):** High-performance, minimalist web framework for Node.js.
- **`mongoose` (v9.6.2):** Elegant MongoDB object modeling providing schema validation and advanced querying.
- **`mongoose-paginate-v2` (v1.8.0):** Adds robust pagination capabilities directly to Mongoose models.

### Security & Authentication
- **`bcryptjs` (v3.0.3):** Optimized library for hashing and salting user passwords securely.
- **`jsonwebtoken` (v9.0.3):** Implementation of JSON Web Tokens (JWT) for stateless authentication and authorization.
- **`helmet` (v8.1.0):** Secures the Express application by setting various essential HTTP headers.
- **`cors` (v2.8.6):** Middleware to enable Cross-Origin Resource Sharing for frontend integrations.
- **`express-rate-limit` (v8.5.1):** Essential basic rate-limiting middleware to prevent brute-force attacks and DDoS.

### Data Validation & Utilities
- **`express-validator` (v7.3.2):** Powerful middleware for validating and sanitizing incoming request bodies, params, and queries.
- **`dotenv` (v17.4.2):** Zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- **`morgan` (v1.10.1):** HTTP request logger middleware for monitoring API usage and debugging.

### Development Tools
- **`nodemon` (v3.1.14):** Utility that automatically restarts the node application when file changes in the directory are detected.

---

## 🚀 Getting Started

### Prerequisites
- Node.js version 18.0.0 or higher
- MongoDB instance (Local or MongoDB Atlas)

### Installation

1. **Clone the repository and navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` file to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
   *Make sure to update `MONGODB_URI` and `JWT_SECRET` in your `.env` file.*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure

```text
backend/
├── src/
│   ├── config/         # Database and environment configurations
│   ├── controllers/    # Route handlers with business logic
│   ├── middlewares/    # Custom middlewares (auth, errors, validation)
│   ├── models/         # Mongoose schemas (User, Order, etc.)
│   ├── routes/         # Express router definitions
│   ├── services/       # Reusable service layer logic
│   ├── utils/          # Helper classes (ApiError, ApiResponse)
│   ├── validations/    # Express-validator schema rules
│   ├── app.js          # Express application setup
│   └── server.js       # Entry point, database connection, and listener
├── .env.example        # Template for environment variables
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation (this file)
```

---

## 📜 Available Scripts

- `npm run dev`: Starts the server in development mode using `nodemon` (auto-reloads on file changes).
- `npm start`: Starts the server in production mode using `node`.
- `npm run health`: Runs a quick CLI health check against the local server to verify it is running and responding.

---

## 🌐 API Domains

The API is mounted at `/api/v1` and is divided into several domains:

- **Auth:** `/api/v1/auth` - Login, registration, profile management, and password resets.
- **Orders:** `/api/v1/orders` - CRUD operations for orders, including infinite scroll and paged listings.
- **Search & Filters:** `/api/v1/orders/search`, `/api/v1/orders/filter` - Advanced search and multi-criteria filtering.
- **Analytics & Stats:** `/api/v1/analytics`, `/api/v1/stats` - Data aggregation for dashboards (revenue, top products).
- **Admin:** `/api/v1/admin` - Protected routes for global user and order management.
- **Shipping:** `/api/v1/shipping` - Shipment tracking, label generation, and address updates.

*(Refer to the Postman Collection for detailed request/response schemas.)*
