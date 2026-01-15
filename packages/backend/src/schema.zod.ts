// Generated zod schemas from OpenAPI components.schemas
// Use these schemas for runtime validation in forms, API requests, etc.

import { z } from 'zod';

/**
 * Schema for EntitlementType
 * Entitlement identifier
 */
export const EntitlementTypeSchema = z.string();
/**
 * Schema for LimitType
 * Limit type identifier
 */
export const LimitTypeSchema = z.string();
/**
 * Schema for PlanType
 * Plan type identifier
 */
export const PlanTypeSchema = z.string();
/**
 * Schema for ResourceType
 * Resource type identifier
 */
export const ResourceTypeSchema = z.string();
/**
 * Schema for UsageLimitType
 * Usage-based limit type identifier
 */
export const UsageLimitTypeSchema = z.string();

/**
 * Zod schema for BalanceResponse*/
export const BalanceResponseSchema = z.object({ balance: z.number() }); /**
 * Zod schema for CheckLimitResponse*/
export const CheckLimitResponseSchema = z.object({
  allowed: z.boolean(),
  current: z.number(),
  remaining: z.number().optional(),
  requested: z.number(),
}); /**
 * Zod schema for EntitlementCheckBody*/
export const EntitlementCheckBodySchema = z.object({
  amount: z.number().int().optional(),
  entitlement: EntitlementTypeSchema,
  resourceId: z.string(),
  userId: z.string(),
}); /**
 * Zod schema for EntitlementCheckResult*/
export const EntitlementCheckResultSchema = z.object({
  allowed: z.boolean(),
  limit: z
    .object({
      allowed: z.boolean(),
      current: z.number().optional(),
      limit: z.number().optional(),
      plan: z.string().nullable().optional(),
      reason: z.string().optional(),
      remaining: z.number().optional(),
      scope: z.string().optional(),
    })
    .nullable()
    .optional(),
  plans: z
    .object({
      allowed: z.boolean(),
      allowedPlans: z.array(z.string()).optional(),
      plan: z.string().nullable().optional(),
      reason: z.string().optional(),
    })
    .nullable()
    .optional(),
  roles: z
    .object({
      allowed: z.boolean(),
      allowedRoles: z.array(z.string()).optional(),
      reason: z.string().optional(),
      userRoles: z.array(z.string()).optional(),
    })
    .nullable()
    .optional(),
}); /**
 * Zod schema for EntitlementsListResult*/
export const EntitlementsListResultSchema = z.object({
  results: z.array(
    z.object({
      entitlements: z.array(
        z.object({
          allowed: z.boolean(),
          allowedByPlan: z.boolean(),
          allowedByRole: z.boolean(),
          allowedPlans: z.array(z.string()).optional(),
          allowedRoles: z.array(z.string()),
          currentPlan: z.string().optional(),
          currentRole: z.string().optional(),
          entitlement: EntitlementTypeSchema,
        })
      ),
      resourceId: z.string(),
      resourceType: ResourceTypeSchema,
    })
  ),
}); /**
 * Zod schema for PlanAssignBody*/
export const PlanAssignBodySchema = z.object({ planKey: PlanTypeSchema }); /**
 * Zod schema for PlanDeleteResponse*/
export const PlanDeleteResponseSchema = z.object({ success: z.boolean() }); /**
 * Zod schema for PlanResponse*/
export const PlanResponseSchema = z.object({
  createdAt: z.string().datetime(),
  environmentId: z.string(),
  planKey: PlanTypeSchema,
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  updatedAt: z.string().datetime(),
}); /**
 * Zod schema for Resource*/
export const ResourceSchema = z.object({
  createdAt: z.string().datetime(),
  id: z.string(),
  name: z.string().nullable(),
  parents: z
    .array(
      z.object({
        id: z.string(),
        type: ResourceTypeSchema,
      })
    )
    .optional(),
  type: ResourceTypeSchema,
}); /**
 * Zod schema for ResourceBulkCreateBody*/
export const ResourceBulkCreateBodySchema = z.object({
  resources: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      parents: z
        .array(
          z.object({
            id: z.string(),
            type: ResourceTypeSchema,
          })
        )
        .optional(),
      roles: z
        .array(
          z.object({
            role: z.string(),
            userId: z.string(),
          })
        )
        .optional(),
    })
  ),
}); /**
 * Zod schema for ResourceBulkResult*/
export const ResourceBulkResultSchema = z.object({
  created: z.array(
    z.object({
      environmentId: z.string(),
      id: z.string(),
      type: ResourceTypeSchema,
    })
  ),
  errors: z.array(
    z.object({
      error: z.string(),
      index: z.number(),
      resource: z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        parents: z
          .array(
            z.object({
              id: z.string(),
              type: ResourceTypeSchema,
            })
          )
          .optional(),
        roles: z
          .array(
            z.object({
              role: z.string(),
              userId: z.string(),
            })
          )
          .optional(),
      }),
    })
  ),
  success: z.boolean(),
  summary: z.object({
    failed: z.number(),
    successful: z.number(),
    total: z.number(),
  }),
}); /**
 * Zod schema for ResourceCreateBody*/
export const ResourceCreateBodySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  parents: z
    .array(
      z.object({
        id: z.string(),
        type: ResourceTypeSchema,
      })
    )
    .optional(),
  roles: z
    .array(
      z.object({
        role: z.string(),
        userId: z.string(),
      })
    )
    .optional(),
}); /**
 * Zod schema for ResourceList*/
export const ResourceListSchema = z.object({
  items: z.array(
    z.object({
      createdAt: z.string().datetime(),
      id: z.string(),
      name: z.string().nullable(),
      parents: z
        .array(
          z.object({
            id: z.string(),
            type: ResourceTypeSchema,
          })
        )
        .optional(),
      type: ResourceTypeSchema,
    })
  ),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
}); /**
 * Zod schema for ResourceMemberList*/
export const ResourceMemberListSchema = z.object({
  items: z.array(
    z.object({
      inherited: z.boolean(),
      role: z.string(),
      user: z.object({
        avatarUrl: z.string().nullable(),
        createdAt: z.string().datetime(),
        email: z.string().email(),
        emailVerified: z.boolean(),
        firstName: z.string().nullable(),
        id: z.string(),
        lastLoginAt: z.string().datetime().nullable(),
        lastName: z.string().nullable(),
        lookupKey: z.string().nullable(),
        updatedAt: z.string().datetime(),
      }),
      userId: z.string(),
    })
  ),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
}); /**
 * Zod schema for ResourceUpdateBody*/
export const ResourceUpdateBodySchema = z.object({
  name: z.string().optional(),
  /** Creates relationships with other resources. Parent resources must already exist. */ parents:
    z
      .array(
        z.object({
          id: z.string(),
          type: ResourceTypeSchema,
        })
      )
      .optional(),
}); /**
 * Zod schema for Role*/
export const RoleSchema = z.object({
  createdAt: z.string(),
  environmentId: z.string(),
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  role: z.string(),
  userId: z.string(),
}); /**
 * Zod schema for RoleBulkCreateBody*/
export const RoleBulkCreateBodySchema = z.object({
  roles: z.array(
    z.object({
      resourceId: z.string(),
      resourceType: ResourceTypeSchema,
      role: z.string(),
      userId: z.string(),
    })
  ),
}); /**
 * Zod schema for RoleBulkResult*/
export const RoleBulkResultSchema = z.object({
  created: z.array(
    z.object({
      createdAt: z.string(),
      environmentId: z.string(),
      resourceId: z.string(),
      resourceType: ResourceTypeSchema,
      role: z.string(),
      userId: z.string(),
    })
  ),
  errors: z.array(
    z.object({
      error: z.string(),
      index: z.number(),
      role: z.object({
        resourceId: z.string(),
        resourceType: ResourceTypeSchema,
        role: z.string(),
        userId: z.string(),
      }),
    })
  ),
  success: z.boolean(),
  summary: z.object({
    failed: z.number(),
    successful: z.number(),
    total: z.number(),
  }),
}); /**
 * Zod schema for RoleCreateBody*/
export const RoleCreateBodySchema = z.object({
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  role: z.string(),
}); /**
 * Zod schema for RoleList*/
export const RoleListSchema = z.object({
  limit: z.number(),
  page: z.number(),
  roles: z.array(
    z.object({
      createdAt: z.string(),
      environmentId: z.string(),
      resourceId: z.string(),
      resourceType: ResourceTypeSchema,
      role: z.string(),
      userId: z.string(),
    })
  ),
  total: z.number(),
}); /**
 * Zod schema for TransactionHistoryResponse*/
export const TransactionHistoryResponseSchema = z.object({
  items: z.array(
    z.object({
      amount: z.number().int(),
      createdAt: z.string().datetime(),
      environmentId: z.string(),
      id: z.string(),
      limitType: LimitTypeSchema,
      resourceId: z.string(),
      resourceType: ResourceTypeSchema,
      tags: z.record(z.string(), z.unknown()).nullable(),
    })
  ),
}); /**
 * Zod schema for UsageCheckBody*/
export const UsageCheckBodySchema = z.object({
  amount: z.number().int(),
  limitType: UsageLimitTypeSchema,
  period: z.enum(['monthly', 'yearly', 'lifetime']),
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
}); /**
 * Zod schema for UsageConsumeBody*/
export const UsageConsumeBodySchema = z.object({
  amount: z.number().int(),
  limitType: UsageLimitTypeSchema,
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  tags: z.record(z.string(), z.unknown()).optional(),
}); /**
 * Zod schema for UsageCreditBody*/
export const UsageCreditBodySchema = z.object({
  amount: z.number().int(),
  limitType: UsageLimitTypeSchema,
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  tags: z.record(z.string(), z.unknown()).optional(),
}); /**
 * Zod schema for UsageWalletResponse*/
export const UsageWalletResponseSchema = z.object({
  amount: z.number().int(),
  createdAt: z.string().datetime(),
  environmentId: z.string(),
  id: z.string(),
  limitType: UsageLimitTypeSchema,
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  tags: z.record(z.string(), z.unknown()).nullable(),
}); /**
 * Zod schema for User*/
export const UserSchema = z.object({
  avatarUrl: z.string().nullable(),
  createdAt: z.string().datetime(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  firstName: z.string().nullable(),
  id: z.string(),
  lastLoginAt: z.string().datetime().nullable(),
  lastName: z.string().nullable(),
  lookupKey: z.string().nullable(),
  updatedAt: z.string().datetime(),
}); /**
 * Zod schema for UserCreateBody*/
export const UserCreateBodySchema = z.object({
  avatarUrl: z.string().url().optional(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  lookupKey: z.string(),
  newUser: z.boolean().nullable().optional(),
  password: z.string().nullable().optional(),
}); /**
 * Zod schema for UserList*/
export const UserListSchema = z.object({
  items: z.array(
    z.object({
      avatarUrl: z.string().nullable(),
      createdAt: z.string().datetime(),
      email: z.string().email(),
      emailVerified: z.boolean(),
      firstName: z.string().nullable(),
      id: z.string(),
      lastLoginAt: z.string().datetime().nullable(),
      lastName: z.string().nullable(),
      lookupKey: z.string().nullable(),
      updatedAt: z.string().datetime(),
    })
  ),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
}); /**
 * Zod schema for UserResourceList*/
export const UserResourceListSchema = z.array(
  z.object({
    inherited: z.boolean(),
    resource: z
      .object({
        id: z.string(),
        name: z.string(),
        parents: z.array(
          z.object({
            id: z.string(),
            type: ResourceTypeSchema,
          })
        ),
        type: ResourceTypeSchema,
      })
      .catchall(z.unknown()),
    role: z.string(),
  })
); /**
 * Zod schema for UserUpdateBody*/
export const UserUpdateBodySchema = z.object({
  avatarUrl: z.string().url().nullable().optional(),
  email: z.string().email().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  lookupKey: z.string().optional(),
  password: z.string().optional(),
});
// Operation query parameter schemas

/**
 * Schema for query params of Entitlements.ListForResource* Returns entitlements for a specific resource and user. Only evaluates roles and plans (excludes limits). Provides detailed information about why entitlements are allowed or denied, including current roles, allowed roles, current plan, and allowed plans. Results are cached per resource for performance.*/
export const EntitlementsListForResourceQuerySchema = z.object({
  /** The unique identifier of the user */ userId: z.string(),
});

/**
 * Schema for query params of Entitlements.ListForTenant* Returns entitlements for a tenant resource and all its descendant resources. This endpoint scopes queries to a single tenant, preventing cross-tenant data access. Only evaluates roles and plans (excludes limits). Results are cached per resource for performance. The tenant resource type is automatically determined from the environment definition (resource marked as `is_tenant: true`).*/
export const EntitlementsListForTenantQuerySchema = z.object({
  /** The unique identifier of the user */ userId: z.string(),
});

/**
 * Schema for query params of Resource Members.List* Retrieves a paginated list of users who have roles (direct or inherited) on the specified resource. Supports search functionality to filter users by email or name.*/
export const ResourceMembersListQuerySchema = z.object({
  /** Number of items per page (minimum: 1, maximum: 100) */ limit: z
    .number()
    .optional(),
  /** Page number for pagination */ page: z.number().optional(),
  /** Search query to filter members by email or name */ search: z
    .string()
    .optional(),
});

/**
 * Schema for query params of Resources.List* Retrieves a paginated list of resources of the specified type. Supports search and filtering. Resources are returned with their parent relationships and metadata.*/
export const ResourcesListQuerySchema = z.object({
  /** Number of items per page (minimum: 1, maximum: 100) */ limit: z
    .number()
    .optional(),
  /** Page number for pagination */ page: z.number().optional(),
  /** Search query to filter resources by name */ search: z.string().optional(),
});

/**
 * Schema for query params of Roles.List* Retrieves a paginated list of roles assigned to a user. Supports filtering by resource type, resource ID, and role name. Returns both directly assigned roles and inherited roles.*/
export const RolesListQuerySchema = z.object({
  /** Number of items per page (minimum: 1, maximum: 100) */ limit: z
    .number()
    .optional(),
  /** Page number for pagination */ page: z.number().optional(),
  /** Filter roles by specific resource ID */ resourceId: z.string().optional(),
  /** Filter roles by resource type */ resourceType:
    ResourceTypeSchema.optional(),
  /** Filter by role name */ role: z.string().optional(),
});

/**
 * Schema for query params of Usage.GetBalance* Retrieves the current balance of a usage wallet for a specific resource and limit type within a given time period. The balance reflects all credits and consumption transactions.*/
export const UsageGetBalanceQuerySchema = z.object({
  /** Time period for the balance calculation */ period: z.enum([
    'monthly',
    'yearly',
    'lifetime',
  ]),
});

/**
 * Schema for query params of Usage.GetTransactionHistory* Retrieves the transaction history for a usage wallet, including all credits and consumption records. Supports filtering by time period and date range.*/
export const UsageGetTransactionHistoryQuerySchema = z.object({
  /** End date for filtering transactions (ISO 8601 format) */ endDate: z
    .string()
    .optional(),
  /** Time period for filtering transactions */ period: z
    .enum(['monthly', 'yearly', 'lifetime'])
    .optional(),
  /** Start date for filtering transactions (ISO 8601 format) */ startDate: z
    .string()
    .optional(),
});

/**
 * Schema for query params of Users.List* Retrieves a paginated list of users in your environment. Supports search functionality to filter users by email, name, or lookup key.*/
export const UsersListQuerySchema = z.object({
  /** Number of items per page (minimum: 1, maximum: 100) */ limit: z
    .number()
    .optional(),
  /** Page number for pagination */ page: z.number().optional(),
  /** Search query to filter users by email, name, or lookup key */ search: z
    .string()
    .optional(),
});
