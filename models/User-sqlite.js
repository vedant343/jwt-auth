import bcrypt from "bcryptjs";
import { getDb } from "../config/database-sqlite.js";

class User {
  static async create(email, password) {
    try {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const db = await getDb();
      const result = await db.run(
        "INSERT INTO users (email, password_hash) VALUES (?, ?)",
        [email, passwordHash]
      );

      const newUser = await db.get(
        "SELECT id, email, created_at FROM users WHERE id = ?",
        [result.lastID]
      );

      await db.close();
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const db = await getDb();
      const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
      await db.close();
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const db = await getDb();
      const user = await db.get(
        "SELECT id, email, created_at, updated_at FROM users WHERE id = ?",
        [id]
      );
      await db.close();
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(password, passwordHash) {
    try {
      return await bcrypt.compare(password, passwordHash);
    } catch (error) {
      throw error;
    }
  }

  static async saveRefreshToken(userId, token, expiresAt) {
    try {
      const db = await getDb();
      await db.run(
        "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
        [userId, token, expiresAt]
      );
      await db.close();
    } catch (error) {
      throw error;
    }
  }

  static async findRefreshToken(token) {
    try {
      const db = await getDb();
      const tokenData = await db.get(
        `SELECT rt.*, u.email 
         FROM refresh_tokens rt 
         JOIN users u ON rt.user_id = u.id 
         WHERE rt.token = ? AND rt.expires_at > datetime('now')`,
        [token]
      );
      await db.close();
      return tokenData;
    } catch (error) {
      throw error;
    }
  }

  static async removeRefreshToken(token) {
    try {
      const db = await getDb();
      await db.run("DELETE FROM refresh_tokens WHERE token = ?", [token]);
      await db.close();
    } catch (error) {
      throw error;
    }
  }

  static async removeAllRefreshTokens(userId) {
    try {
      const db = await getDb();
      await db.run("DELETE FROM refresh_tokens WHERE user_id = ?", [userId]);
      await db.close();
    } catch (error) {
      throw error;
    }
  }
}

export default User;
