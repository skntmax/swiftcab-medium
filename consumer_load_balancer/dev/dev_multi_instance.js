const { exec } = require("child_process");
const dotenv = require("dotenv");
const path = require("path");
const os = require("os");

dotenv.config({ path: path.resolve(__dirname, "./../.env.development") });

const isWindows = os.platform() === "win32";

// First compile the TypeScript files
console.log("📦 Compiling TypeScript...");
exec("npx tsc", (tscErr, tscStdout, tscStderr) => {
  if (tscErr) {
    console.error("❌ TypeScript compilation error:", tscErr.message);
    return;
  }
  if (tscStderr) {
    console.error("⚠️ TypeScript stderr:", tscStderr);
  }
  console.log("✅ TypeScript compiled successfully.");
  console.log(tscStdout);

  // Now spawn pm2 processes
  const instanceCount = 5;

  for (let i = 1; i <= instanceCount; i++) {
    const name = `kafka-driver-pool-consumer-dev-${i}`;

    const command = isWindows
      ? `pm2 start cmd --name "${name}" -- /c "npm run init:kafka:driver_consumer_pool:dev"`
      : `pm2 start npm --name '${name}' -- run init:kafka:driver_consumer_pool:dev`;

    console.log(`🚀 Spawning instance: ${name}`);
    exec(command, (pm2Err, pm2Stdout, pm2Stderr) => {
      if (pm2Err) {
        console.error(`❌ Error starting ${name}:`, pm2Err.message);
        return;
      }
      if (pm2Stderr) {
        console.error(`⚠️ ${name} stderr:`, pm2Stderr);
        return;
      }
      console.log(`✅ ${name} started:\n${pm2Stdout}`);
    });
  }
});
