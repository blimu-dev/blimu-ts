// Generated zod schemas from OpenAPI components.schemas
// Use these schemas for runtime validation in forms, API requests, etc.

import { z } from 'zod';

/**
 * Schema for EntitlementType
 * Entitlement identifier
 */
export const EntitlementTypeSchema = z.string();

/**
 * Schema for PlanType
 * Plan type identifier
 */
export const PlanTypeSchema = z.string();

/**
 * Schema for ResourceType
 * Resource type identifier
 */
export const ResourceTypeSchema = z.string();

/**
 * Zod schema for RefreshResponse
 */
export const RefreshResponseSchema = z.object({ sessionToken: z.string().optional() });

/**
 * Zod schema for SessionResponse
 */
export const SessionResponseSchema = z.object({
  isAuthenticated: z.boolean(),
  user: z
    .object({
      email: z.string(),
      emailVerified: z.boolean(),
      firstName: z.string().nullable(),
      id: z.string(),
      lastName: z.string().nullable(),
    })
    .nullable(),
});

/**
 * Zod schema for EntitlementsListResult
 */
export const EntitlementsListResultSchema = z.object({
  results: z
    .object({
      entitlements: z
        .object({
          allowed: z.boolean(),
          allowedByPlan: z.boolean(),
          allowedByRole: z.boolean(),
          allowedPlans: PlanTypeSchema.array().optional(),
          allowedRoles: z.string().array(),
          currentPlan: PlanTypeSchema.optional(),
          currentRole: z.string().optional(),
          entitlement: EntitlementTypeSchema,
        })
        .array(),
      resourceId: z.string(),
      resourceType: ResourceTypeSchema,
    })
    .array(),
});

// Operation query parameter schemas

/**
 * Schema for query params of Auth.Logout
 */
export const AuthLogoutQuerySchema = z.object({
  __lh_jwt: z.string().optional(),
});

/**
 * Schema for query params of Auth.Refresh
 */
export const AuthRefreshQuerySchema = z.object({
  __lh_jwt: z.string().optional(),
});
