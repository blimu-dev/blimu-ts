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
  /** Entitlement identifier */
  entitlement: EntitlementType;
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
    allowedPlans?: Array<string>;
    plan?: string | null;
    reason?: string;
  } | null;
  roles?: {
    allowed: boolean;
    allowedRoles?: Array<string>;
    reason?: string;
    userRoles?: Array<string>;
  } | null;
}
/**
 * Entitlement identifier
 */
export type EntitlementType = string;
/**
 * Limit type identifier
 */
export type LimitType = string;
export interface PlanAssignBody {
  /** Plan type identifier */
  planKey: PlanType;
}
export interface PlanDeleteResponse {
  success: boolean;
}
export interface PlanResponse {
  createdAt: string;
  environmentId: string;
  /** Plan type identifier */
  planKey: PlanType;
  resourceId: string;
  /** Resource type identifier */
  resourceType: ResourceType;
  updatedAt: string;
}
/**
 * Plan type identifier
 */
export type PlanType = string;
export interface Resource {
  createdAt: string;
  id: string;
  name: string | null;
  parents?: Array<{ id: string; type: ResourceType }>;
  /** Resource type identifier */
  type: ResourceType;
}
export interface ResourceBulkCreateBody {
  resources: Array<{
    id?: string;
    name?: string;
    parents?: Array<{ id: string; type: ResourceType }>;
    roles?: Array<{ role: string; userId: string }>;
  }>;
}
export interface ResourceBulkResult {
  created: Array<{ environmentId: string; id: string; type: ResourceType }>;
  errors: Array<{
    error: string;
    index: number;
    resource: {
      id?: string;
      name?: string;
      parents?: Array<{ id: string; type: ResourceType }>;
      roles?: Array<{ role: string; userId: string }>;
    };
  }>;
  success: boolean;
  summary: { failed: number; successful: number; total: number };
}
export interface ResourceCreateBody {
  id?: string;
  name?: string;
  parents?: Array<{ id: string; type: ResourceType }>;
  roles?: Array<{ role: string; userId: string }>;
}
export interface ResourceList {
  items: Array<{
    createdAt: string;
    id: string;
    name: string | null;
    parents?: Array<{ id: string; type: ResourceType }>;
    type: ResourceType;
  }>;
  limit: number;
  page: number;
  total: number;
}
/**
 * Resource type identifier
 */
export type ResourceType = string;
export interface ResourceUpdateBody {
  name?: string;
  /** Creates relationships with other resources. Parent resources must already exist. */
  parents?: Array<{ id: string; type: ResourceType }>;
}
export interface Role {
  createdAt: string;
  environmentId: string;
  resourceId: string;
  /** Resource type identifier */
  resourceType: ResourceType;
  role: string;
  userId: string;
}
export interface RoleBulkCreateBody {
  roles: Array<{ resourceId: string; resourceType: ResourceType; role: string; userId: string }>;
}
export interface RoleBulkResult {
  created: Array<{
    createdAt: string;
    environmentId: string;
    resourceId: string;
    resourceType: ResourceType;
    role: string;
    userId: string;
  }>;
  errors: Array<{
    error: string;
    index: number;
    role: { resourceId: string; resourceType: ResourceType; role: string; userId: string };
  }>;
  success: boolean;
  summary: { failed: number; successful: number; total: number };
}
export interface RoleCreateBody {
  resourceId: string;
  /** Resource type identifier */
  resourceType: ResourceType;
  role: string;
}
export interface RoleList {
  limit: number;
  page: number;
  roles: Array<{
    createdAt: string;
    environmentId: string;
    resourceId: string;
    resourceType: ResourceType;
    role: string;
    userId: string;
  }>;
  total: number;
}
export interface TransactionHistoryResponse {
  items: Array<{
    amount: number;
    createdAt: string;
    environmentId: string;
    id: string;
    limitType: LimitType;
    resourceId: string;
    resourceType: ResourceType;
    tags: Record<string, unknown> | null;
  }>;
}
export interface UsageCheckBody {
  amount: number;
  /** Usage-based limit type identifier */
  limitType: UsageLimitType;
  period: 'monthly' | 'yearly' | 'lifetime';
  resourceId: string;
  /** Resource type identifier */
  resourceType: ResourceType;
}
export interface UsageConsumeBody {
  amount: number;
  /** Usage-based limit type identifier */
  limitType: UsageLimitType;
  resourceId: string;
  /** Resource type identifier */
  resourceType: ResourceType;
  tags?: Record<string, unknown>;
}
export interface UsageCreditBody {
  amount: number;
  /** Usage-based limit type identifier */
  limitType: UsageLimitType;
  resourceId: string;
  /** Resource type identifier */
  resourceType: ResourceType;
  tags?: Record<string, unknown>;
}
/**
 * Usage-based limit type identifier
 */
export type UsageLimitType = string;
export interface UsageWalletResponse {
  amount: number;
  createdAt: string;
  environmentId: string;
  id: string;
  /** Usage-based limit type identifier */
  limitType: UsageLimitType;
  resourceId: string;
  /** Resource type identifier */
  resourceType: ResourceType;
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
  password?: string | null;
}
export interface UserList {
  items: Array<{
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
  }>;
  limit: number;
  page: number;
  total: number;
}
export type UserResourceList = Array<{
  inherited: boolean;
  resource: {
    id: string;
    name: string;
    parents: Array<{ id: string; type: ResourceType }>;
    type: ResourceType;
  };
  role: string;
}>;
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
 * Query params for Resources.List
 *
 * Retrieves a paginated list of resources of the specified type. Supports search and filtering. Resources are returned with their parent relationships and metadata.
 */
export interface ResourcesListQuery {
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit?: number;
  /** Page number for pagination */
  page?: number;
  /** Search query to filter resources by name */
  search?: string;
}
/**
 * Query params for Roles.List
 *
 * Retrieves a paginated list of roles assigned to a user. Supports filtering by resource type, resource ID, and role name. Returns both directly assigned roles and inherited roles.
 */
export interface RolesListQuery {
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit?: number;
  /** Page number for pagination */
  page?: number;
  /** Filter roles by specific resource ID */
  resourceId?: string;
  /** Filter roles by resource type */
  resourceType?: ResourceType;
  /** Filter by role name */
  role?: string;
}
/**
 * Query params for Usage.GetBalance
 *
 * Retrieves the current balance of a usage wallet for a specific resource and limit type within a given time period. The balance reflects all credits and consumption transactions.
 */
export interface UsageGetBalanceQuery {
  /** Time period for the balance calculation */
  period: 'monthly' | 'yearly' | 'lifetime';
}
/**
 * Query params for Usage.GetTransactionHistory
 *
 * Retrieves the transaction history for a usage wallet, including all credits and consumption records. Supports filtering by time period and date range.
 */
export interface UsageGetTransactionHistoryQuery {
  /** End date for filtering transactions (ISO 8601 format) */
  endDate?: string;
  /** Time period for filtering transactions */
  period?: 'monthly' | 'yearly' | 'lifetime';
  /** Start date for filtering transactions (ISO 8601 format) */
  startDate?: string;
}
/**
 * Query params for Users.List
 *
 * Retrieves a paginated list of users in your environment. Supports search functionality to filter users by email, name, or lookup key.
 */
export interface UsersListQuery {
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit?: number;
  /** Page number for pagination */
  page?: number;
  /** Search query to filter users by email, name, or lookup key */
  search?: string;
}
