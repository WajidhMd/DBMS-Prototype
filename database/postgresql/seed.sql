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
INSERT INTO employees (employee_id, user_id, name, email, phone, address, department, status) VALUES
('emp-001', 'usr-emp-001', 'Staff Member Alex', 'employee@ecommerce.com', '+1-555-0188', '100 Logistics Hub, North Wing, CA 95054', 'Operations & Fulfillment', 'Active');

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
('prod-001', 'sell-001', 'cat-001', 'Quantum Pro Wireless Headphones', 'AcousticTech', 14999, 45, TRUE, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'),
('prod-002', 'sell-001', 'cat-001', 'UltraBook Max 15" Laptop', 'ApexCompute', 96999, 12, TRUE, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600'),
('prod-003', 'sell-001', 'cat-001', 'AeroWatch Series 5 Smartwatch', 'AeroTech', 18999, 30, TRUE, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
('prod-007', 'sell-001', 'cat-001', 'NovaPod Pro Wireless Earbuds', 'AcousticTech', 9499, 80, TRUE, 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=60'),
('prod-008', 'sell-001', 'cat-001', 'PixelLens 4K Action Camera', 'VisionTech', 25999, 18, TRUE, 'https://images.unsplash.com/photo-1685615359827-aa31d97578e7?w=500&auto=format&fit=crop&q=60'),
('prod-009', 'sell-001', 'cat-001', 'ThunderBass Portable Bluetooth Speaker', 'AcousticTech', 5999, 65, TRUE, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'),
('prod-010', 'sell-001', 'cat-001', 'SwiftCharge 10000mAh Power Bank', 'VoltEdge', 1499, 100, TRUE, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600'),
('prod-011', 'sell-001', 'cat-001', 'ZenPad Ultra 11" Tablet', 'ApexCompute', 28999, 22, TRUE, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'),
('prod-012', 'sell-001', 'cat-001', 'MechStrike RGB Gaming Keyboard', 'ByteForce', 6499, 40, TRUE, 'https://images.unsplash.com/photo-1626958390943-a70309376444?w=500&auto=format&fit=crop&q=60'),
('prod-013', 'sell-001', 'cat-001', 'ProStream 27" 4K Monitor', 'VisionTech', 28999, 15, TRUE, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600'),
('prod-004', 'sell-002', 'cat-002', 'Classic Leather Bomber Jacket', 'UrbanCraft', 10999, 25, TRUE, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'),
('prod-005', 'sell-002', 'cat-002', 'Ergonomic Running Shoes', 'StrideFlex', 6499, 60, TRUE, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'),
('prod-014', 'sell-002', 'cat-002', 'Slim Fit Denim Jeans', 'UrbanCraft', 4999, 70, TRUE, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'),
('prod-015', 'sell-002', 'cat-002', 'Premium Cotton Polo T-Shirt', 'ThreadLine', 1499, 120, TRUE, 'https://images.unsplash.com/photo-1625910513413-c23b8bb81cba?w=500&auto=format&fit=crop&q=60'),
('prod-016', 'sell-002', 'cat-002', 'Aviator Polarized Sunglasses', 'OpticVue', 2499, 90, TRUE, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600'),
('prod-017', 'sell-002', 'cat-002', 'Canvas Weekender Travel Bag', 'NomadGear', 5999, 35, TRUE, 'https://images.unsplash.com/photo-1448582649076-3981753123b5?w=500&auto=format&fit=crop&q=60'),
('prod-018', 'sell-002', 'cat-002', 'Woolen Knit Beanie Cap', 'ThreadLine', 699, 150, TRUE, 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600'),
('prod-019', 'sell-002', 'cat-002', 'Formal Oxford Dress Shoes', 'ClassicStep', 8999, 28, TRUE, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600'),
('prod-020', 'sell-002', 'cat-002', 'Floral Print Summer Dress', 'BloomStyle', 3999, 45, TRUE, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'),
('prod-021', 'sell-002', 'cat-002', 'Genuine Leather Belt', 'UrbanCraft', 1299, 85, TRUE, 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600'),
('prod-006', 'sell-001', 'cat-003', 'Smart Ambient Desk Lamp', 'Lumina', 4499, 50, TRUE, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600'),
('prod-022', 'sell-001', 'cat-003', 'Ergonomic Office Chair', 'ComfortZone', 21999, 20, TRUE, 'https://images.unsplash.com/photo-1688578735427-994ecdea3ea4?w=500&auto=format&fit=crop&q=60'),
('prod-023', 'sell-001', 'cat-003', 'Minimalist Wooden Coffee Table', 'OakCraft', 13999, 14, TRUE, 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&auto=format&fit=crop&q=60'),
('prod-024', 'sell-001', 'cat-003', 'Ceramic Planter Set (Pack of 3)', 'GreenNest', 1299, 55, TRUE, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600'),
('prod-025', 'sell-001', 'cat-003', 'Velvet Throw Pillow Covers (Set of 4)', 'CozyHome', 899, 80, TRUE, 'https://images.unsplash.com/photo-1559051668-9024c9b5e84b?w=500&auto=format&fit=crop&q=60'),
('prod-026', 'sell-001', 'cat-003', 'Stainless Steel Cookware Set (10-Piece)', 'ChefPrime', 10999, 25, TRUE, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'),
('prod-027', 'sell-001', 'cat-003', 'Aromatherapy Essential Oil Diffuser', 'ZenAura', 1499, 70, TRUE, 'https://images.unsplash.com/photo-1608571702346-bf078a741b19?w=500&auto=format&fit=crop&q=60'),
('prod-028', 'sell-001', 'cat-003', 'Wall-Mounted Floating Shelves (Set of 3)', 'OakCraft', 4999, 38, TRUE, 'https://images.unsplash.com/photo-1597072689227-8882273e8f6a?w=500&auto=format&fit=crop&q=60'),
('prod-029', 'sell-001', 'cat-003', 'Turkish Cotton Bath Towel Set', 'CozyHome', 1499, 60, TRUE, 'https://images.unsplash.com/photo-1600369672770-985fd30004eb?w=600'),
('prod-030', 'sell-001', 'cat-003', 'Smart WiFi Air Purifier', 'PureBreeze', 12999, 16, TRUE, 'https://images.unsplash.com/photo-1436473849883-bb3464c23e93?w=500&auto=format&fit=crop&q=60'),
('prod-031', 'sell-002', 'cat-004', 'The Art of Programming (Hardcover)', 'TechPress', 2499, 40, TRUE, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600'),
('prod-032', 'sell-002', 'cat-004', 'Premium Leather-Bound Journal', 'InkCraft', 999, 55, TRUE, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'),
('prod-033', 'sell-002', 'cat-004', 'Watercolor Paint Set (48 Colors)', 'ArtistChoice', 1299, 65, TRUE, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600'),
('prod-034', 'sell-002', 'cat-004', 'Classic Fiction Collection (Box Set)', 'LitWorld', 5999, 30, TRUE, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=500&auto=format&fit=crop&q=60'),
('prod-035', 'sell-002', 'cat-004', 'Architect Precision Pen Set', 'InkCraft', 899, 100, TRUE, 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=600'),
('prod-036', 'sell-002', 'cat-004', 'Data Science & AI Handbook', 'TechPress', 4499, 35, TRUE, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600'),
('prod-037', 'sell-002', 'cat-004', 'Sketch & Draw A3 Pad (100 Sheets)', 'ArtistChoice', 599, 90, TRUE, 'https://images.unsplash.com/photo-1525278070609-779c7adb7b71?w=500&auto=format&fit=crop&q=60'),
('prod-038', 'sell-002', 'cat-004', 'World Atlas & Geography Encyclopedia', 'LitWorld', 3499, 25, TRUE, 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=600'),
('prod-039', 'sell-002', 'cat-004', 'Executive Desk Organizer (Bamboo)', 'InkCraft', 1299, 42, TRUE, 'https://images.unsplash.com/photo-1644463589256-02679b9c0767?w=500&auto=format&fit=crop&q=60'),
('prod-040', 'sell-002', 'cat-004', 'Motivational Planner & Goal Tracker', 'InkCraft', 799, 75, TRUE, 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600'),
('prod-041', 'sell-002', 'cat-005', 'LEGO Starship Building Toy Set', 'BrickMaster', 4999, 45, TRUE, 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600'),
('prod-042', 'sell-001', 'cat-005', 'RC High-Speed Monster Truck Toy', 'TurboPlay', 3499, 35, TRUE, 'https://images.unsplash.com/photo-1673108231541-728d7873f93c?w=500&auto=format&fit=crop&q=60'),
('prod-043', 'sell-002', 'cat-005', 'Plush Cuddle Bear Soft Toy', 'WarmHug', 999, 80, TRUE, 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600'),
('prod-044', 'sell-002', 'cat-005', 'Educational Wooden Puzzle Toy Set', 'SmartKidz', 899, 60, TRUE, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600'),
('prod-045', 'sell-001', 'cat-005', 'RoboTech Transforming Action Toy', 'MechPlay', 2499, 50, TRUE, 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=500&auto=format&fit=crop&q=60'),
('prod-046', 'sell-002', 'cat-005', 'Classic Wooden Train Track Toy', 'TrackCraft', 2999, 40, TRUE, 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=60'),
('prod-047', 'sell-001', 'cat-005', 'Kids DIY Science Experiment Toy Kit', 'SmartKidz', 1299, 55, TRUE, 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600'),
('prod-048', 'sell-002', 'cat-005', 'Magnetic Building Blocks Toy Set', 'BrickMaster', 3499, 70, TRUE, 'https://images.unsplash.com/photo-1765403256661-c60b291c38ba?w=500&auto=format&fit=crop&q=60'),
('prod-049', 'sell-002', 'cat-005', 'Super Hero Action Figure Toy Set', 'HeroForge', 1999, 65, TRUE, 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=600'),
('prod-050', 'sell-002', 'cat-005', 'Interactive Singing Bird Toy', 'WarmHug', 1699, 90, TRUE, 'https://images.unsplash.com/photo-1776039775580-a6dee1cdfc0b?w=500&auto=format&fit=crop&q=60'),
('prod-051', 'sell-001', 'cat-006', 'Wireless Game Controller for PS5 & PC', 'NexusPlay', 4999, 40, TRUE, 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600'),
('prod-052', 'sell-001', 'cat-006', 'Surround Sound Wireless Game Headset', 'AudioStrike', 7499, 35, TRUE, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600'),
('prod-053', 'sell-001', 'cat-006', 'Retro Arcade Mini Video Game Cabinet', 'PixelArcade', 4499, 50, TRUE, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600'),
('prod-054', 'sell-002', 'cat-006', 'Kingdoms Strategy Medieval Board Game', 'GuildGames', 3499, 60, TRUE, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=600'),
('prod-055', 'sell-001', 'cat-006', 'RGB Optical Wireless Game Mouse', 'ViperEdge', 3499, 85, TRUE, 'https://images.unsplash.com/photo-1628832307345-7404b47f1751?w=500&auto=format&fit=crop&q=60'),
('prod-056', 'sell-001', 'cat-006', 'CyberStrike VR Virtual Reality Game Headset', 'NexusPlay', 21999, 15, TRUE, 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&auto=format&fit=crop&q=60'),
('prod-057', 'sell-002', 'cat-006', 'Tabletop Soccer Action Board Game', 'ArenaPlay', 2999, 30, TRUE, 'https://images.unsplash.com/photo-1588318073076-7030f7040046?w=500&auto=format&fit=crop&q=60'),
('prod-058', 'sell-002', 'cat-006', 'Tournament Wooden Chess Set Strategy Game', 'GrandMaster', 2499, 45, TRUE, 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600'),
('prod-059', 'sell-001', 'cat-006', 'Handheld Retro Game Console (500 Built-in Games)', 'PixelArcade', 2999, 75, TRUE, 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=600'),
('prod-060', 'sell-001', 'cat-006', 'RGB XXL Desk Mat & Game Mouse Pad', 'ViperEdge', 1899, 110, TRUE, 'https://images.unsplash.com/photo-1696710257827-75e2e5954059?w=500&auto=format&fit=crop&q=60'),
('prod-061', 'sell-002', 'cat-007', 'Radiance Hydrating Face Serum Beauty Oil', 'GlowSkin', 2999, 80, TRUE, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'),
('prod-062', 'sell-002', 'cat-007', 'Organic Herbal Foaming Face Wash Beauty Cleanser', 'PureBotanics', 599, 95, TRUE, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'),
('prod-063', 'sell-002', 'cat-007', 'Velvet Matte Long-Wear Lipstick Beauty Set', 'LuxeShade', 999, 60, TRUE, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'),
('prod-064', 'sell-002', 'cat-007', 'Vitamin C Brightening Moisturizer Beauty Cream', 'GlowSkin', 2499, 75, TRUE, 'https://images.unsplash.com/photo-1625753783470-ec2ab4efeeec?w=500&auto=format&fit=crop&q=60'),
('prod-065', 'sell-001', 'cat-007', 'Professional Ionic Hair Dryer Beauty Blower', 'SalonPro', 5999, 30, TRUE, 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&auto=format&fit=crop&q=60'),
('prod-066', 'sell-002', 'cat-007', 'Mineral Sunscreen SPF 50 Broad Spectrum Beauty Lotion', 'SunShield', 1999, 100, TRUE, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600'),
('prod-067', 'sell-002', 'cat-007', 'Luxury Eau De Parfum Beauty Fragrance 100ml', 'AuraScents', 6499, 40, TRUE, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600'),
('prod-068', 'sell-002', 'cat-007', 'Exfoliating Arabica Coffee Body Scrub Beauty Polish', 'PureBotanics', 1499, 85, TRUE, 'https://images.unsplash.com/photo-1667803546535-81f5b1c4dbfb?w=500&auto=format&fit=crop&q=60'),
('prod-069', 'sell-002', 'cat-007', 'Pro Makeup Brush Set (15-Piece) Beauty Kit', 'LuxeShade', 2499, 65, TRUE, 'https://images.unsplash.com/photo-1620464003286-a5b0d79f32c2?w=500&auto=format&fit=crop&q=60'),
('prod-070', 'sell-002', 'cat-007', 'Deep Repair Argan Oil Hair Mask Beauty Care', 'SalonPro', 899, 70, TRUE, 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600'),
('prod-071', 'sell-001', 'cat-008', 'Chronograph Stainless Steel Luxury Watch', 'Chronos', 13999, 25, TRUE, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600'),
('prod-072', 'sell-001', 'cat-008', 'Titanium Fitness Smart Watch with Heart Rate Monitor', 'AeroTech', 10999, 45, TRUE, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600'),
('prod-073', 'sell-002', 'cat-008', 'Vintage Brown Leather Minimalist Quartz Watch', 'NordicTime', 8999, 35, TRUE, 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500&auto=format&fit=crop&q=60'),
('prod-074', 'sell-001', 'cat-008', 'Diver 200m Waterproof Automatic Mechanical Watch', 'OceanDeep', 18999, 20, TRUE, 'https://images.unsplash.com/photo-1542816340-4d3de5047cfd?w=500&auto=format&fit=crop&q=60'),
('prod-075', 'sell-002', 'cat-008', 'Rose Gold Diamond Accent Women Luxury Watch', 'Elegance', 11999, 30, TRUE, 'https://images.unsplash.com/photo-1525740664269-1bb17f251737?w=500&auto=format&fit=crop&q=60'),
('prod-076', 'sell-001', 'cat-008', 'Military Tactical Shockproof Digital Sport Watch', 'ToughGear', 4499, 60, TRUE, 'https://images.unsplash.com/photo-1783792353186-69f53a804d96?w=500&auto=format&fit=crop&q=60'),
('prod-077', 'sell-001', 'cat-008', 'Solar-Powered Eco Chronometer Field Watch', 'Chronos', 14999, 22, TRUE, 'https://images.unsplash.com/photo-1727391484073-8d37dd702e13?w=500&auto=format&fit=crop&q=60'),
('prod-078', 'sell-001', 'cat-008', 'Ultra AMOLED Touchscreen Bluetooth Smart Watch', 'AeroTech', 9499, 50, TRUE, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600'),
('prod-079', 'sell-002', 'cat-008', 'Skeleton Dial Automatic Movement Men Watch', 'NordicTime', 20999, 15, TRUE, 'https://images.unsplash.com/photo-1618215649872-6e3143a716ec?w=500&auto=format&fit=crop&q=60'),
('prod-080', 'sell-002', 'cat-008', 'Ultra-Slim Mesh Band Quartz Elegant Watch', 'Elegance', 6499, 40, TRUE, 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=600'),
('prod-081', 'sell-002', 'cat-009', 'Official Pro Match Basketball Sport Size 7', 'Courtside', 1499, 60, TRUE, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60'),
('prod-082', 'sell-002', 'cat-009', 'Thermal Bonded Tournament Soccer Ball Sport', 'StrikerPro', 1499, 75, TRUE, 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=600'),
('prod-083', 'sell-002', 'cat-009', 'Graphite Tennis Racket with Cover Sport Pro', 'AeroSpin', 8999, 25, TRUE, 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600'),
('prod-084', 'sell-002', 'cat-009', 'Non-Slip Eco Alignment Yoga Mat Exercise Sport', 'ZenFlex', 1299, 90, TRUE, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'),
('prod-085', 'sell-001', 'cat-009', 'Adjustable Cast Iron Dumbbells Pair 20kg Sport Fitness', 'IronCore', 10999, 20, TRUE, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600'),
('prod-086', 'sell-002', 'cat-009', 'High-Speed Ball Bearing Jump Rope Sport Training', 'ZenFlex', 599, 120, TRUE, 'https://images.unsplash.com/photo-1516876345887-6dd74f80787a?w=500&auto=format&fit=crop&q=60'),
('prod-087', 'sell-001', 'cat-009', 'Aero Cycling Helmet Mountain Bike Sport Safety', 'TrailGuard', 3499, 40, TRUE, 'https://images.unsplash.com/photo-1591511275477-88f079d88154?w=500&auto=format&fit=crop&q=60'),
('prod-088', 'sell-002', 'cat-009', 'Insulated Stainless Steel Sport Water Bottle 1000ml', 'HydroActive', 899, 100, TRUE, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600'),
('prod-089', 'sell-002', 'cat-009', 'Loop Resistance Exercise Bands (5-Pack) Sport Fitness', 'IronCore', 699, 85, TRUE, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500&auto=format&fit=crop&q=60'),
('prod-090', 'sell-001', 'cat-009', 'Polarized UV400 Cycling Sunglasses Sport Eyewear', 'TrailGuard', 1499, 50, TRUE, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600'),
('prod-091', 'sell-001', 'cat-010', 'Mirrorless 24.2MP 4K Video Digital Camera Body', 'OpticPro', 59999, 12, TRUE, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'),
('prod-092', 'sell-001', 'cat-010', '50mm f/1.8 Prime Portrait Lens for DSLR Camera', 'OpticPro', 12999, 28, TRUE, 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600'),
('prod-093', 'sell-001', 'cat-010', 'Lightweight Aluminum Tripod with Ball Head for Camera', 'SteadyShot', 3499, 50, TRUE, 'https://images.unsplash.com/photo-1634680582783-0b06ca18a449?w=500&auto=format&fit=crop&q=60'),
('prod-094', 'sell-002', 'cat-010', 'Vintage Instant Print Photo Camera with Flash', 'RetroSnap', 6499, 40, TRUE, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600'),
('prod-095', 'sell-001', 'cat-010', '3-Axis Handheld Gimbal Stabilizer for Action Camera', 'SteadyShot', 9499, 30, TRUE, 'https://images.unsplash.com/photo-1626362729742-d394ea4c6f43?w=500&auto=format&fit=crop&q=60'),
('prod-096', 'sell-001', 'cat-010', '4K Ultra HD Waterproof Action Camera with WiFi', 'AquaCam', 10999, 35, TRUE, 'https://images.unsplash.com/photo-1484506399805-c273b8e91dce?w=500&auto=format&fit=crop&q=60'),
('prod-097', 'sell-002', 'cat-010', 'Padded Shockproof DSLR Camera Backpack Case', 'ShutterBag', 3999, 45, TRUE, 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=600'),
('prod-098', 'sell-001', 'cat-010', 'Dimmable Studio LED Ring Light with Stand for Camera', 'Lumina', 2999, 70, TRUE, 'https://images.unsplash.com/photo-1673196649671-eb09066ad6c1?w=500&auto=format&fit=crop&q=60'),
('prod-099', 'sell-001', 'cat-010', 'Speedlight Wireless External Flash for Camera', 'OpticPro', 7499, 25, TRUE, 'https://images.unsplash.com/photo-1551779420-2ec52303f5e1?w=500&auto=format&fit=crop&q=60'),
('prod-100', 'sell-001', 'cat-010', 'High-Speed 128GB V30 SDXC Memory Card for Camera', 'FastData', 1999, 150, TRUE, 'https://images.unsplash.com/photo-1589532768434-a92c95dad7cb?w=500&auto=format&fit=crop&q=60'),
('prod-101', 'sell-001', 'cat-011', 'AeroPhone Pro 5G Flagship Smartphone 256GB', 'AeroTech', 66999, 20, TRUE, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'),
('prod-102', 'sell-001', 'cat-011', 'Titan Slim 5G Smartphone 128GB Mobile Phone', 'ApexCompute', 48999, 30, TRUE, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'),
('prod-103', 'sell-001', 'cat-011', 'Fast 15W Magnetic Wireless Charging Pad for Phone', 'VoltEdge', 1499, 90, TRUE, 'https://images.unsplash.com/photo-1633381638729-27f730955c23?w=500&auto=format&fit=crop&q=60'),
('prod-104', 'sell-002', 'cat-011', 'Crystal Clear Shockproof Protective Phone Case', 'ShieldArmor', 499, 140, TRUE, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600'),
('prod-105', 'sell-001', 'cat-011', 'Infinity Fold Dual-Screen Smartphone Phone 512GB', 'AeroTech', 104999, 10, TRUE, 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600'),
('prod-106', 'sell-001', 'cat-011', 'Magnetic Car Air Vent Mount Holder for Smartphone Phone', 'VoltEdge', 799, 110, TRUE, 'https://images.unsplash.com/photo-1764347923709-fc48487f2486?w=500&auto=format&fit=crop&q=60'),
('prod-107', 'sell-001', 'cat-011', 'Nylon Braided USB-C Fast Charger Cable 2m Phone Cord', 'VoltEdge', 499, 200, TRUE, 'https://images.unsplash.com/photo-1572721546624-05bf65ad7679?w=500&auto=format&fit=crop&q=60'),
('prod-108', 'sell-002', 'cat-011', 'Tempered Glass Screen Protector (3-Pack) for Phone', 'ShieldArmor', 399, 160, TRUE, 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600'),
('prod-109', 'sell-001', 'cat-011', 'Flexible Bluetooth Selfie Stick Tripod Stand for Phone', 'SteadyShot', 999, 80, TRUE, 'https://images.unsplash.com/photo-1576299090369-9067e4adca28?w=500&auto=format&fit=crop&q=60'),
('prod-110', 'sell-001', 'cat-011', 'Smart Phone Core 64GB 4G LTE Unlocked Mobile', 'ApexCompute', 8999, 45, TRUE, 'https://images.unsplash.com/photo-1575695342320-d2d2d2f9b73f?w=600'),
('prod-111', 'sell-001', 'cat-011', 'Apple iPhone 15 Pro Max 256GB Natural Titanium', 'Apple', 134999, 15, TRUE, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600'),
('prod-112', 'sell-001', 'cat-011', 'Samsung Galaxy S24 Ultra 5G AI Smartphone 256GB', 'Samsung', 119999, 18, TRUE, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600'),
('prod-113', 'sell-001', 'cat-011', 'OnePlus 12 5G 16GB RAM 512GB Silky Black', 'OnePlus', 64999, 25, TRUE, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600'),
('prod-114', 'sell-001', 'cat-011', 'Google Pixel 8 Pro 5G 128GB Obsidian Phone', 'Google', 79999, 20, TRUE, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600'),
('prod-115', 'sell-001', 'cat-006', 'Sony PlayStation 5 Slim Console Disk Edition 1TB', 'Sony', 54990, 14, TRUE, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600'),
('prod-116', 'sell-001', 'cat-006', 'Xbox Series X 1TB High-Performance Gaming Console', 'Microsoft', 49990, 12, TRUE, 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600'),
('prod-117', 'sell-001', 'cat-006', 'Nintendo Switch OLED Model Neon Blue and Neon Red', 'Nintendo', 28999, 22, TRUE, 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600'),
('prod-118', 'sell-001', 'cat-001', 'Apple MacBook Air 13" M3 Chip 8GB RAM 256GB SSD', 'Apple', 99990, 15, TRUE, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'),
('prod-119', 'sell-001', 'cat-001', 'ASUS ROG Strix G16 Gaming Laptop RTX 4060 16GB', 'ASUS', 114990, 10, TRUE, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600'),
('prod-120', 'sell-001', 'cat-001', 'Sony WH-1000XM5 Wireless Noise Cancelling Headset', 'Sony', 26990, 35, TRUE, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600'),
('prod-121', 'sell-001', 'cat-001', 'Apple iPad Air 11" M2 Chip 128GB Wi-Fi Space Grey', 'Apple', 59900, 18, TRUE, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600'),
('prod-122', 'sell-001', 'cat-010', 'Sony Alpha 7 IV Full-Frame Mirrorless Camera Body', 'Sony', 189990, 8, TRUE, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600'),
('prod-123', 'sell-001', 'cat-010', 'Canon EOS R50 Mirrorless Camera with 18-45mm Lens', 'Canon', 54990, 16, TRUE, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600'),
('prod-124', 'sell-001', 'cat-010', 'DJI Mini 4 Pro Fly More Combo Drone with RC 2', 'DJI', 98990, 12, TRUE, 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600'),
('prod-125', 'sell-001', 'cat-003', 'Dyson V12 Detect Slim Cordless Vacuum Cleaner', 'Dyson', 44900, 14, TRUE, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600'),
('prod-126', 'sell-001', 'cat-003', 'Philips Hue Smart LED Starter Bulb Kit with Bridge', 'Philips', 7999, 30, TRUE, 'https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=600'),
('prod-127', 'sell-001', 'cat-003', 'Nespresso Essenza Mini Espresso Coffee Maker Machine', 'Nespresso', 14999, 20, TRUE, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600'),
('prod-128', 'sell-002', 'cat-002', 'Nike Air Zoom Pegasus 40 Men Road Running Shoes', 'Nike', 9995, 40, TRUE, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'),
('prod-129', 'sell-002', 'cat-002', 'Ray-Ban Classic Polarized Wayfarer Sunglasses', 'Ray-Ban', 7990, 35, TRUE, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600'),
('prod-130', 'sell-001', 'cat-008', 'Apple Watch Series 9 GPS 45mm Midnight Aluminum', 'Apple', 41900, 25, TRUE, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600'),
('prod-131', 'sell-001', 'cat-008', 'Garmin Forerunner 265 GPS AMOLED Running Smartwatch', 'Garmin', 44990, 15, TRUE, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
('prod-132', 'sell-002', 'cat-009', 'Yonex Nanoray Light 18i Graphite Badminton Racket', 'Yonex', 2199, 50, TRUE, 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600');

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

-- 13. Insert Wishlists
INSERT INTO wishlists (wishlist_id, user_id, product_id, created_at) VALUES
('wsh-001', 'usr-cust-001', 'prod-001', '2026-01-05 10:00:00');
