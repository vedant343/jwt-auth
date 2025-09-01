import bcrypt from "bcryptjs";

// Simple in-memory storage for testing
const users = [];
const refreshTokens = [];

class User {
  static async create(email, password) {
    try {
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const newUser = {
        id: users.length + 1,
        email,
        password_hash: passwordHash,
        created_at: new Date().toISOString(),
      };

      users.push(newUser);

      return {
        id: newUser.id,
        email: newUser.email,
        created_at: newUser.created_at,
      };
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      return users.find((user) => user.email === email);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const user = users.find((user) => user.id === id);
      if (user) {
        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          updated_at: user.created_at,
        };
      }
      return null;
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
      refreshTokens.push({
        user_id: userId,
        token,
        expires_at: expiresAt,
        created_at: new Date(),
      });
    } catch (error) {
      throw error;
    }
  }

  static async findRefreshToken(token) {
    try {
      const tokenData = refreshTokens.find(
        (rt) => rt.token === token && new Date(rt.expires_at) > new Date()
      );

      if (tokenData) {
        const user = users.find((u) => u.id === tokenData.user_id);
        return {
          ...tokenData,
          email: user ? user.email : null,
        };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  static async removeRefreshToken(token) {
    try {
      const index = refreshTokens.findIndex((rt) => rt.token === token);
      if (index > -1) {
        refreshTokens.splice(index, 1);
      }
    } catch (error) {
      throw error;
    }
  }

  static async removeAllRefreshTokens(userId) {
    try {
      const filtered = refreshTokens.filter((rt) => rt.user_id !== userId);
      refreshTokens.length = 0;
      refreshTokens.push(...filtered);
    } catch (error) {
      throw error;
    }
  }
}

export default User;
