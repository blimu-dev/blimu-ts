/**
 * @blimu/types - TypeScript type definitions for Blimu simple types
 *
 * These types are base definitions that are augmented by customer configuration
 * via the `blimu codegen` command. The augmentation adds union types based on
 * the customer's resource, entitlement, plan, and limit definitions.
 *
 * @example
 * ```typescript
 * import type { ResourceType } from '@blimu/types';
 *
 * // After running `blimu codegen`, ResourceType will be:
 * // type ResourceType = 'organization' | 'workspace' | 'project';
 * ```
 */

/**
 * Resource type identifier
 *
 * This type is augmented by `blimu codegen` to include all resource types
 * defined in your Blimu configuration.
 */
export type ResourceType = string;

/**
 * Entitlement type identifier
 *
 * This type is augmented by `blimu codegen` to include all entitlement types
 * defined in your Blimu configuration.
 */
export type EntitlementType = string;

/**
 * Plan type identifier
 *
 * This type is augmented by `blimu codegen` to include all plan types
 * defined in your Blimu configuration.
 */
export type PlanType = string;

/**
 * Limit type identifier (resource-based limits)
 *
 * This type is augmented by `blimu codegen` to include all resource limit types
 * defined in your Blimu configuration plans.
 */
export type LimitType = string;

/**
 * Usage-based limit type identifier
 *
 * This type is augmented by `blimu codegen` to include all usage-based limit types
 * defined in your Blimu configuration plans.
 */
export type UsageLimitType = string;
