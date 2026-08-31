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

const nextBin = path.join(realCwd, 'node_modules', 'next', 'dist', 'bin', 'next');

const env = {
  ...process.env,
  NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --max-old-space-size=3072`.trim(),
};

// Check if user passed arguments (e.g. custom port or flags)
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
