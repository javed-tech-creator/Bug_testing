import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.config.js";

console.log("✅ Creating notification queue...");
export const notificationQueue = new Queue("notificationQueue", {
  connection: redisConnection,
});
console.log("✅ Notification queue created");
