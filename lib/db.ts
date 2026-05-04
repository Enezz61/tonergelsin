import mongoose from "mongoose";

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI tanımlı değil");
  }

  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(MONGODB_URI);
}
