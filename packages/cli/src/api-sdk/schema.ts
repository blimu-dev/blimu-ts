// Generated types from OpenAPI components.schemas

export type Enum<T> = T[keyof T];

export interface ApiKeyCreateDto {
  name: string;
}

export interface ApiKeyDto_Output {
  createdAt: string;
  id: string;
  isActive: boolean;
  key: string;
  name: string;
  updatedAt: string;
  workspaceId: string;
}

export interface ApiKeyListDto_Output {
  data: {
    createdAt: string;
    id: string;
    isActive: boolean;
    key: string;
    name: string;
    updatedAt: string;
    workspaceId: string;
  }[];
  total: number;
}

export interface ApiKeyRevealDto_Output {
  createdAt: string;
  environmentId: string;
  id: string;
  isActive: boolean;
  key: string;
  name: string;
  updatedAt: string;
  workspaceId: string;
}

export type CustomHostnameListDto_Output = {
  createdAt: string;
  domain: string;
  environmentId: string;
  errorMessage: string | null;
  hostnameId: string | null;
  id: string;
  issuedAt: string | null;
  provider: string;
  retryCount: number;
  status: 'PENDING' | 'PROVISIONING' | 'ACTIVE' | 'RENEWING' | 'FAILED' | 'EXPIRED';
  updatedAt: string;
}[];

export interface DefinitionDto_Output {
  entitlements?: Record<string, unknown>;
  features?: Record<string, unknown>;
  plans?: Record<string, unknown>;
  resources?: Record<string, unknown>;
}

export interface DefinitionUpdateDto {
  entitlements?: Record<string, unknown>;
  features?: Record<string, unknown>;
  plans?: Record<string, unknown>;
  resources?: Record<string, unknown>;
}

export interface DefinitionValidateRequestDto {
  entitlements?: Record<string, unknown>;
  features?: Record<string, unknown>;
  plans?: Record<string, unknown>;
  resources: Record<string, unknown>;
  version?: string;
}

export interface DefinitionValidateResponseDto_Output {
  errors: { field: string; message: string; resource: string }[];
  spec?: Record<string, unknown>;
  valid: boolean;
}

export type DnsRecordListDto_Output = {
  actualValue: string | null;
  expectedValue: string;
  hostname: string;
  id: string;
  lastCheckedAt: string | null;
  name: string;
  recordType: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'UNHEALTHY';
  verifiedAt: string | null;
}[];

export interface EnvironmentAuthConfigDto_Output {
  authMethod?: 'code' | 'password' | 'both';
  codeExpirationMinutes?: number;
  maxCodeAttempts?: number;
  requireEmailVerification?: boolean;
}

export interface EnvironmentAuthConfigUpdateDto {
  authMethod?: 'code' | 'password' | 'both';
  codeExpirationMinutes?: number;
  maxCodeAttempts?: number;
  requireEmailVerification?: boolean;
}

export interface EnvironmentCreateDto {
  cloneFromEnvironmentId?: string;
  domain?: string;
  lookupKey?: string;
  name: string;
  variant?: 'TEST' | 'LIVE';
}

export interface EnvironmentDto_Output {
  createdAt: string;
  domain: string;
  domainStatus?: 'PENDING' | 'VALIDATING' | 'VERIFIED' | 'FAILED' | 'TIMED_OUT' | 'UNHEALTHY';
  id: string;
  isAccessible?: boolean;
  lookupKey: string | null;
  name: string;
  publishableKey: string;
  sslStatus?: 'PENDING' | 'PROVISIONING' | 'ACTIVE' | 'RENEWING' | 'FAILED' | 'EXPIRED';
  updatedAt: string;
  variant: 'TEST' | 'LIVE';
  workspaceId: string;
}

export interface EnvironmentListDto_Output {
  data: {
    createdAt: string;
    domain: string;
    domainStatus?: 'PENDING' | 'VALIDATING' | 'VERIFIED' | 'FAILED' | 'TIMED_OUT' | 'UNHEALTHY';
    id: string;
    isAccessible?: boolean;
    lookupKey: string | null;
    name: string;
    publishableKey: string;
    sslStatus?: 'PENDING' | 'PROVISIONING' | 'ACTIVE' | 'RENEWING' | 'FAILED' | 'EXPIRED';
    updatedAt: string;
    variant: 'TEST' | 'LIVE';
    workspaceId: string;
  }[];
  meta: { limit: number; page: number; total: number; totalPages: number };
}

export interface EnvironmentUpdateDto {
  lookupKey?: string;
  name?: string;
}

export interface EnvironmentWithDefinitionDto_Output {
  createdAt: string;
  definition: {
    entitlements?: Record<string, unknown>;
    features?: Record<string, unknown>;
    plans?: Record<string, unknown>;
    resources?: Record<string, unknown>;
  } | null;
  domain: string;
  domainStatus?: 'PENDING' | 'VALIDATING' | 'VERIFIED' | 'FAILED' | 'TIMED_OUT' | 'UNHEALTHY';
  id: string;
  isAccessible?: boolean;
  lookupKey: string | null;
  name: string;
  publishableKey: string;
  sslStatus?: 'PENDING' | 'PROVISIONING' | 'ACTIVE' | 'RENEWING' | 'FAILED' | 'EXPIRED';
  updatedAt: string;
  variant: 'TEST' | 'LIVE';
  workspaceId: string;
}

export interface InviteMemberDto {
  email: string;
  role: 'admin' | 'owner' | 'member';
}

export interface InviteMemberResponseDto_Output {
  id: string;
}

export interface MemberListResponseDto_Output {
  items: {
    avatarUrl: string | null;
    createdAt: string;
    email: string;
    firstName: string | null;
    invitationId?: string | null;
    lastName: string | null;
    role: 'admin' | 'owner' | 'member';
    status: 'active' | 'pending';
    userId: string;
  }[];
  limit: number;
  page: number;
  total: number;
}

export interface OAuthAppCreateBodyDto {
  grantTypes: ('authorization_code' | 'device_code')[];
  name: string;
  pkceRequired?: boolean;
  redirectUris?: string[];
  requireConsent?: boolean;
  scopes?: string[];
}

export interface OAuthAppCreateResponse_Output {
  clientId: string;
  clientSecret: string | null;
  createdAt: string;
  environmentId: string;
  grantTypes: string[];
  id: string;
  isActive: boolean;
  name: string;
  pkceRequired: boolean;
  redirectUris: string[];
  requireConsent: boolean;
  scopes: string[];
  updatedAt: string;
}

export interface OAuthAppList_Output {
  data: OAuthApp_Output[];
  limit: number;
  page: number;
  total: number;
}

export interface OAuthAppRotateSecretResponse_Output {
  clientSecret: string;
}

export interface OAuthAppTokenList_Output {
  data: {
    createdAt: string;
    expiresAt: string;
    id: string;
    revokedAt: string | null;
    scopes: string[];
    tokenType: string;
    userId: string;
  }[];
  total: number;
}

export interface OAuthAppUpdateBodyDto {
  isActive?: boolean;
  name?: string;
  pkceRequired?: boolean;
  redirectUris?: string[];
  requireConsent?: boolean;
  scopes?: string[];
}

export interface OAuthApp_Output {
  clientId: string;
  createdAt: string;
  environmentId: string;
  grantTypes: string[];
  id: string;
  isActive: boolean;
  name: string;
  pkceRequired: boolean;
  redirectUris: string[];
  requireConsent: boolean;
  scopes: string[];
  updatedAt: string;
}

export interface ResourceCreateDto {
  id?: string;
  name?: string;
  parents?: { id: string; type: string }[];
  type: string;
}

export interface ResourceDto_Output {
  createdAt: string;
  id: string;
  name: string | null;
  parents?: { id: string; type: string }[];
  type: string;
}

export interface ResourceListResponseDto_Output {
  items: {
    createdAt: string;
    id: string;
    name: string | null;
    parents?: { id: string; type: string }[];
    type: string;
  }[];
  limit: number;
  page: number;
  total: number;
}

export interface ResourceUpdateDto {
  name?: string;
  parents?: { id: string; type: string }[];
}

export interface ResourceUserListResponseDto_Output {
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
      updatedAt: string;
    };
    userId: string;
  }[];
  limit: number;
  page: number;
  total: number;
}

export interface SslStatusResponseDto_Output {
  certificates: {
    createdAt: string;
    domain: string;
    environmentId: string;
    errorMessage: string | null;
    hostnameId: string | null;
    id: string;
    issuedAt: string | null;
    provider: string;
    retryCount: number;
    status: 'PENDING' | 'PROVISIONING' | 'ACTIVE' | 'RENEWING' | 'FAILED' | 'EXPIRED';
    updatedAt: string;
  }[];
  sslIssuedAt: string | null;
  status: 'PENDING' | 'PROVISIONING' | 'ACTIVE' | 'RENEWING' | 'FAILED' | 'EXPIRED';
}

export interface UpdateRoleDto {
  role: 'admin' | 'owner' | 'member';
}

export interface UserAccessDto_Output {
  roles: Record<string, unknown>;
  workspaces: {
    environments: { id: string; name: string; type: 'environment'; variant: 'TEST' | 'LIVE' }[];
    id: string;
    name: string;
    type: 'workspace';
  }[];
}

export interface UserDto_Output {
  avatarUrl: string | null;
  createdAt: string;
  email: string;
  emailVerified: boolean;
  firstName: string | null;
  id: string;
  lastLoginAt: string | null;
  lastName: string | null;
  updatedAt: string;
}

export interface UserListResponseDto_Output {
  items: {
    avatarUrl: string | null;
    createdAt: string;
    email: string;
    emailVerified: boolean;
    firstName: string | null;
    id: string;
    lastLoginAt: string | null;
    lastName: string | null;
    updatedAt: string;
  }[];
  limit: number;
  page: number;
  total: number;
}

export interface UserResourceDto_Output {
  inherited: boolean;
  name: string;
  parentIds: string[];
  resourceId: string;
  resourceType: string;
  role: string;
}

export interface WorkspaceCreateDto {
  key?: string;
  name: string;
}

export interface WorkspaceCreateResponseDto_Output {
  createdAt: string;
  environments: {
    createdAt: string;
    domain: string;
    domainStatus?: 'PENDING' | 'VALIDATING' | 'VERIFIED' | 'FAILED' | 'TIMED_OUT' | 'UNHEALTHY';
    id: string;
    isAccessible?: boolean;
    lookupKey: string | null;
    name: string;
    publishableKey: string;
    sslStatus?: 'PENDING' | 'PROVISIONING' | 'ACTIVE' | 'RENEWING' | 'FAILED' | 'EXPIRED';
    updatedAt: string;
    variant: 'TEST' | 'LIVE';
    workspaceId: string;
  }[];
  id: string;
  name: string;
  updatedAt: string;
}

export interface WorkspaceDto_Output {
  createdAt: string;
  id: string;
  name: string;
  updatedAt: string;
}

export interface WorkspaceListDto_Output {
  data: { createdAt: string; id: string; name: string; updatedAt: string }[];
  total: number;
}

export interface WorkspaceUpdateDto {
  name: string;
}

// Operation query parameter interfaces

/**
 * Query params for Environments.List*/
export interface EnvironmentsListQuery {
  limit?: number;
  page?: number;
  search?: string;
}

/**
 * Query params for Oauth Apps.List*
 * Retrieves a paginated list of OAuth apps for the environment. Supports filtering by grant type and active status.*/
export interface OauthAppsListQuery {
  /** Filter by grant type */
  grantType?: string;
  /** Filter by active status */
  isActive?: boolean;
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit?: number;
  /** Page number for pagination */
  page?: number;
}

/**
 * Query params for Oauth Apps.ListTokens*
 * Retrieves a list of tokens (refresh tokens) associated with an OAuth app. Supports filtering by token type and active status. Token values are never returned.*/
export interface OauthAppsListTokensQuery {
  /** Only return active (non-revoked) tokens */
  activeOnly?: boolean;
  /** Filter by token type */
  tokenType?: string;
}

/**
 * Query params for Resources.List*/
export interface ResourcesListQuery {
  limit?: number;
  page?: number;
  parent?: string;
  search?: string;
  type: string;
}

/**
 * Query params for Resources.ListChildren*/
export interface ResourcesListChildrenQuery {
  limit?: number;
  page?: number;
  parent?: string;
  search?: string;
  type: string;
}

/**
 * Query params for Resources.GetResourceUsers*/
export interface ResourcesGetResourceUsersQuery {
  limit?: number;
  page?: number;
  search?: string;
}

/**
 * Query params for Users.List*/
export interface UsersListQuery {
  limit?: number;
  page?: number;
  search?: string;
}

/**
 * Query params for Workspace Members.List*/
export interface WorkspaceMembersListQuery {
  limit?: number;
  page?: number;
  search?: string;
}
