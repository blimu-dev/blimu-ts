import { spawnSync } from 'child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let hasError = false;

function compileFullCss() {
  const input = join(__dirname, 'src/styles/styles.css');
  const output = join(__dirname, 'dist/styles/styles.css');
  mkdirSync(dirname(output), { recursive: true });

  // Prefer calling the real binary. In this monorepo the binary is provided by
  // `@tailwindcss/cli` at the workspace root.
  const binCandidates = [
    join(__dirname, '../../node_modules/.bin/tailwindcss'),
    join(__dirname, '../../../node_modules/.bin/tailwindcss'),
  ];

  const tailwindBin = binCandidates.find((p) => existsSync(p));

  const args = ['-i', input, '-o', output, '--content', './src/**/*.{ts,tsx}'];

  // Tailwind v4: compile CSS and generate only the utilities we actually use in src/.
  const result = tailwindBin
    ? spawnSync(tailwindBin, args, { cwd: __dirname, stdio: 'inherit' })
    : spawnSync('yarn', ['-s', 'tailwindcss', ...args], {
        cwd: __dirname,
        stdio: 'inherit',
      });

  if (result.status !== 0) {
    console.error('Tailwind CSS compilation failed.');
    return false;
  }

  console.log('✓ Full CSS compiled to dist/styles/styles.css');
  return true;
}

function copyTwStylesCss() {
  const srcPath = join(__dirname, 'src/styles/tw-styles.css');
  const distPath = join(__dirname, 'dist/styles/tw-styles.css');
  const css = readFileSync(srcPath, 'utf-8');
  mkdirSync(dirname(distPath), { recursive: true });
  writeFileSync(distPath, css);
  console.log('✓ Tailwind-consumer CSS copied to dist/styles/tw-styles.css');
}

try {
  if (!compileFullCss()) hasError = true;
} catch (error) {
  console.error('Error compiling styles.css:', error);
  hasError = true;
}

try {
  copyTwStylesCss();
} catch (error) {
  console.error('Error copying tw-styles.css:', error);
  hasError = true;
}

if (hasError) {
  process.exit(1);
}
