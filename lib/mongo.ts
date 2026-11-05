import { MongoClient } from "mongodb";

// one shared client for the profile API routes
const g = globalThis as unknown as { _mongoApp?: MongoClient };

export function db() {
  if (!g._mongoApp) g._mongoApp = new MongoClient(process.env.MONGODB_URI as string);
  return g._mongoApp.db(process.env.DB_NAME || "booknook");
}
