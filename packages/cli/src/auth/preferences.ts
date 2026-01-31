import { readFileSync, writeFileSync, mkdirSync, existsSync, chmodSync } from 'fs';
import { dirname } from 'path';
import { paths } from '../utils/paths';
import { readCredentials, hasCredentials } from './credentials';

/**
 * User preferences structure - stored per user
 */
interface UserPreferences {
  default_workspace_id?: string;
}

/**
 * Preferences file structure - keyed by user ID
 */
type PreferencesFile = Record<string, UserPreferences>;

/**
 * Decode JWT token to extract user ID (sub claim)
 */
function decodeJwtUserId(token: string): string | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode base64url payload
    const payload = parts[1];
    if (!payload) {
      return null;
    }
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    const claims = JSON.parse(jsonPayload) as Record<string, unknown>;

    // Return sub (subject) claim which contains user ID
    return typeof claims['sub'] === 'string' ? claims['sub'] : null;
  } catch {
    return null;
  }
}

/**
 * Get current user ID from access token
 */
function getCurrentUserId(): string | null {
  if (!hasCredentials()) {
    return null;
  }

  try {
    const creds = readCredentials();
    return decodeJwtUserId(creds.access_token);
  } catch {
    return null;
  }
}

/**
 * Read preferences file
 */
function readPreferencesFile(): PreferencesFile {
  if (!existsSync(paths.preferences)) {
    return {};
  }

  try {
    const content = readFileSync(paths.preferences, 'utf-8');
    return JSON.parse(content) as PreferencesFile;
  } catch {
    return {};
  }
}

/**
 * Write preferences file
 */
function writePreferencesFile(prefs: PreferencesFile): void {
  // Ensure directory exists
  const dir = dirname(paths.preferences);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  // Write file
  writeFileSync(paths.preferences, JSON.stringify(prefs, null, 2), 'utf-8');

  // Set permissions to 600 (owner read/write only)
  chmodSync(paths.preferences, 0o600);
}

/**
 * Get default workspace ID for the current user
 */
export function getDefaultWorkspaceId(): string | null {
  const userId = getCurrentUserId();
  if (!userId) {
    return null;
  }

  const prefs = readPreferencesFile();
  return prefs[userId]?.default_workspace_id ?? null;
}

/**
 * Set default workspace ID for the current user
 */
export function setDefaultWorkspaceId(workspaceId: string): void {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('Cannot set workspace preference: No authenticated user found');
  }

  const prefs = readPreferencesFile();
  prefs[userId] = {
    ...prefs[userId],
    default_workspace_id: workspaceId,
  };
  writePreferencesFile(prefs);
}
