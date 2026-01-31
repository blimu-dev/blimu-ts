import { Blimu, type Schema, FetchError, BadRequestError } from '@blimu/backend';
import { generateCodeVerifier, generateCodeChallenge } from '../utils/pkce';
import { poll } from '../utils/polling';
import type { RequestInfo } from 'undici';
import { Agent, fetch as undiciFetch } from 'undici';
import type { BlimuInternalEnvironment } from '../config/client-ids';

/**
 * Create a custom fetch function that accepts self-signed certificates
 * This is needed for local development with self-signed SSL certificates
 */
export function createLocalDevFetch(): typeof fetch {
  // Create an undici Agent that accepts self-signed certificates
  // undici is built into Node.js 18+, so no need to install it
  const agent = new Agent({
    connect: {
      rejectUnauthorized: false, // Accept self-signed certificates for local dev
    },
  });

  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    // Use undici's fetch with the custom agent
    return undiciFetch(input, {
      ...init,
      dispatcher: agent,
    }) as Promise<Response>;
  };
}

/**
 * OAuth2 client for device code flow
 */
export class OAuth2Client {
  private readonly client: Blimu;

  constructor(
    private readonly runtimeApiBaseUrl: string,
    private readonly clientId: string,
    private readonly environment?: BlimuInternalEnvironment
  ) {
    // For local-dev environment, use custom fetch that accepts self-signed certificates
    const fetchFn =
      this.environment === 'local-dev' || this.environment === 'local-prod'
        ? createLocalDevFetch()
        : undefined;

    this.client = new Blimu({
      baseURL: runtimeApiBaseUrl,
      ...(fetchFn ? { fetch: fetchFn } : {}),
    });
  }

  /**
   * Request device code with PKCE
   */
  async requestDeviceCode(): Promise<{
    deviceCodeResponse: Schema.DeviceCodeResponse;
    codeVerifier: string;
    codeChallenge: string;
  }> {
    // Generate PKCE verifier and challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Request device code using backend SDK
    try {
      const deviceCodeResponse = await this.client.oauth.requestDeviceCode({
        client_id: this.clientId,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      });

      return {
        deviceCodeResponse,
        codeVerifier,
        codeChallenge,
      };
    } catch (error: unknown) {
      // Handle FetchError from SDK
      if (error instanceof FetchError) {
        const errorBody =
          (error.data as {
            error_description?: string;
            error?: string;
          }) || {};

        // For HTTP 0 errors (network failures), provide more context
        if (error.status === 0) {
          const underlyingError = error.message || 'Unknown network error';
          throw new Error(
            `Failed to connect to ${this.runtimeApiBaseUrl}. ${underlyingError}\n` +
              `This usually means:\n` +
              `  - The server is not running or not reachable\n` +
              `  - DNS resolution failed\n` +
              `  - SSL/TLS certificate issues\n` +
              `  - Network connectivity problems\n\n` +
              `Please verify that the Runtime API is accessible at: ${this.runtimeApiBaseUrl}`
          );
        }

        throw new Error(
          errorBody.error_description ?? errorBody.error ?? error.message ?? 'Request failed'
        );
      }
      throw error;
    }
  }

  /**
   * Poll for tokens using device code
   */
  async pollForTokens(
    deviceCode: string,
    codeVerifier: string,
    interval: number
  ): Promise<Schema.TokenResponse> {
    return poll<Schema.TokenResponse>(
      async () => {
        try {
          const tokenResponse = await this.client.oauth.exchangeDeviceCode({
            grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
            device_code: deviceCode,
            client_id: this.clientId,
            code_verifier: codeVerifier,
          });
          return { success: true, data: tokenResponse };
        } catch (error: unknown) {
          if (error instanceof BadRequestError) {
            return {
              success: false,
              error: {
                error: error.message,
                error_description: error.message,
              },
            };
          }
          // FetchClient throws FetchError on non-2xx responses
          // Extract error details for polling logic
          if (error instanceof FetchError) {
            // For HTTP 0 errors (network failures), throw immediately
            if (error.status === 0) {
              throw new Error(
                `Network error while polling for tokens: ${error.message || 'Connection failed'}\n` +
                  `Please verify that the Runtime API is accessible at: ${this.runtimeApiBaseUrl}`
              );
            }

            // For other errors, create a poll error with user-friendly message
            return {
              success: false,
              error: {
                error: `http_${error.status}`,
                error_description: error.message || `HTTP ${error.status} error`,
              },
            };
          }

          // For non-FetchError exceptions, throw immediately (don't poll on these)
          const errorMessage = error instanceof Error ? error.message : String(error);
          throw new Error(`Unexpected error while polling for tokens: ${errorMessage}`);
        }
      },
      {
        initialInterval: interval,
        maxInterval: 60,
        maxAttempts: 120,
        timeout: 600000, // 10 minutes
      }
    );
  }
}
