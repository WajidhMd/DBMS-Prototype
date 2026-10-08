-- PostgreSQL DDL Schema for E-Commerce Management System

-- Drop tables if existing (in reverse dependency order)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_item CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS sellers CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users table (Authentication & Authorization Layer)
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'CUSTOMER', 'SELLER', 'EMPLOYEE')),
    ref_id VARCHAR(36),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Customer Entity
CREATE TABLE customers (
    customer_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    email VARCHAR(120) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone VARCHAR(20) NOT NULL
);

-- 3. Address Entity
CREATE TABLE addresses (
    address_id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    street VARCHAR(150) NOT NULL,
    apartment_no VARCHAR(50),
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE
);

-- 4. Seller Entity
CREATE TABLE sellers (
    seller_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL
);

-- 4b. Employee Entity
CREATE TABLE employees (
    employee_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL
);

-- 5. Category Entity
CREATE TABLE categories (
    category_id VARCHAR(36) PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- 6. Product Entity
CREATE TABLE products (
    product_id VARCHAR(36) PRIMARY KEY,
    seller_id VARCHAR(36) NOT NULL REFERENCES sellers(seller_id) ON DELETE CASCADE,
    category_id VARCHAR(36) NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    product_name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    stock_qty INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(500)
);

-- 7. Cart Entity
CREATE TABLE carts (
    cart_id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL UNIQUE REFERENCES customers(customer_id) ON DELETE CASCADE
);

-- 8. Cart Item (Cart -> Product M:N Junction)
CREATE TABLE cart_item (
    cart_id VARCHAR(36) NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id VARCHAR(36) NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    PRIMARY KEY (cart_id, product_id)
);

-- 9. Order Entity
CREATE TABLE orders (
    order_id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    address_id VARCHAR(36) NOT NULL REFERENCES addresses(address_id) ON DELETE CASCADE,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    shipping_date TIMESTAMP NULL,
    order_amount NUMERIC(10, 2) NOT NULL,
    order_status VARCHAR(30) DEFAULT 'Pending'
);

-- 10. Order Item (Order -> Product M:N Junction)
CREATE TABLE order_item (
    order_id VARCHAR(36) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id VARCHAR(36) NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (order_id, product_id)
);

-- 11. Payment Entity
CREATE TABLE payments (
    payment_id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    payment_mode VARCHAR(50) NOT NULL,
    payment_status VARCHAR(30) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date_of_payment TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Review Entity
CREATE TABLE reviews (
    review_id VARCHAR(36) PRIMARY KEY,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    product_id VARCHAR(36) NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    description TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Order History / Audit Entity
CREATE TABLE order_history (
    history_id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(120) NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

