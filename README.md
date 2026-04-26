# ProcurePro – B2B Industrial Procurement System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)

> A production-grade B2B procurement platform supporting the full procurement cycle — from vendor discovery and RFQ bidding to order fulfillment and finance tracking. Built with multi-role access, real-world data consistency, and scalable backend design.

🔗 **Live Demo:** *Coming Soon (deploying to AWS)*  
📂 **GitHub:** [github.com/Adi-dev118/procurepro-app](https://github.com/Adi-dev118/procurepro-app)

---

## 📸 Screenshots

### Login Page
<img width="1920" height="1080" alt="login" src="https://github.com/user-attachments/assets/c6f72d2a-7b1e-4907-a6ea-704c043e6395" />

### Admin Dashboard
<img width="1920" height="1080" alt="admin-dashboard" src="https://github.com/user-attachments/assets/97d22787-fbf9-4b75-b1cb-20aeb1e22e40" />

### RFQ Bid Comparison
<img width="1920" height="1080" alt="rfq-bids" src="https://github.com/user-attachments/assets/9f164a17-f7d4-44bc-9562-78ae5e56fbb1" />

### Vendor Product Management
<img width="1920" height="1080" alt="vendor-product-management" src="https://github.com/user-attachments/assets/107403a1-c83b-4b7d-88d2-66ce788cda17" />

### Vendor Order Management
<img width="1920" height="1080" alt="vendor-order-management" src="https://github.com/user-attachments/assets/3d7ca3f2-c6d7-4fca-8752-d3d2eed45a4b" />

---

## 🔄 How It Works

1. A **Company** browses the marketplace or creates an RFQ specifying product requirements and budget
2. **Vendors** receive the RFQ, submit competitive quotes with pricing and delivery terms
3. The Company reviews bids, accepts the best offer, and the order lifecycle begins — tracked by **Admin**
4. The **Vendor Finance Dashboard** records revenue, commissions, and payout history per transaction

---

## ✨ Features

### 🏢 Multi-Role System
| Role | Capabilities |
|---|---|
| **Admin** | Manage users, oversee all orders, platform analytics |
| **Vendor** | List products, respond to RFQs, track revenue & payouts |
| **Company** | Browse marketplace, place orders, create and manage RFQs |

### 📋 RFQ System
- Create RFQs with product specs, quantity, and budget
- Vendors submit competing quotes with pricing and delivery terms
- Side-by-side bid comparison with win/loss tracking
- Auto-status updates through quote lifecycle

### 🛒 Marketplace & Cart
- Product catalog with inventory tracking
- Cart with stock validation and quantity controls
- Upsert logic — add to cart or increase quantity in one API call
- DB transactions with rollback on order failure

### 💰 Vendor Finance Dashboard
- Revenue tracking per order
- Commission and payout calculation
- Complete transaction history with filters

### ⚙️ Backend Infrastructure
- Role-based access control (RBAC) on all routes
- Redis session store for scalable session management
- Parallel query execution with `Promise.all` for performance
- Server-side pagination with dynamic query building
- Centralized error handling middleware

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (Browser)                  │
│              EJS Templates + Vanilla JS              │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP
┌─────────────────────▼───────────────────────────────┐
│               Express.js (MVC)                       │
│  Routes → Controllers → Services → DB Queries        │
│                                                      │
│  Middleware: Auth | RBAC | Error Handler | Logger    │
└──────────┬─────────────────────┬────────────────────┘
           │                     │
┌──────────▼──────┐   ┌──────────▼──────┐
│   MySQL (23     │   │  Redis Session   │
│   tables)       │   │  Store           │
└─────────────────┘   └─────────────────┘
```

**Stack:**
- **Backend:** Node.js, Express.js (MVC architecture)
- **Frontend:** EJS (server-side rendering), HTML, CSS, JavaScript
- **Database:** MySQL — 23 tables
- **Session Management:** Redis
- **Authentication:** Session-based with bcrypt password hashing

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Role-based login |
| `GET` | `/api/company/marketplace` | Browse product catalog |
| `PATCH` | `/api/company/cart/upsert/:productId` | Add/update cart item |
| `DELETE` | `/api/company/cart/clear` | Clear entire cart |
| `POST` | `/api/company/rfq/create` | Create new RFQ |
| `POST` | `/api/vendor/rfq/:rfqId/quote` | Submit quote on RFQ |
| `PATCH` | `/api/company/rfq/:rfqId/accept/:quoteId` | Accept winning bid |
| `GET` | `/api/vendor/finance/dashboard` | Vendor revenue & payouts |
| `GET` | `/api/admin/orders` | All orders (paginated) |

---

## 🧠 Design Decisions

**Why MySQL over NoSQL?**  
Procurement workflows involve complex relational data — RFQs linked to quotes, quotes linked to orders, orders linked to vendors and companies. Relational integrity and JOIN queries are critical. MongoDB would require application-level consistency enforcement that MySQL handles natively.

**Why Redis for sessions?**  
Node.js in-memory sessions don't survive restarts and don't scale horizontally. Redis gives persistent, fast, scalable session storage — essential for a multi-role system where session data carries role and auth state.

**Why DB transactions with rollback?**  
Order placement touches multiple tables atomically (orders, order_items, cart, inventory). If any step fails, the entire operation rolls back — no partial data, no orphaned records.

**Why Promise.all for queries?**  
Dashboard pages aggregate data from multiple independent tables (orders, revenue, products, etc.). Running queries in parallel instead of sequentially cuts load time proportionally to the number of queries.

---

## 📊 Database Schema

23 tables covering the full procurement domain:

**Core entities:** users, companies, vendors, admin  
**Procurement:** rfqs, rfq_items, quotes, quote_items  
**Orders:** orders, order_items
**Finance:** vendor_revenue, commissions, payouts, transactions  
**Catalog:** products, categories  
**Cart:** carts, cart_items  

### Entity Relationship Diagram
<img width="1324" height="863" alt="E-R-Diagram" src="https://github.com/user-attachments/assets/859fc9f2-d4a4-4f61-9945-ff69a44ec10d" />

- Referential integrity enforced across all foreign key relationships
- Normalization applied to reduce redundancy while keeping queries efficient
- Indexes on high-frequency lookup columns (product_id, user_id, rfq_id)

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MySQL 8+
- Redis (running on `localhost:6379`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Adi-dev118/procurepro-app.git
cd procurepro-app

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
```

Edit `.env`:
```env
HOST_NAME=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=procureapp
PORT=3000
SESSION_SECRET=your_session_secret
REDIS_HOST=localhost
REDIS_PORT=6379
```

```bash
# 4. Import database schema
mysql -u your_db_user -p procureapp < procureapp.sql

# 5. Start Redis
redis-server

# 6. Run the application
npm start
```

App runs at `http://localhost:3000`

---

## 🗺️ Roadmap

This project is being actively developed as a production deployment:

- [x] Core procurement workflows (RFQ, orders, cart)
- [x] Multi-role RBAC with Redis sessions
- [x] Vendor finance dashboard
- [ ] **React.js** — migrate frontend from EJS to component-based UI
- [ ] **TypeScript** — add static typing across frontend and backend
- [ ] **Docker** — containerize app + MySQL + Redis with docker-compose
- [ ] **Cloud Deployment** — AWS (EC2 + RDS + ElastiCache + S3)
- [ ] **CI/CD** — GitHub Actions for lint, test, and deploy pipeline
- [ ] **AI Procurement Bot** — natural language RFQ creation and vendor matching using LLM API

---

## 👨‍💻 Author

**Aditya Gaikwad**  
[GitHub](https://github.com/Adi-dev118)
