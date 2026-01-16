// Library exports for programmatic usage

/**
 * Configuration utilities
 */
export { defineConfig } from './config/define-config';
export type {
  BlimuConfig,
  ResourceDefinition,
  EntitlementDefinition,
  FeatureDefinition,
  PlanDefinition,
} from './config/schema';
export {
  BlimuConfigSchema,
  ResourceDefinitionSchema,
  EntitlementDefinitionSchema,
  FeatureDefinitionSchema,
  PlanDefinitionSchema,
} from './config/schema';

/**
 * Type inference utilities
 */
export type {
  InferResourceTypes,
  InferEntitlementTypes,
  InferPlanTypes,
  InferLimitTypes,
  InferUsageLimitTypes,
} from './types/infer';
