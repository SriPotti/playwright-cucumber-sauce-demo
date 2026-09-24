const { spawnSync } = require('node:child_process');

function run(command, args) {
  return spawnSync(command, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
}

console.log('\n=== Cucumber: all features ===\n');
const cucumber = run('npx', ['cucumber-js']);

console.log('\n=== qafix 1.1–1.3 on every saved trace.zip ===\n');
const qafix = run('npm', ['run', 'qafix']);

if (qafix.status !== 0) {
  process.exit(qafix.status ?? 1);
}
process.exit(cucumber.status ?? 1);
