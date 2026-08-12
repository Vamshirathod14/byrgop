import mongoose from 'mongoose';

export async function connectDB(uri = process.env.MONGO_URI) {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[db] connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error('[db] connection failed:', err.message);
    process.exit(1);
  }
}
