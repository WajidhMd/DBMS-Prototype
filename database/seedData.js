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
    phone: '+1-800-555-0100',
    address: '100 Logistics Hub, North Wing, CA 95054',
    department: 'Operations & Fulfillment',
    status: 'Active'
  }
];

export const sampleWishlists = [
  {
    wishlist_id: 'wsh-001',
    user_id: 'usr-cust-001',
    product_id: 'prod-001',
    created_at: '2026-01-05 10:00:00'
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
  {
    "product_id": "prod-001",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "Quantum Pro Wireless Headphones",
    "brand": "AcousticTech",
    "mrp": 14999,
    "stock_qty": 45,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
  },
  {
    "product_id": "prod-002",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "UltraBook Max 15\" Laptop",
    "brand": "ApexCompute",
    "mrp": 96999,
    "stock_qty": 12,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"
  },
  {
    "product_id": "prod-003",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "AeroWatch Series 5 Smartwatch",
    "brand": "AeroTech",
    "mrp": 18999,
    "stock_qty": 30,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
  },
  {
    "product_id": "prod-007",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "NovaPod Pro Wireless Earbuds",
    "brand": "AcousticTech",
    "mrp": 9499,
    "stock_qty": 80,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-008",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "PixelLens 4K Action Camera",
    "brand": "VisionTech",
    "mrp": 25999,
    "stock_qty": 18,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1685615359827-aa31d97578e7?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-009",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "ThunderBass Portable Bluetooth Speaker",
    "brand": "AcousticTech",
    "mrp": 5999,
    "stock_qty": 65,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"
  },
  {
    "product_id": "prod-010",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "SwiftCharge 10000mAh Power Bank",
    "brand": "VoltEdge",
    "mrp": 1499,
    "stock_qty": 100,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600"
  },
  {
    "product_id": "prod-011",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "ZenPad Ultra 11\" Tablet",
    "brand": "ApexCompute",
    "mrp": 28999,
    "stock_qty": 22,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600"
  },
  {
    "product_id": "prod-012",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "MechStrike RGB Gaming Keyboard",
    "brand": "ByteForce",
    "mrp": 6499,
    "stock_qty": 40,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1626958390943-a70309376444?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-013",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "ProStream 27\" 4K Monitor",
    "brand": "VisionTech",
    "mrp": 28999,
    "stock_qty": 15,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600"
  },
  {
    "product_id": "prod-004",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Classic Leather Bomber Jacket",
    "brand": "UrbanCraft",
    "mrp": 10999,
    "stock_qty": 25,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"
  },
  {
    "product_id": "prod-005",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Ergonomic Running Shoes",
    "brand": "StrideFlex",
    "mrp": 6499,
    "stock_qty": 60,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
  },
  {
    "product_id": "prod-014",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Slim Fit Denim Jeans",
    "brand": "UrbanCraft",
    "mrp": 4999,
    "stock_qty": 70,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"
  },
  {
    "product_id": "prod-015",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Premium Cotton Polo T-Shirt",
    "brand": "ThreadLine",
    "mrp": 1499,
    "stock_qty": 120,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1625910513413-c23b8bb81cba?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-016",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Aviator Polarized Sunglasses",
    "brand": "OpticVue",
    "mrp": 2499,
    "stock_qty": 90,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"
  },
  {
    "product_id": "prod-017",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Canvas Weekender Travel Bag",
    "brand": "NomadGear",
    "mrp": 5999,
    "stock_qty": 35,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1448582649076-3981753123b5?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-018",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Woolen Knit Beanie Cap",
    "brand": "ThreadLine",
    "mrp": 699,
    "stock_qty": 150,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600"
  },
  {
    "product_id": "prod-019",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Formal Oxford Dress Shoes",
    "brand": "ClassicStep",
    "mrp": 8999,
    "stock_qty": 28,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600"
  },
  {
    "product_id": "prod-020",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Floral Print Summer Dress",
    "brand": "BloomStyle",
    "mrp": 3999,
    "stock_qty": 45,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"
  },
  {
    "product_id": "prod-021",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Genuine Leather Belt",
    "brand": "UrbanCraft",
    "mrp": 1299,
    "stock_qty": 85,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600"
  },
  {
    "product_id": "prod-006",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Smart Ambient Desk Lamp",
    "brand": "Lumina",
    "mrp": 4499,
    "stock_qty": 50,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"
  },
  {
    "product_id": "prod-022",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Ergonomic Office Chair",
    "brand": "ComfortZone",
    "mrp": 21999,
    "stock_qty": 20,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-023",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Minimalist Wooden Coffee Table",
    "brand": "OakCraft",
    "mrp": 13999,
    "stock_qty": 14,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-024",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Ceramic Planter Set (Pack of 3)",
    "brand": "GreenNest",
    "mrp": 1299,
    "stock_qty": 55,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600"
  },
  {
    "product_id": "prod-025",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Velvet Throw Pillow Covers (Set of 4)",
    "brand": "CozyHome",
    "mrp": 899,
    "stock_qty": 80,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1559051668-9024c9b5e84b?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-026",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Stainless Steel Cookware Set (10-Piece)",
    "brand": "ChefPrime",
    "mrp": 10999,
    "stock_qty": 25,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"
  },
  {
    "product_id": "prod-027",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Aromatherapy Essential Oil Diffuser",
    "brand": "ZenAura",
    "mrp": 1499,
    "stock_qty": 70,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1608571702346-bf078a741b19?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-028",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Wall-Mounted Floating Shelves (Set of 3)",
    "brand": "OakCraft",
    "mrp": 4999,
    "stock_qty": 38,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1597072689227-8882273e8f6a?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-029",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Turkish Cotton Bath Towel Set",
    "brand": "CozyHome",
    "mrp": 1499,
    "stock_qty": 60,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=600"
  },
  {
    "product_id": "prod-030",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Smart WiFi Air Purifier",
    "brand": "PureBreeze",
    "mrp": 12999,
    "stock_qty": 16,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1436473849883-bb3464c23e93?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-031",
    "seller_id": "sell-002",
    "category_id": "cat-004",
    "product_name": "The Art of Programming (Hardcover)",
    "brand": "TechPress",
    "mrp": 2499,
    "stock_qty": 40,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600"
  },
  {
    "product_id": "prod-032",
    "seller_id": "sell-002",
    "category_id": "cat-004",
    "product_name": "Premium Leather-Bound Journal",
    "brand": "InkCraft",
    "mrp": 999,
    "stock_qty": 55,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600"
  },
  {
    "product_id": "prod-033",
    "seller_id": "sell-002",
    "category_id": "cat-004",
    "product_name": "Watercolor Paint Set (48 Colors)",
    "brand": "ArtistChoice",
    "mrp": 1299,
    "stock_qty": 65,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600"
  },
  {
    "product_id": "prod-034",
    "seller_id": "sell-002",
    "category_id": "cat-004",
    "product_name": "Classic Fiction Collection (Box Set)",
    "brand": "LitWorld",
    "mrp": 5999,
    "stock_qty": 30,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-035",
    "seller_id": "sell-002",
    "category_id": "cat-004",
    "product_name": "Architect Precision Pen Set",
    "brand": "InkCraft",
    "mrp": 899,
    "stock_qty": 100,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600"
  },
  {
    "product_id": "prod-036",
    "seller_id": "sell-002",
    "category_id": "cat-004",
    "product_name": "Data Science & AI Handbook",
    "brand": "TechPress",
    "mrp": 4499,
    "stock_qty": 35,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600"
  },
  {
    "product_id": "prod-037",
    "seller_id": "sell-002",
    "category_id": "cat-004",
    "product_name": "Sketch & Draw A3 Pad (100 Sheets)",
    "brand": "ArtistChoice",
    "mrp": 599,
    "stock_qty": 90,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1525278070609-779c7adb7b71?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-038",
    "seller_id": "sell-002",
    "category_id": "cat-004",
    "product_name": "World Atlas & Geography Encyclopedia",
    "brand": "LitWorld",
    "mrp": 3499,
    "stock_qty": 25,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600"
  },
  {
    "product_id": "prod-039",
    "seller_id": "sell-002",
    "category_id": "cat-004",
    "product_name": "Executive Desk Organizer (Bamboo)",
    "brand": "InkCraft",
    "mrp": 1299,
    "stock_qty": 42,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1644463589256-02679b9c0767?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-040",
    "seller_id": "sell-002",
    "category_id": "cat-004",
    "product_name": "Motivational Planner & Goal Tracker",
    "brand": "InkCraft",
    "mrp": 799,
    "stock_qty": 75,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600"
  },
  {
    "product_id": "prod-041",
    "seller_id": "sell-002",
    "category_id": "cat-005",
    "product_name": "LEGO Starship Building Toy Set",
    "brand": "BrickMaster",
    "mrp": 4999,
    "stock_qty": 45,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600"
  },
  {
    "product_id": "prod-042",
    "seller_id": "sell-001",
    "category_id": "cat-005",
    "product_name": "RC High-Speed Monster Truck Toy",
    "brand": "TurboPlay",
    "mrp": 3499,
    "stock_qty": 35,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1673108231541-728d7873f93c?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-043",
    "seller_id": "sell-002",
    "category_id": "cat-005",
    "product_name": "Plush Cuddle Bear Soft Toy",
    "brand": "WarmHug",
    "mrp": 999,
    "stock_qty": 80,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600"
  },
  {
    "product_id": "prod-044",
    "seller_id": "sell-002",
    "category_id": "cat-005",
    "product_name": "Educational Wooden Puzzle Toy Set",
    "brand": "SmartKidz",
    "mrp": 899,
    "stock_qty": 60,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600"
  },
  {
    "product_id": "prod-045",
    "seller_id": "sell-001",
    "category_id": "cat-005",
    "product_name": "RoboTech Transforming Action Toy",
    "brand": "MechPlay",
    "mrp": 2499,
    "stock_qty": 50,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-046",
    "seller_id": "sell-002",
    "category_id": "cat-005",
    "product_name": "Classic Wooden Train Track Toy",
    "brand": "TrackCraft",
    "mrp": 2999,
    "stock_qty": 40,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-047",
    "seller_id": "sell-001",
    "category_id": "cat-005",
    "product_name": "Kids DIY Science Experiment Toy Kit",
    "brand": "SmartKidz",
    "mrp": 1299,
    "stock_qty": 55,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600"
  },
  {
    "product_id": "prod-048",
    "seller_id": "sell-002",
    "category_id": "cat-005",
    "product_name": "Magnetic Building Blocks Toy Set",
    "brand": "BrickMaster",
    "mrp": 3499,
    "stock_qty": 70,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1765403256661-c60b291c38ba?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-049",
    "seller_id": "sell-002",
    "category_id": "cat-005",
    "product_name": "Super Hero Action Figure Toy Set",
    "brand": "HeroForge",
    "mrp": 1999,
    "stock_qty": 65,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=600"
  },
  {
    "product_id": "prod-050",
    "seller_id": "sell-002",
    "category_id": "cat-005",
    "product_name": "Interactive Singing Bird Toy",
    "brand": "WarmHug",
    "mrp": 1699,
    "stock_qty": 90,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1776039775580-a6dee1cdfc0b?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-051",
    "seller_id": "sell-001",
    "category_id": "cat-006",
    "product_name": "Wireless Game Controller for PS5 & PC",
    "brand": "NexusPlay",
    "mrp": 4999,
    "stock_qty": 40,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600"
  },
  {
    "product_id": "prod-052",
    "seller_id": "sell-001",
    "category_id": "cat-006",
    "product_name": "Surround Sound Wireless Game Headset",
    "brand": "AudioStrike",
    "mrp": 7499,
    "stock_qty": 35,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
  },
  {
    "product_id": "prod-053",
    "seller_id": "sell-001",
    "category_id": "cat-006",
    "product_name": "Retro Arcade Mini Video Game Cabinet",
    "brand": "PixelArcade",
    "mrp": 4499,
    "stock_qty": 50,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600"
  },
  {
    "product_id": "prod-054",
    "seller_id": "sell-002",
    "category_id": "cat-006",
    "product_name": "Kingdoms Strategy Medieval Board Game",
    "brand": "GuildGames",
    "mrp": 3499,
    "stock_qty": 60,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600"
  },
  {
    "product_id": "prod-055",
    "seller_id": "sell-001",
    "category_id": "cat-006",
    "product_name": "RGB Optical Wireless Game Mouse",
    "brand": "ViperEdge",
    "mrp": 3499,
    "stock_qty": 85,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1628832307345-7404b47f1751?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-056",
    "seller_id": "sell-001",
    "category_id": "cat-006",
    "product_name": "CyberStrike VR Virtual Reality Game Headset",
    "brand": "NexusPlay",
    "mrp": 21999,
    "stock_qty": 15,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-057",
    "seller_id": "sell-002",
    "category_id": "cat-006",
    "product_name": "Tabletop Soccer Action Board Game",
    "brand": "ArenaPlay",
    "mrp": 2999,
    "stock_qty": 30,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1588318073076-7030f7040046?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-058",
    "seller_id": "sell-002",
    "category_id": "cat-006",
    "product_name": "Tournament Wooden Chess Set Strategy Game",
    "brand": "GrandMaster",
    "mrp": 2499,
    "stock_qty": 45,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600"
  },
  {
    "product_id": "prod-059",
    "seller_id": "sell-001",
    "category_id": "cat-006",
    "product_name": "Handheld Retro Game Console (500 Built-in Games)",
    "brand": "PixelArcade",
    "mrp": 2999,
    "stock_qty": 75,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=600"
  },
  {
    "product_id": "prod-060",
    "seller_id": "sell-001",
    "category_id": "cat-006",
    "product_name": "RGB XXL Desk Mat & Game Mouse Pad",
    "brand": "ViperEdge",
    "mrp": 1899,
    "stock_qty": 110,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1696710257827-75e2e5954059?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-061",
    "seller_id": "sell-002",
    "category_id": "cat-007",
    "product_name": "Radiance Hydrating Face Serum Beauty Oil",
    "brand": "GlowSkin",
    "mrp": 2999,
    "stock_qty": 80,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600"
  },
  {
    "product_id": "prod-062",
    "seller_id": "sell-002",
    "category_id": "cat-007",
    "product_name": "Organic Herbal Foaming Face Wash Beauty Cleanser",
    "brand": "PureBotanics",
    "mrp": 599,
    "stock_qty": 95,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"
  },
  {
    "product_id": "prod-063",
    "seller_id": "sell-002",
    "category_id": "cat-007",
    "product_name": "Velvet Matte Long-Wear Lipstick Beauty Set",
    "brand": "LuxeShade",
    "mrp": 999,
    "stock_qty": 60,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600"
  },
  {
    "product_id": "prod-064",
    "seller_id": "sell-002",
    "category_id": "cat-007",
    "product_name": "Vitamin C Brightening Moisturizer Beauty Cream",
    "brand": "GlowSkin",
    "mrp": 2499,
    "stock_qty": 75,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1625753783470-ec2ab4efeeec?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-065",
    "seller_id": "sell-001",
    "category_id": "cat-007",
    "product_name": "Professional Ionic Hair Dryer Beauty Blower",
    "brand": "SalonPro",
    "mrp": 5999,
    "stock_qty": 30,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-066",
    "seller_id": "sell-002",
    "category_id": "cat-007",
    "product_name": "Mineral Sunscreen SPF 50 Broad Spectrum Beauty Lotion",
    "brand": "SunShield",
    "mrp": 1999,
    "stock_qty": 100,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600"
  },
  {
    "product_id": "prod-067",
    "seller_id": "sell-002",
    "category_id": "cat-007",
    "product_name": "Luxury Eau De Parfum Beauty Fragrance 100ml",
    "brand": "AuraScents",
    "mrp": 6499,
    "stock_qty": 40,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600"
  },
  {
    "product_id": "prod-068",
    "seller_id": "sell-002",
    "category_id": "cat-007",
    "product_name": "Exfoliating Arabica Coffee Body Scrub Beauty Polish",
    "brand": "PureBotanics",
    "mrp": 1499,
    "stock_qty": 85,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1667803546535-81f5b1c4dbfb?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-069",
    "seller_id": "sell-002",
    "category_id": "cat-007",
    "product_name": "Pro Makeup Brush Set (15-Piece) Beauty Kit",
    "brand": "LuxeShade",
    "mrp": 2499,
    "stock_qty": 65,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1620464003286-a5b0d79f32c2?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-070",
    "seller_id": "sell-002",
    "category_id": "cat-007",
    "product_name": "Deep Repair Argan Oil Hair Mask Beauty Care",
    "brand": "SalonPro",
    "mrp": 899,
    "stock_qty": 70,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600"
  },
  {
    "product_id": "prod-071",
    "seller_id": "sell-001",
    "category_id": "cat-008",
    "product_name": "Chronograph Stainless Steel Luxury Watch",
    "brand": "Chronos",
    "mrp": 13999,
    "stock_qty": 25,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600"
  },
  {
    "product_id": "prod-072",
    "seller_id": "sell-001",
    "category_id": "cat-008",
    "product_name": "Titanium Fitness Smart Watch with Heart Rate Monitor",
    "brand": "AeroTech",
    "mrp": 10999,
    "stock_qty": 45,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600"
  },
  {
    "product_id": "prod-073",
    "seller_id": "sell-002",
    "category_id": "cat-008",
    "product_name": "Vintage Brown Leather Minimalist Quartz Watch",
    "brand": "NordicTime",
    "mrp": 8999,
    "stock_qty": 35,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-074",
    "seller_id": "sell-001",
    "category_id": "cat-008",
    "product_name": "Diver 200m Waterproof Automatic Mechanical Watch",
    "brand": "OceanDeep",
    "mrp": 18999,
    "stock_qty": 20,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1542816340-4d3de5047cfd?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-075",
    "seller_id": "sell-002",
    "category_id": "cat-008",
    "product_name": "Rose Gold Diamond Accent Women Luxury Watch",
    "brand": "Elegance",
    "mrp": 11999,
    "stock_qty": 30,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1525740664269-1bb17f251737?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-076",
    "seller_id": "sell-001",
    "category_id": "cat-008",
    "product_name": "Military Tactical Shockproof Digital Sport Watch",
    "brand": "ToughGear",
    "mrp": 4499,
    "stock_qty": 60,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1783792353186-69f53a804d96?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-077",
    "seller_id": "sell-001",
    "category_id": "cat-008",
    "product_name": "Solar-Powered Eco Chronometer Field Watch",
    "brand": "Chronos",
    "mrp": 14999,
    "stock_qty": 22,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1727391484073-8d37dd702e13?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-078",
    "seller_id": "sell-001",
    "category_id": "cat-008",
    "product_name": "Ultra AMOLED Touchscreen Bluetooth Smart Watch",
    "brand": "AeroTech",
    "mrp": 9499,
    "stock_qty": 50,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600"
  },
  {
    "product_id": "prod-079",
    "seller_id": "sell-002",
    "category_id": "cat-008",
    "product_name": "Skeleton Dial Automatic Movement Men Watch",
    "brand": "NordicTime",
    "mrp": 20999,
    "stock_qty": 15,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1618215649872-6e3143a716ec?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-080",
    "seller_id": "sell-002",
    "category_id": "cat-008",
    "product_name": "Ultra-Slim Mesh Band Quartz Elegant Watch",
    "brand": "Elegance",
    "mrp": 6499,
    "stock_qty": 40,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600"
  },
  {
    "product_id": "prod-081",
    "seller_id": "sell-002",
    "category_id": "cat-009",
    "product_name": "Official Pro Match Basketball Sport Size 7",
    "brand": "Courtside",
    "mrp": 1499,
    "stock_qty": 60,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-082",
    "seller_id": "sell-002",
    "category_id": "cat-009",
    "product_name": "Thermal Bonded Tournament Soccer Ball Sport",
    "brand": "StrikerPro",
    "mrp": 1499,
    "stock_qty": 75,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=600"
  },
  {
    "product_id": "prod-083",
    "seller_id": "sell-002",
    "category_id": "cat-009",
    "product_name": "Graphite Tennis Racket with Cover Sport Pro",
    "brand": "AeroSpin",
    "mrp": 8999,
    "stock_qty": 25,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600"
  },
  {
    "product_id": "prod-084",
    "seller_id": "sell-002",
    "category_id": "cat-009",
    "product_name": "Non-Slip Eco Alignment Yoga Mat Exercise Sport",
    "brand": "ZenFlex",
    "mrp": 1299,
    "stock_qty": 90,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600"
  },
  {
    "product_id": "prod-085",
    "seller_id": "sell-001",
    "category_id": "cat-009",
    "product_name": "Adjustable Cast Iron Dumbbells Pair 20kg Sport Fitness",
    "brand": "IronCore",
    "mrp": 10999,
    "stock_qty": 20,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600"
  },
  {
    "product_id": "prod-086",
    "seller_id": "sell-002",
    "category_id": "cat-009",
    "product_name": "High-Speed Ball Bearing Jump Rope Sport Training",
    "brand": "ZenFlex",
    "mrp": 599,
    "stock_qty": 120,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1516876345887-6dd74f80787a?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-087",
    "seller_id": "sell-001",
    "category_id": "cat-009",
    "product_name": "Aero Cycling Helmet Mountain Bike Sport Safety",
    "brand": "TrailGuard",
    "mrp": 3499,
    "stock_qty": 40,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1591511275477-88f079d88154?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-088",
    "seller_id": "sell-002",
    "category_id": "cat-009",
    "product_name": "Insulated Stainless Steel Sport Water Bottle 1000ml",
    "brand": "HydroActive",
    "mrp": 899,
    "stock_qty": 100,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600"
  },
  {
    "product_id": "prod-089",
    "seller_id": "sell-002",
    "category_id": "cat-009",
    "product_name": "Loop Resistance Exercise Bands (5-Pack) Sport Fitness",
    "brand": "IronCore",
    "mrp": 699,
    "stock_qty": 85,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-090",
    "seller_id": "sell-001",
    "category_id": "cat-009",
    "product_name": "Polarized UV400 Cycling Sunglasses Sport Eyewear",
    "brand": "TrailGuard",
    "mrp": 1499,
    "stock_qty": 50,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
  },
  {
    "product_id": "prod-091",
    "seller_id": "sell-001",
    "category_id": "cat-010",
    "product_name": "Mirrorless 24.2MP 4K Video Digital Camera Body",
    "brand": "OpticPro",
    "mrp": 59999,
    "stock_qty": 12,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"
  },
  {
    "product_id": "prod-092",
    "seller_id": "sell-001",
    "category_id": "cat-010",
    "product_name": "50mm f/1.8 Prime Portrait Lens for DSLR Camera",
    "brand": "OpticPro",
    "mrp": 12999,
    "stock_qty": 28,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600"
  },
  {
    "product_id": "prod-093",
    "seller_id": "sell-001",
    "category_id": "cat-010",
    "product_name": "Lightweight Aluminum Tripod with Ball Head for Camera",
    "brand": "SteadyShot",
    "mrp": 3499,
    "stock_qty": 50,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1634680582783-0b06ca18a449?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-094",
    "seller_id": "sell-002",
    "category_id": "cat-010",
    "product_name": "Vintage Instant Print Photo Camera with Flash",
    "brand": "RetroSnap",
    "mrp": 6499,
    "stock_qty": 40,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600"
  },
  {
    "product_id": "prod-095",
    "seller_id": "sell-001",
    "category_id": "cat-010",
    "product_name": "3-Axis Handheld Gimbal Stabilizer for Action Camera",
    "brand": "SteadyShot",
    "mrp": 9499,
    "stock_qty": 30,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1626362729742-d394ea4c6f43?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-096",
    "seller_id": "sell-001",
    "category_id": "cat-010",
    "product_name": "4K Ultra HD Waterproof Action Camera with WiFi",
    "brand": "AquaCam",
    "mrp": 10999,
    "stock_qty": 35,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1484506399805-c273b8e91dce?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-097",
    "seller_id": "sell-002",
    "category_id": "cat-010",
    "product_name": "Padded Shockproof DSLR Camera Backpack Case",
    "brand": "ShutterBag",
    "mrp": 3999,
    "stock_qty": 45,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600"
  },
  {
    "product_id": "prod-098",
    "seller_id": "sell-001",
    "category_id": "cat-010",
    "product_name": "Dimmable Studio LED Ring Light with Stand for Camera",
    "brand": "Lumina",
    "mrp": 2999,
    "stock_qty": 70,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1673196649671-eb09066ad6c1?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-099",
    "seller_id": "sell-001",
    "category_id": "cat-010",
    "product_name": "Speedlight Wireless External Flash for Camera",
    "brand": "OpticPro",
    "mrp": 7499,
    "stock_qty": 25,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1551779420-2ec52303f5e1?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-100",
    "seller_id": "sell-001",
    "category_id": "cat-010",
    "product_name": "High-Speed 128GB V30 SDXC Memory Card for Camera",
    "brand": "FastData",
    "mrp": 1999,
    "stock_qty": 150,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1589532768434-a92c95dad7cb?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-101",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "AeroPhone Pro 5G Flagship Smartphone 256GB",
    "brand": "AeroTech",
    "mrp": 66999,
    "stock_qty": 20,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
  },
  {
    "product_id": "prod-102",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "Titan Slim 5G Smartphone 128GB Mobile Phone",
    "brand": "ApexCompute",
    "mrp": 48999,
    "stock_qty": 30,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600"
  },
  {
    "product_id": "prod-103",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "Fast 15W Magnetic Wireless Charging Pad for Phone",
    "brand": "VoltEdge",
    "mrp": 1499,
    "stock_qty": 90,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1633381638729-27f730955c23?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-104",
    "seller_id": "sell-002",
    "category_id": "cat-011",
    "product_name": "Crystal Clear Shockproof Protective Phone Case",
    "brand": "ShieldArmor",
    "mrp": 499,
    "stock_qty": 140,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600"
  },
  {
    "product_id": "prod-105",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "Infinity Fold Dual-Screen Smartphone Phone 512GB",
    "brand": "AeroTech",
    "mrp": 104999,
    "stock_qty": 10,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600"
  },
  {
    "product_id": "prod-106",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "Magnetic Car Air Vent Mount Holder for Smartphone Phone",
    "brand": "VoltEdge",
    "mrp": 799,
    "stock_qty": 110,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1764347923709-fc48487f2486?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-107",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "Nylon Braided USB-C Fast Charger Cable 2m Phone Cord",
    "brand": "VoltEdge",
    "mrp": 499,
    "stock_qty": 200,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1572721546624-05bf65ad7679?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-108",
    "seller_id": "sell-002",
    "category_id": "cat-011",
    "product_name": "Tempered Glass Screen Protector (3-Pack) for Phone",
    "brand": "ShieldArmor",
    "mrp": 399,
    "stock_qty": 160,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600"
  },
  {
    "product_id": "prod-109",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "Flexible Bluetooth Selfie Stick Tripod Stand for Phone",
    "brand": "SteadyShot",
    "mrp": 999,
    "stock_qty": 80,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1576299090369-9067e4adca28?w=500&auto=format&fit=crop&q=60"
  },
  {
    "product_id": "prod-110",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "Smart Phone Core 64GB 4G LTE Unlocked Mobile",
    "brand": "ApexCompute",
    "mrp": 8999,
    "stock_qty": 45,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?w=600"
  },
  {
    "product_id": "prod-111",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "Apple iPhone 15 Pro Max 256GB Natural Titanium",
    "brand": "Apple",
    "mrp": 134999,
    "stock_qty": 15,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"
  },
  {
    "product_id": "prod-112",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "Samsung Galaxy S24 Ultra 5G AI Smartphone 256GB",
    "brand": "Samsung",
    "mrp": 119999,
    "stock_qty": 18,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600"
  },
  {
    "product_id": "prod-113",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "OnePlus 12 5G 16GB RAM 512GB Silky Black",
    "brand": "OnePlus",
    "mrp": 64999,
    "stock_qty": 25,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600"
  },
  {
    "product_id": "prod-114",
    "seller_id": "sell-001",
    "category_id": "cat-011",
    "product_name": "Google Pixel 8 Pro 5G 128GB Obsidian Phone",
    "brand": "Google",
    "mrp": 79999,
    "stock_qty": 20,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
  },
  {
    "product_id": "prod-115",
    "seller_id": "sell-001",
    "category_id": "cat-006",
    "product_name": "Sony PlayStation 5 Slim Console Disk Edition 1TB",
    "brand": "Sony",
    "mrp": 54990,
    "stock_qty": 14,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600"
  },
  {
    "product_id": "prod-116",
    "seller_id": "sell-001",
    "category_id": "cat-006",
    "product_name": "Xbox Series X 1TB High-Performance Gaming Console",
    "brand": "Microsoft",
    "mrp": 49990,
    "stock_qty": 12,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600"
  },
  {
    "product_id": "prod-117",
    "seller_id": "sell-001",
    "category_id": "cat-006",
    "product_name": "Nintendo Switch OLED Model Neon Blue and Neon Red",
    "brand": "Nintendo",
    "mrp": 28999,
    "stock_qty": 22,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600"
  },
  {
    "product_id": "prod-118",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "Apple MacBook Air 13\" M3 Chip 8GB RAM 256GB SSD",
    "brand": "Apple",
    "mrp": 99990,
    "stock_qty": 15,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"
  },
  {
    "product_id": "prod-119",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "ASUS ROG Strix G16 Gaming Laptop RTX 4060 16GB",
    "brand": "ASUS",
    "mrp": 114990,
    "stock_qty": 10,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600"
  },
  {
    "product_id": "prod-120",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "Sony WH-1000XM5 Wireless Noise Cancelling Headset",
    "brand": "Sony",
    "mrp": 26990,
    "stock_qty": 35,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
  },
  {
    "product_id": "prod-121",
    "seller_id": "sell-001",
    "category_id": "cat-001",
    "product_name": "Apple iPad Air 11\" M2 Chip 128GB Wi-Fi Space Grey",
    "brand": "Apple",
    "mrp": 59900,
    "stock_qty": 18,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600"
  },
  {
    "product_id": "prod-122",
    "seller_id": "sell-001",
    "category_id": "cat-010",
    "product_name": "Sony Alpha 7 IV Full-Frame Mirrorless Camera Body",
    "brand": "Sony",
    "mrp": 189990,
    "stock_qty": 8,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600"
  },
  {
    "product_id": "prod-123",
    "seller_id": "sell-001",
    "category_id": "cat-010",
    "product_name": "Canon EOS R50 Mirrorless Camera with 18-45mm Lens",
    "brand": "Canon",
    "mrp": 54990,
    "stock_qty": 16,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600"
  },
  {
    "product_id": "prod-124",
    "seller_id": "sell-001",
    "category_id": "cat-010",
    "product_name": "DJI Mini 4 Pro Fly More Combo Drone with RC 2",
    "brand": "DJI",
    "mrp": 98990,
    "stock_qty": 12,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600"
  },
  {
    "product_id": "prod-125",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Dyson V12 Detect Slim Cordless Vacuum Cleaner",
    "brand": "Dyson",
    "mrp": 44900,
    "stock_qty": 14,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600"
  },
  {
    "product_id": "prod-126",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Philips Hue Smart LED Starter Bulb Kit with Bridge",
    "brand": "Philips",
    "mrp": 7999,
    "stock_qty": 30,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=600"
  },
  {
    "product_id": "prod-127",
    "seller_id": "sell-001",
    "category_id": "cat-003",
    "product_name": "Nespresso Essenza Mini Espresso Coffee Maker Machine",
    "brand": "Nespresso",
    "mrp": 14999,
    "stock_qty": 20,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600"
  },
  {
    "product_id": "prod-128",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Nike Air Zoom Pegasus 40 Men Road Running Shoes",
    "brand": "Nike",
    "mrp": 9995,
    "stock_qty": 40,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
  },
  {
    "product_id": "prod-129",
    "seller_id": "sell-002",
    "category_id": "cat-002",
    "product_name": "Ray-Ban Classic Polarized Wayfarer Sunglasses",
    "brand": "Ray-Ban",
    "mrp": 7990,
    "stock_qty": 35,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
  },
  {
    "product_id": "prod-130",
    "seller_id": "sell-001",
    "category_id": "cat-008",
    "product_name": "Apple Watch Series 9 GPS 45mm Midnight Aluminum",
    "brand": "Apple",
    "mrp": 41900,
    "stock_qty": 25,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600"
  },
  {
    "product_id": "prod-131",
    "seller_id": "sell-001",
    "category_id": "cat-008",
    "product_name": "Garmin Forerunner 265 GPS AMOLED Running Smartwatch",
    "brand": "Garmin",
    "mrp": 44990,
    "stock_qty": 15,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
  },
  {
    "product_id": "prod-132",
    "seller_id": "sell-002",
    "category_id": "cat-009",
    "product_name": "Yonex Nanoray Light 18i Graphite Badminton Racket",
    "brand": "Yonex",
    "mrp": 2199,
    "stock_qty": 50,
    "is_active": true,
    "image_url": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600"
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
    order_amount: 27997.00,
    order_status: 'DELIVERED',
    assigned_employee_id: 'emp-001'
  },
  {
    order_id: 'ord-002',
    customer_id: 'cust-002',
    address_id: 'addr-003',
    order_number: 'ORD-2026-99412',
    order_date: '2026-03-01 16:45:00',
    shipping_date: null,
    approx_delivery_date: null,
    order_amount: 96999.00,
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
    unit_price: 14999.00
  },
  {
    order_id: 'ord-001',
    product_id: 'prod-005',
    quantity: 2,
    unit_price: 6499.00
  },
  {
    order_id: 'ord-002',
    product_id: 'prod-002',
    quantity: 1,
    unit_price: 96999.00
  }
];

export const samplePayments = [
  {
    payment_id: 'pay-001',
    order_id: 'ord-001',
    payment_mode: 'Credit/Debit Card',
    payment_status: 'Completed',
    amount: 27997.00,
    date_of_payment: '2026-02-10 14:21:10'
  },
  {
    payment_id: 'pay-002',
    order_id: 'ord-002',
    payment_mode: 'UPI',
    payment_status: 'Completed',
    amount: 96999.00,
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
