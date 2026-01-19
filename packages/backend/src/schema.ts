// Generated types from OpenAPI components.schemas

export type Enum<T> = T[keyof T];

export interface BalanceResponse {
  balance: number;
}

export interface CheckLimitResponse {
  allowed: boolean;
  current: number;
  remaining?: number;
  requested: number;
}

export interface EntitlementCheckBody {
  amount?: number;
  entitlement: string;
  resourceId: string;
  userId: string;
}

export interface EntitlementCheckResult {
  allowed: boolean;
  limit?: {
    allowed: boolean;
    current?: number;
    limit?: number;
    plan?: string | null;
    reason?: string;
    remaining?: number;
    scope?: string;
  } | null;
  plans?: {
    allowed: boolean;
    allowedPlans?: string[];
    plan?: string | null;
    reason?: string;
  } | null;
  roles?: {
    allowed: boolean;
    allowedRoles?: string[];
    reason?: string;
    userRoles?: string[];
  } | null;
}

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

export interface PlanAssignBody {
  planKey: string;
}

export interface PlanDeleteResponse {
  success: boolean;
}

export interface PlanResponse {
  createdAt: string;
  environmentId: string;
  planKey: string;
  resourceId: string;
  resourceType: string;
  updatedAt: string;
}

export interface Resource {
  createdAt: string;
  id: string;
  name: string | null;
  parents?: { id: string; type: string }[];
  type: string;
}

export interface ResourceBulkCreateBody {
  resources: {
    id?: string;
    name?: string;
    parents?: { id: string; type: string }[];
    roles?: { role: string; userId: string }[];
  }[];
}

export interface ResourceBulkResult {
  created: { environmentId: string; id: string; type: string }[];
  errors: {
    error: string;
    index: number;
    resource: {
      id?: string;
      name?: string;
      parents?: { id: string; type: string }[];
      roles?: { role: string; userId: string }[];
    };
  }[];
  success: boolean;
  summary: { failed: number; successful: number; total: number };
}

export interface ResourceCreateBody {
  id?: string;
  name?: string;
  parents?: { id: string; type: string }[];
  roles?: { role: string; userId: string }[];
}

export interface ResourceList {
  items: Resource[];
  limit: number;
  page: number;
  total: number;
}

export interface ResourceMemberList {
  items: {
    inherited: boolean;
    role: string;
    user: {
      avatarUrl: string | null;
      createdAt: string;
      email: string;
      emailVerified: boolean;
      firstName: string | null;
      id: string;
      lastLoginAt: string | null;
      lastName: string | null;
      lookupKey: string | null;
      updatedAt: string;
    };
    userId: string;
  }[];
  limit: number;
  page: number;
  total: number;
}

export interface ResourceUpdateBody {
  name?: string;
  /** Creates relationships with other resources. Parent resources must already exist. */
  parents?: { id: string; type: string }[];
}

export interface Role {
  createdAt: string;
  environmentId: string;
  resourceId: string;
  resourceType: string;
  role: string;
  userId: string;
}

export interface RoleBulkCreateBody {
  roles: { resourceId: string; resourceType: string; role: string; userId: string }[];
}

export interface RoleBulkResult {
  created: {
    createdAt: string;
    environmentId: string;
    resourceId: string;
    resourceType: string;
    role: string;
    userId: string;
  }[];
  errors: {
    error: string;
    index: number;
    role: { resourceId: string; resourceType: string; role: string; userId: string };
  }[];
  success: boolean;
  summary: { failed: number; successful: number; total: number };
}

export interface RoleCreateBody {
  resourceId: string;
  resourceType: string;
  role: string;
}

export interface RoleList {
  limit: number;
  page: number;
  roles: {
    createdAt: string;
    environmentId: string;
    resourceId: string;
    resourceType: string;
    role: string;
    userId: string;
  }[];
  total: number;
}

export interface TransactionHistoryResponse {
  items: {
    amount: number;
    createdAt: string;
    environmentId: string;
    id: string;
    limitType: string;
    resourceId: string;
    resourceType: string;
    tags: Record<string, unknown> | null;
  }[];
}

export interface UsageCheckBody {
  amount: number;
  limitType: string;
  period: 'monthly' | 'yearly' | 'lifetime';
  resourceId: string;
  resourceType: string;
}

export interface UsageConsumeBody {
  amount: number;
  limitType: string;
  resourceId: string;
  resourceType: string;
  tags?: Record<string, unknown>;
}

export interface UsageCreditBody {
  amount: number;
  limitType: string;
  resourceId: string;
  resourceType: string;
  tags?: Record<string, unknown>;
}

export interface UsageWalletResponse {
  amount: number;
  createdAt: string;
  environmentId: string;
  id: string;
  limitType: string;
  resourceId: string;
  resourceType: string;
  tags: Record<string, unknown> | null;
}

export interface User {
  avatarUrl: string | null;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  firstName: string | null;
  id: string;
  lastLoginAt: string | null;
  lastName: string | null;
  lookupKey: string | null;
  updatedAt: string;
}

export interface UserCreateBody {
  avatarUrl?: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  lookupKey: string;
  newUser?: boolean | null;
  password?: string | null;
}

export interface UserList {
  items: {
    avatarUrl: string | null;
    createdAt: string;
    email: string;
    emailVerified: boolean;
    firstName: string | null;
    id: string;
    lastLoginAt: string | null;
    lastName: string | null;
    lookupKey: string | null;
    updatedAt: string;
  }[];
  limit: number;
  page: number;
  total: number;
}

export type UserResourceList = {
  inherited: boolean;
  resource: { id: string; name: string; parents: { id: string; type: string }[]; type: string };
  role: string;
}[];

export interface UserUpdateBody {
  avatarUrl?: string | null;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  lookupKey?: string;
  password?: string;
}

// Operation query parameter interfaces

/**
 * Query params for Entitlements.ListForResource*
 * Returns entitlements for a specific resource and user. Only evaluates roles and plans (excludes limits). Provides detailed information about why entitlements are allowed or denied, including current roles, allowed roles, current plan, and allowed plans. Results are cached per resource for performance.*/
export interface EntitlementsListForResourceQuery {
  /** The unique identifier of the user */
  userId: string;
}

/**
 * Query params for Entitlements.ListForTenant*
 * Returns entitlements for a tenant resource and all its descendant resources. This endpoint scopes queries to a single tenant, preventing cross-tenant data access. Only evaluates roles and plans (excludes limits). Results are cached per resource for performance. The tenant resource type is automatically determined from the environment definition (resource marked as `is_tenant: true`).*/
export interface EntitlementsListForTenantQuery {
  /** The unique identifier of the user */
  userId: string;
}

/**
 * Query params for Resource Members.List*
 * Retrieves a paginated list of users who have roles (direct or inherited) on the specified resource. Supports search functionality to filter users by email or name.*/
export interface ResourceMembersListQuery {
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit?: number;
  /** Page number for pagination */
  page?: number;
  /** Search query to filter members by email or name */
  search?: string;
}

/**
 * Query params for Resources.List*
 * Retrieves a paginated list of resources of the specified type. Supports search and filtering. Resources are returned with their parent relationships and metadata.*/
export interface ResourcesListQuery {
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit?: number;
  /** Page number for pagination */
  page?: number;
  /** Search query to filter resources by name */
  search?: string;
}

/**
 * Query params for Roles.List*
 * Retrieves a paginated list of roles assigned to a user. Supports filtering by resource type, resource ID, and role name. Returns both directly assigned roles and inherited roles.*/
export interface RolesListQuery {
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit?: number;
  /** Page number for pagination */
  page?: number;
  /** Filter roles by specific resource ID */
  resourceId?: string;
  /** Filter roles by resource type */
  resourceType?: string;
  /** Filter by role name */
  role?: string;
}

/**
 * Query params for Usage.GetBalance*
 * Retrieves the current balance of a usage wallet for a specific resource and limit type within a given time period. The balance reflects all credits and consumption transactions.*/
export interface UsageGetBalanceQuery {
  /** Time period for the balance calculation */
  period: 'monthly' | 'yearly' | 'lifetime';
}

/**
 * Query params for Usage.GetTransactionHistory*
 * Retrieves the transaction history for a usage wallet, including all credits and consumption records. Supports filtering by time period and date range.*/
export interface UsageGetTransactionHistoryQuery {
  /** End date for filtering transactions (ISO 8601 format) */
  endDate?: string;
  /** Time period for filtering transactions */
  period?: 'monthly' | 'yearly' | 'lifetime';
  /** Start date for filtering transactions (ISO 8601 format) */
  startDate?: string;
}

/**
 * Query params for Users.List*
 * Retrieves a paginated list of users in your environment. Supports search functionality to filter users by email, name, or lookup key.*/
export interface UsersListQuery {
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit?: number;
  /** Page number for pagination */
  page?: number;
  /** Search query to filter users by email, name, or lookup key */
  search?: string;
}
