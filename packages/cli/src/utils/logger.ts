import * as clack from '@clack/prompts';
import chalk from 'chalk';

/**
 * Colored logger that wraps @clack/prompts with chalk styling.
 * Use this instead of clack.log for consistent colored output across commands.
 */
export const log = {
  /** Neutral / informational message (dim) */
  info: (message: string): void => {
    clack.log.info(message);
  },

  /** Step or action in progress (cyan) */
  step: (message: string): void => {
    clack.log.step(chalk.cyan(message));
  },

  /** Success message (green) */
  success: (message: string): void => {
    clack.log.success(chalk.green(message));
  },

  /** Warning message (yellow) */
  warn: (message: string): void => {
    clack.log.warn(chalk.yellow(message));
  },

  /** Error message (red) */
  error: (message: string): void => {
    clack.log.error(chalk.red(message));
  },
};
