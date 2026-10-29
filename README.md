# E-Commerce Management System (Chen ER Diagram Spec)

A comprehensive, full-stack E-Commerce Management System web application built strictly according to the Chen ER Diagram specification. The application supports **dynamic database switching** between **PostgreSQL** and **MongoDB** through a single unified React frontend and Express Node.js backend.

---

## 🌟 Key Features

### 1. Product Return and Approval Workflow
- **Customer Dashboard & Orders**:
  - Customers can request returns for eligible delivered items within the 30-day return window.
  - Multi-item selection, quantity customization, return reason (Damaged, Defective, Wrong Product, etc.), comments, and photo evidence URL.
  - Generates unique return request ID (`ret-...`).
  - Once approved by an employee, customers can initiate shipping via **"Ship Return"**, inputting courier name and tracking consignment number.
- **Employee Dashboard — Return Approvals**:
  - Dedicated **Return Requests & Approvals** operations tab.
  - Inspect complete details, uploaded image proofs, item quantities, and return reasons.
  - One-click **Accept Request** (triggers customer notification and enables customer return shipping).
  - One-click **Reject Request** with mandatory official rejection reason (disables shipping and notifies customer).
  - Ability to update status to **In Transit**, confirm receipt, and finalize return (triggering refund & inventory restock).
- **Seller Dashboard — Returned Products & Shipments**:
  - Multi-vendor isolation: Each seller only sees returned items belonging to their own orders.
  - Displays product details, SKU/Brand, return quantity, customer comments, approval status, shipment details, courier, and tracking number.
  - Seller can click **"Confirm Receipt of Product"** to advance status to `RETURN_RECEIVED`.

### 2. Visual Tracking for Orders and Returns
- **Moving Truck Animation Indicator**:
  - Horizontal delivery progress line connecting all workflow stages with connected status nodes.
  - Animated truck icon dynamically positions itself and moves smoothly to the current stage based directly on real backend status changes.
  - Stages:
    - **Order Tracking**: `Order Placed` → `Confirmed` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`.
    - **Return Tracking**: `Return Requested` → `Employee Approval` → `Return Shipment Initiated` → `Return In Transit` → `Return Received by Seller` → `Return Completed`.
  - Shows stage completion timestamps, courier name, tracking number, and estimated delivery dates.
  - Responsive design: Horizontal layout on desktop/tablet, readable stacked layout on mobile devices.

### 3. Customer Feedback and Reviews
- **Verified Purchase Ratings**:
  - System strictly enforces ER purchase relationships: only customers who ordered and received the product can submit 1 to 5 star ratings and reviews.
  - Prevents duplicate reviews while allowing customers to edit or delete their existing feedback anytime.
- **Product Details & Catalog Display**:
  - Displays average product rating, review count, star breakdown, individual customer reviews, and verified purchase badges.
- **Admin & Employee Feedback Moderation**:
  - Dedicated **Feedback Moderation** tab.
  - Staff can inspect reviews, flag inappropriate content, hide/unhide reviews from the catalog, and view an audit trail of moderation logs.

### 4. PostgreSQL and MongoDB Dual Database Support (MySQL Removed)
- Complete removal of MySQL connection pools, drivers (`mysql2`), schemas, and UI selectors.
- Start screen and navbar provide seamless switching between **PostgreSQL** and **MongoDB**.
- All data models, return tables, tracking events, feedback records, and notifications run consistently across both engines.

---

## 🔑 Pre-configured Seed Credentials

All pre-seeded demo accounts use password: `password123`

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@ecommerce.com` | `password123` | System Administrator - Dashboards, User Management, Moderation |
| **EMPLOYEE** | `employee@ecommerce.com` | `password123` | Operational Employee - Order Forwarding, Return Approvals, Moderation |
| **CUSTOMER** | `john.doe@example.com` | `password123` | John Doe - Customer with orders, returns, and reviews |
| **CUSTOMER** | `jane.smith@example.com` | `password123` | Jane Smith - Customer account |
| **SELLER** | `techworld@seller.com` | `password123` | TechWorld Electronics - Seller listing gadgets, fulfilling orders & returns |
| **SELLER** | `fashionhub@seller.com` | `password123` | FashionHub Apparel - Seller listing fashion items |

---

## 🚀 Quick Start & Execution Guide

### Prerequisites
- Node.js (v18+)
- NPM (v9+)
- (Optional) PostgreSQL or MongoDB server running locally.
  *(Note: If live database servers are not running locally, the application automatically uses an isolated, pre-seeded emulated database engine per selection so you can test all features immediately!)*

---

### 🐧 Running on Linux & macOS

```bash
# Make script executable and run
chmod +x start.sh
./start.sh
```

---

### 🪟 Running on Windows

Open two terminal windows (Command Prompt or PowerShell):

**Terminal 1 (Backend REST API - Port 5000):**
```cmd
cd backend
npm install
npm start
```

**Terminal 2 (Frontend React App - Port 5173):**
```cmd
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🗄️ Database Setup (For Live DB Servers)

### A. PostgreSQL Setup
1. Start PostgreSQL server.
2. Create database:
   ```bash
   createdb -U postgres ecommerce_db
   ```
3. Run the schema and seed scripts:
   ```bash
   psql -U postgres -d ecommerce_db -f database/postgresql/schema.sql
   psql -U postgres -d ecommerce_db -f database/postgresql/seed.sql
   ```

### B. MongoDB Setup
1. Start MongoDB daemon (`mongod`).
2. Run the MongoDB seed script:
   ```bash
   cd backend
   node ../database/mongodb/seed.js
   ```

---

## 📁 Directory Structure

```
ecommerce-dbms/
├── start.sh                 # Linux & macOS 1-Click Startup Script
├── package.json             # Root npm script launcher
├── .env.example             # PostgreSQL & MongoDB configuration
├── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx & Navbar.css
│   │   │   ├── Footer.jsx
│   │   │   ├── InvoiceModal.jsx
│   │   │   ├── VisualTracker.jsx & VisualTracker.css   # Visual tracking with animated truck
│   │   │   ├── ReturnModal.jsx                         # Return request submission
│   │   │   ├── ShipReturnModal.jsx                     # Customer return shipment confirmation
│   │   │   ├── ReviewModal.jsx                         # Feedback and star rating submission
│   │   │   └── NotificationBell.jsx                    # In-app notification bell & dropdown
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── DbContext.jsx                           # PostgreSQL and MongoDB target selector
│   │   ├── pages/
│   │   │   ├── Login.jsx & Login.css
│   │   │   ├── Register.jsx
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── SellerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Addresses.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── database/
│   │   ├── postgresql.js
│   │   └── mongodb.js
│   ├── services/
│   │   └── dbAdapter.js          # Unified adapter for PostgreSQL and MongoDB
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── returnController.js   # Return workflow controller
│   │   ├── notificationController.js
│   │   ├── addressController.js
│   │   ├── reviewController.js   # Customer feedback & moderation controller
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── returnRoutes.js       # Complete return workflow endpoints
│   │   ├── notificationRoutes.js
│   │   ├── addressRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── dbSelectorMiddleware.js
│   ├── server.js
│   └── package.json
│
└── database/
    ├── postgresql/
    │   ├── schema.sql
    │   └── seed.sql
    ├── mongodb/
    │   └── seed.js
    └── seedData.js
```
