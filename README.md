# Payment Gateway Simulation

A comprehensive full-stack payment gateway simulation inspired by platforms like **Razorpay** and **Stripe**. This project demonstrates a microservices architecture orchestrated via Docker, featuring a Node.js backend, a React Merchant Dashboard, and a Hosted Checkout Page.

---

## 📂 Project Structure

```text
payment-gateway/
├── backend/                 # Node.js/Express API Service
│   ├── src/
│   │   ├── models/          # Sequelize Models (Merchant, Order, Payment)
│   │   ├── routes/          # API Routes
│   │   └── services/        # Business Logic (Validation, Processing)
│   └── Dockerfile
├── frontend/                # React Merchant Dashboard
│   ├── src/pages/           # Dashboard, Transactions, Login
│   └── Dockerfile
├── checkout-page/           # React Hosted Checkout
│   ├── src/pages/           # Payment Forms & Status Screens
│   └── Dockerfile
├── docker-compose.yml       # Container Orchestration
└── .env.example             # Environment Configuration
```

---

## 🚀 Services Overview

The system consists of four main containerized services:

| Service       | Port   | Description                                        | Tech Stack                  |
| :------------ | :----- | :------------------------------------------------- | :-------------------------- |
| **API**       | `8000` | Core backend handling orders, payments, and auth.  | Node.js, Express, Sequelize |
| **Dashboard** | `3000` | Merchant interface for analytics and transactions. | React, Vite                 |
| **Checkout**  | `3001` | Customer-facing payment page.                      | React, Vite                 |
| **Database**  | `5432` | Persistent storage for all data.                   | PostgreSQL 15               |

---

## ✨ Key Features

| Feature                   | Description                                                                             |
| :------------------------ | :-------------------------------------------------------------------------------------- |
| **Merchant Auth**         | Secure API Key & Secret authentication logic.                                           |
| **Order Management**      | Centralized order creation and tracking.                                                |
| **Multi-Method Payments** | Support for **UPI** (VPA validation) and **Credit/Debit Cards** (Luhn Check).           |
| **Hosted Checkout**       | Secure, user-friendly checkout page with real-time polling.                             |
| **Processing Simulation** | Realistic state transitions: `created` → `processing` (5-10s delay) → `success/failed`. |
| **Merchant Dashboard**    | Real-time analytics (Success Rate, Total Volume) and transaction logs.                  |

---

## 🛠️ Setup & Installation

### Prerequisites

- Docker & Docker Compose

### Quick Start

1.  **Clone the repository** (if applicable).
2.  **Start the application**:
    ```bash
    docker-compose up -d --build
    ```
3.  **Verify Health**:
    - Backend: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🧪 Testing Guide

### 1. Test Credentials

A test merchant is automatically seeded on startup:

| Field       | Value                |
| :---------- | :------------------- |
| **Email**   | `test@example.com`   |
| **API Key** | `key_test_abc123`    |
| **Secret**  | `secret_test_xyz789` |

### 2. Run a Test Flow

1.  **Create Order** (via API):

    ```bash
    curl -X POST http://localhost:8000/api/v1/orders \
      -H "Content-Type: application/json" \
      -H "X-Api-Key: key_test_abc123" \
      -H "X-Api-Secret: secret_test_xyz789" \
      -d '{ "amount": 50000, "currency": "INR", "receipt": "readme_test" }'
    ```

2.  **Pay**:

    - Copy the `id` from the response (e.g., `order_...`).
    - Open: `http://localhost:3001/checkout?order_id=YOUR_ORDER_ID`

3.  **Verify**:
    - Check the http://localhost:3000/dashboard to see the completed transaction.
