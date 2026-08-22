import mongoose from "mongoose";

/**
 * Cached MongoDB (Atlas) connection, shared across Next.js hot reloads /
 * serverless invocations — required for Mongoose in Next.js's dev mode
 * (which otherwise reconnects on every file save).
 */

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cached = global._mongooseConn ?? { conn: null, promise: null };
global._mongooseConn = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable (MongoDB Atlas connection string).");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || "insights360" });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
