-- PostgreSQL Seed Data Script

-- 1. Insert Users
INSERT INTO users (user_id, email, password_hash, role, ref_id, created_at) VALUES
('usr-admin-001', 'admin@ecommerce.com', '$2a$10$wT8dG6jT1d.B6a1YqE5d/.8y4aO/eC5r9f4y.2b8K1W9qM5o7d8/G', 'ADMIN', NULL, '2026-01-01 10:00:00'),
('usr-cust-001', 'john.doe@example.com', '$2a$10$wT8dG6jT1d.B6a1YqE5d/.8y4aO/eC5r9f4y.2b8K1W9qM5o7d8/G', 'CUSTOMER', 'cust-001', '2026-01-02 11:30:00'),
('usr-cust-002', 'jane.smith@example.com', '$2a$10$wT8dG6jT1d.B6a1YqE5d/.8y4aO/eC5r9f4y.2b8K1W9qM5o7d8/G', 'CUSTOMER', 'cust-002', '2026-01-03 14:15:00'),
('usr-sell-001', 'techworld@seller.com', '$2a$10$wT8dG6jT1d.B6a1YqE5d/.8y4aO/eC5r9f4y.2b8K1W9qM5o7d8/G', 'SELLER', 'sell-001', '2026-01-01 09:00:00'),
('usr-sell-002', 'fashionhub@seller.com', '$2a$10$wT8dG6jT1d.B6a1YqE5d/.8y4aO/eC5r9f4y.2b8K1W9qM5o7d8/G', 'SELLER', 'sell-002', '2026-01-01 09:30:00');

-- 2. Insert Customers
INSERT INTO customers (customer_id, user_id, email, first_name, middle_name, last_name, date_of_birth, phone) VALUES
('cust-001', 'usr-cust-001', 'john.doe@example.com', 'John', 'Robert', 'Doe', '1995-05-15', '+1-555-0192'),
('cust-002', 'usr-cust-002', 'jane.smith@example.com', 'Jane', 'Anne', 'Smith', '1998-11-20', '+1-555-0144');

-- 3. Insert Addresses
INSERT INTO addresses (address_id, customer_id, street, apartment_no, city, state, pincode, is_default) VALUES
('addr-001', 'cust-001', '124 Innovation Way', 'Apt 4B', 'San Jose', 'CA', '95110', TRUE),
('addr-002', 'cust-001', '789 Market Street', 'Suite 200', 'San Francisco', 'CA', '94103', FALSE),
('addr-003', 'cust-002', '456 Tech Boulevard', 'Floor 3', 'Austin', 'TX', '78701', TRUE);

-- 4. Insert Sellers
INSERT INTO sellers (seller_id, user_id, name, email, phone) VALUES
('sell-001', 'usr-sell-001', 'TechWorld Electronics', 'techworld@seller.com', '+1-800-555-8324'),
('sell-002', 'usr-sell-002', 'FashionHub Apparel', 'fashionhub@seller.com', '+1-800-555-9988');

-- 5. Insert Categories
INSERT INTO categories (category_id, category_name, description) VALUES
('cat-001', 'Electronics & Gadgets', 'Smartphones, Laptops, Audio gear, and Wearable accessories.'),
('cat-002', 'Apparel & Fashion', 'Trending Men & Women clothing, footwear, and accessories.'),
('cat-003', 'Home & Living', 'Modern furniture, kitchen appliances, and home decor.'),
('cat-004', 'Books & Stationery', 'Academic textbooks, novels, and luxury stationery items.');

-- 6. Insert Products
INSERT INTO products (product_id, seller_id, category_id, product_name, brand, mrp, stock_qty, is_active, image_url) VALUES
('prod-001', 'sell-001', 'cat-001', 'Quantum Pro Wireless Headphones', 'AcousticTech', 199.99, 45, TRUE, '/images/headphones.jpg'),
('prod-002', 'sell-001', 'cat-001', 'UltraBook Max 15" Laptop', 'ApexCompute', 1299.00, 12, TRUE, '/images/laptop.jpg'),
('prod-003', 'sell-001', 'cat-001', 'AeroWatch Series 5 Smartwatch', 'AeroTech', 249.50, 30, TRUE, '/images/smartwatch.jpg'),
('prod-004', 'sell-002', 'cat-002', 'Classic Leather Bomber Jacket', 'UrbanCraft', 149.99, 25, TRUE, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'),
('prod-005', 'sell-002', 'cat-002', 'Ergonomic Running Shoes', 'StrideFlex', 89.95, 60, TRUE, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'),
('prod-006', 'sell-001', 'cat-003', 'Smart Ambient Desk Lamp', 'Lumina', 59.99, 50, TRUE, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600');

-- 7. Insert Carts
INSERT INTO carts (cart_id, customer_id) VALUES
('cart-001', 'cust-001'),
('cart-002', 'cust-002');

-- 8. Insert Cart Items
INSERT INTO cart_item (cart_id, product_id, quantity) VALUES
('cart-001', 'prod-001', 1),
('cart-001', 'prod-005', 2);

-- 9. Insert Orders
INSERT INTO orders (order_id, customer_id, address_id, order_number, order_date, shipping_date, order_amount, order_status) VALUES
('ord-001', 'cust-001', 'addr-001', 'ORD-2026-88101', '2026-02-10 14:20:00', '2026-02-12 09:00:00', 379.94, 'Delivered'),
('ord-002', 'cust-002', 'addr-003', 'ORD-2026-99412', '2026-03-01 16:45:00', NULL, 1299.00, 'Pending');

-- 10. Insert Order Items
INSERT INTO order_item (order_id, product_id, quantity, unit_price) VALUES
('ord-001', 'prod-001', 1, 199.99),
('ord-001', 'prod-005', 2, 89.95),
('ord-002', 'prod-002', 1, 1299.00);

-- 11. Insert Payments
INSERT INTO payments (payment_id, order_id, payment_mode, payment_status, amount, date_of_payment) VALUES
('pay-001', 'ord-001', 'Credit/Debit Card', 'Completed', 379.94, '2026-02-10 14:21:10'),
('pay-002', 'ord-002', 'UPI', 'Completed', 1299.00, '2026-03-01 16:46:05');

-- 12. Insert Reviews
INSERT INTO reviews (review_id, customer_id, product_id, rating, description, review_date) VALUES
('rev-001', 'cust-001', 'prod-001', 5, 'Outstanding audio quality and long battery life! Very comfortable for long hours.', '2026-02-15 11:30:00'),
('rev-002', 'cust-001', 'prod-005', 4, 'Very comfortable running shoes with decent arch support. Fits true to size.', '2026-02-16 10:15:00');
