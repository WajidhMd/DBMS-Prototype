# E-Commerce DBMS Project Plan

## Overview
A web-based database management system prototype for an e-commerce store built with HTML5, CSS3, and JavaScript (ES6).

## Scope
1. **Authentication & DB Selector** (`index.html`)
   - Select database engine: MySQL, PostgreSQL, MongoDB.
   - Sample user accounts drawer for quick login.

2. **Management Console** (`dashboard.html`)
   - **Metrics**: Total sales, active orders, product count, low stock warnings.
   - **Data Views**:
     - Products & Stock: Catalog table, stock status, add/delete items.
     - Orders: Track order fulfillment states.
     - Users: RBAC role allocations and database preferences.
     - Analytics: Category stock breakdown.
   - **DDL Inspector**: View `CREATE TABLE` and `JSON Schema` definitions for MySQL, PostgreSQL, and MongoDB.

## File Structure
```
.
├── index.html          # Login portal & database selector
├── dashboard.html      # Main management console
├── css/
│   └── style.css       # Stylesheet
├── js/
│   ├── data.js         # Mock data & DDL schemas
│   └── app.js          # App logic
├── plan.md             # Plan document
└── README.md           # Documentation
```
