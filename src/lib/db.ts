import { MongoClient, Db } from "mongodb";

// Singleton class to ensure there's only ONE instance of DB connection
class DbConnection {
  private static instance: DbConnection;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnecting = false;

  private constructor() {}

  public static getInstance(): DbConnection {
    if (!DbConnection.instance) {
      DbConnection.instance = new DbConnection();
    }
    return DbConnection.instance;
  }

  private async waitForConnection(): Promise<void> {
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (this.isConnecting) {
          resolve();
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  }

  public async getDb(): Promise<Db> {
    if (this.client && this.db) {
      return this.db;
    }
    if (!process.env.MONGO_URL || !process.env.DB_NAME) {
      throw new Error("MONGO_URL and DB_NAME must be specified in .env");
    }
    try {
      if (this.isConnecting) {
        await this.waitForConnection();
      }
      if (!this.client) {
        this.isConnecting = true;
        this.client = await MongoClient.connect(process.env.MONGO_URL);
        this.isConnecting = false;
      }
      this.db = this.client.db(process.env.DB_NAME);
      return this.db;
    } catch (error) {
      // Reset the members
      this.isConnecting = false;
      this.client = null;
      this.db = null;
      console.log("MongoDB connection error", error);
      throw new Error("Could not connect to Database");
    }
  }

  // This method is primarily for testing purposes
  public async closeConnection(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
    }
  }
}

// For use in development environments to preserve connection across hot reloads
// Add dbConnection to the global scope
declare global {
  var dbConnection: DbConnection | undefined;
}

// Checks if connection already exists, else creates one and assigns it to global scope
const dbConnection =
  global.dbConnection || (global.dbConnection = DbConnection.getInstance());

export const getDb = () => dbConnection.getDb();

// Old setup:
/*

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

*/
