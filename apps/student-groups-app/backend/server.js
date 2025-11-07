const express = require("express");
const cors = require("cors");
const config = require("./config");
const { setupRoutes } = require("./routes");

/**
 * Main server module - Entry point for the backend application
 */

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup API routes
setupRoutes(app, config);

// Start server
app.listen(config.PORT, () => {
  console.log("🚀 Backend Proxy Server Started");
  console.log("=================================");
  console.log(`📍 Port: ${config.PORT}`);
  console.log(`🌐 Canvas API: ${config.CANVAS_API_URL}`);
  console.log(`🏠 Canvas Host: ${config.CANVAS_HOST}`);
  console.log(`🛠️  Environment: ${config.NODE_ENV}`);
  console.log(`📊 Log Level: ${config.LOG_LEVEL}`);
  console.log("=================================");
  console.log(`🔗 Health Check: http://localhost:${config.PORT}/health`);
  console.log(`⚙️  Config Info: http://localhost:${config.PORT}/config`);
  console.log("=================================");
});
