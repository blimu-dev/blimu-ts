import type { Command } from 'commander';
import { spinner as clackSpinner, log } from '@clack/prompts';
import { OAuth2Client } from '../auth/oauth-client';
import {
  writeCredentials,
  setRefreshToken,
  setCodeVerifier,
  isKeychainAvailable,
} from '../auth/credentials';
import { getClientId, type BlimuInternalEnvironment } from '../config/client-ids';
import { loadRcConfig, getEnvironment, getRuntimeApiBaseUrl } from '../config/rc-config';

interface LoginCommandOptions {
  execEnv: BlimuInternalEnvironment;
  runtimeApiUrl: string;
  verbose: boolean;
}

/**
 * Register the login command
 */
export function loginCommand(program: Command): void {
  program
    .command('login')
    .description('Authenticate with Blimu using OAuth2 device flow')
    .option(
      '--exec-env <env>',
      'Blimu internal environment (local-dev, local-prod, cloud-dev, cloud-prod)'
    )
    .option('--runtime-api-url <url>', 'Override Runtime API base URL')
    .option('--verbose', 'Show detailed output', false)
    .action(async (options: LoginCommandOptions) => {
      const spin = clackSpinner();
      const verbose = options.verbose;

      try {
        // Load RC config
        const rcConfig = loadRcConfig();

        // Get environment
        const environment = getEnvironment(
          options.execEnv as BlimuInternalEnvironment | undefined,
          rcConfig
        );

        // Get Runtime API base URL
        const runtimeApiBaseUrl = getRuntimeApiBaseUrl(
          options.runtimeApiUrl,
          rcConfig,
          environment
        );

        if (verbose) {
          log.info(`Runtime API: ${runtimeApiBaseUrl}`);
        }

        // Get client ID
        const clientId = getClientId(environment);

        log.step(`Authenticating to ${environment} environment...`);

        // Check keychain availability (silent unless warning needed)
        const keychainAvailable = await isKeychainAvailable();

        if (!keychainAvailable) {
          log.warn(
            'System keychain not available. Refresh token will be stored in plaintext at ~/.blimu/credentials.json'
          );
        }

        // Create OAuth2 client
        const oauthClient = new OAuth2Client(runtimeApiBaseUrl, clientId, environment);

        // Request device code
        if (verbose) {
          spin.start('Requesting device code...');
        }
        const { deviceCodeResponse, codeVerifier } = await oauthClient.requestDeviceCode();
        if (verbose) {
          spin.stop('Device code received');
        }

        // Display user instructions
        log.info('To complete authentication, please visit:');
        log.info(`  ${deviceCodeResponse.verification_uri_complete}`);
        log.info(`Or enter this code: ${deviceCodeResponse.user_code}`);

        // Store code verifier (for PKCE)
        await setCodeVerifier(environment, codeVerifier);

        // Poll for tokens
        spin.start('Waiting for authorization...');
        const tokenResponse = await oauthClient.pollForTokens(
          deviceCodeResponse.device_code,
          codeVerifier,
          deviceCodeResponse.interval
        );
        spin.stop();

        // Calculate expiry timestamp
        const expiresAt = Math.floor(Date.now() / 1000) + tokenResponse.expires_in;

        // Store credentials (silent)
        writeCredentials({
          access_token: tokenResponse.access_token,
          token_type: tokenResponse.token_type as 'Bearer',
          expires_at: expiresAt,
          environment,
        });

        // Store refresh token (keychain preferred, fallback to file)
        const { usedKeychain } = await setRefreshToken(environment, tokenResponse.refresh_token);

        // Success message
        log.success('Successfully authenticated!');
        if (verbose) {
          if (usedKeychain) {
            log.info('Refresh token stored in system keychain');
          } else {
            log.info('Refresh token stored in credentials file');
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log.error(`Authentication failed: ${formatUserFriendlyError(errorMessage)}`);

        if (verbose && error instanceof Error && error.stack) {
          log.info(error.stack);
        }

        process.exit(1);
      }
    });
}

/**
 * Format error messages to be user-friendly (remove technical details like HTTP codes)
 */
function formatUserFriendlyError(message: string): string {
  // Remove HTTP status code prefixes like "HTTP 502:" or "HTTP 400:"
  const cleanedMessage = message.replace(/^HTTP \d+:\s*/i, '');

  // Map common technical errors to user-friendly messages
  const errorMappings: Record<string, string> = {
    'Invalid request': 'The authorization request was invalid. Please try again.',
    'User denied authorization': 'Authorization was denied.',
    'Device code has expired': 'The login session has expired. Please try again.',
    'Polling timeout exceeded': 'Login timed out. Please try again.',
    'Maximum polling attempts exceeded': 'Login timed out. Please try again.',
  };

  return errorMappings[cleanedMessage] ?? cleanedMessage;
}
