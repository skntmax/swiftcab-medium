const { exec } = require("child_process");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env.development
dotenv.config({ path: path.resolve(__dirname, "./../../.env.development") });

// Number of Kafka consumer pool instances you want
const instanceCount = 4;

for (let i = 1; i <= instanceCount; i++) {
  const name = `kafka-driver-pool-consumer-${i}`;
  const command = `pm2 start npm --name "${name}" -- run init:kafka:driver_consumer_pool:prod`;

  console.log(`🚀 Spawning ${name}...`);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error starting ${name}:`, error.message);
      return;
    }
    if (stderr) {
      console.error(`⚠️ Stderr from ${name}:`, stderr);
      return;
    }
    console.log(`✅ ${name} started:\n${stdout}`);
  });
}
