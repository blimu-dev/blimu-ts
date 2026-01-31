import { vi } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { tmpdir } from 'os';
import type { BlimuInternalEnvironment } from '../config/client-ids';
import type { Credentials } from '../auth/credentials';

/**
 * Test utilities for CLI integration tests
 */

/**
 * Create a temporary directory for test files
 */
export function createTempDir(): string {
  const tempDir = path.join(
    tmpdir(),
    `blimu-cli-test-${Date.now()}-${Math.random().toString(36).substring(7)}`
  );
  fs.mkdirSync(tempDir, { recursive: true });
  return tempDir;
}

/**
 * Clean up temporary directory
 */
export function cleanupTempDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Mock credentials file
 */
export function createMockCredentials(tempDir: string, overrides?: Partial<Credentials>): string {
  const credentialsPath = path.join(tempDir, '.blimu', 'credentials.json');
  const credentialsDir = path.dirname(credentialsPath);

  fs.mkdirSync(credentialsDir, { recursive: true });

  const credentials: Credentials = {
    access_token: 'mock-access-token',
    token_type: 'Bearer',
    expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    environment: 'cloud-prod' as BlimuInternalEnvironment,
    ...overrides,
  };

  fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2), 'utf-8');
  fs.chmodSync(credentialsPath, 0o600);

  return credentialsPath;
}

/**
 * Mock Blimu config file (creates JSON file for easier testing)
 */
export function createMockConfig(tempDir: string, config: unknown): string {
  const configPath = path.join(tempDir, 'blimu.config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  return configPath;
}

/**
 * Mock .blimurc file
 */
export function createMockRcConfig(tempDir: string, rcConfig: unknown): string {
  const rcPath = path.join(tempDir, '.blimurc.json');
  fs.writeFileSync(rcPath, JSON.stringify(rcConfig, null, 2), 'utf-8');
  return rcPath;
}

/**
 * Mock environment variables
 */
export function mockEnv(env: Record<string, string | undefined>): () => void {
  const originalEnv = { ...process.env };
  Object.assign(process.env, env);

  return () => {
    process.env = originalEnv;
  };
}

/**
 * Mock process.exit to prevent tests from actually exiting
 */
export function mockProcessExit(): { mockExit: ReturnType<typeof vi.fn>; restore: () => void } {
  const originalExit = process.exit.bind(process);
  const mockExit = vi.fn() as unknown as typeof process.exit;
  process.exit = mockExit;

  return {
    mockExit: mockExit as unknown as ReturnType<typeof vi.fn>,
    restore: () => {
      process.exit = originalExit;
    },
  };
}

/**
 * Wait for async operations to complete
 */
export function waitFor(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
