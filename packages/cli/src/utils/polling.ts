/**
 * Polling utility for device code flow
 * Handles exponential backoff and OAuth2 error responses
 */

export interface PollOptions {
  /**
   * Initial polling interval in seconds
   */
  initialInterval?: number;
  /**
   * Maximum polling interval in seconds
   */
  maxInterval?: number;
  /**
   * Maximum number of polling attempts
   */
  maxAttempts?: number;
  /**
   * Timeout in milliseconds
   */
  timeout?: number;
}

export interface PollError {
  error: string;
  error_description?: string;
}

/**
 * Poll a function until it returns a non-error result or times out
 * Implements exponential backoff for authorization_pending and slow_down errors
 */
export async function poll<T>(
  fn: () => Promise<{ success: true; data: T } | { success: false; error: PollError }>,
  options: PollOptions = {}
): Promise<T> {
  const {
    initialInterval = 5,
    maxInterval = 60,
    maxAttempts = 120, // 10 minutes at 5s intervals
    timeout = 600000, // 10 minutes
  } = options;

  const startTime = Date.now();
  let currentInterval = initialInterval;
  let attempts = 0;

  while (attempts < maxAttempts) {
    // Check timeout
    if (Date.now() - startTime > timeout) {
      throw new Error('Login timed out');
    }

    // Wait before polling (except first attempt)
    if (attempts > 0) {
      await sleep(currentInterval * 1000);
    }

    attempts++;

    try {
      const result = await fn();

      if (result.success) {
        return result.data;
      }

      const error = result.error;

      // Handle OAuth2 error responses
      if (error.error === 'authorization_pending') {
        // Continue polling with current interval
        continue;
      }

      if (error.error === 'slow_down') {
        // Increase interval by 5 seconds (RFC 8628)
        currentInterval = Math.min(currentInterval + 5, maxInterval);
        continue;
      }

      if (error.error === 'access_denied') {
        throw new Error('Authorization was denied');
      }

      if (error.error === 'expired_token') {
        throw new Error('Login session has expired');
      }

      // Other errors should be thrown with user-friendly message
      throw new Error(error.error_description ?? error.error ?? 'Authorization failed');
    } catch (error) {
      // If it's already an Error, rethrow
      if (error instanceof Error) {
        throw error;
      }
      // Otherwise, wrap it
      throw new Error(`Polling error: ${String(error)}`);
    }
  }

  throw new Error('Login timed out');
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
