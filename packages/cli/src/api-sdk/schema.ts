// Generated types from OpenAPI components.schemas

export type Enum<T> = T[keyof T];

export interface ApiKeyCreateDto {
  environmentId: string;
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
  data: Array<{
    createdAt: string;
    id: string;
    isActive: boolean;
    key: string;
    name: string;
    updatedAt: string;
    workspaceId: string;
  }>;
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

export type CustomHostnameListDto_Output = Array<{
  createdAt: string;
  domain: string;
  environmentId: string;
  errorMessage: string | null;
  hostnameId: string | null;
  id: string;
  issuedAt: string | null;
  provider: string;
  retryCount: number;
  status:
    | 'PENDING'
    | 'PROVISIONING'
    | 'ACTIVE'
    | 'RENEWING'
    | 'FAILED'
    | 'EXPIRED';
  updatedAt: string;
}>;

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
  errors: Array<{ field: string; message: string; resource: string }>;
  spec?: Record<string, unknown>;
  valid: boolean;
}

export type DnsRecordListDto_Output = Array<{
  actualValue: string | null;
  expectedValue: string;
  hostname: string;
  id: string;
  lastCheckedAt: string | null;
  name: string;
  recordType: string;
  status: 'PENDING' | 'VERIFIED' | 'FAILED' | 'UNHEALTHY';
  verifiedAt: string | null;
}>;

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
  domainStatus?:
    | 'PENDING'
    | 'VALIDATING'
    | 'VERIFIED'
    | 'FAILED'
    | 'TIMED_OUT'
    | 'UNHEALTHY';
  id: string;
  isAccessible?: boolean;
  lookupKey: string | null;
  name: string;
  sslStatus?:
    | 'PENDING'
    | 'PROVISIONING'
    | 'ACTIVE'
    | 'RENEWING'
    | 'FAILED'
    | 'EXPIRED';
  updatedAt: string;
  variant: 'TEST' | 'LIVE';
  workspaceId: string;
}

export interface EnvironmentListDto_Output {
  data: Array<{
    createdAt: string;
    domain: string;
    domainStatus?:
      | 'PENDING'
      | 'VALIDATING'
      | 'VERIFIED'
      | 'FAILED'
      | 'TIMED_OUT'
      | 'UNHEALTHY';
    id: string;
    isAccessible?: boolean;
    lookupKey: string | null;
    name: string;
    sslStatus?:
      | 'PENDING'
      | 'PROVISIONING'
      | 'ACTIVE'
      | 'RENEWING'
      | 'FAILED'
      | 'EXPIRED';
    updatedAt: string;
    variant: 'TEST' | 'LIVE';
    workspaceId: string;
  }>;
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
  domainStatus?:
    | 'PENDING'
    | 'VALIDATING'
    | 'VERIFIED'
    | 'FAILED'
    | 'TIMED_OUT'
    | 'UNHEALTHY';
  id: string;
  isAccessible?: boolean;
  lookupKey: string | null;
  name: string;
  sslStatus?:
    | 'PENDING'
    | 'PROVISIONING'
    | 'ACTIVE'
    | 'RENEWING'
    | 'FAILED'
    | 'EXPIRED';
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
  items: Array<{
    avatarUrl: string | null;
    createdAt: string;
    email: string;
    firstName: string | null;
    invitationId?: string | null;
    lastName: string | null;
    role: 'admin' | 'owner' | 'member';
    status: 'active' | 'pending';
    userId: string;
  }>;
  limit: number;
  page: number;
  total: number;
}

export interface ResourceCreateDto {
  id?: string;
  name?: string;
  parents?: Array<{ id: string; type: string }>;
  type: string;
}

export interface ResourceDto_Output {
  createdAt: string;
  id: string;
  name: string | null;
  parents?: Array<{ id: string; type: string }>;
  type: string;
}

export interface ResourceListResponseDto_Output {
  items: Array<{
    createdAt: string;
    id: string;
    name: string | null;
    parents?: Array<{ id: string; type: string }>;
    type: string;
  }>;
  limit: number;
  page: number;
  total: number;
}

export interface ResourceUpdateDto {
  name?: string;
  parents?: Array<{ id: string; type: string }>;
}

export interface ResourceUserListResponseDto_Output {
  items: Array<{
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
  }>;
  limit: number;
  page: number;
  total: number;
}

export interface SslStatusResponseDto_Output {
  certificates: Array<{
    createdAt: string;
    domain: string;
    environmentId: string;
    errorMessage: string | null;
    hostnameId: string | null;
    id: string;
    issuedAt: string | null;
    provider: string;
    retryCount: number;
    status:
      | 'PENDING'
      | 'PROVISIONING'
      | 'ACTIVE'
      | 'RENEWING'
      | 'FAILED'
      | 'EXPIRED';
    updatedAt: string;
  }>;
  sslIssuedAt: string | null;
  status:
    | 'PENDING'
    | 'PROVISIONING'
    | 'ACTIVE'
    | 'RENEWING'
    | 'FAILED'
    | 'EXPIRED';
}

export interface UpdateRoleDto {
  role: 'admin' | 'owner' | 'member';
}

export interface UserAccessDto_Output {
  roles: Record<string, unknown>;
  workspaces: Array<{
    environments: Array<{
      id: string;
      name: string;
      type: 'environment';
      variant: 'TEST' | 'LIVE';
    }>;
    id: string;
    name: string;
    type: 'workspace';
  }>;
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
  items: Array<{
    avatarUrl: string | null;
    createdAt: string;
    email: string;
    emailVerified: boolean;
    firstName: string | null;
    id: string;
    lastLoginAt: string | null;
    lastName: string | null;
    updatedAt: string;
  }>;
  limit: number;
  page: number;
  total: number;
}

export interface UserResourceDto_Output {
  inherited: boolean;
  name: string;
  parentIds: Array<string>;
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
  environments: Array<{
    createdAt: string;
    domain: string;
    domainStatus?:
      | 'PENDING'
      | 'VALIDATING'
      | 'VERIFIED'
      | 'FAILED'
      | 'TIMED_OUT'
      | 'UNHEALTHY';
    id: string;
    isAccessible?: boolean;
    lookupKey: string | null;
    name: string;
    sslStatus?:
      | 'PENDING'
      | 'PROVISIONING'
      | 'ACTIVE'
      | 'RENEWING'
      | 'FAILED'
      | 'EXPIRED';
    updatedAt: string;
    variant: 'TEST' | 'LIVE';
    workspaceId: string;
  }>;
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
  data: Array<{
    createdAt: string;
    id: string;
    name: string;
    updatedAt: string;
  }>;
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
