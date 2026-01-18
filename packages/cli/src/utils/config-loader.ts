import * as path from 'path';
import * as fs from 'fs';

/**
 * Find default config file in project root
 */
export function findDefaultConfig(): string | null {
  const possiblePaths = [
    path.join(process.cwd(), 'blimu.config.ts'),
    path.join(process.cwd(), 'blimu.config.mjs'),
    path.join(process.cwd(), 'blimu.config.js'),
    path.join(process.cwd(), 'blimu.config.json'),
  ];

  for (const configPath of possiblePaths) {
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }

  return null;
}

/**
 * Load and parse config file
 */
export async function loadConfig(configPath: string): Promise<unknown> {
  const absolutePath = path.isAbsolute(configPath)
    ? configPath
    : path.resolve(process.cwd(), configPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Config file not found: ${absolutePath}`);
  }

  const ext = path.extname(absolutePath).toLowerCase();

  if (ext === '.json') {
    const content = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(content);
  }

  // For .ts, .mjs, .js files, use dynamic import
  const module = await import(absolutePath);
  return module.default || module;
}

/**
 * Get relative import path from output directory to config file
 * Handles both relative paths and ensures proper extension handling
 */
export function getRelativeImportPath(fromDir: string, toFile: string): string {
  const relative = path.relative(fromDir, toFile);
  // Remove .ts/.mjs/.js extension for import
  const withoutExt = relative.replace(/\.(ts|mjs|js)$/, '');
  // Ensure it starts with ./ or ../
  if (!withoutExt.startsWith('.')) {
    return `./${withoutExt}`;
  }
  return withoutExt;
}
