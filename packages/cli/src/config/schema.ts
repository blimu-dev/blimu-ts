import { z } from 'zod';

/**
 * Zod schema for resource definition
 */
export const ResourceDefinitionSchema = z.object({
  is_tenant: z.boolean().optional(),
  roles: z.array(z.string()).min(1, 'At least one role must be defined'),
  parents: z.record(z.string(), z.object({ required: z.boolean() })).optional(),
  roles_inheritance: z
    .record(
      z.string().min(1), // local role
      // Allow tokens containing letters, numbers, underscores or dashes
      // Examples: parent->editor, organization->admin, workspace_v2->viewer
      z.array(z.string().regex(/^([a-z0-9_-]+->)*[a-z0-9_-]+$/i)).min(1)
    )
    .optional(),
});

/**
 * Zod schema for entitlement definition
 */
export const EntitlementDefinitionSchema = z.object({
  roles: z.array(z.string()).min(1).optional(),
  plans: z.array(z.string()).optional(),
  limit: z.string().optional(), // Reference to usage-based limit
});

/**
 * Zod schema for feature definition
 */
export const FeatureDefinitionSchema = z.object({
  name: z.string(),
  summary: z.string().optional(),
  entitlements: z.array(z.string()).optional(),
  plans: z.array(z.string()).optional(),
  default_enabled: z.boolean().optional(),
});

/**
 * Zod schema for plan definition
 */
export const PlanDefinitionSchema = z.object({
  name: z.string().min(1, 'Plan name is required'),
  summary: z.string().optional(),
  description: z.string().min(1, 'Plan description is required').optional(),
  resource_limits: z.record(z.string(), z.number().int().min(0)).optional(),
  usage_based_limits: z
    .record(
      z.string(),
      z.object({
        value: z.number().int().min(0),
        period: z.enum(['monthly', 'yearly', 'lifetime']),
      })
    )
    .optional(),
});

/**
 * Zod schema for complete Blimu configuration
 */
export const BlimuConfigSchema = z.object({
  resources: z.record(z.string().min(1), ResourceDefinitionSchema),
  entitlements: z.record(z.string().min(1), EntitlementDefinitionSchema).optional(),
  features: z.record(z.string().min(1), FeatureDefinitionSchema).optional(),
  plans: z.record(z.string().min(1), PlanDefinitionSchema).optional(),
});

/**
 * Type inference from schemas
 */
export type ResourceDefinition = z.infer<typeof ResourceDefinitionSchema>;
export type EntitlementDefinition = z.infer<typeof EntitlementDefinitionSchema>;
export type FeatureDefinition = z.infer<typeof FeatureDefinitionSchema>;
export type PlanDefinition = z.infer<typeof PlanDefinitionSchema>;
export type BlimuConfig = z.infer<typeof BlimuConfigSchema>;
