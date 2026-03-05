import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected");

    // After connecting, ensure we drop the problematic index if it exists
    const db = mongoose.connection.db;
    if (db) {
      await db.collection('users').dropIndex('phone_1').catch(() => {});
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
