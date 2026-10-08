# E-Commerce Management System (Chen ER Diagram Spec)

A complete, full-stack E-Commerce Management System web application built strictly according to the Chen ER Diagram specification. The application supports **dynamic database switching** between **MySQL**, **PostgreSQL**, and **MongoDB** through a single unified React frontend and Express Node.js backend.

---

## 🌟 Key Features

1. **Dynamic Database Switching**:
   - At startup/login, select the target database: `[ MySQL ] [ PostgreSQL ] [ MongoDB ]`.
   - The selected database dynamically determines where all user records, authentication, product catalog, carts, orders, and reviews are stored and retrieved.

2. **Strict Chen ER Diagram Compliance**:
   - **Entities**: Customer, Address, Seller, Category, Product, Cart, Order, Payment, Review.
   - **Derived Attributes**:
     - `Customer.age` (calculated dynamically from `date_of_birth`).
     - `Seller.total_sales` (calculated dynamically from `order_item` revenue).
     - `Cart.items_total` & `Cart.grand_total` (calculated dynamically from `cart_item` junction).
   - **Relationships & Cardinalities**:
     - Customer -> Address (`has`, 1:N)
     - Customer -> Cart (`owns`, 1:1)
     - Customer -> Order (`places`, 1:N)
     - Customer -> Review (`writes`, 1:N)
     - Product -> Review (`receives`, 1:N)
     - Seller -> Product (`sells`, 1:N)
     - Category -> Product (`belongs to`, 1:N)
     - Cart -> Product (`contains`, M:N attribute: `quantity`) -> `cart_item`
     - Order -> Product (`includes`, M:N attributes: `quantity`, `unit_price`) -> `order_item`
     - Order -> Payment (`paid by`, 1:N)
     - Order -> Address (`ships to`, N:1)

3. **Modern Professional Dark UI**:
   - Inspired by the DBMS Portal login design.
   - Dark navy background (`#0b0f19`), dark card containers (`#161b26`), glowing purple/blue buttons and borders (`#6366f1`), responsive controls.

4. **Role-Based Authentication & Dashboards**:
   - **CUSTOMER**: Personal Dashboard, Product Catalog, Filters/Sort/Pagination, Cart Management, Checkout & Address Manager, Order History, Reviews.
   - **SELLER**: Vendor Portal, Listed Products Inventory, Add/Edit/Deactivate Product, Stock Management, Sales Revenue metrics.
   - **ADMIN**: Executive Console, Overview Statistics (Customers, Sellers, Products, Orders, Revenue, Pending Orders), Customer & Seller tables, Category CRUD, Order status updater, Payment Audit logs.

5. **Sample Accounts Drawer**:
   - Click **"View Sample Accounts"** on the login page for 1-click credential auto-fill for Admin, Customer, and Seller across all target databases!

---

## 🔑 Pre-configured Seed Credentials

All pre-seeded demo accounts use password: `password123`

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@ecommerce.com` | `password123` | System Administrator - Full Access to Dashboards & Reports |
| **CUSTOMER** | `john.doe@example.com` | `password123` | John Doe - Customer with addresses, cart, and orders |
| **CUSTOMER** | `jane.smith@example.com` | `password123` | Jane Smith - Customer account |
| **SELLER** | `techworld@seller.com` | `password123` | TechWorld Electronics - Seller listing gadgets |
| **SELLER** | `fashionhub@seller.com` | `password123` | FashionHub Apparel - Seller listing clothing |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- NPM (v9+)
- (Optional) MySQL, PostgreSQL, or MongoDB server running locally.
  *(Note: If a live database server is not running on your machine, the application intelligently uses an isolated, pre-seeded emulated database engine per selection so you can test all features out-of-the-box seamlessly!)*

---

### Step 1: Database Setup (For Live DB Servers)

#### A. MySQL Setup
1. Start your MySQL Server (e.g. via XAMPP, MySQL Workbench, or service).
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
1. Start your MongoDB Daemon (`mongod`).
2. Run the MongoDB node seed script:
   ```bash
   cd backend
   node ../database/mongodb/seed.js
   ```

---

### Step 2: Start the Backend Server

```bash
cd backend
npm install
npm start
```
The backend REST API server will start on `http://localhost:5000`.

---

### Step 3: Start the React Frontend

Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Testing Workflow & Verification

1. **Database Selection**:
   - On the login page (`/login`), click `[ MySQL ]`, `[ PostgreSQL ]`, or `[ MongoDB ]`.
   - The selected button will highlight with a glowing border and active engine badge.

2. **Login as Customer**:
   - Click **"View Sample Accounts"** -> Select `john.doe@example.com` (`password123`).
   - Click **"Login to Dashboard"**.
   - Observe derived age (`30 years`), order metrics, cart items count, and order status history.

3. **Browse & Cart Operations**:
   - Navigate to `/products`.
   - Filter by Category ("Electronics & Gadgets"), Brand ("AcousticTech"), or sort by Price.
   - Click **"Add Cart"**.
   - Navigate to `/cart`, modify quantity, or click **"Proceed to Checkout"**.
   - Select an existing shipping address or add a new address, choose Payment Method ("UPI"), and click **"Confirm & Place Order"**.

4. **Login as Seller**:
   - Log out and log in with `techworld@seller.com` (`password123`).
   - View vendor portal metrics, listed products, total sales revenue (derived), and click **"Add New Product"** to list a item.

5. **Login as Admin**:
   - Log out and log in with `admin@ecommerce.com` (`password123`).
   - Manage all customer records, seller sales, categories CRUD, update order status dropdowns (`Pending` -> `Shipped` -> `Delivered`), and inspect payment logs.

---

## 📁 Directory Structure

```
ecommerce-dbms/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx & Navbar.css
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── DbContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx & Login.css
│   │   │   ├── Register.jsx
│   │   │   ├── CustomerDashboard.jsx
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
├── database/
│   ├── mysql/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── postgresql/
│   │   ├── schema.sql
│   │   └── seed.sql
│   ├── mongodb/
│   │   └── seed.js
│   └── seedData.js
│
├── .env.example
└── README.md
```
