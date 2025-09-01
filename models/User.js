import bcrypt from "bcryptjs";
import pool from "../config/database.js";

class User {
  static async create(email, password) {
    try {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const query = `
        INSERT INTO users (email, password_hash) 
        VALUES ($1, $2) 
        RETURNING id, email, created_at
      `;

      const result = await pool.query(query, [email, passwordHash]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query =
        "SELECT id, email, created_at, updated_at FROM users WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows[0];
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
      const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at) 
        VALUES ($1, $2, $3)
      `;

      await pool.query(query, [userId, token, expiresAt]);
    } catch (error) {
      throw error;
    }
  }

  static async findRefreshToken(token) {
    try {
      const query = `
        SELECT rt.*, u.email 
        FROM refresh_tokens rt 
        JOIN users u ON rt.user_id = u.id 
        WHERE rt.token = $1 AND rt.expires_at > NOW()
      `;

      const result = await pool.query(query, [token]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async removeRefreshToken(token) {
    try {
      const query = "DELETE FROM refresh_tokens WHERE token = $1";
      await pool.query(query, [token]);
    } catch (error) {
      throw error;
    }
  }

  static async removeAllRefreshTokens(userId) {
    try {
      const query = "DELETE FROM refresh_tokens WHERE user_id = $1";
      await pool.query(query, [userId]);
    } catch (error) {
      throw error;
    }
  }
}

export default User;
