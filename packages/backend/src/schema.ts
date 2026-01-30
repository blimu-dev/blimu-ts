// Generated types from OpenAPI components.schemas

import type { ResourceType, EntitlementType, PlanType, UsageLimitType } from '@blimu/types';

export type Enum<T> = T[keyof T];

export interface AuthorizeRequest {
  /** Action to take: allow or deny */
  action: 'allow' | 'deny';
  /** True if consent was auto-approved (not required or previously granted) */
  auto_approved?: boolean;
  /** OAuth2 client ID */
  client_id: string;
  /** PKCE code challenge */
  code_challenge?: string;
  /** PKCE code challenge method */
  code_challenge_method?: string;
  /** Redirect URI */
  redirect_uri: string;
  /** Response type (typically "code") */
  response_type: string;
  /** Space-separated list of scopes */
  scope?: string;
  /** State parameter for CSRF protection */
  state?: string;
  /** True if user explicitly clicked Allow, false if auto-approved */
  user_action?: boolean;
}

export interface BalanceResponse {
  balance: number;
}

export interface CheckLimitResponse {
  allowed: boolean;
  current: number;
  remaining?: number;
  requested: number;
}

export interface ConsentCheckResponse {
  /** Whether user consent is required */
  consent_required: boolean;
  /** Whether consent was previously granted for this app and scopes */
  previously_granted: boolean;
}

export interface DeviceAuthorizeRequest {
  /** Action to take: allow or deny */
  action: 'allow' | 'deny';
  /** True if consent was auto-approved (not required or previously granted) */
  auto_approved?: boolean;
  /** True if user explicitly clicked Allow, false if auto-approved */
  user_action?: boolean;
  /** The user code displayed to the user */
  user_code: string;
}

export interface DeviceAuthorizeResponse {
  /** Whether the authorization was successful */
  success: boolean;
}

export interface DeviceCodeInfoResponse {
  /** The name of the OAuth2 application */
  appName: string;
  /** Whether the user has already granted consent for this app and scopes */
  previouslyGranted: boolean;
  /** Whether the app requires user consent */
  requireConsent: boolean;
  /** The scopes requested by the device code */
  scopes: string[];
}

export interface DeviceCodeRequest {
  /** OAuth2 client ID */
  client_id: string;
  /** PKCE code challenge (base64url encoded SHA256 hash) */
  code_challenge?: string;
  /** PKCE code challenge method */
  code_challenge_method?: 'S256' | 'plain';
  /** Space-separated list of scopes */
  scope?: string;
}

export interface DeviceCodeResponse {
  /** Device verification code (for polling) */
  device_code: string;
  /** Device code expiration time in seconds */
  expires_in: number;
  /** Minimum polling interval in seconds */
  interval: number;
  /** User verification code (short, human-readable) */
  user_code: string;
  /** Verification URI for user */
  verification_uri: string;
  /** Complete verification URI with user code */
  verification_uri_complete: string;
}

export interface DeviceTokenRequest {
  /** OAuth2 client ID */
  client_id: string;
  /** PKCE code verifier (if challenge was provided) */
  code_verifier?: string;
  /** Device code from authorization response */
  device_code: string;
  /** Grant type (must be device_code) */
  grant_type: 'urn:ietf:params:oauth:grant-type:device_code';
}

export interface EntitlementCheckBody {
  amount?: number;
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
    plan?: PlanType;
    reason?: string;
    remaining?: number;
    scope?: string;
  } | null;
  plans?: { allowed: boolean; allowedPlans?: PlanType[]; plan?: PlanType; reason?: string } | null;
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
      allowedPlans?: PlanType[];
      allowedRoles: string[];
      currentPlan?: PlanType;
      currentRole?: string;
      entitlement: EntitlementType;
    }[];
    resourceId: string;
    resourceType: ResourceType;
  }[];
}

export interface IntrospectionRequest {
  /** The token to introspect */
  token: string;
  /** Hint about token type */
  token_type_hint?: 'access_token' | 'refresh_token';
}

export interface IntrospectionResponse {
  /** Whether the token is active */
  active: boolean;
  /** Client ID */
  client_id?: string;
  /** Environment ID */
  environment_id?: string;
  /** Token expiration timestamp */
  exp?: number;
  /** Token issued at timestamp */
  iat?: number;
  /** Space-separated list of scopes */
  scope?: string;
  /** Subject (user ID) */
  sub?: string;
  /** Token type */
  token_type?: string;
  /** Username or user ID */
  username?: string;
}

export interface JWK {
  keys: { alg: string; e: string; kid: string; kty: string; n: string; use: string }[];
}

export interface PlanAssignBody {
  planKey: PlanType;
}

export interface PlanDeleteResponse {
  success: boolean;
}

export interface PlanResponse {
  createdAt: string;
  environmentId: string;
  planKey: PlanType;
  resourceId: string;
  resourceType: ResourceType;
  updatedAt: string;
}

export interface Resource {
  createdAt: string;
  id: string;
  name: string | null;
  parents?: { id: string; type: ResourceType }[];
  type: ResourceType;
}

export interface ResourceBulkCreateBody {
  resources: {
    id?: string;
    name?: string;
    parents?: { id: string; type: ResourceType }[];
    roles?: { role: string; userId: string }[];
  }[];
}

export interface ResourceBulkResult {
  created: { environmentId: string; id: string; type: ResourceType }[];
  errors: {
    error: string;
    index: number;
    resource: {
      id?: string;
      name?: string;
      parents?: { id: string; type: ResourceType }[];
      roles?: { role: string; userId: string }[];
    };
  }[];
  success: boolean;
  summary: { failed: number; successful: number; total: number };
}

export interface ResourceCreateBody {
  id?: string;
  name?: string;
  parents?: { id: string; type: ResourceType }[];
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
  parents?: { id: string; type: ResourceType }[];
}

export interface RevocationRequest {
  /** The token to revoke */
  token: string;
  /** Hint about token type */
  token_type_hint?: 'access_token' | 'refresh_token';
}

export interface Role {
  createdAt: string;
  environmentId: string;
  resourceId: string;
  resourceType: ResourceType;
  role: string;
  userId: string;
}

export interface RoleBulkCreateBody {
  roles: { resourceId: string; resourceType: ResourceType; role: string; userId: string }[];
}

export interface RoleBulkResult {
  created: {
    createdAt: string;
    environmentId: string;
    resourceId: string;
    resourceType: ResourceType;
    role: string;
    userId: string;
  }[];
  errors: {
    error: string;
    index: number;
    role: { resourceId: string; resourceType: ResourceType; role: string; userId: string };
  }[];
  success: boolean;
  summary: { failed: number; successful: number; total: number };
}

export interface RoleCreateBody {
  resourceId: string;
  resourceType: ResourceType;
  role: string;
}

export interface RoleList {
  limit: number;
  page: number;
  roles: {
    createdAt: string;
    environmentId: string;
    resourceId: string;
    resourceType: ResourceType;
    role: string;
    userId: string;
  }[];
  total: number;
}

export interface TokenRequest {
  /** OAuth2 client ID */
  client_id: string;
  /** OAuth2 client secret (required for confidential clients) */
  client_secret?: string;
  /** Authorization code (required for authorization_code grant) */
  code?: string;
  /** PKCE code verifier (if challenge was provided) */
  code_verifier?: string;
  /** OAuth2 grant type */
  grant_type: 'authorization_code' | 'refresh_token';
  /** Redirect URI (required for authorization_code grant) */
  redirect_uri?: string;
  /** Refresh token (required for refresh_token grant) */
  refresh_token?: string;
  /** Space-separated list of scopes (optional for refresh) */
  scope?: string;
}

export interface TokenResponse {
  /** Access token (JWT) */
  access_token: string;
  /** Access token expiration time in seconds */
  expires_in: number;
  /** Refresh token (for obtaining new access tokens) */
  refresh_token: string;
  /** Space-separated list of granted scopes */
  scope?: string;
  /** Token type */
  token_type: string;
}

export interface TransactionHistoryResponse {
  items: {
    amount: number;
    createdAt: string;
    environmentId: string;
    id: string;
    limitType: UsageLimitType;
    resourceId: string;
    resourceType: ResourceType;
    tags: Record<string, unknown> | null;
  }[];
}

export interface UsageCheckBody {
  amount: number;
  limitType: UsageLimitType;
  period: 'monthly' | 'yearly' | 'lifetime';
  resourceId: string;
  resourceType: ResourceType;
}

export interface UsageConsumeBody {
  amount: number;
  limitType: UsageLimitType;
  resourceId: string;
  resourceType: ResourceType;
  tags?: Record<string, unknown>;
}

export interface UsageCreditBody {
  amount: number;
  limitType: UsageLimitType;
  resourceId: string;
  resourceType: ResourceType;
  tags?: Record<string, unknown>;
}

export interface UsageWalletResponse {
  amount: number;
  createdAt: string;
  environmentId: string;
  id: string;
  limitType: UsageLimitType;
  resourceId: string;
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
  resource: {
    id: string;
    name: string;
    parents: { id: string; type: ResourceType }[];
    type: ResourceType;
  };
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
 * Query params for AuthJwks.GetOAuthAppJwks*
 * Returns the public key for a specific OAuth app to verify JWT tokens. This is a public endpoint following OAuth2/OIDC standards. Provide client_id to get keys for a specific OAuth app, or use authenticated endpoint for environment keys.*/
export interface AuthJwksGetOAuthAppJwksQuery {
  /** OAuth app client ID to get public keys for */
  client_id?: string;
}

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
 * Query params for Oauth.CheckConsentRequired*
 * Checks if user consent is required for the OAuth2 app and requested scopes.*/
export interface OauthCheckConsentRequiredQuery {
  /** OAuth2 client ID */
  client_id: string;
  /** Redirect URI */
  redirect_uri?: string;
  /** Space-separated list of scopes */
  scope?: string;
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
  resourceType?: ResourceType;
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
