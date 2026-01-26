import { readCredentials, writeCredentials, getRefreshToken, setRefreshToken } from './credentials';
import type { BlimuInternalEnvironment } from '../config/client-ids';

/**
 * Token response from refresh endpoint
 */
export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope?: string;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  runtimeApiBaseUrl: string,
  clientId: string,
  environment: BlimuInternalEnvironment
): Promise<{ access_token: string; expires_at: number; refresh_token: string }> {
  // Get refresh token from keychain or credentials file
  const refreshToken = await getRefreshToken(environment);
  if (!refreshToken) {
    throw new Error('No refresh token found. Please run `blimu login` again.');
  }

  // Request new tokens
  const response = await fetch(`${runtimeApiBaseUrl}/v1/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      error_description?: string;
      error?: string;
    };
    throw new Error(
      error.error_description ?? error.error ?? `HTTP ${response.status}: ${response.statusText}`
    );
  }

  const tokenResponse = (await response.json()) as RefreshTokenResponse;

  // Calculate expiry timestamp
  const expiresAt = Math.floor(Date.now() / 1000) + tokenResponse.expires_in;

  // Update credentials file
  const creds = readCredentials();
  writeCredentials({
    ...creds,
    access_token: tokenResponse.access_token,
    expires_at: expiresAt,
    environment,
  });

  // Update refresh token (handle rotation)
  if (tokenResponse.refresh_token !== refreshToken) {
    // Token was rotated, update stored refresh token
    await setRefreshToken(environment, tokenResponse.refresh_token);
  }

  return {
    access_token: tokenResponse.access_token,
    expires_at: expiresAt,
    refresh_token: tokenResponse.refresh_token,
  };
}

/**
 * Check if access token is expired or about to expire
 * @param bufferSeconds - Number of seconds before expiry to consider token expired (default: 60)
 */
export function isTokenExpired(bufferSeconds = 60): boolean {
  try {
    const creds = readCredentials();
    const now = Math.floor(Date.now() / 1000);
    return creds.expires_at - now < bufferSeconds;
  } catch {
    return true; // If we can't read credentials, consider expired
  }
}

/**
 * Get valid access token, refreshing if necessary
 */
export async function getValidAccessToken(
  runtimeApiBaseUrl: string,
  clientId: string,
  environment: BlimuInternalEnvironment
): Promise<string> {
  // Check if token is expired
  if (isTokenExpired()) {
    // Refresh token
    const refreshed = await refreshAccessToken(runtimeApiBaseUrl, clientId, environment);
    return refreshed.access_token;
  }

  // Token is still valid, return it
  const creds = readCredentials();
  return creds.access_token;
}
