// Generated types from OpenAPI components.schemas

export type Enum<T> = T[keyof T];

export interface EntitlementsListResult {
  results: {
    entitlements: {
      allowed: boolean;
      allowedByPlan: boolean;
      allowedByRole: boolean;
      allowedPlans?: string[];
      allowedRoles: string[];
      currentPlan?: string;
      currentRole?: string;
      entitlement: string;
    }[];
    resourceId: string;
    resourceType: string;
  }[];
}

export interface RefreshResponse {
  sessionToken: string;
}

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
 * Query params for Auth.Refresh*/
export interface AuthRefreshQuery {
  __lh_jwt?: string;
}
