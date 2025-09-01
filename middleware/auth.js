import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = verifyToken(refreshToken);

    if (decoded.type !== "refresh") {
      return res.status(403).json({
        success: false,
        message: "Invalid token type",
      });
    }

    // Check if refresh token exists in database
    const tokenData = await User.findRefreshToken(refreshToken);
    if (!tokenData) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    req.refreshTokenData = tokenData;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};
