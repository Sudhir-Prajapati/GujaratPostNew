const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');

console.log('[Backend Build] Generating Prisma Client...');
const prismaBin = path.join(rootDir, 'node_modules', 'prisma', 'build', 'index.js');

if (fs.existsSync(prismaBin)) {
  const prismaRes = spawnSync(process.execPath, [prismaBin, 'generate'], {
    cwd: rootDir,
    stdio: 'inherit',
    env: process.env,
  });

  if (prismaRes.status !== 0) {
    console.warn('[Backend Build] Warning: prisma generate encountered a non-zero exit code (possibly locked DLL on Windows). Proceeding with TypeScript compilation if client exists.');
  }
} else {
  // Fallback to npx prisma generate
  try {
    spawnSync('npx', ['prisma', 'generate'], {
      cwd: rootDir,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    });
  } catch (err) {
    console.warn('[Backend Build] Prisma fallback warning:', err.message);
  }
}

console.log('[Backend Build] Compiling TypeScript...');
const tscBin = path.join(rootDir, 'node_modules', 'typescript', 'bin', 'tsc');

const tscRes = spawnSync(process.execPath, [tscBin], {
  cwd: rootDir,
  stdio: 'inherit',
  env: process.env,
});

if (tscRes.status !== 0) {
  console.error('[Backend Build] TypeScript compilation failed.');
  process.exit(tscRes.status || 1);
}

console.log('[Backend Build] ✓ Backend built successfully to dist/ directory.');
process.exit(0);
