import type { Command } from 'commander';
import open from 'open';
import { log } from '../utils/logger';
import { OAuth2Client } from '../auth/oauth-client';
import {
  writeCredentials,
  setRefreshToken,
  setCodeVerifier,
  isKeychainAvailable,
} from '../auth/credentials';
import { setDefaultWorkspaceId } from '../auth/preferences';
import { getClientId, type BlimuInternalEnvironment } from '../config/client-ids';
import { loadRcConfig, getEnvironment, getRuntimeApiBaseUrl } from '../config/rc-config';
import { createTaskRunner } from '../ui/task-runner.js';
import { promptSelect, type SelectOption } from '../ui/prompts.js';
import { createPlatformApiClient } from '../utils/api-client';

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
      const verbose = options.verbose;

      try {
        const runner = await createTaskRunner();

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
          runner.info(`Runtime API: ${runtimeApiBaseUrl}`);
        }

        // Get client ID
        const clientId = getClientId(environment);

        // Format environment name for display
        const envDisplay =
          environment === 'cloud-prod' ? 'Blimu platform' : `${environment} environment`;

        const authGroup = runner.group(`Authenticating to ${envDisplay}`);

        // Check keychain availability
        const keychainAvailable = await isKeychainAvailable();
        if (!keychainAvailable) {
          authGroup.warn(
            'System keychain not available. Refresh token will be stored in plaintext at ~/.config/blimu/credentials.json'
          );
        }

        // Create OAuth2 client
        const oauthClient = new OAuth2Client(runtimeApiBaseUrl, clientId, environment);

        // Request device code
        const { deviceCodeResponse, codeVerifier } = await oauthClient.requestDeviceCode();

        // Display user instructions (clearable - will be removed on success)
        authGroup.info("Browser didn't open? Use the url below to sign in (c to copy)", {
          clearable: true,
        });
        authGroup.copyableText(deviceCodeResponse.verification_uri_complete, {
          clearable: true,
          dimmed: true,
        });

        // Open the URL in the default browser
        try {
          await open(deviceCodeResponse.verification_uri_complete);
        } catch {
          // Ignore errors (e.g. headless/CI); user can still copy the URL above
        }

        // Store code verifier (for PKCE)
        await setCodeVerifier(environment, codeVerifier);

        // Poll for tokens
        const tokenResponse = await oauthClient.pollForTokens(
          deviceCodeResponse.device_code,
          codeVerifier,
          deviceCodeResponse.interval
        );

        // Calculate expiry timestamp
        const expiresAt = Math.floor(Date.now() / 1000) + tokenResponse.expires_in;

        // Store credentials
        writeCredentials({
          access_token: tokenResponse.access_token,
          token_type: tokenResponse.token_type as 'Bearer',
          expires_at: expiresAt,
          environment,
        });

        // Store refresh token (keychain preferred, fallback to file)
        const { usedKeychain } = await setRefreshToken(environment, tokenResponse.refresh_token);

        // Success message (this will clear all clearable items first)
        authGroup.success('Login successful');

        if (verbose) {
          if (usedKeychain) {
            runner.info('Refresh token stored in system keychain');
          } else {
            runner.info('Refresh token stored in credentials file');
          }
        }

        // Close the Ink UI by waiting for it to finish
        // We need to do this WITHOUT calling wait() as it seems to break HTTP requests
        // Get the render instance and manually cleanup
        const inkRunner = runner as {
          renderInstance?: { cleanup(): void };
          isRendering?: boolean;
        };
        if (inkRunner.renderInstance) {
          inkRunner.renderInstance.cleanup();
          inkRunner.isRendering = false;
        }

        // Small delay to let Ink fully cleanup
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Fetch workspaces and prompt for default selection if multiple exist (use exec-env for platform URL)
        await promptForDefaultWorkspace(environment);
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
 * Prompt user to select a default workspace if they have multiple workspaces.
 * Uses the given exec-env so platform URL matches the environment the user logged into.
 */
async function promptForDefaultWorkspace(execEnv: BlimuInternalEnvironment): Promise<void> {
  try {
    log.info('Fetching workspaces...');

    // Create API client using stored credentials; platform URL is resolved from exec-env
    const client = await createPlatformApiClient({
      requireAuth: true,
      environment: execEnv,
    });

    // Fetch workspaces
    const { data: workspaces } = await client.workspaces.list();

    log.info(`Found ${workspaces.length} workspace(s)`);

    // If only one workspace, set it as default automatically
    if (workspaces.length === 1) {
      const workspace = workspaces[0];
      if (workspace) {
        setDefaultWorkspaceId(workspace.id);
        log.info(`Default workspace set to: ${workspace.name}`);
      }
      return;
    }

    // If no workspaces, skip
    if (workspaces.length === 0) {
      return;
    }

    // Multiple workspaces - prompt for selection
    const options: SelectOption[] = workspaces.map((ws) => ({
      label: ws.name,
      value: ws.id,
      description: `ID: ${ws.id}`,
    }));

    const selected = await promptSelect({
      title: 'Select a default workspace:',
      choices: options,
    });

    if (selected) {
      setDefaultWorkspaceId(selected);
      const selectedWorkspace = workspaces.find((ws) => ws.id === selected);
      log.success(`Default workspace set to: ${selectedWorkspace?.name}`);
    }
  } catch (error) {
    // Silently fail workspace selection - not critical for login
    log.warn('Could not fetch workspaces for default selection');
    if (error instanceof Error) {
      const err = error as Error & {
        status?: number;
        data?: { message?: string; response?: { message?: string } };
      };
      const apiMessage = err.data?.message ?? err.data?.response?.message ?? err.message;
      log.info(`Reason: ${apiMessage}`);
      if (err.status === 401 && apiMessage?.includes('Invalid or expired')) {
        log.info(
          'Tip: For local-dev, ensure platform-api has BLIMU_API_URL=https://runtime-api.dev-blimu.dev and BLIMU_CLI_OAUTH_CLIENT_ID set to the CLI OAuth app client_id.'
        );
      }
      if (process.env['DEBUG']) {
        console.error('Full error details:', error);
        if (err.status !== undefined) console.error('HTTP Status:', err.status);
        if (err.data !== undefined) console.error('Response data:', err.data);
      }
    }
  }
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
