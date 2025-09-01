import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Test route
app.get("/", (req, res) => {
  res.send("Test Server Running! 🚀");
});

// Frontend route
app.get("/app", (req, res) => {
  res.redirect("/public/index.html");
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Test server is healthy",
    timestamp: new Date().toISOString()
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}/public/index.html`);
  console.log(`🌐 App Route: http://localhost:${PORT}/app`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
}); 