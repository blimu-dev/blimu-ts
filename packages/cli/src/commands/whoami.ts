import type { Command } from 'commander';
import { readCredentials } from '../auth/credentials';
import { toText } from '../utils/format';
import { decodeJwtPayload } from '../utils/jwt';
import { log } from '../utils/logger';
import chalk from 'chalk';

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
        const creds = readCredentials();
        const payload = decodeJwtPayload(creds.access_token);

        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = creds.expires_at - now;

        const info: Record<string, unknown> = {
          ...(payload?.['sub'] ? { [`${chalk.cyan('@userid')}`]: payload['sub'] } : {}),
          ...(payload?.['email'] ? { [`${chalk.cyan('@email')}`]: payload['email'] } : {}),
          ...(payload?.['name'] ? { [`${chalk.cyan('@name')}`]: payload['name'] } : {}),
          [`${chalk.cyan('@environment')}`]: creds.environment ?? 'unknown',
          [`${chalk.cyan('@expires')}`]: formatDate(creds.expires_at),
          ...(timeUntilExpiry > 0
            ? { [`${chalk.cyan('@expires_in')}`]: `${Math.floor(timeUntilExpiry / 60)} minutes` }
            : { [`${chalk.red('@expired')}`]: true }),
        };

        log.info('Current authentication:\n\n' + toText(info) + '\n');
      } catch (error) {
        if (error instanceof Error && error.message.includes('No credentials found')) {
          log.error('Not authenticated. Please run `blimu login` first.');
        } else {
          log.error(
            `Failed to get user info: ${error instanceof Error ? error.message : String(error)}`
          );
        }
        process.exit(1);
      }
    });
}
