# 🛍️ KrivAura – Full-Stack Ecommerce Application

A full-stack Ecommerce application built with **Node.js, Express.js, PostgreSQL, React.js and Next.js**, featuring authentication, product management, cart, wishlist, orders, payments, and admin order management.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User Registration & Login
- JWT Authentication
- Role-Based Authorization
- Password Hashing
- Protected Routes

### 🛍️ Ecommerce
- Categories
- Products
- Product Images
- Cart
- Wishlist
- Orders
- Order Cancellation
- Admin Order Management

### 💳 Payments
- Cashfree hosted checkout
- Server-side payment verification and signed webhooks

### 🖥️ Frontend
- React.js
- Next.js
- Responsive Web Interface
- Authentication Flow
- Product Listing & Details
- Shopping Cart
- Wishlist
- Checkout
- Order Management
- Admin Interface

### ⚙️ Backend
- RESTful APIs
- Global Error Handling
- Request Validation using Zod
- PostgreSQL Database
- Clean Architecture
- Repository Pattern

---

## 🛠 Tech Stack

### Frontend
- React.js
- Next.js
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- PostgreSQL

### Authentication & Security
- JWT
- bcrypt

### Integrations & Services
- Cashfree Payments
- Cloudinary
- Multer

### Validation
- Zod

---

## Cashfree setup

Apply `database/schema_v1.4.sql` after the existing schema versions. Configure these backend environment variables:

```env
CASHFREE_CLIENT_ID=your_cashfree_app_id
CASHFREE_CLIENT_SECRET=your_cashfree_secret
CASHFREE_ENVIRONMENT=sandbox
FRONTEND_URL=https://krivaura.com
```

Set `CASHFREE_ENVIRONMENT=production` when switching to live Cashfree credentials. The Cashfree webhook URL is `https://api.krivaura.com/api/v1/webhooks/cashfree`; configure it in the Cashfree dashboard for payment success events. Set `CASHFREE_RETURN_URL` only if needed; it must return to `/checkout` with Cashfree's `{order_id}` placeholder in the query string.

## 📂 Project Structure

```text
KrivAura
│
├── frontend
│   ├── components
│   ├── pages
│   ├── app
│   ├── services
│   └── ...
│
├── backend
│   └── src
│       ├── config
│       ├── constants
│       ├── controllers
│       ├── middlewares
│       ├── repositories
│       ├── routes
│       ├── services
│       ├── uploads
│       ├── utils
│       └── validations
│
└── README.md
