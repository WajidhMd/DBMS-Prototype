# E-Commerce Management System (Chen ER Diagram Spec)

A complete, full-stack E-Commerce Management System web application built strictly according to the Chen ER Diagram specification. The application supports **dynamic database switching** between **MySQL**, **PostgreSQL**, and **MongoDB** through a single unified React frontend and Express Node.js backend.

---

## 🌟 Key Features

1. **Dynamic Database Switching**:
   - At startup/login, select the target database: `[ MySQL ] [ PostgreSQL ] [ MongoDB ]`.
   - The selected database dynamically determines where all user records, authentication, product catalog, carts, orders, invoices, and reviews are stored and retrieved.

2. **End-to-End Order Status Lifecycle Workflow**:
   - **Step 1 (Order Placed)**: Customer pays and places the order at checkout. Initial status is set to **`Order Placed`** (`ORDER_PLACED`).
   - **Step 2 (Employee Forwarding)**: Employee reviews customer order requests and forwards them to the respective Seller (**"Forward Order to Seller"** -> `SENT_TO_SELLER`).
   - **Step 3 (Seller Confirmation)**: Seller receives forwarded orders and confirms/places them (**"Confirm & Place Order"** -> `ORDER_CONFIRMED`).
   - **Step 4 (Seller Shipping Request & Approx Delivery Date)**: Seller requests shipping to employee (**"Request Ship to Employee"** -> `SHIPPED`), auto-generating and saving an **Approximate Delivery Date** (`approx_delivery_date`, e.g. 4 business days).
   - **Step 5 (Employee-Only Delivery Confirmation)**: Employee has the exclusive option **"Mark as Delivered"** (**strictly restricted to Employee/Admin roles**) to update status to **`Delivered`** (`DELIVERED`).

3. **Downloadable (PDF) & Viewable Tax Invoice**:
   - Interactive, print-ready **Invoice Modal** (`InvoiceModal.jsx`) powered by `html2canvas` and `jsPDF`.
   - Features store branding, tax invoice number, order reference, customer billing details, shipping address, payment method/status, itemized line totals, subtotal/tax summary, current order status, and **Approximate Delivery Date**.
   - Accessible immediately upon payment completion on the **Checkout** success screen, as well as on **My Orders**, **Customer Dashboard**, **Employee Dashboard**, and **Seller Dashboard**.

4. **Role-Based Portals & Dashboards**:
   - **CUSTOMER**: Personal Dashboard, Product Catalog with Search/Filter/Sort, Cart Management, Checkout with Address Manager, Order History, Invoice Downloads, and Reviews.
   - **EMPLOYEE**: Intermediary Operations Portal, New Order Request Processing, Forwarding Orders to Sellers, Order Inspection, and Exclusive **Mark as Delivered** action.
   - **SELLER**: Vendor Portal, Catalog Inventory Management, Add/Edit/Deactivate Product, Order Confirmation, Shipping Request to Employee, and Sales Metrics.
   - **ADMIN**: Executive Console, Platform Overview Statistics (Customers, Sellers, Products, Orders, Revenue), System Audit Logs, Category CRUD, and Payment Management.

5. **Sample Accounts Drawer**:
   - Click **"View Sample Accounts"** on the login page for 1-click credential auto-fill for Admin, Customer, Employee, and Seller across all target databases!

---

## 🔑 Pre-configured Seed Credentials

All pre-seeded demo accounts use password: `password123`

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@ecommerce.com` | `password123` | System Administrator - Full Access to Dashboards & Reports |
| **EMPLOYEE** | `employee@ecommerce.com` | `password123` | Operational Employee - Facilitates Customer ↔ Seller Order Lifecycle & Delivery |
| **CUSTOMER** | `john.doe@example.com` | `password123` | John Doe - Customer with addresses, cart, orders, and PDF invoices |
| **CUSTOMER** | `jane.smith@example.com` | `password123` | Jane Smith - Customer account |
| **SELLER** | `techworld@seller.com` | `password123` | TechWorld Electronics - Seller listing gadgets & confirming orders |
| **SELLER** | `fashionhub@seller.com` | `password123` | FashionHub Apparel - Seller listing clothing |

---

## 🚀 Quick Start & Execution Guide

### Prerequisites
- Node.js (v18+)
- NPM (v9+)
- (Optional) MySQL, PostgreSQL, or MongoDB server running locally.
  *(Note: If a live database server is not running on your machine, the application intelligently uses an isolated, pre-seeded emulated database engine per selection so you can test all features out-of-the-box seamlessly!)*

---

### 🐧 Running on Linux & macOS

#### Option A: 1-Click Bash Startup Script (Recommended)
You can start both backend (Port 5000) and frontend (Port 5173) simultaneously on Linux/macOS using the automated startup script:

```bash
# Make script executable and run
chmod +x start.sh
./start.sh
```
*Or run via npm:*
```bash
npm run start:linux
```

#### Option B: Manual Linux Command Execution
Open two terminal windows:

**Terminal 1 (Backend REST API):**
```bash
cd backend
npm install
npm start
```
*Backend API server runs at `http://localhost:5000`.*

**Terminal 2 (Frontend React App):**
```bash
cd frontend
npm install
npm run dev
```
*Frontend Web UI runs at `http://localhost:5173`.*

---

### 🪟 Running on Windows

Open two terminal windows (Command Prompt or PowerShell):

**Terminal 1 (Backend):**
```cmd
cd backend
npm install
npm start
```

**Terminal 2 (Frontend):**
```cmd
cd frontend
npm install
npm run dev
```

---

### 🗄️ Database Setup (For Live DB Servers)

#### A. MySQL Setup
1. Start your MySQL Server (e.g. via systemctl, XAMPP, MySQL Workbench).
2. Execute the schema script:
   ```bash
   mysql -u root -p < database/mysql/schema.sql
   ```
3. Execute the seed script:
   ```bash
   mysql -u root -p < database/mysql/seed.sql
   ```

#### B. PostgreSQL Setup
1. Start your PostgreSQL Server.
2. Create the database:
   ```bash
   createdb -U postgres ecommerce_db
   ```
3. Execute the schema script:
   ```bash
   psql -U postgres -d ecommerce_db -f database/postgresql/schema.sql
   ```
4. Execute the seed script:
   ```bash
   psql -U postgres -d ecommerce_db -f database/postgresql/seed.sql
   ```

#### C. MongoDB Setup
1. Start your MongoDB Daemon (`mongod` or `systemctl start mongod`).
2. Run the MongoDB node seed script:
   ```bash
   cd backend
   node ../database/mongodb/seed.js
   ```

---

## 🧪 Testing Order Lifecycle & Invoice Workflow

1. **Customer Order Placement & Invoice**:
   - Log in as `john.doe@example.com` (`password123`).
   - Add items to cart from `/products` and proceed to `/checkout`.
   - Select address, choose payment method, and click **"Confirm & Place Order"**.
   - Status becomes **`Order Placed`**.
   - Click **"View & Download PDF Invoice"** to preview and download the official PDF tax receipt.

2. **Employee Forwarding**:
   - Log out and log in as `employee@ecommerce.com` (`password123`).
   - Under *New Order Requests*, click **"Forward Order to Seller"**.
   - Status updates to **`Forwarded to Seller`**.

3. **Seller Order Confirmation & Shipping Request**:
   - Log out and log in as `techworld@seller.com` (`password123`).
   - Under *Employee-Forwarded Orders*, click **"Confirm & Place Order"** (Status -> **`Order Confirmed`**).
   - Click **"Request Ship to Employee"** (Status -> **`Order Shipped`**).
   - An **Approximate Delivery Date** is generated and displayed.

4. **Employee Delivery Confirmation**:
   - Log back in as `employee@ecommerce.com` (`password123`).
   - Under *Shipped Orders*, click **"Mark as Delivered"** (Only available for Employee role!).
   - Status updates to **`Delivered`**.

---

## 📁 Directory Structure

```
ecommerce-dbms/
├── start.sh                 # Linux & macOS 1-Click Startup Script
├── package.json             # Root npm script launcher
├── .env.example
├── .gitignore
├── README.md
│
├── frontend/
│   ├── public/
│   │   └── images/
│   │       ├── headphones.jpg
│   │       ├── laptop.jpg
│   │       └── smartwatch.jpg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx & Navbar.css
│   │   │   ├── Footer.jsx
│   │   │   └── InvoiceModal.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── DbContext.jsx
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
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── database/
│   │   ├── mysql.js
│   │   ├── postgresql.js
│   │   └── mongodb.js
│   ├── services/
│   │   └── dbAdapter.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── addressController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
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
    ├── mysql/
    │   ├── schema.sql
    │   └── seed.sql
    ├── postgresql/
    │   ├── schema.sql
    │   └── seed.sql
    ├── mongodb/
    │   └── seed.js
    └── seedData.js
```
