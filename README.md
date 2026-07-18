# 🛍️ Ecommerce Backend API

A production-ready Ecommerce Backend built with Node.js, Express.js and PostgreSQL following Clean Architecture.

---

## 🚀 Features

- Authentication & Authorization
- JWT Login
- Role Based Access
- Categories
- Products
- Product Images
- Cart
- Wishlist
- Orders
- Razorpay Payment Integration
- Admin Order Management
- Global Error Handling
- Zod Validation
- PostgreSQL

---

## 🛠 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- JWT
- bcrypt
- Multer
- Razorpay
- Zod

---

## 📂 Project Structure

src
│
├── config
├── constants
├── controllers
├── middlewares
├── repositories
├── routes
├── services
├── uploads
├── utils
├── validations

---

## Installation

```bash
git clone <repo-url>

cd ecommerce-backend

npm install
```

Create `.env`

```env
PORT=3000

DATABASE_URL=postgresql://postgres:password@localhost:5432/ecommerce

JWT_SECRET=your_secret

JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=

RAZORPAY_KEY_SECRET=
```

Run

```bash
npm run dev
```

---

## Modules

- Authentication
- Categories
- Products
- Product Images
- Cart
- Wishlist
- Orders
- Payments
- Admin

---

## API Endpoints

### Auth

POST /auth/register

POST /auth/login

### Categories

GET /categories

POST /categories

PUT /categories/:id

DELETE /categories/:id

### Products

GET /products

GET /products/:id

POST /products

PUT /products/:id

DELETE /products/:id

### Cart

GET /cart

POST /cart

PUT /cart/:id

DELETE /cart/:id

### Wishlist

GET /wishlist

POST /wishlist

DELETE /wishlist/:id

### Orders

POST /orders

GET /orders

GET /orders/:id

PUT /orders/:id/cancel

### Payments

POST /payments/razorpay/create-order

POST /payments/razorpay/verify

### Admin

GET /admin/orders

GET /admin/orders/:id

PUT /admin/orders/:id/status