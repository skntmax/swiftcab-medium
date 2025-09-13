const { exec } = require("child_process");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "./../.env.development") });
const os = require("os");
const isWindows = os.platform() === "win32";

// Utility to run shell commands
function runCommand(command, name) {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Error starting ${name}:`, err.message);
      return;
    }
    if (stderr) {
      console.error(`⚠️ ${name} stderr:`, stderr);
      return;
    }
    console.log(`✅ ${name} started:\n${stdout}`);
  });
}

// Function to spawn pm2 processes for a script
function spawnInstances(scriptName, baseName, count) {
  for (let i = 1; i <= count; i++) {
    const name = `${baseName}-${i}`;
    const command = isWindows
      ? `pm2 start cmd --name "${name}" -- /c "npm run ${scriptName}"`
      : `pm2 start npm --name "${name}" -- run ${scriptName}`;

    console.log(`🚀 Spawning instance: ${name}`);
    runCommand(command, name);
  }
}

// Config for all consumers
const consumers = [
  {
    script: "init:kafka:driverConsumerPoolInstance:dev",
    base: "kafka-driver-pool-consumer-dev",
    // count: 5,
    count: 1,
  },
  {
    script: "init:kafka:userDriverRequestInstance:dev",
    base: "kafka-user-driver-request-consumer-dev",
    // count: 2,
    count: 1,

  },
  {
    script: "init:kafka:driverAcceptedRides:dev",
    base: "kafka-driver-accepted-rides-consumer-dev",
    // count: 5,
    count: 1,

  },
];

// Spawn all consumers
function spawnAll() {
  consumers.forEach(({ script, base, count }) =>
    spawnInstances(script, base, count)
  );
}

// First compile TypeScript
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

  // Spawn Kafka consumer groups
  spawnAll();
});
