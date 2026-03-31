# ProcurePro - B2B Industrial Procurement System

## 📌 Description
ProcurePro is a web-based application designed to streamline industrial procurement processes between businesses. It allows efficient management of suppliers, orders, RFQs, and inventory.

## 🚀 Tech Stack
- Frontend: EJS (server-side rendering), HTML, CSS, JavaScript
- Backend: Node.js, Express.js v5
- Database: MySQL
- Session Store: Redis
- Auth: Session-based authentication with bcrypt

## ✨ Features
- Supplier management
- Order tracking system
- RFQ (Request for Quotation) handling
- Inventory management
- Role-based access



## 🛠️ How to Run
1. Clone the repository
2. Install dependencies:
   npm install
3. Start server:
   npm start
4. Create a `config.env` file in the server folder:
   - HOST_NAME=localhost
   - DB_USER=your_db_user
   - DB_PASSWORD=your_db_password
   - DB_NAME=procureapp
   - PORT=3000
   - SESSION_SECRET=your_session_secret
5. Make sure Redis is running on localhost:6379
6. Import procureapp.sql into MySQL

## 📂 Database
- SQL dump file included (`procureapp.sql`)

## 👨‍💻 Author
Aditya Gaikwad
