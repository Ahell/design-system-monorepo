require("dotenv").config();

/**
 * Configuration module for environment variables and validation
 */

// Load and validate environment variables
const PORT = parseInt(process.env.PORT) || 3001;
const CANVAS_API_URL =
  process.env.CANVAS_API_URL || "https://canvas.instructure.com/api/v1";
const CANVAS_ACCESS_TOKEN = process.env.CANVAS_ACCESS_TOKEN;

// Validate Canvas API URL and extract hostname
let CANVAS_HOST;
try {
  const url = new URL(CANVAS_API_URL);
  CANVAS_HOST = url.hostname;
} catch (error) {
  console.error("❌ Invalid CANVAS_API_URL:", CANVAS_API_URL);
  console.error("Please provide a valid URL in your .env file");
  process.exit(1);
}

// Optional environment variables with defaults
const NODE_ENV = process.env.NODE_ENV || "development";
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const REQUEST_TIMEOUT = parseInt(process.env.REQUEST_TIMEOUT) || 30000; // 30 seconds
const MAX_CONCURRENT_REQUESTS =
  parseInt(process.env.MAX_CONCURRENT_REQUESTS) || 10;

// Validate required configuration
const requiredEnvVars = ["CANVAS_ACCESS_TOKEN"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error("❌ Missing required environment variables:");
  missingEnvVars.forEach((varName) => console.error(`   - ${varName}`));
  console.error("Please check your .env file");
  process.exit(1);
}

// Log loaded configuration
console.log("🔧 Environment Configuration:");
console.log(`   NODE_ENV: ${NODE_ENV}`);
console.log(`   PORT: ${PORT}`);
console.log(`   CANVAS_API_URL: ${CANVAS_API_URL}`);
console.log(`   CANVAS_HOST: ${CANVAS_HOST}`);
console.log(
  `   CANVAS_ACCESS_TOKEN: ${
    CANVAS_ACCESS_TOKEN ? "***" + CANVAS_ACCESS_TOKEN.slice(-4) : "NOT SET"
  }`
);
console.log(`   LOG_LEVEL: ${LOG_LEVEL}`);
console.log(`   REQUEST_TIMEOUT: ${REQUEST_TIMEOUT}ms`);
console.log(`   MAX_CONCURRENT_REQUESTS: ${MAX_CONCURRENT_REQUESTS}`);
console.log("");

module.exports = {
  PORT,
  CANVAS_API_URL,
  CANVAS_ACCESS_TOKEN,
  CANVAS_HOST,
  NODE_ENV,
  LOG_LEVEL,
  REQUEST_TIMEOUT,
  MAX_CONCURRENT_REQUESTS,
};
