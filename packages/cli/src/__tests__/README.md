# CLI Integration Tests

This directory contains integration tests for the Blimu CLI using MSW (Mock Service Worker) to mock HTTP requests.

## Setup

The test setup uses:

- **MSW (Mock Service Worker)**: For mocking HTTP requests to the Platform API and Runtime API
- **Vitest**: Test runner with Node.js environment
- **Test Utilities**: Helpers for mocking credentials, config files, and file system operations

## Structure

```
__tests__/
├── setup.ts              # MSW server setup and lifecycle hooks
├── handlers.ts           # MSW request handlers for API endpoints
├── test-utils.ts         # Utility functions for test setup/teardown
└── integration/          # Integration tests for CLI commands
    └── push.integration.test.ts
```

## Running Tests

```bash
# Run all tests
yarn test

# Run in watch mode
yarn test:watch

# Run only integration tests
yarn test integration
```

## Adding New Tests

### 1. Create MSW Handlers

Add new handlers to `handlers.ts` for any API endpoints your command uses:

```typescript
http.get(
  `${PLATFORM_API_BASE}/v1/workspace/:workspaceId/environments`,
  async ({ params, request }) => {
    // Validate auth
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return mock response
    return HttpResponse.json([...], { status: 200 });
  }
);
```

### 2. Use Test Utilities

Use utilities from `test-utils.ts` to set up test environment:

```typescript
import {
  createTempDir,
  cleanupTempDir,
  createMockCredentials,
  createMockConfig,
  mockProcessExit,
} from '../test-utils';
```

### 3. Write Integration Test

Example test structure:

```typescript
describe('my-command integration', () => {
  let tempDir: string;
  let mockExit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    tempDir = createTempDir();
    const exitMock = mockProcessExit();
    mockExit = exitMock.mockExit;
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
    vi.restoreAllMocks();
  });

  it('should do something', async () => {
    // Setup
    createMockCredentials(tempDir);
    const configPath = createMockConfig(tempDir, { ... });

    // Execute
    const program = new Command();
    myCommand(program);
    await program.parseAsync(['node', 'my-command', '--option', 'value']);

    // Verify
    expect(mockExit).not.toHaveBeenCalled();
  });
});
```

## Mocked Endpoints

The following endpoints are currently mocked:

### Platform API

- `PUT /v1/workspace/:workspaceId/environments/:environmentId/definitions` - Update definitions
- `GET /v1/workspace/:workspaceId/environments/:environmentId/definitions` - Get definitions
- `POST /v1/workspace/:workspaceId/environments/:environmentId/definitions/validate` - Validate definitions

### Runtime API

- `POST /oauth/token` - OAuth token exchange (authorization_code, refresh_token)
- `POST /oauth/device` - Device flow initiation
- `GET /v1/me` - Get current user info

## Test Utilities

### File System

- `createTempDir()` - Create temporary directory for test files
- `cleanupTempDir(dir)` - Clean up temporary directory
- `createMockCredentials(tempDir, overrides?)` - Create mock credentials file
- `createMockConfig(tempDir, config)` - Create mock Blimu config file
- `createMockRcConfig(tempDir, rcConfig)` - Create mock .blimurc.json file

### Process/Environment

- `mockProcessExit()` - Mock `process.exit()` to prevent tests from exiting
- `mockEnv(env)` - Mock environment variables

### Prompts

- `mockClackPrompts()` - Mock @clack/prompts to avoid interactive prompts

## Notes

- All HTTP requests are automatically intercepted by MSW
- Tests run in isolated temporary directories
- Credentials and config files are mocked to avoid touching real files
- `process.exit()` is mocked to allow testing error scenarios
