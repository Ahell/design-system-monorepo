const http = require("http");

// Test the health endpoint
const testHealth = () => {
  return new Promise((resolve, reject) => {
    const req = http.get("http://localhost:3001/health", (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
};

// Test the config endpoint
const testConfig = () => {
  return new Promise((resolve, reject) => {
    const req = http.get("http://localhost:3001/config", (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
};

// Run tests
async function runTests() {
  console.log("Testing enhanced dotenv backend configuration...\n");

  try {
    console.log("Testing /health endpoint...");
    const health = await testHealth();
    console.log("✅ Health endpoint working!");
    console.log("Status:", health.status);
    console.log("Environment:", health.environment);
    console.log("Canvas Host:", health.canvas_host);
    console.log("Port:", health.port);
    console.log("Uptime:", health.uptime);
    console.log("");

    console.log("Testing /config endpoint...");
    const config = await testConfig();
    console.log("✅ Config endpoint working!");
    console.log("Environment:", config.environment);
    console.log("Log Level:", config.log_level);
    console.log("Node Version:", config.node_version);
    console.log("Platform:", config.platform);
    console.log("");

    console.log(
      "🎉 All tests passed! Enhanced dotenv configuration is working correctly."
    );
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

runTests();
