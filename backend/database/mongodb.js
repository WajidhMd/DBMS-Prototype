import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let mongoClient = null;
let mongoDb = null;

export async function getMongoDB() {
  if (!mongoDb) {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB_NAME || 'ecommerce_db';
    mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 });
    await mongoClient.connect();
    mongoDb = mongoClient.db(dbName);
  }
  return mongoDb;
}

export async function testMongoDBConnection() {
  try {
    const db = await getMongoDB();
    await db.command({ ping: 1 });
    return true;
  } catch (err) {
    return false;
  }
}
