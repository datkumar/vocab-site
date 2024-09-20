import { MongoClient, Db } from "mongodb";

if (!process.env.MONGO_URL || !process.env.DB_NAME) {
  throw new Error("MONGO_URL and DB_NAME must be specified in .env");
}
const url = process.env.MONGO_URL;
const dbName = process.env.DB_NAME;

// The MongoDB driver handles connection pooling internally, so it
// efficiently manages and reuses a pool of connections to the database server.
// You don’t need to explicitly disconnect after each request
// The connection pool will be maintained as long as the MongoClient instance exists.

let db: Db;
let mongo: MongoClient;
if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value is preserved
  // across module reloads caused by HMR
  let globalWithMongo = global as typeof globalThis & {
    _mongo: MongoClient;
    _db?: Db;
  };
  if (!globalWithMongo._db) {
    // globalWithMongo._db = new MongoClient(url, {}).db(dbName);
    globalWithMongo._mongo = new MongoClient(url, {});
    globalWithMongo._db = globalWithMongo._mongo.db(dbName);
  }
  mongo = globalWithMongo._mongo;
  db = globalWithMongo._db;
} else {
  // In production mode, it's best to not use a global variable
  // as the state isn't preserved across different API calls in serverless architecture
  // db = new MongoClient(url).db(dbName);
  mongo = new MongoClient(url);
  db = mongo.db(dbName);
}

export { db };
export { mongo };
