// Standard Seed Data shared across PostgreSQL and MongoDB
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
  },
  {
    category_id: 'cat-005',
    category_name: 'Toys & Action Figures',
    description: 'Dolls, action figures, building sets, and educational toys.'
  },
  {
    category_id: 'cat-006',
    category_name: 'Gaming & Video Games',
    description: 'Gaming consoles, wireless controllers, headsets, and video games.'
  },
  {
    category_id: 'cat-007',
    category_name: 'Beauty & Personal Care',
    description: 'Skincare serums, luxury perfumes, cosmetics, and beauty tools.'
  },
  {
    category_id: 'cat-008',
    category_name: 'Watches & Timepieces',
    description: 'Luxury analog watches, digital timepieces, and smartwatches.'
  },
  {
    category_id: 'cat-009',
    category_name: 'Sports & Outdoors',
    description: 'Fitness equipment, athletic gear, balls, and cycling accessories.'
  },
  {
    category_id: 'cat-010',
    category_name: 'Cameras & Photography',
    description: 'Mirrorless cameras, lenses, tripods, and action cameras.'
  },
  {
    category_id: 'cat-011',
    category_name: 'Phones & Accessories',
    description: 'Smartphones, 5G mobiles, wireless chargers, and phone cases.'
  }
];

export const sampleProducts = [
  // ═══════════════════════════════════════════════════════════════
  // CATEGORY: Electronics & Gadgets (cat-001) — 10 Products
  // ═══════════════════════════════════════════════════════════════
  {
    product_id: 'prod-001',
    seller_id: 'sell-001',
    category_id: 'cat-001',
    product_name: 'Quantum Pro Wireless Headphones',
    brand: 'AcousticTech',
    mrp: 199.99,
    stock_qty: 45,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
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
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'
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
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
  },
  {
    product_id: 'prod-007',
    seller_id: 'sell-001',
    category_id: 'cat-001',
    product_name: 'NovaPod Pro Wireless Earbuds',
    brand: 'AcousticTech',
    mrp: 129.99,
    stock_qty: 80,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600'
  },
  {
    product_id: 'prod-008',
    seller_id: 'sell-001',
    category_id: 'cat-001',
    product_name: 'PixelLens 4K Action Camera',
    brand: 'VisionTech',
    mrp: 349.99,
    stock_qty: 18,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'
  },
  {
    product_id: 'prod-009',
    seller_id: 'sell-001',
    category_id: 'cat-001',
    product_name: 'ThunderBass Portable Bluetooth Speaker',
    brand: 'AcousticTech',
    mrp: 79.99,
    stock_qty: 65,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'
  },
  {
    product_id: 'prod-010',
    seller_id: 'sell-001',
    category_id: 'cat-001',
    product_name: 'SwiftCharge 10000mAh Power Bank',
    brand: 'VoltEdge',
    mrp: 49.99,
    stock_qty: 100,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600'
  },
  {
    product_id: 'prod-011',
    seller_id: 'sell-001',
    category_id: 'cat-001',
    product_name: 'ZenPad Ultra 11" Tablet',
    brand: 'ApexCompute',
    mrp: 599.00,
    stock_qty: 22,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'
  },
  {
    product_id: 'prod-012',
    seller_id: 'sell-001',
    category_id: 'cat-001',
    product_name: 'MechStrike RGB Gaming Keyboard',
    brand: 'ByteForce',
    mrp: 119.99,
    stock_qty: 40,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'
  },
  {
    product_id: 'prod-013',
    seller_id: 'sell-001',
    category_id: 'cat-001',
    product_name: 'ProStream 27" 4K Monitor',
    brand: 'VisionTech',
    mrp: 449.99,
    stock_qty: 15,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY: Apparel & Fashion (cat-002) — 10 Products
  // ═══════════════════════════════════════════════════════════════
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
    product_id: 'prod-014',
    seller_id: 'sell-002',
    category_id: 'cat-002',
    product_name: 'Slim Fit Denim Jeans',
    brand: 'UrbanCraft',
    mrp: 64.99,
    stock_qty: 70,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'
  },
  {
    product_id: 'prod-015',
    seller_id: 'sell-002',
    category_id: 'cat-002',
    product_name: 'Premium Cotton Polo T-Shirt',
    brand: 'ThreadLine',
    mrp: 39.99,
    stock_qty: 120,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'
  },
  {
    product_id: 'prod-016',
    seller_id: 'sell-002',
    category_id: 'cat-002',
    product_name: 'Aviator Polarized Sunglasses',
    brand: 'OpticVue',
    mrp: 59.99,
    stock_qty: 90,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'
  },
  {
    product_id: 'prod-017',
    seller_id: 'sell-002',
    category_id: 'cat-002',
    product_name: 'Canvas Weekender Travel Bag',
    brand: 'NomadGear',
    mrp: 79.99,
    stock_qty: 35,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'
  },
  {
    product_id: 'prod-018',
    seller_id: 'sell-002',
    category_id: 'cat-002',
    product_name: 'Woolen Knit Beanie Cap',
    brand: 'ThreadLine',
    mrp: 24.99,
    stock_qty: 150,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600'
  },
  {
    product_id: 'prod-019',
    seller_id: 'sell-002',
    category_id: 'cat-002',
    product_name: 'Formal Oxford Dress Shoes',
    brand: 'ClassicStep',
    mrp: 119.99,
    stock_qty: 28,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600'
  },
  {
    product_id: 'prod-020',
    seller_id: 'sell-002',
    category_id: 'cat-002',
    product_name: 'Floral Print Summer Dress',
    brand: 'BloomStyle',
    mrp: 54.99,
    stock_qty: 45,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'
  },
  {
    product_id: 'prod-021',
    seller_id: 'sell-002',
    category_id: 'cat-002',
    product_name: 'Genuine Leather Belt',
    brand: 'UrbanCraft',
    mrp: 34.99,
    stock_qty: 85,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600'
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY: Home & Living (cat-003) — 10 Products
  // ═══════════════════════════════════════════════════════════════
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
  },
  {
    product_id: 'prod-022',
    seller_id: 'sell-001',
    category_id: 'cat-003',
    product_name: 'Ergonomic Office Chair',
    brand: 'ComfortZone',
    mrp: 299.99,
    stock_qty: 20,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600'
  },
  {
    product_id: 'prod-023',
    seller_id: 'sell-001',
    category_id: 'cat-003',
    product_name: 'Minimalist Wooden Coffee Table',
    brand: 'OakCraft',
    mrp: 189.99,
    stock_qty: 14,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600'
  },
  {
    product_id: 'prod-024',
    seller_id: 'sell-001',
    category_id: 'cat-003',
    product_name: 'Ceramic Planter Set (Pack of 3)',
    brand: 'GreenNest',
    mrp: 44.99,
    stock_qty: 55,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600'
  },
  {
    product_id: 'prod-025',
    seller_id: 'sell-001',
    category_id: 'cat-003',
    product_name: 'Velvet Throw Pillow Covers (Set of 4)',
    brand: 'CozyHome',
    mrp: 29.99,
    stock_qty: 80,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1584100936595-c0c9f006b80f?w=600'
  },
  {
    product_id: 'prod-026',
    seller_id: 'sell-001',
    category_id: 'cat-003',
    product_name: 'Stainless Steel Cookware Set (10-Piece)',
    brand: 'ChefPrime',
    mrp: 149.99,
    stock_qty: 25,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'
  },
  {
    product_id: 'prod-027',
    seller_id: 'sell-001',
    category_id: 'cat-003',
    product_name: 'Aromatherapy Essential Oil Diffuser',
    brand: 'ZenAura',
    mrp: 39.99,
    stock_qty: 70,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600'
  },
  {
    product_id: 'prod-028',
    seller_id: 'sell-001',
    category_id: 'cat-003',
    product_name: 'Wall-Mounted Floating Shelves (Set of 3)',
    brand: 'OakCraft',
    mrp: 69.99,
    stock_qty: 38,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600'
  },
  {
    product_id: 'prod-029',
    seller_id: 'sell-001',
    category_id: 'cat-003',
    product_name: 'Turkish Cotton Bath Towel Set',
    brand: 'CozyHome',
    mrp: 54.99,
    stock_qty: 60,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=600'
  },
  {
    product_id: 'prod-030',
    seller_id: 'sell-001',
    category_id: 'cat-003',
    product_name: 'Smart WiFi Air Purifier',
    brand: 'PureBreeze',
    mrp: 179.99,
    stock_qty: 16,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600'
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY: Books & Stationery (cat-004) — 10 Products
  // ═══════════════════════════════════════════════════════════════
  {
    product_id: 'prod-031',
    seller_id: 'sell-002',
    category_id: 'cat-004',
    product_name: 'The Art of Programming (Hardcover)',
    brand: 'TechPress',
    mrp: 49.99,
    stock_qty: 40,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'
  },
  {
    product_id: 'prod-032',
    seller_id: 'sell-002',
    category_id: 'cat-004',
    product_name: 'Premium Leather-Bound Journal',
    brand: 'InkCraft',
    mrp: 34.99,
    stock_qty: 55,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'
  },
  {
    product_id: 'prod-033',
    seller_id: 'sell-002',
    category_id: 'cat-004',
    product_name: 'Watercolor Paint Set (48 Colors)',
    brand: 'ArtistChoice',
    mrp: 29.99,
    stock_qty: 65,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600'
  },
  {
    product_id: 'prod-034',
    seller_id: 'sell-002',
    category_id: 'cat-004',
    product_name: 'Classic Fiction Collection (Box Set)',
    brand: 'LitWorld',
    mrp: 79.99,
    stock_qty: 30,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'
  },
  {
    product_id: 'prod-035',
    seller_id: 'sell-002',
    category_id: 'cat-004',
    product_name: 'Architect Precision Pen Set',
    brand: 'InkCraft',
    mrp: 19.99,
    stock_qty: 100,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600'
  },
  {
    product_id: 'prod-036',
    seller_id: 'sell-002',
    category_id: 'cat-004',
    product_name: 'Data Science & AI Handbook',
    brand: 'TechPress',
    mrp: 59.99,
    stock_qty: 35,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600'
  },
  {
    product_id: 'prod-037',
    seller_id: 'sell-002',
    category_id: 'cat-004',
    product_name: 'Sketch & Draw A3 Pad (100 Sheets)',
    brand: 'ArtistChoice',
    mrp: 14.99,
    stock_qty: 90,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600'
  },
  {
    product_id: 'prod-038',
    seller_id: 'sell-002',
    category_id: 'cat-004',
    product_name: 'World Atlas & Geography Encyclopedia',
    brand: 'LitWorld',
    mrp: 44.99,
    stock_qty: 25,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600'
  },
  {
    product_id: 'prod-039',
    seller_id: 'sell-002',
    category_id: 'cat-004',
    product_name: 'Executive Desk Organizer (Bamboo)',
    brand: 'InkCraft',
    mrp: 39.99,
    stock_qty: 42,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'
  },
  {
    product_id: 'prod-040',
    seller_id: 'sell-002',
    category_id: 'cat-004',
    product_name: 'Motivational Planner & Goal Tracker',
    brand: 'InkCraft',
    mrp: 24.99,
    stock_qty: 75,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600'
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY: Toys (cat-005) — 10 Products
  // ═══════════════════════════════════════════════════════════════
  {
    product_id: 'prod-041',
    seller_id: 'sell-002',
    category_id: 'cat-005',
    product_name: 'LEGO Starship Building Toy Set',
    brand: 'BrickMaster',
    mrp: 69.99,
    stock_qty: 45,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600'
  },
  {
    product_id: 'prod-042',
    seller_id: 'sell-001',
    category_id: 'cat-005',
    product_name: 'RC High-Speed Monster Truck Toy',
    brand: 'TurboPlay',
    mrp: 49.99,
    stock_qty: 35,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600'
  },
  {
    product_id: 'prod-043',
    seller_id: 'sell-002',
    category_id: 'cat-005',
    product_name: 'Plush Cuddle Bear Soft Toy',
    brand: 'WarmHug',
    mrp: 24.99,
    stock_qty: 80,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600'
  },
  {
    product_id: 'prod-044',
    seller_id: 'sell-002',
    category_id: 'cat-005',
    product_name: 'Educational Wooden Puzzle Toy Set',
    brand: 'SmartKidz',
    mrp: 19.99,
    stock_qty: 60,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600'
  },
  {
    product_id: 'prod-045',
    seller_id: 'sell-001',
    category_id: 'cat-005',
    product_name: 'RoboTech Transforming Action Toy',
    brand: 'MechPlay',
    mrp: 34.99,
    stock_qty: 50,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600'
  },
  {
    product_id: 'prod-046',
    seller_id: 'sell-002',
    category_id: 'cat-005',
    product_name: 'Classic Wooden Train Track Toy',
    brand: 'TrackCraft',
    mrp: 39.99,
    stock_qty: 40,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600'
  },
  {
    product_id: 'prod-047',
    seller_id: 'sell-001',
    category_id: 'cat-005',
    product_name: 'Kids DIY Science Experiment Toy Kit',
    brand: 'SmartKidz',
    mrp: 29.99,
    stock_qty: 55,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600'
  },
  {
    product_id: 'prod-048',
    seller_id: 'sell-002',
    category_id: 'cat-005',
    product_name: 'Magnetic Building Blocks Toy Set',
    brand: 'BrickMaster',
    mrp: 44.99,
    stock_qty: 70,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600'
  },
  {
    product_id: 'prod-049',
    seller_id: 'sell-002',
    category_id: 'cat-005',
    product_name: 'Super Hero Action Figure Toy Set',
    brand: 'HeroForge',
    mrp: 27.99,
    stock_qty: 65,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=600'
  },
  {
    product_id: 'prod-050',
    seller_id: 'sell-002',
    category_id: 'cat-005',
    product_name: 'Interactive Singing Bird Toy',
    brand: 'WarmHug',
    mrp: 22.99,
    stock_qty: 90,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600'
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY: Games (cat-006) — 10 Products
  // ═══════════════════════════════════════════════════════════════
  {
    product_id: 'prod-051',
    seller_id: 'sell-001',
    category_id: 'cat-006',
    product_name: 'Wireless Game Controller for PS5 & PC',
    brand: 'NexusPlay',
    mrp: 69.99,
    stock_qty: 40,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600'
  },
  {
    product_id: 'prod-052',
    seller_id: 'sell-001',
    category_id: 'cat-006',
    product_name: 'Surround Sound Wireless Game Headset',
    brand: 'AudioStrike',
    mrp: 99.99,
    stock_qty: 35,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600'
  },
  {
    product_id: 'prod-053',
    seller_id: 'sell-001',
    category_id: 'cat-006',
    product_name: 'Retro Arcade Mini Video Game Cabinet',
    brand: 'PixelArcade',
    mrp: 59.99,
    stock_qty: 50,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600'
  },
  {
    product_id: 'prod-054',
    seller_id: 'sell-002',
    category_id: 'cat-006',
    product_name: 'Kingdoms Strategy Medieval Board Game',
    brand: 'GuildGames',
    mrp: 49.99,
    stock_qty: 60,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600'
  },
  {
    product_id: 'prod-055',
    seller_id: 'sell-001',
    category_id: 'cat-006',
    product_name: 'RGB Optical Wireless Game Mouse',
    brand: 'ViperEdge',
    mrp: 45.99,
    stock_qty: 85,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'
  },
  {
    product_id: 'prod-056',
    seller_id: 'sell-001',
    category_id: 'cat-006',
    product_name: 'CyberStrike VR Virtual Reality Game Headset',
    brand: 'NexusPlay',
    mrp: 299.99,
    stock_qty: 15,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600'
  },
  {
    product_id: 'prod-057',
    seller_id: 'sell-002',
    category_id: 'cat-006',
    product_name: 'Tabletop Soccer Action Board Game',
    brand: 'ArenaPlay',
    mrp: 39.99,
    stock_qty: 30,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600'
  },
  {
    product_id: 'prod-058',
    seller_id: 'sell-002',
    category_id: 'cat-006',
    product_name: 'Tournament Wooden Chess Set Strategy Game',
    brand: 'GrandMaster',
    mrp: 34.99,
    stock_qty: 45,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600'
  },
  {
    product_id: 'prod-059',
    seller_id: 'sell-001',
    category_id: 'cat-006',
    product_name: 'Handheld Retro Game Console (500 Built-in Games)',
    brand: 'PixelArcade',
    mrp: 39.99,
    stock_qty: 75,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=600'
  },
  {
    product_id: 'prod-060',
    seller_id: 'sell-001',
    category_id: 'cat-006',
    product_name: 'RGB XXL Desk Mat & Game Mouse Pad',
    brand: 'ViperEdge',
    mrp: 24.99,
    stock_qty: 110,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1616588589596-19349e59d997?w=600'
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY: Beauty (cat-007) — 10 Products
  // ═══════════════════════════════════════════════════════════════
  {
    product_id: 'prod-061',
    seller_id: 'sell-002',
    category_id: 'cat-007',
    product_name: 'Radiance Hydrating Face Serum Beauty Oil',
    brand: 'GlowSkin',
    mrp: 38.99,
    stock_qty: 80,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'
  },
  {
    product_id: 'prod-062',
    seller_id: 'sell-002',
    category_id: 'cat-007',
    product_name: 'Organic Herbal Foaming Face Wash Beauty Cleanser',
    brand: 'PureBotanics',
    mrp: 22.99,
    stock_qty: 95,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'
  },
  {
    product_id: 'prod-063',
    seller_id: 'sell-002',
    category_id: 'cat-007',
    product_name: 'Velvet Matte Long-Wear Lipstick Beauty Set',
    brand: 'LuxeShade',
    mrp: 29.99,
    stock_qty: 60,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'
  },
  {
    product_id: 'prod-064',
    seller_id: 'sell-002',
    category_id: 'cat-007',
    product_name: 'Vitamin C Brightening Moisturizer Beauty Cream',
    brand: 'GlowSkin',
    mrp: 34.99,
    stock_qty: 75,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600'
  },
  {
    product_id: 'prod-065',
    seller_id: 'sell-001',
    category_id: 'cat-007',
    product_name: 'Professional Ionic Hair Dryer Beauty Blower',
    brand: 'SalonPro',
    mrp: 79.99,
    stock_qty: 30,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600'
  },
  {
    product_id: 'prod-066',
    seller_id: 'sell-002',
    category_id: 'cat-007',
    product_name: 'Mineral Sunscreen SPF 50 Broad Spectrum Beauty Lotion',
    brand: 'SunShield',
    mrp: 26.99,
    stock_qty: 100,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600'
  },
  {
    product_id: 'prod-067',
    seller_id: 'sell-002',
    category_id: 'cat-007',
    product_name: 'Luxury Eau De Parfum Beauty Fragrance 100ml',
    brand: 'AuraScents',
    mrp: 89.99,
    stock_qty: 40,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'
  },
  {
    product_id: 'prod-068',
    seller_id: 'sell-002',
    category_id: 'cat-007',
    product_name: 'Exfoliating Arabica Coffee Body Scrub Beauty Polish',
    brand: 'PureBotanics',
    mrp: 19.99,
    stock_qty: 85,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1556228722-d0b71f3b392b?w=600'
  },
  {
    product_id: 'prod-069',
    seller_id: 'sell-002',
    category_id: 'cat-007',
    product_name: 'Pro Makeup Brush Set (15-Piece) Beauty Kit',
    brand: 'LuxeShade',
    mrp: 32.99,
    stock_qty: 65,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600'
  },
  {
    product_id: 'prod-070',
    seller_id: 'sell-002',
    category_id: 'cat-007',
    product_name: 'Deep Repair Argan Oil Hair Mask Beauty Care',
    brand: 'SalonPro',
    mrp: 24.99,
    stock_qty: 70,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600'
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY: Watches (cat-008) — 10 Products
  // ═══════════════════════════════════════════════════════════════
  {
    product_id: 'prod-071',
    seller_id: 'sell-001',
    category_id: 'cat-008',
    product_name: 'Chronograph Stainless Steel Luxury Watch',
    brand: 'Chronos',
    mrp: 189.99,
    stock_qty: 25,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600'
  },
  {
    product_id: 'prod-072',
    seller_id: 'sell-001',
    category_id: 'cat-008',
    product_name: 'Titanium Fitness Smart Watch with Heart Rate Monitor',
    brand: 'AeroTech',
    mrp: 149.99,
    stock_qty: 45,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600'
  },
  {
    product_id: 'prod-073',
    seller_id: 'sell-002',
    category_id: 'cat-008',
    product_name: 'Vintage Brown Leather Minimalist Quartz Watch',
    brand: 'NordicTime',
    mrp: 119.99,
    stock_qty: 35,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600'
  },
  {
    product_id: 'prod-074',
    seller_id: 'sell-001',
    category_id: 'cat-008',
    product_name: 'Diver 200m Waterproof Automatic Mechanical Watch',
    brand: 'OceanDeep',
    mrp: 249.99,
    stock_qty: 20,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1547996160-71dfabb1a7b4?w=600'
  },
  {
    product_id: 'prod-075',
    seller_id: 'sell-002',
    category_id: 'cat-008',
    product_name: 'Rose Gold Diamond Accent Women Luxury Watch',
    brand: 'Elegance',
    mrp: 159.99,
    stock_qty: 30,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'
  },
  {
    product_id: 'prod-076',
    seller_id: 'sell-001',
    category_id: 'cat-008',
    product_name: 'Military Tactical Shockproof Digital Sport Watch',
    brand: 'ToughGear',
    mrp: 59.99,
    stock_qty: 60,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600'
  },
  {
    product_id: 'prod-077',
    seller_id: 'sell-001',
    category_id: 'cat-008',
    product_name: 'Solar-Powered Eco Chronometer Field Watch',
    brand: 'Chronos',
    mrp: 199.99,
    stock_qty: 22,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600'
  },
  {
    product_id: 'prod-078',
    seller_id: 'sell-001',
    category_id: 'cat-008',
    product_name: 'Ultra AMOLED Touchscreen Bluetooth Smart Watch',
    brand: 'AeroTech',
    mrp: 129.99,
    stock_qty: 50,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600'
  },
  {
    product_id: 'prod-079',
    seller_id: 'sell-002',
    category_id: 'cat-008',
    product_name: 'Skeleton Dial Automatic Movement Men Watch',
    brand: 'NordicTime',
    mrp: 279.99,
    stock_qty: 15,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'
  },
  {
    product_id: 'prod-080',
    seller_id: 'sell-002',
    category_id: 'cat-008',
    product_name: 'Ultra-Slim Mesh Band Quartz Elegant Watch',
    brand: 'Elegance',
    mrp: 89.99,
    stock_qty: 40,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600'
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY: Sports (cat-009) — 10 Products
  // ═══════════════════════════════════════════════════════════════
  {
    product_id: 'prod-081',
    seller_id: 'sell-002',
    category_id: 'cat-009',
    product_name: 'Official Pro Match Basketball Sport Size 7',
    brand: 'Courtside',
    mrp: 34.99,
    stock_qty: 60,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=600'
  },
  {
    product_id: 'prod-082',
    seller_id: 'sell-002',
    category_id: 'cat-009',
    product_name: 'Thermal Bonded Tournament Soccer Ball Sport',
    brand: 'StrikerPro',
    mrp: 29.99,
    stock_qty: 75,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=600'
  },
  {
    product_id: 'prod-083',
    seller_id: 'sell-002',
    category_id: 'cat-009',
    product_name: 'Graphite Tennis Racket with Cover Sport Pro',
    brand: 'AeroSpin',
    mrp: 119.99,
    stock_qty: 25,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600'
  },
  {
    product_id: 'prod-084',
    seller_id: 'sell-002',
    category_id: 'cat-009',
    product_name: 'Non-Slip Eco Alignment Yoga Mat Exercise Sport',
    brand: 'ZenFlex',
    mrp: 27.99,
    stock_qty: 90,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'
  },
  {
    product_id: 'prod-085',
    seller_id: 'sell-001',
    category_id: 'cat-009',
    product_name: 'Adjustable Cast Iron Dumbbells Pair 20kg Sport Fitness',
    brand: 'IronCore',
    mrp: 149.99,
    stock_qty: 20,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600'
  },
  {
    product_id: 'prod-086',
    seller_id: 'sell-002',
    category_id: 'cat-009',
    product_name: 'High-Speed Ball Bearing Jump Rope Sport Training',
    brand: 'ZenFlex',
    mrp: 14.99,
    stock_qty: 120,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600'
  },
  {
    product_id: 'prod-087',
    seller_id: 'sell-001',
    category_id: 'cat-009',
    product_name: 'Aero Cycling Helmet Mountain Bike Sport Safety',
    brand: 'TrailGuard',
    mrp: 49.99,
    stock_qty: 40,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=600'
  },
  {
    product_id: 'prod-088',
    seller_id: 'sell-002',
    category_id: 'cat-009',
    product_name: 'Insulated Stainless Steel Sport Water Bottle 1000ml',
    brand: 'HydroActive',
    mrp: 21.99,
    stock_qty: 100,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'
  },
  {
    product_id: 'prod-089',
    seller_id: 'sell-002',
    category_id: 'cat-009',
    product_name: 'Loop Resistance Exercise Bands (5-Pack) Sport Fitness',
    brand: 'IronCore',
    mrp: 19.99,
    stock_qty: 85,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600'
  },
  {
    product_id: 'prod-090',
    seller_id: 'sell-001',
    category_id: 'cat-009',
    product_name: 'Polarized UV400 Cycling Sunglasses Sport Eyewear',
    brand: 'TrailGuard',
    mrp: 39.99,
    stock_qty: 50,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600'
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY: Cameras (cat-010) — 10 Products
  // ═══════════════════════════════════════════════════════════════
  {
    product_id: 'prod-091',
    seller_id: 'sell-001',
    category_id: 'cat-010',
    product_name: 'Mirrorless 24.2MP 4K Video Digital Camera Body',
    brand: 'OpticPro',
    mrp: 799.99,
    stock_qty: 12,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'
  },
  {
    product_id: 'prod-092',
    seller_id: 'sell-001',
    category_id: 'cat-010',
    product_name: '50mm f/1.8 Prime Portrait Lens for DSLR Camera',
    brand: 'OpticPro',
    mrp: 179.99,
    stock_qty: 28,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600'
  },
  {
    product_id: 'prod-093',
    seller_id: 'sell-001',
    category_id: 'cat-010',
    product_name: 'Lightweight Aluminum Tripod with Ball Head for Camera',
    brand: 'SteadyShot',
    mrp: 69.99,
    stock_qty: 50,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600'
  },
  {
    product_id: 'prod-094',
    seller_id: 'sell-002',
    category_id: 'cat-010',
    product_name: 'Vintage Instant Print Photo Camera with Flash',
    brand: 'RetroSnap',
    mrp: 89.99,
    stock_qty: 40,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'
  },
  {
    product_id: 'prod-095',
    seller_id: 'sell-001',
    category_id: 'cat-010',
    product_name: '3-Axis Handheld Gimbal Stabilizer for Action Camera',
    brand: 'SteadyShot',
    mrp: 129.99,
    stock_qty: 30,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600'
  },
  {
    product_id: 'prod-096',
    seller_id: 'sell-001',
    category_id: 'cat-010',
    product_name: '4K Ultra HD Waterproof Action Camera with WiFi',
    brand: 'AquaCam',
    mrp: 149.99,
    stock_qty: 35,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600'
  },
  {
    product_id: 'prod-097',
    seller_id: 'sell-002',
    category_id: 'cat-010',
    product_name: 'Padded Shockproof DSLR Camera Backpack Case',
    brand: 'ShutterBag',
    mrp: 54.99,
    stock_qty: 45,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600'
  },
  {
    product_id: 'prod-098',
    seller_id: 'sell-001',
    category_id: 'cat-010',
    product_name: 'Dimmable Studio LED Ring Light with Stand for Camera',
    brand: 'Lumina',
    mrp: 39.99,
    stock_qty: 70,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600'
  },
  {
    product_id: 'prod-099',
    seller_id: 'sell-001',
    category_id: 'cat-010',
    product_name: 'Speedlight Wireless External Flash for Camera',
    brand: 'OpticPro',
    mrp: 99.99,
    stock_qty: 25,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=600'
  },
  {
    product_id: 'prod-100',
    seller_id: 'sell-001',
    category_id: 'cat-010',
    product_name: 'High-Speed 128GB V30 SDXC Memory Card for Camera',
    brand: 'FastData',
    mrp: 29.99,
    stock_qty: 150,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600'
  },

  // ═══════════════════════════════════════════════════════════════
  // CATEGORY: Phones (cat-011) — 10 Products
  // ═══════════════════════════════════════════════════════════════
  {
    product_id: 'prod-101',
    seller_id: 'sell-001',
    category_id: 'cat-011',
    product_name: 'AeroPhone Pro 5G Flagship Smartphone 256GB',
    brand: 'AeroTech',
    mrp: 899.99,
    stock_qty: 20,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'
  },
  {
    product_id: 'prod-102',
    seller_id: 'sell-001',
    category_id: 'cat-011',
    product_name: 'Titan Slim 5G Smartphone 128GB Mobile Phone',
    brand: 'ApexCompute',
    mrp: 649.99,
    stock_qty: 30,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'
  },
  {
    product_id: 'prod-103',
    seller_id: 'sell-001',
    category_id: 'cat-011',
    product_name: 'Fast 15W Magnetic Wireless Charging Pad for Phone',
    brand: 'VoltEdge',
    mrp: 34.99,
    stock_qty: 90,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1622445262464-84b14e3295b6?w=600'
  },
  {
    product_id: 'prod-104',
    seller_id: 'sell-002',
    category_id: 'cat-011',
    product_name: 'Crystal Clear Shockproof Protective Phone Case',
    brand: 'ShieldArmor',
    mrp: 16.99,
    stock_qty: 140,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600'
  },
  {
    product_id: 'prod-105',
    seller_id: 'sell-001',
    category_id: 'cat-011',
    product_name: 'Infinity Fold Dual-Screen Smartphone Phone 512GB',
    brand: 'AeroTech',
    mrp: 1399.99,
    stock_qty: 10,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600'
  },
  {
    product_id: 'prod-106',
    seller_id: 'sell-001',
    category_id: 'cat-011',
    product_name: 'Magnetic Car Air Vent Mount Holder for Smartphone Phone',
    brand: 'VoltEdge',
    mrp: 19.99,
    stock_qty: 110,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600'
  },
  {
    product_id: 'prod-107',
    seller_id: 'sell-001',
    category_id: 'cat-011',
    product_name: 'Nylon Braided USB-C Fast Charger Cable 2m Phone Cord',
    brand: 'VoltEdge',
    mrp: 12.99,
    stock_qty: 200,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600'
  },
  {
    product_id: 'prod-108',
    seller_id: 'sell-002',
    category_id: 'cat-011',
    product_name: 'Tempered Glass Screen Protector (3-Pack) for Phone',
    brand: 'ShieldArmor',
    mrp: 14.99,
    stock_qty: 160,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600'
  },
  {
    product_id: 'prod-109',
    seller_id: 'sell-001',
    category_id: 'cat-011',
    product_name: 'Flexible Bluetooth Selfie Stick Tripod Stand for Phone',
    brand: 'SteadyShot',
    mrp: 22.99,
    stock_qty: 80,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600'
  },
  {
    product_id: 'prod-110',
    seller_id: 'sell-001',
    category_id: 'cat-011',
    product_name: 'Smart Phone Core 64GB 4G LTE Unlocked Mobile',
    brand: 'ApexCompute',
    mrp: 199.99,
    stock_qty: 45,
    is_active: true,
    image_url: 'https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?w=600'
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

const nowMs = Date.now();
const formatTs = (ms) => new Date(ms).toISOString().replace('T', ' ').substring(0, 19);

export const sampleOrders = [
  {
    order_id: 'ord-001',
    customer_id: 'cust-001',
    address_id: 'addr-001',
    order_number: 'ORD-2026-88101',
    order_date: formatTs(nowMs - 7 * 86400000),
    shipping_date: formatTs(nowMs - 6 * 86400000),
    approx_delivery_date: formatTs(nowMs - 5 * 86400000).substring(0, 10),
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
    timestamp: formatTs(nowMs - 7 * 86400000)
  },
  {
    history_id: 'hist-002',
    order_id: 'ord-001',
    action: 'Forwarded to Seller by Employee',
    performed_by: 'employee@ecommerce.com',
    previous_status: 'ORDER_PLACED',
    new_status: 'SENT_TO_SELLER',
    timestamp: formatTs(nowMs - 6.5 * 86400000)
  },
  {
    history_id: 'hist-003',
    order_id: 'ord-001',
    action: 'Order Confirmed & Placed by Seller',
    performed_by: 'techworld@seller.com',
    previous_status: 'SENT_TO_SELLER',
    new_status: 'ORDER_CONFIRMED',
    timestamp: formatTs(nowMs - 6.2 * 86400000)
  },
  {
    history_id: 'hist-004',
    order_id: 'ord-001',
    action: 'Shipping Requested by Seller (Order Shipped, Approx Delivery: 4 days)',
    performed_by: 'techworld@seller.com',
    previous_status: 'ORDER_CONFIRMED',
    new_status: 'SHIPPED',
    timestamp: formatTs(nowMs - 6 * 86400000)
  },
  {
    history_id: 'hist-005',
    order_id: 'ord-001',
    action: 'Order Marked as Delivered by Employee',
    performed_by: 'employee@ecommerce.com',
    previous_status: 'SHIPPED',
    new_status: 'DELIVERED',
    timestamp: formatTs(nowMs - 5 * 86400000)
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
