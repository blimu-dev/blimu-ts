/**
 * Utilities for detecting interactive terminal environments
 */

/**
 * Check if running in a CI environment
 */
export function isCI(): boolean {
  return process.env['CI'] === 'true' || process.env['CI'] === '1';
}

/**
 * Check if running in an interactive terminal (TTY)
 */
export function isInteractive(): boolean {
  // Not interactive if in CI
  if (isCI()) {
    return false;
  }

  // Not interactive if stdout is not a TTY
  if (!process.stdout.isTTY) {
    return false;
  }

  // Check TERM variable
  const term = process.env['TERM'];
  if (!term || term === 'dumb') {
    return false;
  }

  return true;
}

/**
 * Check if we should prompt for user input
 * (only in interactive, non-CI environments)
 */
export function shouldPrompt(): boolean {
  return isInteractive();
}
