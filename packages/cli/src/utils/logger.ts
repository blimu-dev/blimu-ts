import chalk from 'chalk';

/**
 * Colored logger for consistent output across commands
 */
export const log = {
  /** Neutral / informational message (dim) */
  info: (message: string): void => {
    console.log(chalk.dim(message));
  },

  /** Step or action in progress (cyan) */
  step: (message: string): void => {
    console.log(chalk.cyan(message));
  },

  /** Success message (green) */
  success: (message: string): void => {
    console.log(chalk.green('✔'), message);
  },

  /** Warning message (yellow) */
  warn: (message: string): void => {
    console.log(chalk.yellow('⚠'), message);
  },

  /** Error message (red) */
  error: (message: string): void => {
    console.error(chalk.red('✖'), message);
  },
};
