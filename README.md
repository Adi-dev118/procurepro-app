🚀 ProcurePro – B2B Industrial Procurement System
📌 Overview

ProcurePro is a full-stack web application designed to streamline procurement workflows between businesses by managing suppliers, RFQs (Request for Quotations), orders, and inventory within a unified system.

The system supports multi-role interactions (Admin, Vendor, Company) and ensures data consistency, secure access control, and scalable request handling.

🧠 Key Highlights

- Designed a relational database with ~23 tables to handle complex procurement workflows
- Implemented role-based access control (RBAC) for secure multi-user interaction
- Used database transactions with rollback to maintain consistency during order placement
- Integrated Redis session store for scalable and efficient session management
- Optimized performance using parallel query execution (Promise.all) and server-side pagination
  
🏗️ Architecture

- Backend: Node.js, Express.js (MVC architecture)
- Frontend: EJS (server-side rendering), HTML, CSS, JavaScript
- Database: MySQL
- Session Management: Redis
- Authentication: Session-based authentication with bcrypt
  
✨ Features

- Supplier and vendor management
- RFQ system with quote submission and tracking
- Order lifecycle management
- Inventory tracking
- Role-based dashboards (Admin, Vendor, Company)
  
⚙️ Setup Instructions
1. Clone the repository
2. Install dependencies:
3. npm install

4. Create a .env file:
 - HOST_NAME=localhost
 - DB_USER=your_db_user
 - DB_PASSWORD=your_db_password
 - DB_NAME=procureapp
 - PORT=3000
 - SESSION_SECRET=your_session_secret
5. Start Redis server on:
 - localhost:6379
6. Import database:
 - procureapp.sql
7. Run the application:
 - npm start

📂 Database

- Includes SQL dump (procureapp.sql)
- Designed to support RFQs, orders, vendors, and transaction workflows
  
🔍 Future Improvements

- API rate limiting and caching improvements
- Advanced analytics dashboard
- Notification system for RFQ updates

👨‍💻 Author
Aditya Gaikwad
