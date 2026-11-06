-- PostgreSQL Seed Data Script

-- 1. Insert Users
INSERT INTO users (user_id, email, password_hash, role, ref_id, created_at) VALUES
('usr-admin-001', 'admin@ecommerce.com', '$2a$10$Qme0SBB149CGytnebQvoT.J8x0xWN0MDtjUYFM/SLEDkcNg3jJJae', 'ADMIN', NULL, '2026-01-01 10:00:00'),
('usr-cust-001', 'john.doe@example.com', '$2a$10$Qme0SBB149CGytnebQvoT.J8x0xWN0MDtjUYFM/SLEDkcNg3jJJae', 'CUSTOMER', 'cust-001', '2026-01-02 11:30:00'),
('usr-cust-002', 'jane.smith@example.com', '$2a$10$Qme0SBB149CGytnebQvoT.J8x0xWN0MDtjUYFM/SLEDkcNg3jJJae', 'CUSTOMER', 'cust-002', '2026-01-03 14:15:00'),
('usr-sell-001', 'techworld@seller.com', '$2a$10$Qme0SBB149CGytnebQvoT.J8x0xWN0MDtjUYFM/SLEDkcNg3jJJae', 'SELLER', 'sell-001', '2026-01-01 09:00:00'),
('usr-sell-002', 'fashionhub@seller.com', '$2a$10$Qme0SBB149CGytnebQvoT.J8x0xWN0MDtjUYFM/SLEDkcNg3jJJae', 'SELLER', 'sell-002', '2026-01-01 09:30:00'),
('usr-emp-001', 'employee@ecommerce.com', '$2a$10$Qme0SBB149CGytnebQvoT.J8x0xWN0MDtjUYFM/SLEDkcNg3jJJae', 'EMPLOYEE', 'emp-001', '2026-01-01 08:00:00');

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

-- 4b. Insert Employees
INSERT INTO employees (employee_id, user_id, name, email, phone) VALUES
('emp-001', 'usr-emp-001', 'Staff Member Alex', 'employee@ecommerce.com', '+1-555-0188');

-- 5. Insert Categories
INSERT INTO categories (category_id, category_name, description) VALUES
('cat-001', 'Electronics & Gadgets', 'Smartphones, Laptops, Audio gear, and Wearable accessories.'),
('cat-002', 'Apparel & Fashion', 'Trending Men & Women clothing, footwear, and accessories.'),
('cat-003', 'Home & Living', 'Modern furniture, kitchen appliances, and home decor.'),
('cat-004', 'Books & Stationery', 'Academic textbooks, novels, and luxury stationery items.'),
('cat-005', 'Toys & Action Figures', 'Dolls, action figures, building sets, and educational toys.'),
('cat-006', 'Gaming & Video Games', 'Gaming consoles, wireless controllers, headsets, and video games.'),
('cat-007', 'Beauty & Personal Care', 'Skincare serums, luxury perfumes, cosmetics, and beauty tools.'),
('cat-008', 'Watches & Timepieces', 'Luxury analog watches, digital timepieces, and smartwatches.'),
('cat-009', 'Sports & Outdoors', 'Fitness equipment, athletic gear, balls, and cycling accessories.'),
('cat-010', 'Cameras & Photography', 'Mirrorless cameras, lenses, tripods, and action cameras.'),
('cat-011', 'Phones & Accessories', 'Smartphones, 5G mobiles, wireless chargers, and phone cases.');

-- 6. Insert Products
INSERT INTO products (product_id, seller_id, category_id, product_name, brand, mrp, stock_qty, is_active, image_url) VALUES
-- Electronics & Gadgets (cat-001)
('prod-001', 'sell-001', 'cat-001', 'Quantum Pro Wireless Headphones', 'AcousticTech', 199.99, 45, TRUE, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'),
('prod-002', 'sell-001', 'cat-001', 'UltraBook Max 15" Laptop', 'ApexCompute', 1299.00, 12, TRUE, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'),
('prod-003', 'sell-001', 'cat-001', 'AeroWatch Series 5 Smartwatch', 'AeroTech', 249.50, 30, TRUE, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
('prod-007', 'sell-001', 'cat-001', 'NovaPod Pro Wireless Earbuds', 'AcousticTech', 129.99, 80, TRUE, 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600'),
('prod-008', 'sell-001', 'cat-001', 'PixelLens 4K Action Camera', 'VisionTech', 349.99, 18, TRUE, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'),
('prod-009', 'sell-001', 'cat-001', 'ThunderBass Portable Bluetooth Speaker', 'AcousticTech', 79.99, 65, TRUE, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'),
('prod-010', 'sell-001', 'cat-001', 'SwiftCharge 10000mAh Power Bank', 'VoltEdge', 49.99, 100, TRUE, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600'),
('prod-011', 'sell-001', 'cat-001', 'ZenPad Ultra 11" Tablet', 'ApexCompute', 599.00, 22, TRUE, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'),
('prod-012', 'sell-001', 'cat-001', 'MechStrike RGB Gaming Keyboard', 'ByteForce', 119.99, 40, TRUE, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600'),
('prod-013', 'sell-001', 'cat-001', 'ProStream 27" 4K Monitor', 'VisionTech', 449.99, 15, TRUE, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'),
-- Apparel & Fashion (cat-002)
('prod-004', 'sell-002', 'cat-002', 'Classic Leather Bomber Jacket', 'UrbanCraft', 149.99, 25, TRUE, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'),
('prod-005', 'sell-002', 'cat-002', 'Ergonomic Running Shoes', 'StrideFlex', 89.95, 60, TRUE, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'),
('prod-014', 'sell-002', 'cat-002', 'Slim Fit Denim Jeans', 'UrbanCraft', 64.99, 70, TRUE, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'),
('prod-015', 'sell-002', 'cat-002', 'Premium Cotton Polo T-Shirt', 'ThreadLine', 39.99, 120, TRUE, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'),
('prod-016', 'sell-002', 'cat-002', 'Aviator Polarized Sunglasses', 'OpticVue', 59.99, 90, TRUE, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'),
('prod-017', 'sell-002', 'cat-002', 'Canvas Weekender Travel Bag', 'NomadGear', 79.99, 35, TRUE, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'),
('prod-018', 'sell-002', 'cat-002', 'Woolen Knit Beanie Cap', 'ThreadLine', 24.99, 150, TRUE, 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600'),
('prod-019', 'sell-002', 'cat-002', 'Formal Oxford Dress Shoes', 'ClassicStep', 119.99, 28, TRUE, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600'),
('prod-020', 'sell-002', 'cat-002', 'Floral Print Summer Dress', 'BloomStyle', 54.99, 45, TRUE, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'),
('prod-021', 'sell-002', 'cat-002', 'Genuine Leather Belt', 'UrbanCraft', 34.99, 85, TRUE, 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600'),
-- Home & Living (cat-003)
('prod-006', 'sell-001', 'cat-003', 'Smart Ambient Desk Lamp', 'Lumina', 59.99, 50, TRUE, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'),
('prod-022', 'sell-001', 'cat-003', 'Ergonomic Office Chair', 'ComfortZone', 299.99, 20, TRUE, 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600'),
('prod-023', 'sell-001', 'cat-003', 'Minimalist Wooden Coffee Table', 'OakCraft', 189.99, 14, TRUE, 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600'),
('prod-024', 'sell-001', 'cat-003', 'Ceramic Planter Set (Pack of 3)', 'GreenNest', 44.99, 55, TRUE, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600'),
('prod-025', 'sell-001', 'cat-003', 'Velvet Throw Pillow Covers (Set of 4)', 'CozyHome', 29.99, 80, TRUE, 'https://images.unsplash.com/photo-1584100936595-c0c9f006b80f?w=600'),
('prod-026', 'sell-001', 'cat-003', 'Stainless Steel Cookware Set (10-Piece)', 'ChefPrime', 149.99, 25, TRUE, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'),
('prod-027', 'sell-001', 'cat-003', 'Aromatherapy Essential Oil Diffuser', 'ZenAura', 39.99, 70, TRUE, 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600'),
('prod-028', 'sell-001', 'cat-003', 'Wall-Mounted Floating Shelves (Set of 3)', 'OakCraft', 69.99, 38, TRUE, 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=600'),
('prod-029', 'sell-001', 'cat-003', 'Turkish Cotton Bath Towel Set', 'CozyHome', 54.99, 60, TRUE, 'https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=600'),
('prod-030', 'sell-001', 'cat-003', 'Smart WiFi Air Purifier', 'PureBreeze', 179.99, 16, TRUE, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600'),
-- Books & Stationery (cat-004)
('prod-031', 'sell-002', 'cat-004', 'The Art of Programming (Hardcover)', 'TechPress', 49.99, 40, TRUE, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'),
('prod-032', 'sell-002', 'cat-004', 'Premium Leather-Bound Journal', 'InkCraft', 34.99, 55, TRUE, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'),
('prod-033', 'sell-002', 'cat-004', 'Watercolor Paint Set (48 Colors)', 'ArtistChoice', 29.99, 65, TRUE, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600'),
('prod-034', 'sell-002', 'cat-004', 'Classic Fiction Collection (Box Set)', 'LitWorld', 79.99, 30, TRUE, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'),
('prod-035', 'sell-002', 'cat-004', 'Architect Precision Pen Set', 'InkCraft', 19.99, 100, TRUE, 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600'),
('prod-036', 'sell-002', 'cat-004', 'Data Science & AI Handbook', 'TechPress', 59.99, 35, TRUE, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600'),
('prod-037', 'sell-002', 'cat-004', 'Sketch & Draw A3 Pad (100 Sheets)', 'ArtistChoice', 14.99, 90, TRUE, 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600'),
('prod-038', 'sell-002', 'cat-004', 'World Atlas & Geography Encyclopedia', 'LitWorld', 44.99, 25, TRUE, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600'),
('prod-039', 'sell-002', 'cat-004', 'Executive Desk Organizer (Bamboo)', 'InkCraft', 39.99, 42, TRUE, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600'),
('prod-040', 'sell-002', 'cat-004', 'Motivational Planner & Goal Tracker', 'InkCraft', 24.99, 75, TRUE, 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600'),
-- Toys (cat-005)
('prod-041', 'sell-002', 'cat-005', 'LEGO Starship Building Toy Set', 'BrickMaster', 69.99, 45, TRUE, 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600'),
('prod-042', 'sell-001', 'cat-005', 'RC High-Speed Monster Truck Toy', 'TurboPlay', 49.99, 35, TRUE, 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600'),
('prod-043', 'sell-002', 'cat-005', 'Plush Cuddle Bear Soft Toy', 'WarmHug', 24.99, 80, TRUE, 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600'),
('prod-044', 'sell-002', 'cat-005', 'Educational Wooden Puzzle Toy Set', 'SmartKidz', 19.99, 60, TRUE, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600'),
('prod-045', 'sell-001', 'cat-005', 'RoboTech Transforming Action Toy', 'MechPlay', 34.99, 50, TRUE, 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=600'),
('prod-046', 'sell-002', 'cat-005', 'Classic Wooden Train Track Toy', 'TrackCraft', 39.99, 40, TRUE, 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600'),
('prod-047', 'sell-001', 'cat-005', 'Kids DIY Science Experiment Toy Kit', 'SmartKidz', 29.99, 55, TRUE, 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600'),
('prod-048', 'sell-002', 'cat-005', 'Magnetic Building Blocks Toy Set', 'BrickMaster', 44.99, 70, TRUE, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600'),
('prod-049', 'sell-002', 'cat-005', 'Super Hero Action Figure Toy Set', 'HeroForge', 27.99, 65, TRUE, 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=600'),
('prod-050', 'sell-002', 'cat-005', 'Interactive Singing Bird Toy', 'WarmHug', 22.99, 90, TRUE, 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600'),
-- Games (cat-006)
('prod-051', 'sell-001', 'cat-006', 'Wireless Game Controller for PS5 & PC', 'NexusPlay', 69.99, 40, TRUE, 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600'),
('prod-052', 'sell-001', 'cat-006', 'Surround Sound Wireless Game Headset', 'AudioStrike', 99.99, 35, TRUE, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600'),
('prod-053', 'sell-001', 'cat-006', 'Retro Arcade Mini Video Game Cabinet', 'PixelArcade', 59.99, 50, TRUE, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600'),
('prod-054', 'sell-002', 'cat-006', 'Kingdoms Strategy Medieval Board Game', 'GuildGames', 49.99, 60, TRUE, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600'),
('prod-055', 'sell-001', 'cat-006', 'RGB Optical Wireless Game Mouse', 'ViperEdge', 45.99, 85, TRUE, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600'),
('prod-056', 'sell-001', 'cat-006', 'CyberStrike VR Virtual Reality Game Headset', 'NexusPlay', 299.99, 15, TRUE, 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=600'),
('prod-057', 'sell-002', 'cat-006', 'Tabletop Soccer Action Board Game', 'ArenaPlay', 39.99, 30, TRUE, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600'),
('prod-058', 'sell-002', 'cat-006', 'Tournament Wooden Chess Set Strategy Game', 'GrandMaster', 34.99, 45, TRUE, 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600'),
('prod-059', 'sell-001', 'cat-006', 'Handheld Retro Game Console (500 Built-in Games)', 'PixelArcade', 39.99, 75, TRUE, 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=600'),
('prod-060', 'sell-001', 'cat-006', 'RGB XXL Desk Mat & Game Mouse Pad', 'ViperEdge', 24.99, 110, TRUE, 'https://images.unsplash.com/photo-1616588589596-19349e59d997?w=600'),
-- Beauty (cat-007)
('prod-061', 'sell-002', 'cat-007', 'Radiance Hydrating Face Serum Beauty Oil', 'GlowSkin', 38.99, 80, TRUE, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'),
('prod-062', 'sell-002', 'cat-007', 'Organic Herbal Foaming Face Wash Beauty Cleanser', 'PureBotanics', 22.99, 95, TRUE, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'),
('prod-063', 'sell-002', 'cat-007', 'Velvet Matte Long-Wear Lipstick Beauty Set', 'LuxeShade', 29.99, 60, TRUE, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'),
('prod-064', 'sell-002', 'cat-007', 'Vitamin C Brightening Moisturizer Beauty Cream', 'GlowSkin', 34.99, 75, TRUE, 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600'),
('prod-065', 'sell-001', 'cat-007', 'Professional Ionic Hair Dryer Beauty Blower', 'SalonPro', 79.99, 30, TRUE, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600'),
('prod-066', 'sell-002', 'cat-007', 'Mineral Sunscreen SPF 50 Broad Spectrum Beauty Lotion', 'SunShield', 26.99, 100, TRUE, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600'),
('prod-067', 'sell-002', 'cat-007', 'Luxury Eau De Parfum Beauty Fragrance 100ml', 'AuraScents', 89.99, 40, TRUE, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'),
('prod-068', 'sell-002', 'cat-007', 'Exfoliating Arabica Coffee Body Scrub Beauty Polish', 'PureBotanics', 19.99, 85, TRUE, 'https://images.unsplash.com/photo-1556228722-d0b71f3b392b?w=600'),
('prod-069', 'sell-002', 'cat-007', 'Pro Makeup Brush Set (15-Piece) Beauty Kit', 'LuxeShade', 32.99, 65, TRUE, 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600'),
('prod-070', 'sell-002', 'cat-007', 'Deep Repair Argan Oil Hair Mask Beauty Care', 'SalonPro', 24.99, 70, TRUE, 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600'),
-- Watches (cat-008)
('prod-071', 'sell-001', 'cat-008', 'Chronograph Stainless Steel Luxury Watch', 'Chronos', 189.99, 25, TRUE, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600'),
('prod-072', 'sell-001', 'cat-008', 'Titanium Fitness Smart Watch with Heart Rate Monitor', 'AeroTech', 149.99, 45, TRUE, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600'),
('prod-073', 'sell-002', 'cat-008', 'Vintage Brown Leather Minimalist Quartz Watch', 'NordicTime', 119.99, 35, TRUE, 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600'),
('prod-074', 'sell-001', 'cat-008', 'Diver 200m Waterproof Automatic Mechanical Watch', 'OceanDeep', 249.99, 20, TRUE, 'https://images.unsplash.com/photo-1547996160-71dfabb1a7b4?w=600'),
('prod-075', 'sell-002', 'cat-008', 'Rose Gold Diamond Accent Women Luxury Watch', 'Elegance', 159.99, 30, TRUE, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'),
('prod-076', 'sell-001', 'cat-008', 'Military Tactical Shockproof Digital Sport Watch', 'ToughGear', 59.99, 60, TRUE, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600'),
('prod-077', 'sell-001', 'cat-008', 'Solar-Powered Eco Chronometer Field Watch', 'Chronos', 199.99, 22, TRUE, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600'),
('prod-078', 'sell-001', 'cat-008', 'Ultra AMOLED Touchscreen Bluetooth Smart Watch', 'AeroTech', 129.99, 50, TRUE, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600'),
('prod-079', 'sell-002', 'cat-008', 'Skeleton Dial Automatic Movement Men Watch', 'NordicTime', 279.99, 15, TRUE, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
('prod-080', 'sell-002', 'cat-008', 'Ultra-Slim Mesh Band Quartz Elegant Watch', 'Elegance', 89.99, 40, TRUE, 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600'),
-- Sports (cat-009)
('prod-081', 'sell-002', 'cat-009', 'Official Pro Match Basketball Sport Size 7', 'Courtside', 34.99, 60, TRUE, 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=600'),
('prod-082', 'sell-002', 'cat-009', 'Thermal Bonded Tournament Soccer Ball Sport', 'StrikerPro', 29.99, 75, TRUE, 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=600'),
('prod-083', 'sell-002', 'cat-009', 'Graphite Tennis Racket with Cover Sport Pro', 'AeroSpin', 119.99, 25, TRUE, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600'),
('prod-084', 'sell-002', 'cat-009', 'Non-Slip Eco Alignment Yoga Mat Exercise Sport', 'ZenFlex', 27.99, 90, TRUE, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'),
('prod-085', 'sell-001', 'cat-009', 'Adjustable Cast Iron Dumbbells Pair 20kg Sport Fitness', 'IronCore', 149.99, 20, TRUE, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600'),
('prod-086', 'sell-002', 'cat-009', 'High-Speed Ball Bearing Jump Rope Sport Training', 'ZenFlex', 14.99, 120, TRUE, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600'),
('prod-087', 'sell-001', 'cat-009', 'Aero Cycling Helmet Mountain Bike Sport Safety', 'TrailGuard', 49.99, 40, TRUE, 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=600'),
('prod-088', 'sell-002', 'cat-009', 'Insulated Stainless Steel Sport Water Bottle 1000ml', 'HydroActive', 21.99, 100, TRUE, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'),
('prod-089', 'sell-002', 'cat-009', 'Loop Resistance Exercise Bands (5-Pack) Sport Fitness', 'IronCore', 19.99, 85, TRUE, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600'),
('prod-090', 'sell-001', 'cat-009', 'Polarized UV400 Cycling Sunglasses Sport Eyewear', 'TrailGuard', 39.99, 50, TRUE, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600'),
-- Cameras (cat-010)
('prod-091', 'sell-001', 'cat-010', 'Mirrorless 24.2MP 4K Video Digital Camera Body', 'OpticPro', 799.99, 12, TRUE, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'),
('prod-092', 'sell-001', 'cat-010', '50mm f/1.8 Prime Portrait Lens for DSLR Camera', 'OpticPro', 179.99, 28, TRUE, 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600'),
('prod-093', 'sell-001', 'cat-010', 'Lightweight Aluminum Tripod with Ball Head for Camera', 'SteadyShot', 69.99, 50, TRUE, 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600'),
('prod-094', 'sell-002', 'cat-010', 'Vintage Instant Print Photo Camera with Flash', 'RetroSnap', 89.99, 40, TRUE, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'),
('prod-095', 'sell-001', 'cat-010', '3-Axis Handheld Gimbal Stabilizer for Action Camera', 'SteadyShot', 129.99, 30, TRUE, 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600'),
('prod-096', 'sell-001', 'cat-010', '4K Ultra HD Waterproof Action Camera with WiFi', 'AquaCam', 149.99, 35, TRUE, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600'),
('prod-097', 'sell-002', 'cat-010', 'Padded Shockproof DSLR Camera Backpack Case', 'ShutterBag', 54.99, 45, TRUE, 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600'),
('prod-098', 'sell-001', 'cat-010', 'Dimmable Studio LED Ring Light with Stand for Camera', 'Lumina', 39.99, 70, TRUE, 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600'),
('prod-099', 'sell-001', 'cat-010', 'Speedlight Wireless External Flash for Camera', 'OpticPro', 99.99, 25, TRUE, 'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=600'),
('prod-100', 'sell-001', 'cat-010', 'High-Speed 128GB V30 SDXC Memory Card for Camera', 'FastData', 29.99, 150, TRUE, 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600'),
-- Phones (cat-011)
('prod-101', 'sell-001', 'cat-011', 'AeroPhone Pro 5G Flagship Smartphone 256GB', 'AeroTech', 899.99, 20, TRUE, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'),
('prod-102', 'sell-001', 'cat-011', 'Titan Slim 5G Smartphone 128GB Mobile Phone', 'ApexCompute', 649.99, 30, TRUE, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'),
('prod-103', 'sell-001', 'cat-011', 'Fast 15W Magnetic Wireless Charging Pad for Phone', 'VoltEdge', 34.99, 90, TRUE, 'https://images.unsplash.com/photo-1622445262464-84b14e3295b6?w=600'),
('prod-104', 'sell-002', 'cat-011', 'Crystal Clear Shockproof Protective Phone Case', 'ShieldArmor', 16.99, 140, TRUE, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600'),
('prod-105', 'sell-001', 'cat-011', 'Infinity Fold Dual-Screen Smartphone Phone 512GB', 'AeroTech', 1399.99, 10, TRUE, 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600'),
('prod-106', 'sell-001', 'cat-011', 'Magnetic Car Air Vent Mount Holder for Smartphone Phone', 'VoltEdge', 19.99, 110, TRUE, 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600'),
('prod-107', 'sell-001', 'cat-011', 'Nylon Braided USB-C Fast Charger Cable 2m Phone Cord', 'VoltEdge', 12.99, 200, TRUE, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600'),
('prod-108', 'sell-002', 'cat-011', 'Tempered Glass Screen Protector (3-Pack) for Phone', 'ShieldArmor', 14.99, 160, TRUE, 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600'),
('prod-109', 'sell-001', 'cat-011', 'Flexible Bluetooth Selfie Stick Tripod Stand for Phone', 'SteadyShot', 22.99, 80, TRUE, 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600'),
('prod-110', 'sell-001', 'cat-011', 'Smart Phone Core 64GB 4G LTE Unlocked Mobile', 'ApexCompute', 199.99, 45, TRUE, 'https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?w=600');

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
('pay-001', 'ord-001', 'Credit/Debit Card', 'Completed', 27997.00, '2026-02-10 14:21:10'),
('pay-002', 'ord-002', 'UPI', 'Completed', 96999.00, '2026-03-01 16:46:05');

-- 12. Insert Reviews
INSERT INTO reviews (review_id, customer_id, product_id, rating, description, review_date) VALUES
('rev-001', 'cust-001', 'prod-001', 5, 'Outstanding audio quality and long battery life! Very comfortable for long hours.', '2026-02-15 11:30:00'),
('rev-002', 'cust-001', 'prod-005', 4, 'Very comfortable running shoes with decent arch support. Fits true to size.', '2026-02-16 10:15:00');
