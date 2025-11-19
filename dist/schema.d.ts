export type Enum<T> = T[keyof T];
export interface AuthLoginBody {
    email: string;
    password: string;
    rememberMe?: boolean;
}
export interface AuthRegisterBody {
    email: string;
    firstName?: string;
    lastName?: string;
    password: string;
}
export interface AuthResponse {
    expiresAt: string;
    sessionToken: string;
    user: {
        email: string;
        emailVerified: boolean;
        firstName: string | null;
        id: string;
        lastName: string | null;
    };
}
export interface Branding {
    backgroundGradient: string | null;
    backgroundImageUrl: string | null;
    brandName: string;
    customCss: string;
    customDomains: Array<string>;
    customJs: string;
    environmentId: string;
    faviconUrl: string;
    fontFamily: string;
    footerText: string | null;
    layoutType: string;
    loginSubtitle: string | null;
    loginTitle: string;
    logoUrl: string | null;
    primaryColor: string;
    primaryDomain: string | null;
    registerSubtitle: string | null;
    registerTitle: string;
    secondaryColor: string;
    showForgotPassword: boolean;
    showRememberMe: boolean;
    showSignup: boolean;
    socialProviders: Record<string, unknown>;
}
export interface ConsentForm {
    action: 'allow' | 'deny';
    client_id: string;
    code_challenge?: string;
    code_challenge_method?: string;
    redirect_uri: string;
    response_type: string;
    scope?: string;
    state?: string;
}
export interface Definition {
    entitlements: Record<string, unknown>;
    features?: Record<string, unknown>;
    namespace?: string;
    plans?: Record<string, unknown>;
    resources: Record<string, unknown>;
}
export interface DefinitionCustomTypesResponse {
    components: {
        schemas: Record<string, unknown>;
    };
    info: {
        description?: string;
        title: string;
        version: string;
    };
    openapi: string;
}
export interface DefinitionGenerateSDKBody {
    entitlements?: Record<string, unknown>;
    features?: Record<string, unknown>;
    namespace?: string;
    plans?: Record<string, unknown>;
    resources: Record<string, unknown>;
    sdk_options: {
        client_name: string;
        module_type?: 'runtime' | 'runtime-client';
        package_name: string;
        type: string;
    };
    version?: string;
}
export interface DefinitionGenerateSDKResponse {
    errors?: Array<{
        field: string;
        message: string;
        resource: string;
    }>;
    spec: Record<string, unknown>;
    success: boolean;
}
export interface DefinitionValidateBody {
    entitlements?: Record<string, unknown>;
    features?: Record<string, unknown>;
    namespace?: string;
    plans?: Record<string, unknown>;
    resources: Record<string, unknown>;
    version?: string;
}
export interface DefinitionValidateResponse {
    errors: Array<{
        field: string;
        message: string;
        resource: string;
    }>;
    spec?: Record<string, unknown>;
    valid: boolean;
}
export interface EntitlementCheckBody {
    entitlement: EntitlementType;
    resourceId: string;
    userId: string;
}
export interface EntitlementCheckResult {
    allowed: boolean;
    reason?: string;
    requiredRoles?: Array<string>;
    userRoles?: Array<string>;
}
export type EntitlementType = string;
export interface EnvironmentByDomain {
    environmentId: string;
}
export interface OAuthApplication {
    applicationType: string;
    clientId: string;
    id: string;
    isPublic: boolean;
    name: string;
    redirectUris: Array<string>;
    scopes: Array<string>;
    skipConsent: boolean;
    trustedScopes: Array<string>;
}
export interface OAuthTokenBody {
    client_id: string;
    client_secret?: string;
    code?: string;
    code_verifier?: string;
    grant_type: 'authorization_code' | 'refresh_token';
    redirect_uri?: string;
    refresh_token?: string;
}
export interface Resource {
    createdAt: string;
    extraFields?: Record<string, unknown>;
    id: string;
    name: string | null;
    parents?: Array<{
        id: string;
        type: ResourceType;
    }>;
    type: ResourceType;
}
export interface ResourceBulkCreateBody {
    resources: Array<{
        id?: string;
        name?: string;
        parents?: Array<{
            id: string;
            type: ResourceType;
        }>;
    }>;
}
export interface ResourceBulkResult {
    created: Array<{
        environmentId: string;
        id: string;
        type: ResourceType;
    }>;
    errors: Array<{
        error: string;
        index: number;
        resource: {
            id?: string;
            name?: string;
            parents?: Array<{
                id: string;
                type: ResourceType;
            }>;
        };
    }>;
    success: boolean;
    summary: {
        failed: number;
        successful: number;
        total: number;
    };
}
export interface ResourceCreateBody {
    extraFields?: Record<string, unknown>;
    id?: string;
    name?: string;
    parents?: Array<{
        id: string;
        type: ResourceType;
    }>;
}
export interface ResourceList {
    items: Array<{
        createdAt: string;
        extraFields?: Record<string, unknown>;
        id: string;
        name: string | null;
        parents?: Array<{
            id: string;
            type: ResourceType;
        }>;
        type: ResourceType;
    }>;
    limit: number;
    page: number;
    total: number;
}
export type ResourceType = string;
export interface ResourceUpdateBody {
    extraFields?: Record<string, unknown>;
    parents?: Array<{
        id: string;
        type: ResourceType;
    }>;
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
    roles: Array<{
        resourceId: string;
        resourceType: ResourceType;
        role: string;
        userId: string;
    }>;
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
        role: {
            resourceId: string;
            resourceType: ResourceType;
            role: string;
            userId: string;
        };
    }>;
    success: boolean;
    summary: {
        failed: number;
        successful: number;
        total: number;
    };
}
export interface RoleCreateBody {
    resourceId: string;
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
export interface SessionUser {
    email: string;
    emailVerified: boolean;
    firstName: string | null;
    id: string;
    lastName: string | null;
}
export interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope?: string;
    token_type: string;
}
export interface User {
    avatarUrl: string | null;
    createdAt: string;
    email: string;
    emailVerified: boolean;
    environmentId: string;
    firstName: string | null;
    id: string;
    lastLoginAt: string | null;
    lastName: string | null;
    lookupKey: string;
    updatedAt: string;
}
export interface UserCreateBody {
    avatarUrl?: string;
    email: string;
    firstName?: string;
    key: string;
    lastName?: string;
    password: string;
}
export interface UserList {
    items: Array<{
        avatarUrl: string | null;
        createdAt: string;
        email: string;
        emailVerified: boolean;
        environmentId: string;
        firstName: string | null;
        id: string;
        lastLoginAt: string | null;
        lastName: string | null;
        lookupKey: string;
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
        parents: Array<{
            id: string;
            type: ResourceType;
        }>;
        type: ResourceType;
    };
    role: string;
}>;
export interface UserUpdateBody {
    avatarUrl?: string | null;
    email?: string;
    firstName?: string | null;
    key?: string;
    lastName?: string | null;
    password?: string;
}
export interface ResourcesListQuery {
    limit?: number;
    page?: number;
    search?: string;
}
export interface RolesListQuery {
    limit?: number;
    page?: number;
    resourceId?: string;
    resourceType?: ResourceType;
    role?: string;
}
export interface UsersListQuery {
    limit?: number;
    page?: number;
    search?: string;
}
