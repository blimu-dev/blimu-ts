import type { Command } from 'commander';
import * as clack from '@clack/prompts';
import { deleteCredentials, deleteRefreshToken, readCredentials } from '../auth/credentials';
import { log } from '../utils/logger';
import type { BlimuInternalEnvironment } from '../config/client-ids';

/**
 * Register the logout command
 */
export function logoutCommand(program: Command): void {
  program
    .command('logout')
    .description('Log out and remove stored credentials')
    .action(async () => {
      const spinner = clack.spinner();

      try {
        // Check if credentials exist
        let environment: BlimuInternalEnvironment | undefined;
        try {
          const creds = readCredentials();
          environment = creds.environment;
        } catch {
          // No credentials found, nothing to do
          log.info('No credentials found. Already logged out.');
          return;
        }

        spinner.start('Removing credentials...');

        // Delete refresh token from keychain
        if (environment) {
          await deleteRefreshToken(environment);
        }

        // Delete credentials file
        deleteCredentials();

        spinner.stop('✓ Credentials removed');

        log.success('Successfully logged out!');
      } catch (error) {
        spinner.stop('❌ Logout failed');
        log.error(`Failed to logout: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      }
    });
}
