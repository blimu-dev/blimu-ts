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
  /** Entitlement identifier */
  entitlement: EntitlementType;
  limit?: { allowed: boolean; current?: number; limit?: number; reason?: string; scope?: string };
}
/**
 * Entitlement identifier
 */
export type EntitlementType = string;
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
  /** Resource type identifier */
  resourceType: ResourceType;
  updatedAt: string;
}
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
    limitType: string;
    resourceId: string;
    resourceType: ResourceType;
    tags: Record<string, unknown> | null;
  }>;
}
export interface UsageCheckBody {
  amount: number;
  limitType: string;
  period: 'monthly' | 'yearly' | 'lifetime';
  resourceId: string;
  /** Resource type identifier */
  resourceType: ResourceType;
}
export interface UsageConsumeBody {
  amount: number;
  limitType: string;
  resourceId: string;
  /** Resource type identifier */
  resourceType: ResourceType;
  tags?: Record<string, unknown>;
}
export interface UsageCreditBody {
  amount: number;
  limitType: string;
  resourceId: string;
  /** Resource type identifier */
  resourceType: ResourceType;
  tags?: Record<string, unknown>;
}
export interface UsageWalletResponse {
  amount: number;
  createdAt: string;
  environmentId: string;
  id: string;
  limitType: string;
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
 */
export interface ResourcesListQuery {
  limit?: number;
  page?: number;
  search?: string;
}
/**
 * Query params for Roles.List
 */
export interface RolesListQuery {
  limit?: number;
  page?: number;
  resourceId?: string;
  /** The type of resource */
  resourceType?: ResourceType;
  role?: string;
}
/**
 * Query params for Usage.GetBalance
 */
export interface UsageGetBalanceQuery {
  period: 'monthly' | 'yearly' | 'lifetime';
}
/**
 * Query params for Usage.GetTransactionHistory
 */
export interface UsageGetTransactionHistoryQuery {
  endDate?: string;
  period?: 'monthly' | 'yearly' | 'lifetime';
  startDate?: string;
}
/**
 * Query params for Users.List
 */
export interface UsersListQuery {
  limit?: number;
  page?: number;
  search?: string;
}
