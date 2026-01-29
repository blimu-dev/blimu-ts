import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Command } from 'commander';
import { http, HttpResponse } from 'msw';
import { server } from '../setup';
import { pushCommand } from '../../commands/push';
import {
  createTempDir,
  cleanupTempDir,
  createMockCredentials,
  createMockConfig,
  mockProcessExit,
  mockClackPrompts,
} from '../test-utils';
import * as configLoader from '../../utils/config-loader';
import * as rcConfig from '../../config/rc-config';
import * as clientIds from '../../config/client-ids';
import * as credentials from '../../auth/credentials';
import type { CredentialsWithRefreshToken } from '../../auth/credentials';

describe('push command integration', () => {
  let tempDir: string;
  let mockExit: ReturnType<typeof vi.fn>;
  let restoreExit: () => void;

  beforeEach(() => {
    // Create temporary directory
    tempDir = createTempDir();

    // Mock process.exit
    const exitMock = mockProcessExit();
    mockExit = exitMock.mockExit;
    restoreExit = exitMock.restore;

    // Mock clack prompts
    mockClackPrompts();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
    restoreExit();
    vi.restoreAllMocks();
  });

  it('should successfully push definitions with valid config', async () => {
    // Setup: Create mock credentials and config
    createMockCredentials(tempDir);
    const configPath = createMockConfig(tempDir, {
      resources: {
        workspace: {
          roles: ['admin', 'editor', 'viewer'],
          is_tenant: true,
        },
      },
    });

    const mockConfig = {
      resources: {
        workspace: {
          roles: ['admin', 'editor', 'viewer'],
          is_tenant: true,
        },
      },
    };

    // Mock config loader
    vi.spyOn(configLoader, 'findDefaultConfig').mockReturnValue(null);
    vi.spyOn(configLoader, 'loadConfig').mockResolvedValue(mockConfig);

    // Mock RC config
    vi.spyOn(rcConfig, 'loadRcConfig').mockReturnValue(null);
    vi.spyOn(rcConfig, 'getPlatformApiBaseUrl').mockReturnValue('https://platform.blimu.dev');

    // Setup: Mock hasCredentials to return true (but we're using bearer token, so this shouldn't matter)
    vi.spyOn(credentials, 'hasCredentials').mockReturnValue(false);

    // Create command
    const program = new Command();
    program.name('blimu');
    program.exitOverride(); // Prevent Commander from calling process.exit
    pushCommand(program);

    // Execute command
    try {
      await program.parseAsync([
        'node',
        'blimu',
        'push',
        '--workspace-id',
        'ws-123',
        '--environment-id',
        'env-456',
        '--config',
        configPath,
        '--platform-api-url',
        'https://platform.blimu.dev',
        '--bearer',
        'test-bearer-token',
      ]);
    } catch {
      // Commander throws on exit, which is expected - we'll check mockExit instead
    }

    // Verify: Should not exit with error
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('should fail when workspace-id is missing', async () => {
    const program = new Command();
    program.name('blimu');
    // Don't use exitOverride here - we want to test that process.exit is called
    pushCommand(program);

    await program.parseAsync(['node', 'blimu', 'push', '--environment-id', 'env-456']);

    // Should exit with code 1 (called from within the action)
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should fail when environment-id is missing', async () => {
    const program = new Command();
    program.name('blimu');
    // Don't use exitOverride here - we want to test that process.exit is called
    pushCommand(program);

    await program.parseAsync(['node', 'blimu', 'push', '--workspace-id', 'ws-123']);

    // Should exit with code 1 (called from within the action)
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should fail when config file is missing', async () => {
    createMockCredentials(tempDir);
    vi.spyOn(credentials, 'hasCredentials').mockReturnValue(true);
    vi.spyOn(configLoader, 'findDefaultConfig').mockReturnValue(null);
    vi.spyOn(configLoader, 'loadConfig').mockRejectedValue(
      new Error('Config file not found: /nonexistent/config.ts')
    );

    const program = new Command();
    program.name('blimu');
    // Don't use exitOverride here - we want to test that process.exit is called
    pushCommand(program);

    await program.parseAsync([
      'node',
      'blimu',
      'push',
      '--workspace-id',
      'ws-123',
      '--environment-id',
      'env-456',
      '--config',
      '/nonexistent/config.ts',
      '--bearer',
      'test-token',
    ]);

    // Should exit with code 1 (called from within the action)
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should use OAuth token when no explicit auth provided and token is expired', async () => {
    // Track HTTP calls
    let tokenRefreshCalled = false;
    let definitionsUpdateCalled = false;
    let definitionsUpdateAuthHeader: string | null = null;

    // Override MSW handlers to track calls - use server.use to add handlers that run before defaults
    // Use pattern matching to catch any runtime API URL (in case of different environments)
    server.use(
      // Track OAuth token refresh call - use pattern to match any runtime API URL
      http.post('https://runtime.blimu.dev/v1/oauth/token', async ({ request }) => {
        tokenRefreshCalled = true; // Track that this endpoint was called
        const body = (await request.json()) as {
          grant_type: string;
          refresh_token?: string;
          client_id?: string;
        };
        const grantType = body.grant_type;
        if (grantType === 'refresh_token') {
          const refreshToken = body.refresh_token;
          if (!refreshToken || refreshToken !== 'valid-refresh-token') {
            return HttpResponse.json(
              { error: 'invalid_grant', error_description: 'Invalid refresh token' },
              { status: 400 }
            );
          }
          // Return new access token
          return HttpResponse.json(
            {
              access_token: 'refreshed-access-token',
              token_type: 'Bearer',
              expires_in: 3600,
              refresh_token: 'new-refresh-token',
            },
            { status: 200 }
          );
        }
        return HttpResponse.json({ error: 'unsupported_grant_type' }, { status: 400 });
      }),
      // Track definitions update call - use exact URL matching
      http.put(
        'https://platform.blimu.dev/v1/workspace/:workspaceId/environments/:environmentId/definitions',
        async ({ request, params }) => {
          definitionsUpdateCalled = true;
          definitionsUpdateAuthHeader = request.headers.get('authorization');
          return HttpResponse.json(
            {
              workspaceId: params['workspaceId'],
              environmentId: params['environmentId'],
              definitions: await request.json(),
              updatedAt: new Date().toISOString(),
            },
            { status: 200 }
          );
        }
      )
    );

    // Setup: Create credentials with refresh token (matching MSW expectations)
    // The refresh token needs to be in the credentials file with _keychain_unavailable: true
    // Token is expired (1000 seconds ago) to trigger refresh
    const credentialsWithRefresh: CredentialsWithRefreshToken = {
      access_token: 'existing-token',
      token_type: 'Bearer',
      expires_at: Math.floor(Date.now() / 1000) - 1000, // Expired token to trigger refresh
      environment: 'cloud-prod',
      refresh_token: 'valid-refresh-token', // Must match MSW handler expectation
      _keychain_unavailable: true,
    };

    // Mock credentials functions to return our test credentials
    // This allows the real token refresh code to run and make HTTP calls
    vi.spyOn(credentials, 'hasCredentials').mockReturnValue(true);
    vi.spyOn(credentials, 'readCredentials').mockReturnValue(credentialsWithRefresh);

    // Mock getRefreshToken to return the refresh token from our credentials
    // This is called by refreshAccessToken to get the refresh token
    vi.spyOn(credentials, 'getRefreshToken').mockResolvedValue('valid-refresh-token');

    // Mock writeCredentials to avoid file system issues during token refresh
    vi.spyOn(credentials, 'writeCredentials').mockImplementation(() => {
      // Mock implementation - no-op
    });
    vi.spyOn(credentials, 'setRefreshToken').mockResolvedValue({ usedKeychain: false });

    const configPath = createMockConfig(tempDir, {
      resources: {
        workspace: {
          roles: ['admin'],
        },
      },
    });

    const mockConfig = {
      resources: {
        workspace: {
          roles: ['admin'],
        },
      },
    };

    // Mock config loader
    vi.spyOn(configLoader, 'findDefaultConfig').mockReturnValue(null);
    vi.spyOn(configLoader, 'loadConfig').mockResolvedValue(mockConfig);

    // Mock RC config and client IDs (needed for token refresh)
    vi.spyOn(rcConfig, 'loadRcConfig').mockReturnValue({
      blimuInternalEnvironment: 'cloud-prod' as const,
    });
    vi.spyOn(rcConfig, 'getRuntimeApiBaseUrl').mockReturnValue('https://runtime.blimu.dev');
    vi.spyOn(rcConfig, 'getPlatformApiBaseUrl').mockReturnValue('https://platform.blimu.dev');
    vi.spyOn(clientIds, 'getClientId').mockReturnValue('test-client-id');

    const program = new Command();
    program.name('blimu');
    program.exitOverride(); // Prevent Commander from calling process.exit
    pushCommand(program);

    // Execute command
    let commandError: Error | null = null;
    try {
      await program.parseAsync([
        'node',
        'blimu',
        'push',
        '--workspace-id',
        'ws-123',
        '--environment-id',
        'env-456',
        '--config',
        configPath,
        '--platform-api-url',
        'https://platform.blimu.dev',
      ]);
    } catch (error) {
      commandError = error instanceof Error ? error : new Error(String(error));
      // Commander throws on exit, which is expected - we'll check the HTTP calls
    }

    // Debug: Log error if command failed
    if (commandError && (!tokenRefreshCalled || !definitionsUpdateCalled)) {
      console.log('Command error:', commandError.message);
      console.log('Mock exit calls:', mockExit.mock.calls);
    }

    // Verify: OAuth token refresh endpoint was called (token was expired)
    expect(tokenRefreshCalled).toBe(true);

    // Verify: Definitions update endpoint was called
    expect(definitionsUpdateCalled).toBe(true);

    // Verify: Definitions update was called with Bearer token from refresh
    expect(definitionsUpdateAuthHeader).toBe('Bearer refreshed-access-token');
  });

  it('should use OAuth token when no explicit auth provided and token is still valid', async () => {
    // Track HTTP calls
    let tokenRefreshCalled = false;
    let definitionsUpdateCalled = false;
    let definitionsUpdateAuthHeader: string | null = null;

    // Override MSW handlers to track calls
    server.use(
      // Track OAuth token refresh call - should NOT be called for valid token
      http.post('https://runtime.blimu.dev/v1/oauth/token', () => {
        tokenRefreshCalled = true; // This should remain false
        return HttpResponse.json({ error: 'should not be called' }, { status: 500 });
      }),
      // Track definitions update call
      http.put(
        'https://platform.blimu.dev/v1/workspace/:workspaceId/environments/:environmentId/definitions',
        async ({ request, params }) => {
          definitionsUpdateCalled = true;
          definitionsUpdateAuthHeader = request.headers.get('authorization');
          return HttpResponse.json(
            {
              workspaceId: params['workspaceId'],
              environmentId: params['environmentId'],
              definitions: await request.json(),
              updatedAt: new Date().toISOString(),
            },
            { status: 200 }
          );
        }
      )
    );

    // Setup: Create credentials with valid (non-expired) token
    // Token expires in 2 hours (7200 seconds) - well beyond the 60-second buffer
    const credentialsWithRefresh: CredentialsWithRefreshToken = {
      access_token: 'valid-existing-token',
      token_type: 'Bearer',
      expires_at: Math.floor(Date.now() / 1000) + 7200, // Valid token (2 hours from now)
      environment: 'cloud-prod',
      refresh_token: 'valid-refresh-token',
      _keychain_unavailable: true,
    };

    // Mock credentials functions
    vi.spyOn(credentials, 'hasCredentials').mockReturnValue(true);
    vi.spyOn(credentials, 'readCredentials').mockReturnValue(credentialsWithRefresh);

    const configPath = createMockConfig(tempDir, {
      resources: {
        workspace: {
          roles: ['admin'],
        },
      },
    });

    const mockConfig = {
      resources: {
        workspace: {
          roles: ['admin'],
        },
      },
    };

    // Mock config loader
    vi.spyOn(configLoader, 'findDefaultConfig').mockReturnValue(null);
    vi.spyOn(configLoader, 'loadConfig').mockResolvedValue(mockConfig);

    // Mock RC config and client IDs (needed even for valid tokens, as getValidAccessToken may check them)
    vi.spyOn(rcConfig, 'loadRcConfig').mockReturnValue({
      blimuInternalEnvironment: 'cloud-prod' as const,
    });
    vi.spyOn(rcConfig, 'getRuntimeApiBaseUrl').mockReturnValue('https://runtime.blimu.dev');
    vi.spyOn(rcConfig, 'getPlatformApiBaseUrl').mockReturnValue('https://platform.blimu.dev');
    vi.spyOn(clientIds, 'getClientId').mockReturnValue('test-client-id');

    const program = new Command();
    program.name('blimu');
    program.exitOverride(); // Prevent Commander from calling process.exit
    pushCommand(program);

    // Execute command
    let commandError: Error | null = null;
    try {
      await program.parseAsync([
        'node',
        'blimu',
        'push',
        '--workspace-id',
        'ws-123',
        '--environment-id',
        'env-456',
        '--config',
        configPath,
        '--platform-api-url',
        'https://platform.blimu.dev',
      ]);
    } catch (error) {
      commandError = error instanceof Error ? error : new Error(String(error));
      // Commander might throw, but we check the HTTP calls
    }

    // Debug: Log error if command failed
    if (commandError && !definitionsUpdateCalled) {
      console.log('Command error:', commandError.message);
      console.log('Mock exit calls:', mockExit.mock.calls);
    }

    // Verify: OAuth token refresh endpoint was NOT called (token is still valid)
    expect(tokenRefreshCalled).toBe(false);

    // Verify: Definitions update endpoint was called
    expect(definitionsUpdateCalled).toBe(true);

    // Verify: Definitions update was called with the existing valid token (not refreshed)
    expect(definitionsUpdateAuthHeader).toBe('Bearer valid-existing-token');
  });
});
