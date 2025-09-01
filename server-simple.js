import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Simple routes
app.get("/", (req, res) => {
  res.send("Auth Project Running 🚀");
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/app", (req, res) => {
  res.redirect("/public/index.html");
});

// Simple auth routes
app.post("/api/auth/signup", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  res.json({
    success: true,
    message: "User created successfully (demo)",
    data: { email, id: 1 },
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  res.json({
    success: true,
    message: "Login successful (demo)",
    data: { email, id: 1, token: "demo-token" },
  });
});

app.get("/api/auth/profile", (req, res) => {
  res.json({
    success: true,
    data: { user: { id: 1, email: "demo@example.com" } },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Simple Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}/public/index.html`);
  console.log(`🌐 App Route: http://localhost:${PORT}/app`);
  console.log(`🔌 API: http://localhost:${PORT}/api/auth`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
});
