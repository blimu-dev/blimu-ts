// Generated zod schemas from OpenAPI components.schemas
// Use these schemas for runtime validation in forms, API requests, etc.

import { z } from 'zod';

/**
 * Zod schema for ApiKeyCreateDto
 */
export const ApiKeyCreateDtoSchema = z.object({ environmentId: z.string(), name: z.string() });

/**
 * Zod schema for ApiKeyDto_Output
 */
export const ApiKeyDto_OutputSchema = z.object({
  createdAt: z.iso.datetime(),
  id: z.string(),
  isActive: z.boolean(),
  key: z.string(),
  name: z.string(),
  updatedAt: z.iso.datetime(),
  workspaceId: z.string(),
});

/**
 * Zod schema for ApiKeyListDto_Output
 */
export const ApiKeyListDto_OutputSchema = z.object({
  data: z
    .object({
      createdAt: z.iso.datetime(),
      id: z.string(),
      isActive: z.boolean(),
      key: z.string(),
      name: z.string(),
      updatedAt: z.iso.datetime(),
      workspaceId: z.string(),
    })
    .array(),
  total: z.number(),
});

/**
 * Zod schema for ApiKeyRevealDto_Output
 */
export const ApiKeyRevealDto_OutputSchema = z.object({
  createdAt: z.iso.datetime(),
  environmentId: z.string(),
  id: z.string(),
  isActive: z.boolean(),
  key: z.string(),
  name: z.string(),
  updatedAt: z.iso.datetime(),
  workspaceId: z.string(),
});

/**
 * Zod schema for CustomHostnameListDto_Output
 */
export const CustomHostnameListDto_OutputSchema = z.array(
  z.object({
    createdAt: z.iso.datetime(),
    domain: z.string(),
    environmentId: z.string(),
    errorMessage: z.string().nullable(),
    hostnameId: z.string().nullable(),
    id: z.string(),
    issuedAt: z.iso.datetime().nullable(),
    provider: z.string(),
    retryCount: z.number().int(),
    status: z.enum(['PENDING', 'PROVISIONING', 'ACTIVE', 'RENEWING', 'FAILED', 'EXPIRED']),
    updatedAt: z.iso.datetime(),
  })
);

/**
 * Zod schema for DefinitionDto_Output
 */
export const DefinitionDto_OutputSchema = z.object({
  entitlements: z
    .record(
      z.string(),
      z.object({
        limit: z.string().optional(),
        plans: z.string().array().optional(),
        roles: z.string().array(),
      })
    )
    .optional(),
  features: z
    .record(
      z.string(),
      z.object({
        entitlements: z.string().array().optional(),
        name: z.string(),
        summary: z.string().optional(),
      })
    )
    .optional(),
  plans: z
    .record(
      z.string(),
      z.object({
        billing: z
          .object({
            features: z
              .object({
                feature_name: z.string(),
                feature_slug: z.string(),
                feature_type: z.enum(['boolean', 'usage', 'seat']),
                included_quantity: z.number().int().optional(),
                included_usage: z.number().int().optional(),
                item_type: z.enum(['included', 'addon', 'usage', 'credit', 'seat']),
                limit_type: z.string().optional(),
              })
              .array()
              .optional(),
            prices: z
              .object({
                amount: z.number().int(),
                currency: z.string(),
                interval: z.enum(['month', 'year']),
              })
              .array()
              .optional(),
            slug: z.string(),
          })
          .optional(),
        name: z.string(),
        resource_limits: z.record(z.string(), z.number().int()).optional(),
        summary: z.string().optional(),
        usage_based_limits: z
          .record(
            z.string(),
            z.object({
              period: z.enum(['monthly', 'yearly', 'lifetime']),
              value: z.number().int(),
            })
          )
          .optional(),
      })
    )
    .optional(),
  resources: z
    .record(
      z.string(),
      z.object({
        is_tenant: z.boolean().optional(),
        parents: z
          .record(
            z.string(),
            z.object({
              required: z.boolean(),
            })
          )
          .optional(),
        roles: z.string().array(),
        roles_inheritance: z.record(z.string(), z.string().array()).optional(),
      })
    )
    .optional(),
});

/**
 * Zod schema for DefinitionUpdateDto
 */
export const DefinitionUpdateDtoSchema = z.object({
  entitlements: z
    .record(
      z.string(),
      z.object({
        limit: z.string().optional(),
        plans: z.string().array().optional(),
        roles: z.string().array(),
      })
    )
    .optional(),
  features: z
    .record(
      z.string(),
      z.object({
        entitlements: z.string().array().optional(),
        name: z.string(),
        summary: z.string().optional(),
      })
    )
    .optional(),
  plans: z
    .record(
      z.string(),
      z.object({
        billing: z
          .object({
            features: z
              .object({
                feature_name: z.string(),
                feature_slug: z.string(),
                feature_type: z.enum(['boolean', 'usage', 'seat']),
                included_quantity: z.number().int().optional(),
                included_usage: z.number().int().optional(),
                item_type: z.enum(['included', 'addon', 'usage', 'credit', 'seat']),
                limit_type: z.string().optional(),
              })
              .array()
              .optional(),
            prices: z
              .object({
                amount: z.number().int(),
                currency: z.string(),
                interval: z.enum(['month', 'year']),
              })
              .array()
              .optional(),
            slug: z.string(),
          })
          .optional(),
        name: z.string(),
        resource_limits: z.record(z.string(), z.number().int()).optional(),
        summary: z.string().optional(),
        usage_based_limits: z
          .record(
            z.string(),
            z.object({
              period: z.enum(['monthly', 'yearly', 'lifetime']),
              value: z.number().int(),
            })
          )
          .optional(),
      })
    )
    .optional(),
  resources: z
    .record(
      z.string(),
      z.object({
        is_tenant: z.boolean().optional(),
        parents: z
          .record(
            z.string(),
            z.object({
              required: z.boolean(),
            })
          )
          .optional(),
        roles: z.string().array(),
        roles_inheritance: z.record(z.string(), z.string().array()).optional(),
      })
    )
    .optional(),
});

/**
 * Zod schema for DefinitionValidateRequestDto
 */
export const DefinitionValidateRequestDtoSchema = z.object({
  entitlements: z
    .record(
      z.string(),
      z.object({
        plans: z.string().array().optional(),
        roles: z.string().array().optional(),
      })
    )
    .optional(),
  features: z
    .record(
      z.string(),
      z.object({
        default_enabled: z.boolean().optional(),
        entitlements: z.string().array().optional(),
        plans: z.string().array().optional(),
      })
    )
    .optional(),
  plans: z
    .record(
      z.string(),
      z.object({
        description: z.string(),
        name: z.string(),
      })
    )
    .optional(),
  resources: z.record(
    z.string(),
    z.object({
      parents: z
        .record(
          z.string(),
          z.object({
            required: z.boolean(),
          })
        )
        .optional(),
      roles: z.string().array(),
      roles_inheritance: z.record(z.string(), z.string().array()).optional(),
    })
  ),
  version: z.string().optional(),
});

/**
 * Zod schema for DefinitionValidateResponseDto_Output
 */
export const DefinitionValidateResponseDto_OutputSchema = z.object({
  errors: z
    .object({
      field: z.string(),
      message: z.string(),
      resource: z.string(),
    })
    .array(),
  spec: z.record(z.string(), z.unknown()).optional(),
  valid: z.boolean(),
});

/**
 * Zod schema for DnsRecordListDto_Output
 */
export const DnsRecordListDto_OutputSchema = z.array(
  z.object({
    actualValue: z.string().nullable(),
    expectedValue: z.string(),
    hostname: z.string(),
    id: z.string(),
    lastCheckedAt: z.iso.datetime().nullable(),
    name: z.string(),
    recordType: z.string(),
    status: z.enum(['PENDING', 'VERIFIED', 'FAILED', 'UNHEALTHY']),
    verifiedAt: z.iso.datetime().nullable(),
  })
);

/**
 * Zod schema for EnvironmentAuthConfigDto_Output
 */
export const EnvironmentAuthConfigDto_OutputSchema = z.object({
  authMethod: z.enum(['code', 'password', 'both']).optional(),
  codeExpirationMinutes: z.number().int().optional(),
  maxCodeAttempts: z.number().int().optional(),
  requireEmailVerification: z.boolean().optional(),
});

/**
 * Zod schema for EnvironmentAuthConfigUpdateDto
 */
export const EnvironmentAuthConfigUpdateDtoSchema = z.object({
  authMethod: z.enum(['code', 'password', 'both']).optional(),
  codeExpirationMinutes: z.number().int().optional(),
  maxCodeAttempts: z.number().int().optional(),
  requireEmailVerification: z.boolean().optional(),
});

/**
 * Zod schema for EnvironmentCreateDto
 */
export const EnvironmentCreateDtoSchema = z.object({
  cloneFromEnvironmentId: z.string().optional(),
  domain: z.string().optional(),
  lookupKey: z.string().optional(),
  name: z.string(),
  variant: z.enum(['TEST', 'LIVE']).optional(),
});

/**
 * Zod schema for EnvironmentDto_Output
 */
export const EnvironmentDto_OutputSchema = z.object({
  createdAt: z.iso.datetime(),
  domain: z.string(),
  domainStatus: z
    .enum(['PENDING', 'VALIDATING', 'VERIFIED', 'FAILED', 'TIMED_OUT', 'UNHEALTHY'])
    .optional(),
  id: z.string(),
  isAccessible: z.boolean().optional(),
  lookupKey: z.string().nullable(),
  name: z.string(),
  sslStatus: z
    .enum(['PENDING', 'PROVISIONING', 'ACTIVE', 'RENEWING', 'FAILED', 'EXPIRED'])
    .optional(),
  updatedAt: z.iso.datetime(),
  variant: z.enum(['TEST', 'LIVE']),
  workspaceId: z.string(),
});

/**
 * Zod schema for EnvironmentListDto_Output
 */
export const EnvironmentListDto_OutputSchema = z.object({
  data: z
    .object({
      createdAt: z.iso.datetime(),
      domain: z.string(),
      domainStatus: z
        .enum(['PENDING', 'VALIDATING', 'VERIFIED', 'FAILED', 'TIMED_OUT', 'UNHEALTHY'])
        .optional(),
      id: z.string(),
      isAccessible: z.boolean().optional(),
      lookupKey: z.string().nullable(),
      name: z.string(),
      sslStatus: z
        .enum(['PENDING', 'PROVISIONING', 'ACTIVE', 'RENEWING', 'FAILED', 'EXPIRED'])
        .optional(),
      updatedAt: z.iso.datetime(),
      variant: z.enum(['TEST', 'LIVE']),
      workspaceId: z.string(),
    })
    .array(),
  meta: z.object({
    limit: z.number(),
    page: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

/**
 * Zod schema for EnvironmentUpdateDto
 */
export const EnvironmentUpdateDtoSchema = z.object({
  lookupKey: z.string().optional(),
  name: z.string().optional(),
});

/**
 * Zod schema for EnvironmentWithDefinitionDto_Output
 */
export const EnvironmentWithDefinitionDto_OutputSchema = z.object({
  createdAt: z.iso.datetime(),
  definition: z
    .object({
      entitlements: z
        .record(
          z.string(),
          z.object({
            limit: z.string().optional(),
            plans: z.string().array().optional(),
            roles: z.string().array(),
          })
        )
        .optional(),
      features: z
        .record(
          z.string(),
          z.object({
            entitlements: z.string().array().optional(),
            name: z.string(),
            summary: z.string().optional(),
          })
        )
        .optional(),
      plans: z
        .record(
          z.string(),
          z.object({
            billing: z
              .object({
                features: z
                  .object({
                    feature_name: z.string(),
                    feature_slug: z.string(),
                    feature_type: z.enum(['boolean', 'usage', 'seat']),
                    included_quantity: z.number().int().optional(),
                    included_usage: z.number().int().optional(),
                    item_type: z.enum(['included', 'addon', 'usage', 'credit', 'seat']),
                    limit_type: z.string().optional(),
                  })
                  .array()
                  .optional(),
                prices: z
                  .object({
                    amount: z.number().int(),
                    currency: z.string(),
                    interval: z.enum(['month', 'year']),
                  })
                  .array()
                  .optional(),
                slug: z.string(),
              })
              .optional(),
            name: z.string(),
            resource_limits: z.record(z.string(), z.number().int()).optional(),
            summary: z.string().optional(),
            usage_based_limits: z
              .record(
                z.string(),
                z.object({
                  period: z.enum(['monthly', 'yearly', 'lifetime']),
                  value: z.number().int(),
                })
              )
              .optional(),
          })
        )
        .optional(),
      resources: z
        .record(
          z.string(),
          z.object({
            is_tenant: z.boolean().optional(),
            parents: z
              .record(
                z.string(),
                z.object({
                  required: z.boolean(),
                })
              )
              .optional(),
            roles: z.string().array(),
            roles_inheritance: z.record(z.string(), z.string().array()).optional(),
          })
        )
        .optional(),
    })
    .nullable(),
  domain: z.string(),
  domainStatus: z
    .enum(['PENDING', 'VALIDATING', 'VERIFIED', 'FAILED', 'TIMED_OUT', 'UNHEALTHY'])
    .optional(),
  id: z.string(),
  isAccessible: z.boolean().optional(),
  lookupKey: z.string().nullable(),
  name: z.string(),
  sslStatus: z
    .enum(['PENDING', 'PROVISIONING', 'ACTIVE', 'RENEWING', 'FAILED', 'EXPIRED'])
    .optional(),
  updatedAt: z.iso.datetime(),
  variant: z.enum(['TEST', 'LIVE']),
  workspaceId: z.string(),
});

/**
 * Zod schema for InviteMemberDto
 */
export const InviteMemberDtoSchema = z.object({
  email: z.email(),
  role: z.enum(['admin', 'owner', 'member']),
});

/**
 * Zod schema for InviteMemberResponseDto_Output
 */
export const InviteMemberResponseDto_OutputSchema = z.object({ id: z.string() });

/**
 * Zod schema for MemberListResponseDto_Output
 */
export const MemberListResponseDto_OutputSchema = z.object({
  items: z
    .object({
      avatarUrl: z.string().nullable(),
      createdAt: z.string(),
      email: z.string(),
      firstName: z.string().nullable(),
      invitationId: z.string().nullable().optional(),
      lastName: z.string().nullable(),
      role: z.enum(['admin', 'owner', 'member']),
      status: z.enum(['active', 'pending']),
      userId: z.string(),
    })
    .array(),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
});

/**
 * Zod schema for ResourceCreateDto
 */
export const ResourceCreateDtoSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  parents: z
    .object({
      id: z.string(),
      type: z.string(),
    })
    .array()
    .optional(),
  type: z.string(),
});

/**
 * Zod schema for ResourceDto_Output
 */
export const ResourceDto_OutputSchema = z.object({
  createdAt: z.string(),
  id: z.string(),
  name: z.string().nullable(),
  parents: z
    .object({
      id: z.string(),
      type: z.string(),
    })
    .array()
    .optional(),
  type: z.string(),
});

/**
 * Zod schema for ResourceListResponseDto_Output
 */
export const ResourceListResponseDto_OutputSchema = z.object({
  items: z
    .object({
      createdAt: z.string(),
      id: z.string(),
      name: z.string().nullable(),
      parents: z
        .object({
          id: z.string(),
          type: z.string(),
        })
        .array()
        .optional(),
      type: z.string(),
    })
    .array(),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
});

/**
 * Zod schema for ResourceUpdateDto
 */
export const ResourceUpdateDtoSchema = z.object({
  name: z.string().optional(),
  parents: z
    .object({
      id: z.string(),
      type: z.string(),
    })
    .array()
    .optional(),
});

/**
 * Zod schema for ResourceUserListResponseDto_Output
 */
export const ResourceUserListResponseDto_OutputSchema = z.object({
  items: z
    .object({
      inherited: z.boolean(),
      role: z.string(),
      user: z.object({
        avatarUrl: z.string().nullable(),
        createdAt: z.string(),
        email: z.string(),
        emailVerified: z.boolean(),
        firstName: z.string().nullable(),
        id: z.string(),
        lastLoginAt: z.string().nullable(),
        lastName: z.string().nullable(),
        updatedAt: z.string(),
      }),
      userId: z.string(),
    })
    .array(),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
});

/**
 * Zod schema for SslStatusResponseDto_Output
 */
export const SslStatusResponseDto_OutputSchema = z.object({
  certificates: z
    .object({
      createdAt: z.iso.datetime(),
      domain: z.string(),
      environmentId: z.string(),
      errorMessage: z.string().nullable(),
      hostnameId: z.string().nullable(),
      id: z.string(),
      issuedAt: z.iso.datetime().nullable(),
      provider: z.string(),
      retryCount: z.number().int(),
      status: z.enum(['PENDING', 'PROVISIONING', 'ACTIVE', 'RENEWING', 'FAILED', 'EXPIRED']),
      updatedAt: z.iso.datetime(),
    })
    .array(),
  sslIssuedAt: z.iso.datetime().nullable(),
  status: z.enum(['PENDING', 'PROVISIONING', 'ACTIVE', 'RENEWING', 'FAILED', 'EXPIRED']),
});

/**
 * Zod schema for UpdateRoleDto
 */
export const UpdateRoleDtoSchema = z.object({ role: z.enum(['admin', 'owner', 'member']) });

/**
 * Zod schema for UserAccessDto_Output
 */
export const UserAccessDto_OutputSchema = z.object({
  roles: z.record(z.string(), z.string()),
  workspaces: z
    .object({
      environments: z
        .object({
          id: z.string(),
          name: z.string(),
          type: z.enum(['environment']),
          variant: z.enum(['TEST', 'LIVE']),
        })
        .array(),
      id: z.string(),
      name: z.string(),
      type: z.enum(['workspace']),
    })
    .array(),
});

/**
 * Zod schema for UserDto_Output
 */
export const UserDto_OutputSchema = z.object({
  avatarUrl: z.string().nullable(),
  createdAt: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  firstName: z.string().nullable(),
  id: z.string(),
  lastLoginAt: z.string().nullable(),
  lastName: z.string().nullable(),
  updatedAt: z.string(),
});

/**
 * Zod schema for UserListResponseDto_Output
 */
export const UserListResponseDto_OutputSchema = z.object({
  items: z
    .object({
      avatarUrl: z.string().nullable(),
      createdAt: z.string(),
      email: z.string(),
      emailVerified: z.boolean(),
      firstName: z.string().nullable(),
      id: z.string(),
      lastLoginAt: z.string().nullable(),
      lastName: z.string().nullable(),
      updatedAt: z.string(),
    })
    .array(),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
});

/**
 * Zod schema for UserResourceDto_Output
 */
export const UserResourceDto_OutputSchema = z.object({
  inherited: z.boolean(),
  name: z.string(),
  parentIds: z.string().array(),
  resourceId: z.string(),
  resourceType: z.string(),
  role: z.string(),
});

/**
 * Zod schema for WorkspaceCreateDto
 */
export const WorkspaceCreateDtoSchema = z.object({ key: z.string().optional(), name: z.string() });

/**
 * Zod schema for WorkspaceCreateResponseDto_Output
 */
export const WorkspaceCreateResponseDto_OutputSchema = z.object({
  createdAt: z.iso.datetime(),
  environments: z
    .object({
      createdAt: z.iso.datetime(),
      domain: z.string(),
      domainStatus: z
        .enum(['PENDING', 'VALIDATING', 'VERIFIED', 'FAILED', 'TIMED_OUT', 'UNHEALTHY'])
        .optional(),
      id: z.string(),
      isAccessible: z.boolean().optional(),
      lookupKey: z.string().nullable(),
      name: z.string(),
      sslStatus: z
        .enum(['PENDING', 'PROVISIONING', 'ACTIVE', 'RENEWING', 'FAILED', 'EXPIRED'])
        .optional(),
      updatedAt: z.iso.datetime(),
      variant: z.enum(['TEST', 'LIVE']),
      workspaceId: z.string(),
    })
    .array(),
  id: z.string(),
  name: z.string(),
  updatedAt: z.iso.datetime(),
});

/**
 * Zod schema for WorkspaceDto_Output
 */
export const WorkspaceDto_OutputSchema = z.object({
  createdAt: z.iso.datetime(),
  id: z.string(),
  name: z.string(),
  updatedAt: z.iso.datetime(),
});

/**
 * Zod schema for WorkspaceListDto_Output
 */
export const WorkspaceListDto_OutputSchema = z.object({
  data: z
    .object({
      createdAt: z.iso.datetime(),
      id: z.string(),
      name: z.string(),
      updatedAt: z.iso.datetime(),
    })
    .array(),
  total: z.number(),
});

/**
 * Zod schema for WorkspaceUpdateDto
 */
export const WorkspaceUpdateDtoSchema = z.object({ name: z.string() });

// Operation query parameter schemas

/**
 * Schema for query params of Environments.List
 */
export const EnvironmentsListQuerySchema = z.object({
  limit: z.number().int().optional(),
  page: z.number().int().optional(),
  search: z.string().optional(),
});

/**
 * Schema for query params of Resources.List
 */
export const ResourcesListQuerySchema = z.object({
  limit: z.number().optional(),
  page: z.number().optional(),
  parent: z.string().optional(),
  search: z.string().optional(),
  type: z.string(),
});

/**
 * Schema for query params of Resources.ListChildren
 */
export const ResourcesListChildrenQuerySchema = z.object({
  limit: z.number().optional(),
  page: z.number().optional(),
  parent: z.string().optional(),
  search: z.string().optional(),
  type: z.string(),
});

/**
 * Schema for query params of Resources.GetResourceUsers
 */
export const ResourcesGetResourceUsersQuerySchema = z.object({
  limit: z.number().optional(),
  page: z.number().optional(),
  search: z.string().optional(),
});

/**
 * Schema for query params of Users.List
 */
export const UsersListQuerySchema = z.object({
  limit: z.number().optional(),
  page: z.number().optional(),
  search: z.string().optional(),
});

/**
 * Schema for query params of Workspace Members.List
 */
export const WorkspaceMembersListQuerySchema = z.object({
  limit: z.number().optional(),
  page: z.number().optional(),
  search: z.string().optional(),
});
