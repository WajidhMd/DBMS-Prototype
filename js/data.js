/**
 * E-Commerce DBMS Sample Data & Schemas
 */

// 1. Sample User Accounts
const sampleUsers = [
  {
    user_id: 1,
    username: "admin_sarah",
    email: "sarah.admin@ecomstore.com",
    password: "Admin2026!Secure",
    role: "Store Administrator",
    department: "Operations",
    database_preference: "MySQL"
  },
  {
    user_id: 2,
    username: "inv_marcus",
    email: "marcus.inventory@ecomstore.com",
    password: "StockManager#26",
    role: "Inventory Manager",
    department: "Logistics",
    database_preference: "PostgreSQL"
  },
  {
    user_id: 3,
    username: "sales_elena",
    email: "elena.sales@ecomstore.com",
    password: "SalesBoost$2026",
    role: "Sales & Revenue Manager",
    department: "Sales & Marketing",
    database_preference: "MySQL"
  },
  {
    user_id: 4,
    username: "fulfill_carlos",
    email: "carlos.fulfill@ecomstore.com",
    password: "FulfillFast!88",
    role: "Order Fulfillment Lead",
    department: "Shipping",
    database_preference: "MongoDB"
  },
  {
    user_id: 5,
    username: "support_aisha",
    email: "aisha.support@ecomstore.com",
    password: "CareHelp2026*",
    role: "Customer Support Lead",
    department: "Support",
    database_preference: "PostgreSQL"
  },
  {
    user_id: 6,
    username: "analyst_david",
    email: "david.data@ecomstore.com",
    password: "DataMetric#99",
    role: "E-Commerce Data Analyst",
    department: "Analytics",
    database_preference: "PostgreSQL"
  },
  {
    user_id: 7,
    username: "catalog_priya",
    email: "priya.catalog@ecomstore.com",
    password: "CatalogMerch!26",
    role: "Catalog Merchandiser",
    department: "Sales & Marketing",
    database_preference: "MySQL"
  },
  {
    user_id: 8,
    username: "sec_robert",
    email: "robert.security@ecomstore.com",
    password: "CyberSec99#Root",
    role: "Database Administrator",
    department: "IT",
    database_preference: "PostgreSQL"
  },
  {
    user_id: 9,
    username: "vendor_lina",
    email: "lina.vendor@ecomstore.com",
    password: "VendorPortal$26",
    role: "Supplier Relations Manager",
    department: "Logistics",
    database_preference: "MongoDB"
  },
  {
    user_id: 10,
    username: "ops_tom",
    email: "tom.ops@ecomstore.com",
    password: "EcomOpsPass!1",
    role: "Operations Supervisor",
    department: "Operations",
    database_preference: "MySQL"
  }
];

// 2. Sample Products Catalog
const sampleProducts = [
  {
    product_id: "PRD-101",
    sku: "SKU-AUD-001",
    name: "Wireless ANC Headphones",
    category: "Audio",
    price: 199.99,
    stock: 45,
    status: "In Stock"
  },
  {
    product_id: "PRD-102",
    sku: "SKU-PER-002",
    name: "RGB Mechanical Keyboard",
    category: "Peripherals",
    price: 129.50,
    stock: 8,
    status: "Low Stock"
  },
  {
    product_id: "PRD-103",
    sku: "SKU-FUR-003",
    name: "Ergonomic Mesh Office Chair",
    category: "Furniture",
    price: 349.00,
    stock: 14,
    status: "Low Stock"
  },
  {
    product_id: "PRD-104",
    sku: "SKU-MON-004",
    name: "27-inch 4K Studio Monitor",
    category: "Displays",
    price: 529.99,
    stock: 28,
    status: "In Stock"
  },
  {
    product_id: "PRD-105",
    sku: "SKU-WCH-005",
    name: "GPS Fitness Smart Watch",
    category: "Wearables",
    price: 179.00,
    stock: 62,
    status: "In Stock"
  },
  {
    product_id: "PRD-106",
    sku: "SKU-STR-006",
    name: "2TB NVMe M.2 SSD",
    category: "Storage",
    price: 189.95,
    stock: 5,
    status: "Low Stock"
  },
  {
    product_id: "PRD-107",
    sku: "SKU-MOU-007",
    name: "Wireless Ergonomic Mouse",
    category: "Peripherals",
    price: 79.99,
    stock: 110,
    status: "In Stock"
  },
  {
    product_id: "PRD-108",
    sku: "SKU-DCK-008",
    name: "Thunderbolt 4 Docking Hub",
    category: "Accessories",
    price: 249.99,
    stock: 0,
    status: "Out of Stock"
  },
  {
    product_id: "PRD-109",
    sku: "SKU-LMP-009",
    name: "LED Desk Lamp with USB Charger",
    category: "Accessories",
    price: 49.99,
    stock: 75,
    status: "In Stock"
  },
  {
    product_id: "PRD-110",
    sku: "SKU-MIC-010",
    name: "USB Condenser Microphone",
    category: "Audio",
    price: 119.00,
    stock: 3,
    status: "Low Stock"
  }
];

// 3. Sample Orders Data
const sampleOrders = [
  {
    order_id: "ORD-9081",
    customer_name: "Alexander Wright",
    customer_email: "alex.wright@gmail.com",
    date: "2026-09-25",
    items_count: 3,
    total_amount: 458.49,
    payment_method: "Credit Card",
    status: "Processing"
  },
  {
    order_id: "ORD-9080",
    customer_name: "Sophia Martinez",
    customer_email: "sophia.m@yahoo.com",
    date: "2026-09-24",
    items_count: 1,
    total_amount: 529.99,
    payment_method: "PayPal",
    status: "Shipped"
  },
  {
    order_id: "ORD-9079",
    customer_name: "David Chen",
    customer_email: "dchen_tech@outlook.com",
    date: "2026-09-24",
    items_count: 2,
    total_amount: 279.94,
    payment_method: "Apple Pay",
    status: "Delivered"
  },
  {
    order_id: "ORD-9078",
    customer_name: "Emma Watson",
    customer_email: "emma.watson@company.org",
    date: "2026-09-23",
    items_count: 4,
    total_amount: 897.50,
    payment_method: "Credit Card",
    status: "Delivered"
  },
  {
    order_id: "ORD-9077",
    customer_name: "Michael Scott",
    customer_email: "mscott@dundermifflin.com",
    date: "2026-09-23",
    items_count: 1,
    total_amount: 349.00,
    payment_method: "Invoice",
    status: "Pending"
  },
  {
    order_id: "ORD-9076",
    customer_name: "Liam Johnson",
    customer_email: "liam.j@proton.me",
    date: "2026-09-22",
    items_count: 2,
    total_amount: 129.98,
    payment_method: "Credit Card",
    status: "Delivered"
  },
  {
    order_id: "ORD-9075",
    customer_name: "Olivia Taylor",
    customer_email: "olivia.t@icloud.com",
    date: "2026-09-21",
    items_count: 1,
    total_amount: 199.99,
    payment_method: "PayPal",
    status: "Cancelled"
  }
];

// 4. Sample Customer Profiles
const sampleCustomers = [
  {
    customer_id: "CUST-301",
    name: "Alexander Wright",
    email: "alex.wright@gmail.com",
    total_orders: 8,
    total_spent: 2450.80,
    tier: "Gold",
    status: "Active"
  },
  {
    customer_id: "CUST-302",
    name: "Sophia Martinez",
    email: "sophia.m@yahoo.com",
    total_orders: 5,
    total_spent: 1380.00,
    tier: "Silver",
    status: "Active"
  },
  {
    customer_id: "CUST-303",
    name: "David Chen",
    email: "dchen_tech@outlook.com",
    total_orders: 12,
    total_spent: 4120.50,
    tier: "Platinum",
    status: "Active"
  },
  {
    customer_id: "CUST-304",
    name: "Emma Watson",
    email: "emma.watson@company.org",
    total_orders: 3,
    total_spent: 897.50,
    tier: "Bronze",
    status: "Active"
  },
  {
    customer_id: "CUST-305",
    name: "Michael Scott",
    email: "mscott@dundermifflin.com",
    total_orders: 1,
    total_spent: 349.00,
    tier: "Bronze",
    status: "Active"
  }
];

// 5. Database Schema Specifications (DDL)
const schemaDDL = {
  users: {
    MySQL: `CREATE TABLE users (
  user_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  department VARCHAR(50) NOT NULL,
  database_preference ENUM('MySQL', 'PostgreSQL', 'MongoDB') DEFAULT 'MySQL',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    PostgreSQL: `CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  department VARCHAR(50) NOT NULL,
  database_preference VARCHAR(20) DEFAULT 'PostgreSQL',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);`,

    MongoDB: `db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["username", "email", "password", "role", "department", "database_preference"],
      properties: {
        username: { bsonType: "string" },
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        role: { bsonType: "string" },
        department: { bsonType: "string" },
        database_preference: { enum: ["MySQL", "PostgreSQL", "MongoDB"] }
      }
    }
  }
});
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "email": 1 }, { unique: true });`
  },

  products: {
    MySQL: `CREATE TABLE products (
  product_id VARCHAR(20) NOT NULL,
  sku VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT UNSIGNED DEFAULT 0,
  status ENUM('In Stock', 'Low Stock', 'Out of Stock') DEFAULT 'In Stock',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    PostgreSQL: `CREATE TABLE products (
  product_id VARCHAR(20) PRIMARY KEY,
  sku VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  status VARCHAR(20) NOT NULL DEFAULT 'In Stock',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_stock ON products(stock);`,

    MongoDB: `db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["product_id", "sku", "name", "category", "price", "stock", "status"],
      properties: {
        product_id: { bsonType: "string" },
        sku: { bsonType: "string" },
        name: { bsonType: "string" },
        category: { bsonType: "string" },
        price: { bsonType: "double", minimum: 0 },
        stock: { bsonType: "int", minimum: 0 },
        status: { enum: ["In Stock", "Low Stock", "Out of Stock"] }
      }
    }
  }
});
db.products.createIndex({ "sku": 1 }, { unique: true });`
  },

  orders: {
    MySQL: `CREATE TABLE orders (
  order_id VARCHAR(20) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  items_count INT UNSIGNED NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
  PRIMARY KEY (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    PostgreSQL: `CREATE TABLE orders (
  order_id VARCHAR(20) PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  items_count INTEGER NOT NULL CHECK (items_count > 0),
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending'
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(date);`,

    MongoDB: `db.createCollection("orders", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["order_id", "customer_name", "date", "items_count", "total_amount", "payment_method", "status"],
      properties: {
        order_id: { bsonType: "string" },
        customer_name: { bsonType: "string" },
        customer_email: { bsonType: "string" },
        date: { bsonType: "string" },
        items_count: { bsonType: "int", minimum: 1 },
        total_amount: { bsonType: "double", minimum: 0 },
        payment_method: { bsonType: "string" },
        status: { enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"] }
      }
    }
  }
});
db.orders.createIndex({ "status": 1 });`
  }
};

// Database Engine Metadata
const dbmsEngineSpecs = {
  MySQL: {
    name: "MySQL 8.0",
    badgeClass: "badge-mysql",
    storageEngine: "InnoDB",
    acidLevel: "Full ACID",
    defaultPort: 3306,
    queryLang: "SQL",
    desc: "Relational database optimized for high-speed online transaction processing."
  },
  PostgreSQL: {
    name: "PostgreSQL 16",
    badgeClass: "badge-postgres",
    storageEngine: "Heap / MVCC",
    acidLevel: "Strict Serializable ACID",
    defaultPort: 5432,
    queryLang: "PL/pgSQL",
    desc: "Advanced open-source relational database with JSONB document support."
  },
  MongoDB: {
    name: "MongoDB 7.0",
    badgeClass: "badge-mongo",
    storageEngine: "WiredTiger",
    acidLevel: "Multi-Document ACID",
    defaultPort: 27017,
    queryLang: "MQL",
    desc: "NoSQL document database built for high scalability and schema flexibility."
  }
};
