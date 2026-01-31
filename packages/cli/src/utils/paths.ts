import { homedir } from 'os';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * XDG Base Directory - industry standard for CLI tools
 * ~/.config/blimu/
 */
const CONFIG_DIR = join(homedir(), '.config', 'blimu');

/**
 * Standard paths for Blimu CLI (following XDG Base Directory specification)
 */
export const paths = {
  /**
   * Config directory
   * ~/.config/blimu/
   */
  configDir: CONFIG_DIR,

  /**
   * Credentials file path
   * ~/.config/blimu/credentials.json
   */
  credentials: join(CONFIG_DIR, 'credentials.json'),

  /**
   * User preferences file path (per-user workspace defaults, etc.)
   * ~/.config/blimu/preferences.json
   */
  preferences: join(CONFIG_DIR, 'preferences.json'),

  /**
   * Config file paths (in priority order)
   * 1. ~/.config/blimu/config.json (XDG Base Directory spec - preferred)
   * 2. ~/.blimurc.json (legacy, for backward compatibility)
   */
  config: {
    primary: join(CONFIG_DIR, 'config.json'),
    legacy: join(homedir(), '.blimurc.json'),
  },
} as const;

/**
 * Get the config file path (checks both locations, prioritizing XDG)
 */
export function getConfigPath(): string | null {
  // Check XDG location first (preferred)
  if (existsSync(paths.config.primary)) {
    return paths.config.primary;
  }
  // Check legacy location for backward compatibility
  if (existsSync(paths.config.legacy)) {
    return paths.config.legacy;
  }
  return null;
}
