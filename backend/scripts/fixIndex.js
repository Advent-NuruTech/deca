import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const fixIndex = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/fancytech-South Sudan";
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");

    const db = mongoose.connection.db;

    // Try to drop the username index from users collection
    try {
      const collection = db.collection("users");
      const indexes = await collection.indexes();

      console.log("\nCurrent indexes on users collection:");
      indexes.forEach((idx) => {
        console.log(`  - ${idx.name}:`, JSON.stringify(idx.key));
      });

      // Find and drop username index
      const usernameIndex = indexes.find((idx) => idx.key && idx.key.username);

      if (usernameIndex) {
        console.log(`\nFound username index: ${usernameIndex.name}`);
        console.log("Dropping username index...");
        await collection.dropIndex(usernameIndex.name);
        console.log("✓ Successfully dropped username index!\n");
      } else {
        console.log("\nNo username index found. Indexes are clean!\n");
      }
    } catch (error) {
      if (error.code === 26) {
        console.log("Users collection does not exist yet. This is fine.\n");
      } else {
        throw error;
      }
    }

    // Also check the 'test' database if it exists
    try {
      const testDb = mongoose.connection.useDb("test");
      const testCollection = testDb.collection("users");
      const testIndexes = await testCollection.indexes();

      const testUsernameIndex = testIndexes.find(
        (idx) => idx.key && idx.key.username,
      );
      if (testUsernameIndex) {
        console.log("Found username index in test.users collection");
        console.log("Dropping username index from test.users...");
        await testCollection.dropIndex(testUsernameIndex.name);
        console.log("✓ Successfully dropped username index from test.users!\n");
      }
    } catch (error) {
      // test database might not exist or collection might not exist
      console.log(
        "Note: Could not check test database (this is usually fine)\n",
      );
    }

    console.log("Index fix completed! You can now create admin users.");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error fixing index:", error.message);
    process.exit(1);
  }
};

fixIndex();
