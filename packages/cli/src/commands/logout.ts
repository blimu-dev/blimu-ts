import type { Command } from 'commander';
import { deleteCredentials, deleteRefreshToken, readCredentials } from '../auth/credentials';
import { log } from '../utils/logger';
import type { BlimuInternalEnvironment } from '../config/client-ids';
import { createTaskRunner } from '../ui/task-runner.js';

/**
 * Register the logout command
 */
export function logoutCommand(program: Command): void {
  program
    .command('logout')
    .description('Log out and remove stored credentials')
    .action(async () => {
      try {
        const runner = await createTaskRunner();

        // Check if credentials exist
        let environment: BlimuInternalEnvironment | undefined;
        try {
          const creds = readCredentials();
          environment = creds.environment;
        } catch {
          // No credentials found, nothing to do
          runner.info('No credentials found. Already logged out.');
          await runner.wait();
          return;
        }

        const logoutGroup = runner.group('Logging out');

        await logoutGroup.task('Remove credentials', async (task) => {
          // Delete refresh token from keychain
          if (environment) {
            await deleteRefreshToken(environment);
          }

          // Delete credentials file
          deleteCredentials();

          task.succeed('Credentials removed');
        });

        runner.success('Successfully logged out!');
        await runner.wait();
      } catch (error) {
        log.error(`Failed to logout: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      }
    });
}
