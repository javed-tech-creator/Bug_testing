/**
 * Script to drop the old recceId_1 index from reccedetails collection
 * Run this script once to fix the duplicate key error
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.DB;

async function dropRecceIdIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Get the collection
    const db = mongoose.connection.db;
    const collection = db.collection("reccedetails");

    // List all indexes
    const indexes = await collection.indexes();
    console.log("\nCurrent indexes:");
    indexes.forEach((index) => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    // Check if recceId_1 index exists
    const hasRecceIdIndex = indexes.some((index) => index.name === "recceId_1");

    if (hasRecceIdIndex) {
      console.log("\nDropping recceId_1 index...");
      await collection.dropIndex("recceId_1");
      console.log("✓ Successfully dropped recceId_1 index");
    } else {
      console.log("\n✓ recceId_1 index does not exist (already removed)");
    }

    // List indexes after dropping
    const updatedIndexes = await collection.indexes();
    console.log("\nUpdated indexes:");
    updatedIndexes.forEach((index) => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    console.log("\n✓ Index cleanup completed successfully");
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\nDatabase connection closed");
    process.exit(0);
  }
}

dropRecceIdIndex();
