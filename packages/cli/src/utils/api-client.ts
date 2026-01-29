import type * as clack from '@clack/prompts';
import { BlimuCli } from '../api-sdk/client';
import { loadRcConfig, getPlatformApiBaseUrl } from '../config/rc-config';
import { hasCredentials, readCredentials } from '../auth/credentials';
import { getValidAccessToken } from '../auth/token-refresh';
import { getClientId, type BlimuInternalEnvironment } from '../config/client-ids';
import { getRuntimeApiBaseUrl } from '../config/rc-config';

export interface CreatePlatformClientOptions {
  apiKey?: string;
  bearer?: string;
  platformApiUrl?: string;
  requireAuth?: boolean;
  spinner?: ReturnType<typeof clack.spinner>;
}

/**
 * Create an authenticated Platform API client
 *
 * Handles authentication automatically:
 * - Uses explicit apiKey or bearer token if provided
 * - If requireAuth is false, creates client without auth
 * - Otherwise, checks for credentials and auto-refreshes OAuth token
 *
 * @param options - Client configuration options
 * @returns Configured BlimuCli instance
 * @throws Error if authentication is required but not available
 */
export async function createPlatformApiClient(
  options: CreatePlatformClientOptions = {}
): Promise<BlimuCli> {
  const { apiKey, bearer, platformApiUrl, requireAuth = true, spinner } = options;

  // Load RC config
  const rcConfig = loadRcConfig();

  // Get environment for URL resolution
  let environment: BlimuInternalEnvironment | undefined;
  if (hasCredentials()) {
    try {
      const creds = readCredentials();
      environment = creds.environment ?? rcConfig?.blimuInternalEnvironment;
    } catch {
      // If credentials can't be read, use RC config
      environment = rcConfig?.blimuInternalEnvironment;
    }
  } else {
    environment = rcConfig?.blimuInternalEnvironment;
  }

  // Resolve Platform API base URL (CLI flag → RC config → environment-based default → fallback)
  const baseURL =
    platformApiUrl ??
    getPlatformApiBaseUrl(undefined, rcConfig, environment) ??
    'https://platform.blimu.dev';

  // Handle authentication
  const finalApiKey: string | undefined = apiKey;
  let finalBearer: string | undefined = bearer;

  // If explicit auth provided, use it
  if (finalApiKey || finalBearer) {
    return new BlimuCli({
      baseURL,
      ...(finalApiKey ? { apiKey: finalApiKey } : {}),
      ...(finalBearer ? { bearer: finalBearer } : {}),
    });
  }

  // If auth not required, create client without auth
  if (!requireAuth) {
    return new BlimuCli({
      baseURL,
    });
  }

  // Auth is required but not provided - check for credentials
  if (!hasCredentials()) {
    throw new Error(
      'Authentication required. Please run `blimu login` first or provide --api-key <key> or --bearer <token>'
    );
  }

  // Auto-load and refresh OAuth token
  try {
    const creds = readCredentials();
    const environment = creds.environment ?? rcConfig?.blimuInternalEnvironment ?? 'cloud-prod';
    const runtimeApiBaseUrl = getRuntimeApiBaseUrl(undefined, rcConfig, environment);
    const clientId = getClientId(environment);

    if (spinner) {
      spinner.start('Refreshing authentication token...');
    }

    finalBearer = await getValidAccessToken(runtimeApiBaseUrl, clientId, environment);

    if (spinner) {
      spinner.stop('✓ Token refreshed');
    }
  } catch (error) {
    if (spinner) {
      spinner.stop('❌ Failed to refresh token');
    }
    throw new Error(
      `Failed to authenticate: ${error instanceof Error ? error.message : String(error)}\n` +
        'Please run `blimu login` again.'
    );
  }

  // Create client with refreshed token
  return new BlimuCli({
    baseURL,
    bearer: finalBearer,
  });
}
