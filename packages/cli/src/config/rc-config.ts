import { readFileSync } from 'fs';
import { getConfigPath } from '../utils/paths';
import type { BlimuInternalEnvironment } from './client-ids';

/**
 * RC config file structure
 */
export interface RcConfig {
  blimuInternalEnvironment?: BlimuInternalEnvironment;
  runtimeApiBaseUrl?: string;
  platformApiBaseUrl?: string;
}

/**
 * Load RC config from file
 * Checks both ~/.config/blimu/config.json (XDG, preferred) and ~/.blimurc.json (legacy)
 * @returns Config object or null if file doesn't exist
 */
export function loadRcConfig(): RcConfig | null {
  const configPath = getConfigPath();
  if (!configPath) {
    return null;
  }

  try {
    const content = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(content) as RcConfig;
    return config;
  } catch {
    // If file exists but can't be read/parsed, return null (will use defaults)
    return null;
  }
}

/**
 * Get environment from config with priority:
 * 1. CLI flag (passed as parameter)
 * 2. RC file
 * 3. Default
 */
export function getEnvironment(
  cliFlag?: BlimuInternalEnvironment,
  rcConfig?: RcConfig | null
): BlimuInternalEnvironment {
  if (cliFlag) {
    return cliFlag;
  }
  if (rcConfig?.blimuInternalEnvironment) {
    return rcConfig.blimuInternalEnvironment;
  }
  // Import here to avoid circular dependency
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const clientIdsModule = require('./client-ids') as {
    DEFAULT_ENVIRONMENT: BlimuInternalEnvironment;
  };

  return clientIdsModule.DEFAULT_ENVIRONMENT;
}

/**
 * Environment-based Runtime API URL mapping
 */
const RUNTIME_API_URLS: Record<BlimuInternalEnvironment, string> = {
  'local-dev': 'https://runtime-api.dev-blimu.dev',
  'local-prod': 'https://runtime-api.dev-blimu.dev',
  'cloud-dev': 'https://api.blimu.dev',
  'cloud-prod': 'https://api.blimu.dev',
};

/**
 * Environment-based Platform API URL mapping
 */
const PLATFORM_API_URLS: Record<BlimuInternalEnvironment, string> = {
  'local-dev': 'https://platform-api.dev-blimu.dev',
  'local-prod': 'https://platform-api.dev-blimu.dev',
  'cloud-dev': 'https://platform.blimu.dev',
  'cloud-prod': 'https://platform.blimu.dev',
};

/**
 * Get Runtime API base URL with priority:
 * 1. CLI flag (passed as parameter)
 * 2. RC file
 * 3. Environment-based default
 * 4. Fallback default
 */
export function getRuntimeApiBaseUrl(
  cliFlag?: string,
  rcConfig?: RcConfig | null,
  environment?: BlimuInternalEnvironment
): string {
  if (cliFlag) {
    return cliFlag;
  }
  if (rcConfig?.runtimeApiBaseUrl) {
    return rcConfig.runtimeApiBaseUrl;
  }
  if (environment && RUNTIME_API_URLS[environment]) {
    return RUNTIME_API_URLS[environment];
  }
  return 'https://runtime.blimu.dev';
}

/**
 * Get Platform API base URL with priority:
 * 1. CLI flag (passed as parameter)
 * 2. RC file
 * 3. Environment-based default
 * 4. Fallback default
 */
export function getPlatformApiBaseUrl(
  cliFlag?: string,
  rcConfig?: RcConfig | null,
  environment?: BlimuInternalEnvironment
): string {
  if (cliFlag) {
    return cliFlag;
  }
  if (rcConfig?.platformApiBaseUrl) {
    return rcConfig.platformApiBaseUrl;
  }
  if (environment && PLATFORM_API_URLS[environment]) {
    return PLATFORM_API_URLS[environment];
  }
  return 'https://platform.blimu.dev';
}
