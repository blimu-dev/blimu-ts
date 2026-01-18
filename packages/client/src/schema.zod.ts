// Generated zod schemas from OpenAPI components.schemas
// Use these schemas for runtime validation in forms, API requests, etc.

import { z } from 'zod';

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
          allowedPlans: z.string().array().optional(),
          allowedRoles: z.string().array(),
          currentPlan: z.string().optional(),
          currentRole: z.string().optional(),
          entitlement: z.string(),
        })
        .array(),
      resourceId: z.string(),
      resourceType: z.string(),
    })
    .array(),
});

/**
 * Zod schema for RefreshResponse
 */
export const RefreshResponseSchema = z.object({ sessionToken: z.string() });

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

// Operation query parameter schemas

/**
 * Schema for query params of Auth.Refresh
 */
export const AuthRefreshQuerySchema = z.object({
  __lh_jwt: z.string().optional(),
});
