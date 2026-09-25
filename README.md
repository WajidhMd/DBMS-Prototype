# E-Commerce DBMS Prototype

A web-based database management system prototype created for a Database Management Systems (DBMS) course project.

## Project Overview

This prototype demonstrates a modern web interface for an E-Commerce Database Management System. The application allows users to test database authentication, view and manage product inventory, track customer orders, manage role-based user access, and inspect database schema definitions (DDL).

### Features
- **Multi-DBMS Selection**: Choose between MySQL, PostgreSQL, and MongoDB target database engines.
- **Role-Based Access Control (RBAC)**: Support for user roles including Store Administrator, Inventory Manager, Sales Lead, and Customer Support.
- **Inventory & Stock Tracking**: Real-time product table with search, low-stock warnings, and item addition/deletion.
- **Order Management**: Track sales order fulfillment states (Pending, Processing, Shipped, Delivered, Cancelled).
- **DDL Schema Inspector**: View equivalent relational SQL (`CREATE TABLE`) and MongoDB (`JSON Schema`) definitions for database tables (`users`, `products`, `orders`).
- **Data Export**: Export catalog, user, or order data as JSON files.

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6)
- **Styling**: Custom CSS (minimal dark theme)
- **Target Databases**: MySQL 8.0, PostgreSQL 16, MongoDB 7.0 (Simulated schema level)

## Project Structure

```
.
├── index.html          # Authentication portal and database engine selector
├── dashboard.html      # Main management dashboard and data tables
├── css/
│   └── style.css       # Stylesheet
├── js/
│   ├── data.js         # Sample dataset and database DDL definitions
│   └── app.js          # App logic, navigation, and modal handlers
└── README.md           # Documentation
```

## How to Run

1. **Option 1: Direct Browser**
   Double-click or open `index.html` in any web browser.

2. **Option 2: Local HTTP Server**
   ```bash
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000`.
