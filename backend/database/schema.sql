-- PostgreSQL DDL Schema for E-Commerce Management System

-- Drop tables if existing (in reverse dependency order)
DROP TABLE IF EXISTS coupon_redemptions CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS feedback_moderation CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS return_status_history CASCADE;
DROP TABLE IF EXISTS return_items CASCADE;
DROP TABLE IF EXISTS return_requests CASCADE;
DROP TABLE IF EXISTS order_history CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_item CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_item CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
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
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    department VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active'
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
    order_status VARCHAR(30) DEFAULT 'Pending',
    approx_delivery_date VARCHAR(50),
    courier_name VARCHAR(100),
    tracking_number VARCHAR(100),
    coupon_code VARCHAR(50),
    discount_amount NUMERIC(10, 2) DEFAULT 0,
    assigned_employee_id VARCHAR(36) REFERENCES employees(employee_id) ON DELETE SET NULL
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
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_hidden BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE
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

-- 14. Return Request Entity
CREATE TABLE return_requests (
    return_id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    return_status VARCHAR(30) NOT NULL DEFAULT 'RETURN_REQUESTED',
    reason VARCHAR(100) NOT NULL,
    comments TEXT,
    image_url VARCHAR(500),
    refund_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    refund_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    courier_name VARCHAR(100),
    tracking_number VARCHAR(100),
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approval_date TIMESTAMP NULL,
    shipment_date TIMESTAMP NULL,
    received_date TIMESTAMP NULL,
    completed_date TIMESTAMP NULL,
    rejection_reason TEXT
);

-- 15. Return Items (Return -> Product M:N Junction with Seller linkage)
CREATE TABLE return_items (
    return_id VARCHAR(36) NOT NULL REFERENCES return_requests(return_id) ON DELETE CASCADE,
    product_id VARCHAR(36) NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    seller_id VARCHAR(36) NOT NULL REFERENCES sellers(seller_id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    PRIMARY KEY (return_id, product_id)
);

-- 16. Return Status History / Audit Entity
CREATE TABLE return_status_history (
    history_id VARCHAR(36) PRIMARY KEY,
    return_id VARCHAR(36) NOT NULL REFERENCES return_requests(return_id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    performed_by VARCHAR(120) NOT NULL,
    notes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. In-App Notifications Entity
CREATE TABLE notifications (
    notification_id VARCHAR(36) PRIMARY KEY,
    recipient_id VARCHAR(36),
    recipient_role VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    reference_id VARCHAR(36),
    reference_type VARCHAR(30),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. Feedback Moderation Log Entity
CREATE TABLE feedback_moderation (
    moderation_id VARCHAR(36) PRIMARY KEY,
    review_id VARCHAR(36) NOT NULL REFERENCES reviews(review_id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    moderator VARCHAR(120) NOT NULL,
    reason TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. Wishlist Entity
CREATE TABLE wishlists (
    wishlist_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    product_id VARCHAR(36) NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- 20. Coupons & Promo Codes Entity
CREATE TABLE coupons (
    coupon_id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    max_discount NUMERIC(10, 2) DEFAULT NULL,
    description TEXT,
    expires_at TIMESTAMP DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 21. Coupon Redemptions Entity (Enforces Single-Use per Customer)
CREATE TABLE coupon_redemptions (
    redemption_id VARCHAR(50) PRIMARY KEY,
    coupon_code VARCHAR(50) NOT NULL,
    customer_id VARCHAR(36) NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
    order_id VARCHAR(36) REFERENCES orders(order_id) ON DELETE SET NULL,
    discount_applied NUMERIC(10, 2) DEFAULT 0,
    redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_customer_coupon UNIQUE (coupon_code, customer_id)
);
