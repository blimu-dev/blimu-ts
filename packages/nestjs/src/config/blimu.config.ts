/**
 * Configuration interface for Blimu NestJS integration
 */
export interface BlimuConfig<TRequest = any> {
  /**
   * The API secret key for authenticating with Blimu Runtime API
   */
  apiSecretKey: string;

  /**
   * The base URL for the Blimu Runtime API
   * @default 'https://runtime.blimu.com'
   */
  baseURL?: string;

  /**
   * Environment ID for the Blimu environment
   * This will be used in future versions for environment-specific configurations
   */
  environmentId?: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeoutMs?: number;

  /**
   * Function to extract user ID from the request
   *
   * This function is called by the EntitlementGuard to determine which user
   * to check entitlements for. It should return the user ID as a string.
   *
   * @param request - The incoming HTTP request
   * @returns The user ID as a string, or a Promise that resolves to the user ID
   *
   * @example
   * ```typescript
   * // Extract from JWT token in Authorization header
   * getUserId: (req) => {
   *   const token = req.headers.authorization?.replace('Bearer ', '');
   *   const decoded = jwt.verify(token, secret);
   *   return decoded.sub;
   * }
   *
   * // Extract from request.user (common with Passport.js)
   * getUserId: (req) => req.user?.id
   *
   * // Extract from custom header
   * getUserId: (req) => req.headers['x-user-id']
   * ```
   */
  getUserId: (request: TRequest) => string | Promise<string>;
}

/**
 * Injection token for Blimu configuration
 */
export const BLIMU_CONFIG = Symbol('BLIMU_CONFIG');
