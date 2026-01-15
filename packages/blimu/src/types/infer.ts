/**
 * Type inference utilities for extracting types from Blimu configuration.
 *
 * These utilities work similarly to Zod's `z.infer<>`, extracting union types
 * from the config structure at compile time.
 */

/**
 * Extracts resource type keys from a Blimu config as a union type.
 *
 * @example
 * ```typescript
 * import type config from './blimu.config';
 * type ResourceType = InferResourceTypes<typeof config>;
 * // Result: 'workspace' | 'environment'
 * ```
 */
export type InferResourceTypes<T> = T extends { resources: infer R }
  ? R extends Record<string, any>
    ? keyof R
    : never
  : never;

/**
 * Extracts entitlement type keys from a Blimu config as a union type.
 *
 * @example
 * ```typescript
 * import type config from './blimu.config';
 * type EntitlementType = InferEntitlementTypes<typeof config>;
 * // Result: 'workspace:read' | 'workspace:create'
 * ```
 */
export type InferEntitlementTypes<T> = T extends { entitlements: infer E }
  ? E extends Record<string, any>
    ? keyof E
    : never
  : never;

/**
 * Extracts plan type keys from a Blimu config as a union type.
 *
 * @example
 * ```typescript
 * import type config from './blimu.config';
 * type PlanType = InferPlanTypes<typeof config>;
 * // Result: 'free' | 'pro'
 * ```
 */
export type InferPlanTypes<T> = T extends { plans: infer P }
  ? P extends Record<string, any>
    ? keyof P
    : never
  : never;

/**
 * Extracts all limit type keys from plan resource_limits as a union type.
 *
 * This collects all unique limit type keys from all plans' resource_limits.
 *
 * @example
 * ```typescript
 * import type config from './blimu.config';
 * type LimitType = InferLimitTypes<typeof config>;
 * // Result: 'environments_per_workspace' | 'workspace_count'
 * ```
 */
export type InferLimitTypes<T> = T extends { plans: infer P }
  ? P extends Record<string, any>
    ? P[keyof P] extends { resource_limits?: infer RL }
      ? RL extends Record<string, any>
        ? keyof RL
        : never
      : never
    : never
  : never;

/**
 * Extracts all usage limit type keys from plan usage_based_limits as a union type.
 *
 * This collects all unique usage limit type keys from all plans' usage_based_limits.
 *
 * @example
 * ```typescript
 * import type config from './blimu.config';
 * type UsageLimitType = InferUsageLimitTypes<typeof config>;
 * // Result: 'tokens' | 'api_calls'
 * ```
 */
export type InferUsageLimitTypes<T> = T extends { plans: infer P }
  ? P extends Record<string, any>
    ? P[keyof P] extends { usage_based_limits?: infer UL }
      ? UL extends Record<string, any>
        ? keyof UL
        : never
      : never
    : never
  : never;
