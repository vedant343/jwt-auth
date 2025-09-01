import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth-sqlite.js";
import {
  initializeDatabase,
  testConnection,
} from "./config/database-sqlite.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

// Middlewares
app.use(express.json({ limit: "10mb" })); // To parse JSON request body
app.use(express.urlencoded({ extended: true, limit: "10mb" })); // To parse URL-encoded bodies
app.use(cookieParser()); // To parse cookies

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Initialize SQLite database
app.use(async (req, res, next) => {
  if (!req.dbInitialized) {
    try {
      await initializeDatabase();
      req.dbInitialized = true;
    } catch (error) {
      console.error("Database initialization failed:", error);
    }
  }
  next();
});

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Auth Project Running with SQLite 🚀");
});

// Frontend route - redirect to the main application
app.get("/app", (req, res) => {
  res.redirect("/public/index.html");
});

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const dbStatus = await testConnection();
    res.json({
      success: true,
      message: "Server is healthy",
      database: dbStatus ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.json({
      success: true,
      message: "Server is healthy",
      database: "error",
      timestamp: new Date().toISOString(),
    });
  }
});

// 404 handler - Fixed the wildcard route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
async function startServer() {
  try {
    console.log("🚀 Initializing SQLite database...");
    await initializeDatabase();
    console.log("✅ Database initialized successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Frontend: http://localhost:${PORT}/public/index.html`);
      console.log(`🌐 App Route: http://localhost:${PORT}/app`);
      console.log(`🔌 API: http://localhost:${PORT}/api/auth`);
      console.log(`💚 Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
