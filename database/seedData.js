// Standard Seed Data shared across MySQL, PostgreSQL, and MongoDB
import bcrypt from 'bcryptjs';

// Pre-calculated hash for "password123"
const DEMO_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

export const sampleUsers = [
  {
    user_id: 'usr-admin-001',
    email: 'admin@ecommerce.com',
    password_hash: DEMO_PASSWORD_HASH,
    role: 'ADMIN',
    ref_id: null,
    created_at: '2026-01-01 10:00:00'
  },
  {
    user_id: 'usr-cust-001',
    email: 'john.doe@example.com',
    password_hash: DEMO_PASSWORD_HASH,
    role: 'CUSTOMER',
    ref_id: 'cust-001',
    created_at: '2026-01-02 11:30:00'
  },
  {
    user_id: 'usr-cust-002',
    email: 'jane.smith@example.com',
    password_hash: DEMO_PASSWORD_HASH,
    role: 'CUSTOMER',
    ref_id: 'cust-002',
    created_at: '2026-01-03 14:15:00'
  },
  {
    user_id: 'usr-sell-001',
    email: 'techworld@seller.com',
    password_hash: DEMO_PASSWORD_HASH,
    role: 'SELLER',
    ref_id: 'sell-001',
    created_at: '2026-01-01 09:00:00'
  },
  {
    user_id: 'usr-sell-002',
    email: 'fashionhub@seller.com',
    password_hash: DEMO_PASSWORD_HASH,
    role: 'SELLER',
    ref_id: 'sell-002',
    created_at: '2026-01-01 09:30:00'
  },
  {
    user_id: 'usr-emp-001',
    email: 'employee@ecommerce.com',
    password_hash: DEMO_PASSWORD_HASH,
    role: 'EMPLOYEE',
    ref_id: 'emp-001',
    is_active: true,
    created_at: '2026-01-01 08:00:00'
  }
];

export const sampleCustomers = [
  {
    customer_id: 'cust-001',
    user_id: 'usr-cust-001',
    email: 'john.doe@example.com',
    first_name: 'John',
    middle_name: 'Robert',
    last_name: 'Doe',
    date_of_birth: '1995-05-15',
    phone: '+1-555-0192'
  },
  {
    customer_id: 'cust-002',
    user_id: 'usr-cust-002',
    email: 'jane.smith@example.com',
    first_name: 'Jane',
    middle_name: 'Anne',
    last_name: 'Smith',
    date_of_birth: '1998-11-20',
    phone: '+1-555-0144'
  }
];

export const sampleAddresses = [
  {
    address_id: 'addr-001',
    customer_id: 'cust-001',
    street: '124 Innovation Way',
    apartment_no: 'Apt 4B',
    city: 'San Jose',
    state: 'CA',
    pincode: '95110',
    is_default: true
  },
  {
    address_id: 'addr-002',
    customer_id: 'cust-001',
    street: '789 Market Street',
    apartment_no: 'Suite 200',
    city: 'San Francisco',
    state: 'CA',
    pincode: '94103',
    is_default: false
  },
  {
    address_id: 'addr-003',
    customer_id: 'cust-002',
    street: '456 Tech Boulevard',
    apartment_no: 'Floor 3',
    city: 'Austin',
    state: 'TX',
    pincode: '78701',
    is_default: true
  }
];

export const sampleSellers = [
  {
    seller_id: 'sell-001',
    user_id: 'usr-sell-001',
    name: 'TechWorld Electronics',
    email: 'techworld@seller.com',
    phone: '+1-800-555-8324'
  },
  {
    seller_id: 'sell-002',
    user_id: 'usr-sell-002',
    name: 'FashionHub Apparel',
    email: 'fashionhub@seller.com',
    phone: '+1-800-555-9988'
  }
];

export const sampleEmployees = [
  {
    employee_id: 'emp-001',
    user_id: 'usr-emp-001',
    name: 'Sample Employee',
    email: 'employee@ecommerce.com',
    phone: '+1-800-555-0100'
  }
];

export const sampleCategories = [
  {
    category_id: 'cat-001',
    category_name: 'Electronics & Gadgets',
    description: 'Smartphones, Laptops, Audio gear, and Wearable accessories.'
  },
  {
    category_id: 'cat-002',
    category_name: 'Apparel & Fashion',
    description: 'Trending Men & Women clothing, footwear, and accessories.'
  },
  {
    category_id: 'cat-003',
    category_name: 'Home & Living',
    description: 'Modern furniture, kitchen appliances, and home decor.'
  },
  {
    category_id: 'cat-004',
    category_name: 'Books & Stationery',
    description: 'Academic textbooks, novels, and luxury stationery items.'
  }
];

export const sampleProducts = [
  {
    product_id: 'prod-001',
    seller_id: 'sell-001',
    category_id: 'cat-001',
    product_name: 'Quantum Pro Wireless Headphones',
    brand: 'AcousticTech',
    mrp: 199.99,
    stock_qty: 45,
    is_active: true,
    image_url: '/images/headphones.jpg'
  },
  {
    product_id: 'prod-002',
    seller_id: 'sell-001',
    category_id: 'cat-001',
    product_name: 'UltraBook Max 15" Laptop',
    brand: 'ApexCompute',
    mrp: 1299.00,
    stock_qty: 12,
    is_active: true,
    image_url: '/images/laptop.jpg'
  },
  {
    product_id: 'prod-003',
    seller_id: 'sell-001',
    category_id: 'cat-001',
    product_name: 'AeroWatch Series 5 Smartwatch',
    brand: 'AeroTech',
    mrp: 249.50,
    stock_qty: 30,
    is_active: true,
    image_url: '/images/smartwatch.jpg'
  },
  {
    product_id: 'prod-004',
    seller_id: 'sell-002',
    category_id: 'cat-002',
    product_name: 'Classic Leather Bomber Jacket',
    brand: 'UrbanCraft',
    mrp: 149.99,
    stock_qty: 25,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'
  },
  {
    product_id: 'prod-005',
    seller_id: 'sell-002',
    category_id: 'cat-002',
    product_name: 'Ergonomic Running Shoes',
    brand: 'StrideFlex',
    mrp: 89.95,
    stock_qty: 60,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'
  },
  {
    product_id: 'prod-006',
    seller_id: 'sell-001',
    category_id: 'cat-003',
    product_name: 'Smart Ambient Desk Lamp',
    brand: 'Lumina',
    mrp: 59.99,
    stock_qty: 50,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'
  }
];

export const sampleCarts = [
  {
    cart_id: 'cart-001',
    customer_id: 'cust-001'
  },
  {
    cart_id: 'cart-002',
    customer_id: 'cust-002'
  }
];

export const sampleCartItems = [
  {
    cart_id: 'cart-001',
    product_id: 'prod-001',
    quantity: 1
  },
  {
    cart_id: 'cart-001',
    product_id: 'prod-005',
    quantity: 2
  }
];

export const sampleOrders = [
  {
    order_id: 'ord-001',
    customer_id: 'cust-001',
    address_id: 'addr-001',
    order_number: 'ORD-2026-88101',
    order_date: '2026-02-10 14:20:00',
    shipping_date: '2026-02-11 11:30:00',
    approx_delivery_date: '2026-02-15',
    order_amount: 379.94,
    order_status: 'DELIVERED'
  },
  {
    order_id: 'ord-002',
    customer_id: 'cust-002',
    address_id: 'addr-003',
    order_number: 'ORD-2026-99412',
    order_date: '2026-03-01 16:45:00',
    shipping_date: null,
    approx_delivery_date: null,
    order_amount: 1299.00,
    order_status: 'ORDER_PLACED'
  }
];

export const sampleOrderHistory = [
  {
    history_id: 'hist-001',
    order_id: 'ord-001',
    action: 'Order Placed by Customer',
    performed_by: 'john.doe@example.com',
    previous_status: null,
    new_status: 'ORDER_PLACED',
    timestamp: '2026-02-10 14:20:00'
  },
  {
    history_id: 'hist-002',
    order_id: 'ord-001',
    action: 'Forwarded to Seller by Employee',
    performed_by: 'employee@ecommerce.com',
    previous_status: 'ORDER_PLACED',
    new_status: 'SENT_TO_SELLER',
    timestamp: '2026-02-10 15:00:00'
  },
  {
    history_id: 'hist-003',
    order_id: 'ord-001',
    action: 'Order Confirmed & Placed by Seller',
    performed_by: 'techworld@seller.com',
    previous_status: 'SENT_TO_SELLER',
    new_status: 'ORDER_CONFIRMED',
    timestamp: '2026-02-10 16:30:00'
  },
  {
    history_id: 'hist-004',
    order_id: 'ord-001',
    action: 'Shipping Requested by Seller (Order Shipped, Approx Delivery: 2026-02-15)',
    performed_by: 'techworld@seller.com',
    previous_status: 'ORDER_CONFIRMED',
    new_status: 'SHIPPED',
    timestamp: '2026-02-11 11:30:00'
  },
  {
    history_id: 'hist-005',
    order_id: 'ord-001',
    action: 'Order Marked as Delivered by Employee',
    performed_by: 'employee@ecommerce.com',
    previous_status: 'SHIPPED',
    new_status: 'DELIVERED',
    timestamp: '2026-02-12 09:00:00'
  },
  {
    history_id: 'hist-006',
    order_id: 'ord-002',
    action: 'Order Placed by Customer',
    performed_by: 'jane.smith@example.com',
    previous_status: null,
    new_status: 'ORDER_PLACED',
    timestamp: '2026-03-01 16:45:00'
  }
];

export const sampleOrderItems = [
  {
    order_id: 'ord-001',
    product_id: 'prod-001',
    quantity: 1,
    unit_price: 199.99
  },
  {
    order_id: 'ord-001',
    product_id: 'prod-005',
    quantity: 2,
    unit_price: 89.95
  },
  {
    order_id: 'ord-002',
    product_id: 'prod-002',
    quantity: 1,
    unit_price: 1299.00
  }
];

export const samplePayments = [
  {
    payment_id: 'pay-001',
    order_id: 'ord-001',
    payment_mode: 'Credit/Debit Card',
    payment_status: 'Completed',
    amount: 379.94,
    date_of_payment: '2026-02-10 14:21:10'
  },
  {
    payment_id: 'pay-002',
    order_id: 'ord-002',
    payment_mode: 'UPI',
    payment_status: 'Completed',
    amount: 1299.00,
    date_of_payment: '2026-03-01 16:46:05'
  }
];

export const sampleReviews = [
  {
    review_id: 'rev-001',
    customer_id: 'cust-001',
    product_id: 'prod-001',
    rating: 5,
    description: 'Outstanding audio quality and long battery life! Very comfortable for long hours.',
    review_date: '2026-02-15 11:30:00'
  },
  {
    review_id: 'rev-002',
    customer_id: 'cust-001',
    product_id: 'prod-005',
    rating: 4,
    description: 'Very comfortable running shoes with decent arch support. Fits true to size.',
    review_date: '2026-02-16 10:15:00'
  }
];
