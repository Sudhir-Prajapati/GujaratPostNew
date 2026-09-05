const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Fix Windows case-sensitivity path issues
const realCwd = fs.realpathSync.native(process.cwd());

if (process.cwd() !== realCwd) {
  console.log(`[Casing Corrector] Detected casing mismatch in working directory.`);
  console.log(`Current CWD: ${process.cwd()}`);
  console.log(`Real CWD:    ${realCwd}`);
}

// Clean stale lock files and corrupted turbopack cache from previous crashed runs
const nextDir = path.join(realCwd, '.next');
const lockFile = path.join(nextDir, 'lock');
if (fs.existsSync(lockFile)) {
  try {
    fs.unlinkSync(lockFile);
  } catch (e) {}
}
const turboCacheDir = path.join(nextDir, 'dev', 'cache', 'turbopack');
if (fs.existsSync(turboCacheDir)) {
  try {
    fs.rmSync(turboCacheDir, { recursive: true, force: true });
  } catch (e) {}
}

// Clean stale cache to avoid memory spikes from stale cache artifacts
const webpackCacheDir = path.join(nextDir, 'cache', 'webpack');
if (fs.existsSync(webpackCacheDir)) {
  try {
    fs.rmSync(webpackCacheDir, { recursive: true, force: true });
  } catch (e) {}
}

const nextBin = path.join(realCwd, 'node_modules', 'next', 'dist', 'bin', 'next');

const env = {
  ...process.env,
  NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --max-old-space-size=1024 --no-warnings`.trim(),
  NEXT_TELEMETRY_DISABLED: '1',
};

const userArgs = process.argv.slice(2);
const args = userArgs.length > 0 ? ['dev', ...userArgs] : ['dev', '--webpack'];

const child = spawn(process.execPath, [nextBin, ...args], {
  cwd: realCwd,
  stdio: 'inherit',
  env,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

process.on('SIGINT', () => {
  if (child && !child.killed) {
    child.kill('SIGINT');
  }
});

process.on('SIGTERM', () => {
  if (child && !child.killed) {
    child.kill('SIGTERM');
  }
});

