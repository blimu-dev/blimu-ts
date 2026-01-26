import type { Command } from 'commander';
import * as clack from '@clack/prompts';
import { readCredentials } from '../auth/credentials';

/**
 * Decode JWT payload (simple base64 decode, no verification)
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    if (!payload) {
      return null;
    }
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Format timestamp as readable date
 */
function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

/**
 * Register the whoami command
 */
export function whoamiCommand(program: Command): void {
  program
    .command('whoami')
    .description('Display current authentication information')
    .action(() => {
      try {
        // Read credentials
        const creds = readCredentials();

        // Decode JWT to get user info
        const payload = decodeJwtPayload(creds.access_token);

        clack.log.info('Current authentication:');
        clack.log.info('');

        if (payload) {
          if (payload['sub']) {
            const sub = payload['sub'] as string;
            clack.log.info(`  User ID: ${sub}`);
          }
          if (payload['email']) {
            const email = payload['email'] as string;
            clack.log.info(`  Email: ${email}`);
          }
          if (payload['name']) {
            const name = payload['name'] as string;
            clack.log.info(`  Name: ${name}`);
          }
        }

        clack.log.info(`  Environment: ${creds.environment ?? 'unknown'}`);
        clack.log.info(`  Token expires: ${formatDate(creds.expires_at)}`);

        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = creds.expires_at - now;
        if (timeUntilExpiry > 0) {
          const minutes = Math.floor(timeUntilExpiry / 60);
          clack.log.info(`  Time until expiry: ${minutes} minutes`);
        } else {
          clack.log.warn('  Token has expired');
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('No credentials found')) {
          clack.log.error('Not authenticated. Please run `blimu login` first.');
        } else {
          clack.log.error(
            `Failed to get user info: ${error instanceof Error ? error.message : String(error)}`
          );
        }
        process.exit(1);
      }
    });
}
