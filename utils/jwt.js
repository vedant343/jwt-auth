import jwt from "jsonwebtoken";

export const generateAccessToken = (userId, email) => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const generateRefreshToken = (userId, email) => {
  return jwt.sign({ userId, email, type: "refresh" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error("Invalid token format");
  }
};
