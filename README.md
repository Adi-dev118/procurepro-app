🚀 ProcurePro – B2B Industrial Procurement System
📌 Overview

ProcurePro is a full-stack web application designed to streamline procurement workflows between businesses by managing suppliers, RFQs (Request for Quotations), orders, and inventory within a unified system.

The system supports multi-role interactions (Admin, Vendor, Company) and ensures data consistency, secure access control, and scalable request handling.

## 📸 Screenshots

### Login Page
<img width="1920" height="1080" alt="login" src="https://github.com/user-attachments/assets/c6f72d2a-7b1e-4907-a6ea-704c043e6395" />

### Admin Dashboard
<img width="1920" height="1080" alt="admin-dashboard" src="https://github.com/user-attachments/assets/97d22787-fbf9-4b75-b1cb-20aeb1e22e40" />

### RFQ Bid Comparison
<img width="1920" height="1080" alt="rfq-bids" src="https://github.com/user-attachments/assets/9f164a17-f7d4-44bc-9562-78ae5e56fbb1" />

### RFQ Product Management
<img width="1920" height="1080" alt="vendor-product-management" src="https://github.com/user-attachments/assets/107403a1-c83b-4b7d-88d2-66ce788cda17" />

### RFQ Order Management
<img width="1920" height="1080" alt="vendor-order-management" src="https://github.com/user-attachments/assets/3d7ca3f2-c6d7-4fca-8752-d3d2eed45a4b" />

### 🧠 Key Highlights

- Designed a relational database with ~23 tables to handle complex procurement workflows
- Implemented role-based access control (RBAC) for secure multi-user interaction
- Used database transactions with rollback to maintain consistency during order placement
- Integrated Redis session store for scalable and efficient session management
- Optimized performance using parallel query execution (Promise.all) and server-side pagination

### 🧠 Design Decisions

- Used Redis for session storage to improve scalability and avoid 
  in-memory session limitations
- Implemented database transactions to ensure consistency in 
  multi-step order processing
- Structured backend using MVC architecture for better 
  maintainability and separation of concerns
- Choose MySQL over NoSQL to enforce relational integrity across 
  complex procurement workflows involving RFQs, quotes, and orders
  
### 🏗️ Architecture

- Backend: Node.js, Express.js (MVC architecture)
- Frontend: EJS (server-side rendering), HTML, CSS, JavaScript
- Database: MySQL
- Session Management: Redis
- Authentication: Session-based authentication with bcrypt
  
### ✨ Features

- Supplier and vendor management
- RFQ system with quote submission and tracking
- Order lifecycle management
- Inventory tracking
- Role-based dashboards (Admin, Vendor, Company)

## 🔄 How It Works
1. A **Company** browses the marketplace or creates an RFQ specifying product requirements and budget
2. **Vendors** receive the RFQ, submit competitive quotes with pricing and delivery terms
3. The Company reviews bids, accepts the best offer, and the order lifecycle begins — tracked by **Admin**
  
⚙️ Setup Instructions
1. Clone the repository
   - git clone https://github.com/Adi-dev118/procurepro-app.git
   - cd procurepro-app
2. Install dependencies:
   - npm install
3. Create a .env file:
   - HOST_NAME=localhost
   - DB_USER=your_db_user
   - DB_PASSWORD=your_db_password
   - DB_NAME=procureapp
   - PORT=3000
   - SESSION_SECRET=your_session_secret
4. Start Redis server on:
   - localhost:6379
5. Import database:
   - procureapp.sql
6. Run the application:
   - npm start

### 📂 Database

- Includes SQL dump (procureapp.sql)
- Designed to support RFQs, orders, vendors, and transaction workflows

  #### 📊 ER Overview
 The database is designed to handle complex procurement workflows involving RFQs, vendor          bidding, and order management.

Key entities include:
- Users (Admin, Vendor, Company)
- RFQs and Quotes for bid management
- Orders and Order Items for transaction tracking
- Products and Inventory for catalog management

  #### Entity Relationship Diagram
<img width="1324" height="863" alt="E-R-Diagram" src="https://github.com/user-attachments/assets/859fc9f2-d4a4-4f61-9945-ff69a44ec10d" />

  - Relationships are structured to ensure referential integrity between RFQs, vendors, and           orders
  - Normalization was applied to reduce redundancy while maintaining query efficiency

### 🔍 Future Improvements

- API rate limiting and caching improvements
- Advanced analytics dashboard
- Notification system for RFQ updates

👨‍💻 Author
Aditya Gaikwad
