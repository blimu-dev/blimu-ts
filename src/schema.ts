// Generated types from OpenAPI components.schemas

export type Enum<T> = T[keyof T];
export namespace Schema {
  export interface EntitlementCheckBody {
    /** Entitlement identifier */
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
  /**
   * Entitlement identifier
   */
  export type EntitlementType = string;
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
    }>;
  }
  export interface ResourceBulkResult {
    created: Array<{ environmentId: string; id: string; type: ResourceType }>;
    errors: Array<{
      error: string;
      index: number;
      resource: { id?: string; name?: string; parents?: Array<{ id: string; type: ResourceType }> };
    }>;
    success: boolean;
    summary: { failed: number; successful: number; total: number };
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
    extraFields?: Record<string, unknown>;
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
   * Query params for Users.List
   */
  export interface UsersListQuery {
    limit?: number;
    page?: number;
    search?: string;
  }
}
