import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path
const dbPath = path.join(__dirname, "../data/auth.db");

// Create database connection
export async function getDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

// Initialize database with tables
export async function initializeDatabase() {
  const db = await getDb();

  try {
    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create refresh_tokens table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Create indexes
    await db.exec("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");
    await db.exec(
      "CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id)"
    );
    await db.exec(
      "CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token)"
    );

    console.log("✅ SQLite database initialized successfully!");
    console.log("📊 Tables created: users, refresh_tokens");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  } finally {
    await db.close();
  }
}

// Test database connection
export async function testConnection() {
  try {
    const db = await getDb();
    const result = await db.get('SELECT datetime("now") as current_time');
    console.log(`🕐 Database connection test: ${result.current_time}`);
    await db.close();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}
