import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Copy CSS file to dist
const srcPath = join(__dirname, 'src/styles/globals.css');
const distPath = join(__dirname, 'dist/styles/globals.css');

try {
  const css = readFileSync(srcPath, 'utf-8');
  mkdirSync(dirname(distPath), { recursive: true });
  writeFileSync(distPath, css);
  console.log('✓ CSS copied to dist/styles/globals.css');
} catch (error) {
  console.error('Error copying CSS:', error);
  process.exit(1);
}
