// Generated types from OpenAPI components.schemas

export type Enum<T> = T[keyof T];
/**
 * Entitlement identifier
 */
export type EntitlementType = string;
export interface EntitlementsListResult {
  results: Array<{
    entitlements: Array<{
      allowed: boolean;
      allowedByPlan: boolean;
      allowedByRole: boolean;
      allowedPlans?: Array<string>;
      allowedRoles: Array<string>;
      currentPlan?: string;
      currentRole?: string;
      entitlement: EntitlementType;
    }>;
    resourceId: string;
    resourceType: ResourceType;
  }>;
}
export interface RefreshResponse {
  sessionToken: string;
}
/**
 * Resource type identifier
 */
export type ResourceType = string;
export interface SessionResponse {
  isAuthenticated: boolean;
  user: {
    email: string;
    emailVerified: boolean;
    firstName: string | null;
    id: string;
    lastName: string | null;
  } | null;
}

// Operation query parameter interfaces
/**
 * Query params for Auth.Refresh
 */
export interface AuthRefreshQuery {
  __lh_jwt?: string;
}
