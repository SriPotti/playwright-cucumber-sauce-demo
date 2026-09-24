import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

function qafixEntry(): string {
  const local = path.join(process.cwd(), 'node_modules', 'qafix', 'dist', 'bin', 'qafix.js');
  if (existsSync(local)) return local;
  return path.resolve(
    process.cwd(),
    '../../qaFixAIAgent/qa-fix/dist/bin/qafix.js'
  );
}

function qafixPackageRoot(bin: string): string {
  return path.resolve(path.dirname(bin), '..', '..');
}

export function runQafixOnTrace(tracePath: string): string {
  if (process.env.QAFIX_SKIP === '1') {
    return 'qafix skipped (QAFIX_SKIP=1)\n';
  }

  const bin = process.env.QAFIX_BIN || qafixEntry();
  if (!existsSync(bin)) {
    return [
      'qafix is not installed in this project.',
      'In qa-fix run: npm ci && npm run build && npm link',
      'In this Playwright repo run: npm link qafix',
      `Expected CLI at ${bin}`,
      ''
    ].join('\n');
  }

  const result = spawnSync(process.execPath, [bin, 'fix', path.resolve(tracePath)], {
    encoding: 'utf8',
    cwd: qafixPackageRoot(bin)
  });
  return `${result.stdout ?? ''}${result.stderr ?? ''}`;
}

export function saveQafixOutput(safeName: string, output: string): string {
  const dir = path.join('reports', 'qafix');
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${safeName}.txt`);
  writeFileSync(file, output);
  return file;
}
