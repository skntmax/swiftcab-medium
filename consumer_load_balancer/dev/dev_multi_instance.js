const dotenv = require("dotenv");
const path = require("path");
const { spawnAll, killAll, restartAll } = require("../runner.js");
const configs = require("../pm2config.js").dev;
const { exec } = require("child_process");
dotenv.config({ path: path.resolve(__dirname, "./../.env.development") });

const action = process.argv[2] || "spawn"; // default action: spawn

console.log(`🌍 Environment: DEV`);
console.log(`⚡ Action: ${action}`);

switch (action) {
  case "spawn":
    console.log("📦 Compiling TypeScript...");
    exec("npx tsc", (err, stdout, stderr) => {
      if (err) {
        console.error("❌ TypeScript compilation error:", err.message);
        return;
      }
      if (stderr) console.error("⚠️ TypeScript stderr:", stderr);
      console.log("✅ TypeScript compiled successfully.");
      console.log(stdout);
      spawnAll(configs);
    });
    break;

  case "remove":
    killAll(configs);
    break;

  case "restart":
    restartAll(configs);
    break;

  default:
    console.error(`❌ Unknown action: ${action}`);
}
