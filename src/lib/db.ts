import { Db, MongoClient, ServerApiVersion } from "mongodb";

// Referred from NextAuth:
// https://authjs.dev/getting-started/adapters/mongodb

if (!process.env.DB_NAME || !process.env.MONGODB_URI) {
  throw new Error("DB_NAME and MONGODB_URI must be specified in .env");
}
const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};
// const options = {};

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
    globalWithMongo._mongo = new MongoClient(url, options);
    globalWithMongo._db = globalWithMongo._mongo.db(dbName);
  }
  mongo = globalWithMongo._mongo;
  db = globalWithMongo._db;
} else {
  // In production mode, it's best to not use a global variable
  // as the state isn't preserved across different API calls in serverless architecture
  mongo = new MongoClient(url, options);
  db = mongo.db(dbName);
}

export { db, mongo };
