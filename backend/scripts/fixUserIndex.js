import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const fixUserIndex = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/fancytech-South Sudan",
    );
    console.log("MongoDB Connected");

    const db = mongoose.connection.db;

    // Get all databases/collections that might have the users collection
    const adminDb = db.admin();
    const databases = await adminDb.listDatabases();

    console.log("\nChecking for users collections with username index...\n");

    for (const dbInfo of databases.databases) {
      const dbName = dbInfo.name;
      // Skip system databases
      if (dbName === "admin" || dbName === "local" || dbName === "config")
        continue;

      try {
        const tempDb = mongoose.connection.useDb(dbName);
        const collections = await tempDb.db.listCollections().toArray();

        for (const collection of collections) {
          if (collection.name === "users") {
            console.log(`Checking collection: ${dbName}.users`);

            try {
              const indexes = await tempDb.collection("users").indexes();
              const usernameIndex = indexes.find(
                (idx) => idx.key && idx.key.username,
              );

              if (usernameIndex) {
                console.log(`Found username index in ${dbName}.users`);
                console.log("Dropping username index...");
                await tempDb.collection("users").dropIndex(usernameIndex.name);
                console.log(
                  `✓ Successfully dropped username index from ${dbName}.users\n`,
                );
              } else {
                console.log(`No username index found in ${dbName}.users\n`);
              }
            } catch (error) {
              console.log(`Error checking ${dbName}.users:`, error.message);
            }
          }
        }
      } catch (error) {
        console.log(`Error accessing database ${dbName}:`, error.message);
      }
    }

    // Also check the current database
    try {
      const indexes = await db.collection("users").indexes();
      const usernameIndex = indexes.find((idx) => idx.key && idx.key.username);

      if (usernameIndex) {
        console.log(
          `Found username index in current database users collection`,
        );
        console.log("Dropping username index...");
        await db.collection("users").dropIndex(usernameIndex.name);
        console.log(`✓ Successfully dropped username index\n`);
      }
    } catch (error) {
      if (error.code !== 26) {
        // 26 = namespace not found
        console.log("Error checking current database:", error.message);
      }
    }

    console.log("Index cleanup completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error fixing index:", error);
    process.exit(1);
  }
};

fixUserIndex();
