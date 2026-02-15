import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisConnection.on("connect", () => console.log("✅ Connected to Redis Cloud (ioredis)"));
redisConnection.on("error", (err) => console.error("❌ Redis error:", err));
