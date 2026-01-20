import type { EntitlementType } from '@blimu/types';
/**
 * Configuration interface for Blimu NestJS integration
 */
export interface BlimuConfig<TRequest = unknown> {
  global?: boolean | undefined;
  /**
   * The API secret key for authenticating with Blimu Runtime API
   */
  apiKey: string;

  /**
   * The base URL for the Blimu Runtime API
   * @default 'https://api.blimu.dev'
   */
  baseURL?: string | undefined;

  /**
   * Environment ID for the Blimu environment
   * This will be used in future versions for environment-specific configurations
   */
  environmentId?: string | undefined;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeoutMs?: number | undefined;

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

  /**
   * Optional default entitlement context resolver for entitlement checks
   *
   * This function is used as a fallback when a decorator-specific resolver is not provided.
   * It receives an object with the entitlement key and parsed resource type, along with the request,
   * allowing for context-aware resolution.
   *
   * @param context - Object containing the entitlement and resource type (parsed from entitlement by splitting on ':')
   * @param request - The incoming HTTP request
   * @returns Entitlement context with resourceId and optionally amount, or a Promise that resolves to it
   *
   * @example
   * ```typescript
   * // Extract resourceId from path parameter
   * defaultEntitlementCtxResolver: ({ entitlement, resourceType }, req) => ({
   *   resourceId: req.params.resourceId,
   * })
   *
   * // Context-aware resolution based on resource type
   * defaultEntitlementCtxResolver: ({ resourceType }, req) => {
   *   if (resourceType === 'organization') {
   *     return { resourceId: req.params.orgId };
   *   }
   *   return { resourceId: req.params.resourceId };
   * }
   *
   * // Extract from request body or query with amount for consumption
   * defaultEntitlementCtxResolver: ({ entitlement, resourceType }, req) => ({
   *   resourceId: req.body?.resourceId || req.query?.resourceId,
   *   amount: req.body?.amount, // Amount to consume for usage-based entitlements
   * })
   * ```
   */
  defaultEntitlementCtxResolver?: (
    context: { entitlement: EntitlementType; resourceType: string },
    request: TRequest,
  ) => { resourceId: string; amount?: number } | Promise<{ resourceId: string; amount?: number }> | undefined;
}

/**
 * Injection token for Blimu configuration
 */
export const BLIMU_CONFIG = Symbol('BLIMU_CONFIG');
