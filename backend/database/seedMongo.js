import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

import {
  sampleUsers,
  sampleCustomers,
  sampleAddresses,
  sampleSellers,
  sampleEmployees,
  sampleCategories,
  sampleProducts,
  sampleCarts,
  sampleCartItems,
  sampleOrders,
  sampleOrderItems,
  samplePayments,
  sampleReviews,
  sampleOrderHistory,
  sampleWishlists
} from './seedData.js';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'ecommerce_db';

async function seedMongoDB() {
  const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });

  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await client.connect();
    const db = client.db(DB_NAME);

    console.log('Clearing existing collections...');
    const collections = [
      'users', 'customers', 'addresses', 'sellers', 'employees',
      'categories', 'products', 'carts', 'cart_items',
      'orders', 'order_items', 'payments', 'reviews', 'order_history',
      'return_requests', 'return_items', 'return_status_history',
      'notifications', 'feedback_moderation', 'wishlists'
    ];

    for (const name of collections) {
      await db.collection(name).deleteMany({});
    }

    console.log('Inserting seed datasets into MongoDB...');
    await db.collection('users').insertMany(sampleUsers);
    await db.collection('customers').insertMany(sampleCustomers);
    await db.collection('addresses').insertMany(sampleAddresses);
    await db.collection('sellers').insertMany(sampleSellers);
    if (sampleEmployees && sampleEmployees.length > 0) {
      await db.collection('employees').insertMany(sampleEmployees);
    }
    await db.collection('categories').insertMany(sampleCategories);
    await db.collection('products').insertMany(sampleProducts);
    await db.collection('carts').insertMany(sampleCarts);
    await db.collection('cart_items').insertMany(sampleCartItems);
    await db.collection('orders').insertMany(sampleOrders);
    await db.collection('order_items').insertMany(sampleOrderItems);
    await db.collection('payments').insertMany(samplePayments);
    await db.collection('reviews').insertMany(sampleReviews);
    if (sampleOrderHistory && sampleOrderHistory.length > 0) {
      await db.collection('order_history').insertMany(sampleOrderHistory);
    }
    if (sampleWishlists && sampleWishlists.length > 0) {
      await db.collection('wishlists').insertMany(sampleWishlists);
    }

    console.log('MongoDB database seeding completed successfully!');
  } catch (error) {
    console.error('Error during MongoDB seeding:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedMongoDB();

