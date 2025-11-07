const http = require("http");

console.log("Testing refactored server endpoints...");

http
  .get("http://localhost:3001/health", (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      try {
        const json = JSON.parse(data);
        console.log("✅ Health endpoint working:", json.status);
        console.log("✅ Environment:", json.environment);
        console.log("✅ Canvas Host:", json.canvas_host);
        process.exit(0);
      } catch (e) {
        console.error("❌ Failed to parse response:", e.message);
        process.exit(1);
      }
    });
  })
  .on("error", (err) => {
    console.error("❌ Request failed:", err.message);
    process.exit(1);
  });
