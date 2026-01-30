import { readFileSync, writeFileSync, mkdirSync, existsSync, chmodSync, unlinkSync } from 'fs';
import { dirname } from 'path';
import { paths } from '../utils/paths';
import type { BlimuInternalEnvironment } from '../config/client-ids';

/**
 * Credentials file structure (when keychain available)
 */
export interface Credentials {
  access_token: string;
  token_type: 'Bearer';
  expires_at: number; // Unix timestamp
  environment?: BlimuInternalEnvironment;
}

/**
 * Credentials file structure (when keychain unavailable - fallback)
 */
export interface CredentialsWithRefreshToken extends Credentials {
  refresh_token: string;
  _keychain_unavailable?: boolean;
}

const KEYCHAIN_SERVICE = 'blimu-cli';

// Lazy-load keyring module to avoid loading native module at module load time
let keyringModule: typeof import('@napi-rs/keyring') | null = null;
let keyringLoadPromise: Promise<typeof import('@napi-rs/keyring')> | null = null;

/**
 * Get the keyring Entry class, loading it dynamically if needed
 */
async function getKeyringEntry(): Promise<(typeof import('@napi-rs/keyring'))['Entry']> {
  if (keyringModule) {
    return keyringModule.Entry;
  }

  keyringLoadPromise ??= import('@napi-rs/keyring');

  keyringModule = await keyringLoadPromise;
  return keyringModule.Entry;
}

/**
 * Check if keychain is available
 */
export async function isKeychainAvailable(): Promise<boolean> {
  try {
    const Entry = await getKeyringEntry();
    const entry = new Entry(KEYCHAIN_SERVICE, 'test-availability');
    entry.setPassword('test');
    entry.deletePassword();
    return true;
  } catch {
    return false;
  }
}

/**
 * Get refresh token from keychain or credentials file
 */
export async function getRefreshToken(
  environment: BlimuInternalEnvironment
): Promise<string | null> {
  const account = `refresh-token-${environment}`;

  // Try keychain first
  try {
    const Entry = await getKeyringEntry();
    const entry = new Entry(KEYCHAIN_SERVICE, account);
    const token = entry.getPassword();
    if (token) {
      return token;
    }
  } catch {
    // Keychain unavailable or token not found, try fallback
  }

  // Fallback to credentials file
  if (existsSync(paths.credentials)) {
    try {
      const content = readFileSync(paths.credentials, 'utf-8');
      const creds = JSON.parse(content) as CredentialsWithRefreshToken;
      if (creds._keychain_unavailable && creds.refresh_token) {
        return creds.refresh_token;
      }
    } catch {
      // Ignore errors
    }
  }

  return null;
}

/**
 * Set refresh token in keychain or credentials file (with fallback)
 */
export async function setRefreshToken(
  environment: BlimuInternalEnvironment,
  token: string
): Promise<{ usedKeychain: boolean }> {
  const account = `refresh-token-${environment}`;

  // Try keychain first
  try {
    const Entry = await getKeyringEntry();
    const entry = new Entry(KEYCHAIN_SERVICE, account);
    entry.setPassword(token);
    return { usedKeychain: true };
  } catch {
    // Keychain unavailable, use fallback
  }

  // Fallback to credentials file
  const creds = readCredentials();
  const updatedCreds: CredentialsWithRefreshToken = {
    ...creds,
    refresh_token: token,
    _keychain_unavailable: true,
    environment,
  };
  writeCredentials(updatedCreds);

  return { usedKeychain: false };
}

/**
 * Delete refresh token from keychain and credentials file
 */
export async function deleteRefreshToken(environment: BlimuInternalEnvironment): Promise<void> {
  const account = `refresh-token-${environment}`;

  // Try to delete from keychain
  try {
    const Entry = await getKeyringEntry();
    const entry = new Entry(KEYCHAIN_SERVICE, account);
    entry.deletePassword();
  } catch {
    // Ignore errors (keychain might not be available or token might not exist)
  }

  // Also remove from credentials file if it exists there
  if (existsSync(paths.credentials)) {
    try {
      const content = readFileSync(paths.credentials, 'utf-8');
      const creds = JSON.parse(content) as CredentialsWithRefreshToken;
      if (creds._keychain_unavailable) {
        // Create new object without refresh_token and _keychain_unavailable
        const {
          refresh_token: _refreshToken,
          _keychain_unavailable: _unavailable,
          ...cleanCreds
        } = creds;
        writeCredentials(cleanCreds);
      }
    } catch {
      // Ignore errors
    }
  }
}

/**
 * Get code verifier from keychain or credentials file
 */
export async function getCodeVerifier(
  environment: BlimuInternalEnvironment
): Promise<string | null> {
  const account = `code-verifier-${environment}`;

  // Try keychain first
  try {
    const Entry = await getKeyringEntry();
    const entry = new Entry(KEYCHAIN_SERVICE, account);
    const verifier = entry.getPassword();
    if (verifier) {
      return verifier;
    }
  } catch {
    // Keychain unavailable, try fallback
  }

  // Fallback not implemented for code verifier (less critical)
  return null;
}

/**
 * Set code verifier in keychain
 */
export async function setCodeVerifier(
  environment: BlimuInternalEnvironment,
  verifier: string
): Promise<{ usedKeychain: boolean }> {
  const account = `code-verifier-${environment}`;

  // Try keychain first
  try {
    const Entry = await getKeyringEntry();
    const entry = new Entry(KEYCHAIN_SERVICE, account);
    entry.setPassword(verifier);
    return { usedKeychain: true };
  } catch {
    // Keychain unavailable, skip (code verifier is less critical)
    return { usedKeychain: false };
  }
}

/**
 * Read credentials from file
 */
export function readCredentials(): Credentials {
  if (!existsSync(paths.credentials)) {
    throw new Error('No credentials found. Please run `blimu login` first.');
  }

  try {
    const content = readFileSync(paths.credentials, 'utf-8');
    return JSON.parse(content) as Credentials;
  } catch (error) {
    throw new Error(
      `Failed to read credentials: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Write credentials to file with proper permissions
 */
export function writeCredentials(creds: Credentials | CredentialsWithRefreshToken): void {
  // Ensure directory exists
  const dir = dirname(paths.credentials);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  // Write file
  writeFileSync(paths.credentials, JSON.stringify(creds, null, 2), 'utf-8');

  // Set permissions to 600 (owner read/write only)
  chmodSync(paths.credentials, 0o600);
}

/**
 * Delete credentials file
 */
export function deleteCredentials(): void {
  if (existsSync(paths.credentials)) {
    unlinkSync(paths.credentials);
  }
}

/**
 * Check if credentials exist
 */
export function hasCredentials(): boolean {
  return existsSync(paths.credentials);
}
