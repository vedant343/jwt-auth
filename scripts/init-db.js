import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...");

    // Read the schema file
    const schemaPath = path.join(__dirname, "../config/schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Execute the schema
    await pool.query(schema);

    console.log("✅ Database schema created successfully!");
    console.log("📊 Tables created:");
    console.log("   - users");
    console.log("   - refresh_tokens");
    console.log("   - Indexes and triggers");

    // Test the connection
    const result = await pool.query("SELECT NOW() as current_time");
    console.log(`🕐 Database connection test: ${result.rows[0].current_time}`);

    console.log("🎉 Database initialization completed!");
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export default initializeDatabase;
