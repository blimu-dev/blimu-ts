import { homedir } from 'os';
import { join } from 'path';
import { existsSync } from 'fs';
/**
 * Standard paths for Blimu CLI
 */
export const paths = {
  /**
   * Credentials file path
   * ~/.blimu/credentials.json
   */
  credentials: join(homedir(), '.blimu', 'credentials.json'),

  /**
   * Config file paths (in priority order)
   * 1. ~/.blimurc.json
   * 2. ~/.config/blimu/config.json (XDG Base Directory spec)
   */
  config: {
    primary: join(homedir(), '.blimurc.json'),
    xdg: join(homedir(), '.config', 'blimu', 'config.json'),
  },
} as const;

/**
 * Get the config file path (checks both locations)
 */
export function getConfigPath(): string | null {
  if (existsSync(paths.config.primary)) {
    return paths.config.primary;
  }
  if (existsSync(paths.config.xdg)) {
    return paths.config.xdg;
  }
  return null;
}
