import { BlimuCli } from '../api-sdk/client';
import { loadRcConfig, getPlatformApiBaseUrl } from '../config/rc-config';
import { hasCredentials, readCredentials } from '../auth/credentials';
import { getValidAccessToken } from '../auth/token-refresh';
import { createLocalDevFetch } from '../auth/oauth-client';
import { getClientId, type BlimuInternalEnvironment } from '../config/client-ids';
import { getRuntimeApiBaseUrl } from '../config/rc-config';

export interface CreatePlatformClientOptions {
  apiKey?: string;
  bearer?: string;
  platformApiUrl?: string;
  /** When set (e.g. from --exec-env), platform and runtime URLs are resolved from this environment. */
  environment?: BlimuInternalEnvironment;
  requireAuth?: boolean;
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
  const { apiKey, bearer, platformApiUrl, environment: execEnv, requireAuth = true } = options;

  // Load RC config
  const rcConfig = loadRcConfig();

  // Get environment for URL resolution: explicit exec-env wins, then credentials, then RC config
  let environment: BlimuInternalEnvironment | undefined = execEnv;
  if (environment === undefined) {
    if (hasCredentials()) {
      try {
        const creds = readCredentials();
        environment = creds.environment ?? rcConfig?.blimuInternalEnvironment;
      } catch {
        environment = rcConfig?.blimuInternalEnvironment;
      }
    } else {
      environment = rcConfig?.blimuInternalEnvironment;
    }
  }

  // Resolve Platform API base URL from exec-env (CLI flag → env var → RC config → environment-based → fallback)
  const baseURL =
    platformApiUrl ??
    getPlatformApiBaseUrl(undefined, rcConfig, environment) ??
    'https://platform.blimu.dev';

  // For local-dev/local-prod, use custom fetch that accepts self-signed certificates
  const fetchFn =
    environment === 'local-dev' || environment === 'local-prod' ? createLocalDevFetch() : undefined;

  // Handle authentication
  const finalApiKey: string | undefined = apiKey;
  let finalBearer: string | undefined = bearer;

  // If explicit auth provided, use it
  if (finalApiKey || finalBearer) {
    return new BlimuCli({
      baseURL,
      ...(fetchFn ? { fetch: fetchFn } : {}),
      ...(finalApiKey ? { apiKey: finalApiKey } : {}),
      ...(finalBearer ? { bearer: finalBearer } : {}),
    });
  }

  // If auth not required, create client without auth
  if (!requireAuth) {
    return new BlimuCli({
      baseURL,
      ...(fetchFn ? { fetch: fetchFn } : {}),
    });
  }

  // Auth is required but not provided - check for credentials
  if (!hasCredentials()) {
    throw new Error(
      'Authentication required. Please run `blimu login` first or provide --api-key <key> or --bearer <token>'
    );
  }

  // Auto-load and refresh OAuth token
  let authEnvironment: BlimuInternalEnvironment = 'cloud-prod';
  try {
    const creds = readCredentials();
    authEnvironment = creds.environment ?? rcConfig?.blimuInternalEnvironment ?? 'cloud-prod';
    const runtimeApiBaseUrl = getRuntimeApiBaseUrl(undefined, rcConfig, authEnvironment);
    const clientId = getClientId(authEnvironment);

    finalBearer = await getValidAccessToken(runtimeApiBaseUrl, clientId, authEnvironment);
  } catch (error) {
    throw new Error(
      `Failed to authenticate: ${error instanceof Error ? error.message : String(error)}\n` +
        'Please run `blimu login` again.'
    );
  }

  // Create client with refreshed token
  const authFetch =
    authEnvironment === 'local-dev' || authEnvironment === 'local-prod'
      ? createLocalDevFetch()
      : undefined;

  return new BlimuCli({
    baseURL,
    ...(authFetch ? { fetch: authFetch } : {}),
    bearer: finalBearer,
  });
}
