const { spawnSync } = require('node:child_process');
const { existsSync, readdirSync, statSync } = require('node:fs');
const path = require('node:path');

function resolveQafixBin() {
  if (process.env.QAFIX_BIN) return process.env.QAFIX_BIN;
  const candidates = [
    path.join(process.cwd(), 'node_modules', 'qafix', 'dist', 'bin', 'qafix.js'),
    path.resolve(__dirname, '../../../qaFixAIAgent/qa-fix/dist/bin/qafix.js')
  ];
  return candidates.find((file) => existsSync(file)) || candidates[0];
}

function collectTraces(target) {
  const resolved = path.resolve(target);
  if (!existsSync(resolved)) {
    console.error(`No such file or directory: ${target}`);
    process.exit(1);
  }
  if (statSync(resolved).isFile()) {
    if (!resolved.endsWith('.zip')) {
      console.error(`Expected a trace.zip file, got: ${target}`);
      process.exit(1);
    }
    return [resolved];
  }
  const names = readdirSync(resolved);
  const traces = names
    .filter((name) => name.endsWith('.zip') || name.endsWith('-trace.zip'))
    .map((name) => path.join(resolved, name))
    .filter((file) => statSync(file).isFile())
    .sort();
  const nested = names
    .map((name) => path.join(resolved, name))
    .filter((file) => {
      try {
        return statSync(file).isDirectory();
      } catch {
        return false;
      }
    })
    .flatMap((dir) =>
      readdirSync(dir)
        .filter((name) => name === 'trace.zip' || name.endsWith('-trace.zip'))
        .map((name) => path.join(dir, name))
    );
  return [...traces, ...nested].sort();
}

const bin = resolveQafixBin();
if (!existsSync(bin)) {
  console.error(
    'qafix CLI not found. Build qa-fix (`npm run build` there) or run `npm install` in this project.'
  );
  console.error(`Looked for ${bin}`);
  process.exit(1);
}

const target = process.argv[2] || 'test-results';
const traces = collectTraces(target);

if (traces.length === 0) {
  console.log(
    `No trace.zip files under ${target}. Run a failing suite first, for example: npm run test:known-failures`
  );
  process.exit(0);
}

let failed = false;
for (const tracePath of traces) {
  console.log(`\n=== qafix ${tracePath} ===`);
  const result = spawnSync(process.execPath, [bin, 'fix', tracePath], {
    encoding: 'utf8',
    cwd: process.cwd(),
    stdio: 'inherit'
  });
  if (result.status !== 0) failed = true;
}

process.exit(failed ? 1 : 0);
