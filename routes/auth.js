import express from "express";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { authenticateToken, validateRefreshToken } from "../middleware/auth.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user
    const newUser = await User.create(email, password);

    // Generate tokens
    const accessToken = generateAccessToken(newUser.id, newUser.email);
    const refreshToken = generateRefreshToken(newUser.id, newUser.email);

    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    await User.saveRefreshToken(newUser.id, refreshToken, expiresAt);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          created_at: newUser.created_at,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(
      password,
      user.password_hash
    );
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    // Save refresh token to database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now
    await User.saveRefreshToken(user.id, refreshToken, expiresAt);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Refresh token
router.post("/refresh", validateRefreshToken, async (req, res) => {
  try {
    const { refreshTokenData } = req;

    // Generate new tokens
    const newAccessToken = generateAccessToken(
      refreshTokenData.user_id,
      refreshTokenData.email
    );
    const newRefreshToken = generateRefreshToken(
      refreshTokenData.user_id,
      refreshTokenData.email
    );

    // Remove old refresh token
    await User.removeRefreshToken(req.body.refreshToken);

    // Save new refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await User.saveRefreshToken(
      refreshTokenData.user_id,
      newRefreshToken,
      expiresAt
    );

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Logout
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove specific refresh token
      await User.removeRefreshToken(refreshToken);
    } else {
      // Remove all refresh tokens for the user
      await User.removeAllRefreshTokens(req.user.id);
    }

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get user profile (protected route)
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
