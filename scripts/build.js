const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const realCwd = fs.realpathSync.native(process.cwd());

if (process.cwd() !== realCwd) {
  console.log(`[Casing Corrector] Detected casing mismatch in working directory.`);
  console.log(`Current CWD: ${process.cwd()}`);
  console.log(`Real CWD:    ${realCwd}`);
  console.log(`Rerunning build in the correct casing...\n`);
}

// Clean previous build cache to avoid stale memory buffers
const nextDir = path.join(realCwd, '.next');
if (fs.existsSync(nextDir)) {
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
  } catch (e) {}
}

const nextBin = path.join(realCwd, 'node_modules', 'next', 'dist', 'bin', 'next');

const env = {
  ...process.env,
  NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --max-old-space-size=2048`.trim(),
};

const result = spawnSync(process.execPath, [nextBin, 'build'], {
  cwd: realCwd,
  stdio: 'inherit',
  env,
});

process.exit(result.status ?? 0);
