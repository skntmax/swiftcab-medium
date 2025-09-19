const { exec } = require("child_process");
const os = require("os");
const isWindows = os.platform() === "win32";


// Utility to run shell commands
function runCommand(command, name) {
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Error (${name}):`, err.message);
      return;
    }
    if (stderr) {
      console.error(`⚠️ ${name} stderr:`, stderr);
      return;
    }
    console.log(`✅ ${name} -> ${stdout.trim()}`);
  });
}

// Spawn pm2 processes
async function spawnInstances(scriptName, baseName, ports) {
  for (let i = 0; i < ports.length; i++) {
    const name = `${baseName}-${i+1}-${ports[i]}`;
    const command = isWindows
      ? `set PORT=${ports[i]} && pm2 start cmd --name "${name}" -- /c "npm run ${scriptName}"`
      : `set PORT=${ports[i]} && pm2 start npm --name "${name}" -- run ${scriptName}`;

    console.log(`🚀 Spawning instance: ${name}`);
    await Promise.resolve(()=>{ setTimeout(()=>{},3000)})
    runCommand(command, name);
  }
}

async function spawnAll(consumers) {
  consumers.forEach(({ script, base,ports }) =>
    spawnInstances(script, base, ports)
  );
}

function killAll(consumers) {
  exec("pm2 jlist", (err, stdout) => {
    if (err) {
      console.error("❌ Failed to list PM2 processes:", err.message);
      return;
    }

    let processes = [];
    try {
      processes = JSON.parse(stdout);
    } catch (parseErr) {
      console.error("❌ Failed to parse PM2 jlist:", parseErr.message);
      return;
    }

    consumers.forEach(({ base }) => {
      const matches = processes
        .filter((p) => p.name.startsWith(base))
        .map((p) => p.name);

      if (matches.length === 0) {
        console.log(`⚠️ No matching processes for base: ${base}`);
        return;
      }

      matches.forEach((name) => {
        const command = `pm2 delete ${name}`;
        console.log(`🔪 Removing: ${name}`);
        runCommand(command, name);
      });
    });
  });
}

function restartAll(consumers) {
exec("pm2 jlist", (err, stdout) => {
    if (err) {
      console.error("❌ Failed to list PM2 processes:", err.message);
      return;
    }

    let processes = [];
    try {
      processes = JSON.parse(stdout);
    } catch (parseErr) {
      console.error("❌ Failed to parse PM2 jlist:", parseErr.message);
      return;
    }

    consumers.forEach(({ base }) => {
      const matches = processes
        .filter((p) => p.name.startsWith(base))
        .map((p) => p.name);

      if (matches.length === 0) {
        console.log(`⚠️ No matching processes for base: ${base}`);
        return;
      }

      matches.forEach((name) => {
        const command = `pm2 restart ${name}`;
        console.log(`🔄 Restarting: ${name}`);
        runCommand(command, name);
      });
    });
  });
}

module.exports = { spawnAll, killAll, restartAll };
