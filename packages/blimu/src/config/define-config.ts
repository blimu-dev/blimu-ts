import {
  BlimuConfigSchema,
  type BlimuConfig,
  type ResourceDefinition,
  type EntitlementDefinition,
  type FeatureDefinition,
  type PlanDefinition,
} from './schema';

/**
 * Input type for defineConfig (allows partial config during definition)
 * Uses proper types inferred from Zod schemas for full type safety
 */
export type BlimuConfigInput = {
  resources: Record<string, ResourceDefinition>;
  entitlements?: Record<string, EntitlementDefinition>;
  features?: Record<string, FeatureDefinition>;
  plans?: Record<string, PlanDefinition>;
};

/**
 * Defines and validates a Blimu configuration.
 *
 * This function validates the config using Zod schemas and returns
 * a type-safe, validated configuration object.
 *
 * @param config - The Blimu configuration object
 * @returns The validated configuration
 * @throws {z.ZodError} If the configuration is invalid
 *
 * @example
 * ```typescript
 * import { defineConfig } from 'blimu';
 *
 * export default defineConfig({
 *   resources: {
 *     workspace: {
 *       roles: ['admin', 'editor', 'viewer'],
 *       is_tenant: true,
 *     },
 *   },
 *   entitlements: {
 *     'workspace:read': {
 *       roles: ['admin', 'editor', 'viewer'],
 *     },
 *   },
 * });
 * ```
 */
export function defineConfig<T extends BlimuConfigInput>(config: T): T {
  // Validate the config using Zod schema
  const validated = BlimuConfigSchema.parse(config);

  // Return the original config (with proper typing) after validation
  // This preserves the exact structure and types from the input
  return config as T & BlimuConfig;
}
