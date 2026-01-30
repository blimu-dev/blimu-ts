// Generated zod schemas from OpenAPI components.schemas
// Use these schemas for runtime validation in forms, API requests, etc.

import { z } from 'zod';

/**
 * Schema for EntitlementType
 * Entitlement identifier
 */
export const EntitlementTypeSchema = z.string();

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
 * Zod schema for AuthorizeRequest
 */
export const AuthorizeRequestSchema = z.object({
  /** Action to take: allow or deny */ action: z.enum(['allow', 'deny']),
  /** True if consent was auto-approved (not required or previously granted) */ auto_approved: z
    .boolean()
    .optional(),
  /** OAuth2 client ID */ client_id: z.string(),
  /** PKCE code challenge */ code_challenge: z.string().optional(),
  /** PKCE code challenge method */ code_challenge_method: z.string().optional(),
  /** Redirect URI */ redirect_uri: z.string(),
  /** Response type (typically "code") */ response_type: z.string(),
  /** Space-separated list of scopes */ scope: z.string().optional(),
  /** State parameter for CSRF protection */ state: z.string().optional(),
  /** True if user explicitly clicked Allow, false if auto-approved */ user_action: z
    .boolean()
    .optional(),
});

/**
 * Zod schema for BalanceResponse
 */
export const BalanceResponseSchema = z.object({ balance: z.number() });

/**
 * Zod schema for CheckLimitResponse
 */
export const CheckLimitResponseSchema = z.object({
  allowed: z.boolean(),
  current: z.number(),
  remaining: z.number().optional(),
  requested: z.number(),
});

/**
 * Zod schema for ConsentCheckResponse
 */
export const ConsentCheckResponseSchema = z.object({
  /** Whether user consent is required */ consent_required: z.boolean(),
  /** Whether consent was previously granted for this app and scopes */ previously_granted:
    z.boolean(),
});

/**
 * Zod schema for DeviceAuthorizeRequest
 */
export const DeviceAuthorizeRequestSchema = z.object({
  /** Action to take: allow or deny */ action: z.enum(['allow', 'deny']),
  /** True if consent was auto-approved (not required or previously granted) */ auto_approved: z
    .boolean()
    .optional(),
  /** True if user explicitly clicked Allow, false if auto-approved */ user_action: z
    .boolean()
    .optional(),
  /** The user code displayed to the user */ user_code: z.string(),
});

/**
 * Zod schema for DeviceAuthorizeResponse
 */
export const DeviceAuthorizeResponseSchema = z.object({
  /** Whether the authorization was successful */ success: z.boolean(),
});

/**
 * Zod schema for DeviceCodeInfoResponse
 */
export const DeviceCodeInfoResponseSchema = z.object({
  /** The name of the OAuth2 application */ appName: z.string(),
  /** Whether the user has already granted consent for this app and scopes */ previouslyGranted:
    z.boolean(),
  /** Whether the app requires user consent */ requireConsent: z.boolean(),
  /** The scopes requested by the device code */ scopes: z.string().array(),
});

/**
 * Zod schema for DeviceCodeRequest
 */
export const DeviceCodeRequestSchema = z.object({
  /** OAuth2 client ID */ client_id: z.string(),
  /** PKCE code challenge (base64url encoded SHA256 hash) */ code_challenge: z.string().optional(),
  /** PKCE code challenge method */ code_challenge_method: z.enum(['S256', 'plain']).optional(),
  /** Space-separated list of scopes */ scope: z.string().optional(),
});

/**
 * Zod schema for DeviceCodeResponse
 */
export const DeviceCodeResponseSchema = z.object({
  /** Device verification code (for polling) */ device_code: z.string(),
  /** Device code expiration time in seconds */ expires_in: z.number(),
  /** Minimum polling interval in seconds */ interval: z.number(),
  /** User verification code (short, human-readable) */ user_code: z.string(),
  /** Verification URI for user */ verification_uri: z.string(),
  /** Complete verification URI with user code */ verification_uri_complete: z.string(),
});

/**
 * Zod schema for DeviceTokenRequest
 */
export const DeviceTokenRequestSchema = z.object({
  /** OAuth2 client ID */ client_id: z.string(),
  /** PKCE code verifier (if challenge was provided) */ code_verifier: z.string().optional(),
  /** Device code from authorization response */ device_code: z.string(),
  /** Grant type (must be device_code) */ grant_type: z.enum([
    'urn:ietf:params:oauth:grant-type:device_code',
  ]),
});

/**
 * Zod schema for IntrospectionRequest
 */
export const IntrospectionRequestSchema = z.object({
  /** The token to introspect */ token: z.string(),
  /** Hint about token type */ token_type_hint: z
    .enum(['access_token', 'refresh_token'])
    .optional(),
});

/**
 * Zod schema for IntrospectionResponse
 */
export const IntrospectionResponseSchema = z.object({
  /** Whether the token is active */ active: z.boolean(),
  /** Client ID */ client_id: z.string().optional(),
  /** Environment ID */ environment_id: z.string().optional(),
  /** Token expiration timestamp */ exp: z.number().optional(),
  /** Token issued at timestamp */ iat: z.number().optional(),
  /** Space-separated list of scopes */ scope: z.string().optional(),
  /** Subject (user ID) */ sub: z.string().optional(),
  /** Token type */ token_type: z.string().optional(),
  /** Username or user ID */ username: z.string().optional(),
});

/**
 * Zod schema for JWK
 */
export const JWKSchema = z.object({
  keys: z
    .object({
      alg: z.string(),
      e: z.string(),
      kid: z.string(),
      kty: z.string(),
      n: z.string(),
      use: z.string(),
    })
    .array(),
});

/**
 * Zod schema for PlanDeleteResponse
 */
export const PlanDeleteResponseSchema = z.object({ success: z.boolean() });

/**
 * Zod schema for ResourceMemberList
 */
export const ResourceMemberListSchema = z.object({
  items: z
    .object({
      inherited: z.boolean(),
      role: z.string(),
      user: z.object({
        avatarUrl: z.string().nullable(),
        createdAt: z.iso.datetime(),
        email: z.email(),
        emailVerified: z.boolean(),
        firstName: z.string().nullable(),
        id: z.string(),
        lastLoginAt: z.iso.datetime().nullable(),
        lastName: z.string().nullable(),
        lookupKey: z.string().nullable(),
        updatedAt: z.iso.datetime(),
      }),
      userId: z.string(),
    })
    .array(),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
});

/**
 * Zod schema for RevocationRequest
 */
export const RevocationRequestSchema = z.object({
  /** The token to revoke */ token: z.string(),
  /** Hint about token type */ token_type_hint: z
    .enum(['access_token', 'refresh_token'])
    .optional(),
});

/**
 * Zod schema for TokenRequest
 */
export const TokenRequestSchema = z.object({
  /** OAuth2 client ID */ client_id: z.string(),
  /** OAuth2 client secret (required for confidential clients) */ client_secret: z
    .string()
    .optional(),
  /** Authorization code (required for authorization_code grant) */ code: z.string().optional(),
  /** PKCE code verifier (if challenge was provided) */ code_verifier: z.string().optional(),
  /** OAuth2 grant type */ grant_type: z.enum(['authorization_code', 'refresh_token']),
  /** Redirect URI (required for authorization_code grant) */ redirect_uri: z.string().optional(),
  /** Refresh token (required for refresh_token grant) */ refresh_token: z.string().optional(),
  /** Space-separated list of scopes (optional for refresh) */ scope: z.string().optional(),
});

/**
 * Zod schema for TokenResponse
 */
export const TokenResponseSchema = z.object({
  /** Access token (JWT) */ access_token: z.string(),
  /** Access token expiration time in seconds */ expires_in: z.number(),
  /** Refresh token (for obtaining new access tokens) */ refresh_token: z.string(),
  /** Space-separated list of granted scopes */ scope: z.string().optional(),
  /** Token type */ token_type: z.string(),
});

/**
 * Zod schema for User
 */
export const UserSchema = z.object({
  avatarUrl: z.string().nullable(),
  createdAt: z.iso.datetime(),
  email: z.email(),
  emailVerified: z.boolean(),
  firstName: z.string().nullable(),
  id: z.string(),
  lastLoginAt: z.iso.datetime().nullable(),
  lastName: z.string().nullable(),
  lookupKey: z.string().nullable(),
  updatedAt: z.iso.datetime(),
});

/**
 * Zod schema for UserCreateBody
 */
export const UserCreateBodySchema = z.object({
  avatarUrl: z.url().optional(),
  email: z.email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  lookupKey: z.string(),
  newUser: z.boolean().nullable().optional(),
  password: z.string().nullable().optional(),
});

/**
 * Zod schema for UserList
 */
export const UserListSchema = z.object({
  items: z
    .object({
      avatarUrl: z.string().nullable(),
      createdAt: z.iso.datetime(),
      email: z.email(),
      emailVerified: z.boolean(),
      firstName: z.string().nullable(),
      id: z.string(),
      lastLoginAt: z.iso.datetime().nullable(),
      lastName: z.string().nullable(),
      lookupKey: z.string().nullable(),
      updatedAt: z.iso.datetime(),
    })
    .array(),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
});

/**
 * Zod schema for UserUpdateBody
 */
export const UserUpdateBodySchema = z.object({
  avatarUrl: z.url().nullable().optional(),
  email: z.email().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  lookupKey: z.string().optional(),
  password: z.string().optional(),
});

/**
 * Zod schema for EntitlementCheckBody
 */
export const EntitlementCheckBodySchema = z.object({
  amount: z.number().int().optional(),
  entitlement: EntitlementTypeSchema,
  resourceId: z.string(),
  userId: z.string(),
});

/**
 * Zod schema for EntitlementCheckResult
 */
export const EntitlementCheckResultSchema = z.object({
  allowed: z.boolean(),
  limit: z
    .object({
      allowed: z.boolean(),
      current: z.number().optional(),
      limit: z.number().optional(),
      plan: PlanTypeSchema.optional(),
      reason: z.string().optional(),
      remaining: z.number().optional(),
      scope: z.string().optional(),
    })
    .nullable()
    .optional(),
  plans: z
    .object({
      allowed: z.boolean(),
      allowedPlans: PlanTypeSchema.array().optional(),
      plan: PlanTypeSchema.optional(),
      reason: z.string().optional(),
    })
    .nullable()
    .optional(),
  roles: z
    .object({
      allowed: z.boolean(),
      allowedRoles: z.string().array().optional(),
      reason: z.string().optional(),
      userRoles: z.string().array().optional(),
    })
    .nullable()
    .optional(),
});

/**
 * Zod schema for PlanAssignBody
 */
export const PlanAssignBodySchema = z.object({ planKey: PlanTypeSchema });

/**
 * Zod schema for EntitlementsListResult
 */
export const EntitlementsListResultSchema = z.object({
  results: z
    .object({
      entitlements: z
        .object({
          allowed: z.boolean(),
          allowedByPlan: z.boolean(),
          allowedByRole: z.boolean(),
          allowedPlans: PlanTypeSchema.array().optional(),
          allowedRoles: z.string().array(),
          currentPlan: PlanTypeSchema.optional(),
          currentRole: z.string().optional(),
          entitlement: EntitlementTypeSchema,
        })
        .array(),
      resourceId: z.string(),
      resourceType: ResourceTypeSchema,
    })
    .array(),
});

/**
 * Zod schema for PlanResponse
 */
export const PlanResponseSchema = z.object({
  createdAt: z.iso.datetime(),
  environmentId: z.string(),
  planKey: PlanTypeSchema,
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  updatedAt: z.iso.datetime(),
});

/**
 * Zod schema for Resource
 */
export const ResourceSchema = z.object({
  createdAt: z.iso.datetime(),
  id: z.string(),
  name: z.string().nullable(),
  parents: z
    .object({
      id: z.string(),
      type: ResourceTypeSchema,
    })
    .array()
    .optional(),
  type: ResourceTypeSchema,
});

/**
 * Zod schema for ResourceBulkCreateBody
 */
export const ResourceBulkCreateBodySchema = z.object({
  resources: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      parents: z
        .object({
          id: z.string(),
          type: ResourceTypeSchema,
        })
        .array()
        .optional(),
      roles: z
        .object({
          role: z.string(),
          userId: z.string(),
        })
        .array()
        .optional(),
    })
    .array(),
});

/**
 * Zod schema for ResourceBulkResult
 */
export const ResourceBulkResultSchema = z.object({
  created: z
    .object({
      environmentId: z.string(),
      id: z.string(),
      type: ResourceTypeSchema,
    })
    .array(),
  errors: z
    .object({
      error: z.string(),
      index: z.number(),
      resource: z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        parents: z
          .object({
            id: z.string(),
            type: ResourceTypeSchema,
          })
          .array()
          .optional(),
        roles: z
          .object({
            role: z.string(),
            userId: z.string(),
          })
          .array()
          .optional(),
      }),
    })
    .array(),
  success: z.boolean(),
  summary: z.object({
    failed: z.number(),
    successful: z.number(),
    total: z.number(),
  }),
});

/**
 * Zod schema for ResourceCreateBody
 */
export const ResourceCreateBodySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  parents: z
    .object({
      id: z.string(),
      type: ResourceTypeSchema,
    })
    .array()
    .optional(),
  roles: z
    .object({
      role: z.string(),
      userId: z.string(),
    })
    .array()
    .optional(),
});

/**
 * Zod schema for ResourceUpdateBody
 */
export const ResourceUpdateBodySchema = z.object({
  name: z.string().optional(),
  /** Creates relationships with other resources. Parent resources must already exist. */ parents: z
    .object({
      id: z.string(),
      type: ResourceTypeSchema,
    })
    .array()
    .optional(),
});

/**
 * Zod schema for Role
 */
export const RoleSchema = z.object({
  createdAt: z.string(),
  environmentId: z.string(),
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  role: z.string(),
  userId: z.string(),
});

/**
 * Zod schema for RoleBulkCreateBody
 */
export const RoleBulkCreateBodySchema = z.object({
  roles: z
    .object({
      resourceId: z.string(),
      resourceType: ResourceTypeSchema,
      role: z.string(),
      userId: z.string(),
    })
    .array(),
});

/**
 * Zod schema for RoleBulkResult
 */
export const RoleBulkResultSchema = z.object({
  created: z
    .object({
      createdAt: z.string(),
      environmentId: z.string(),
      resourceId: z.string(),
      resourceType: ResourceTypeSchema,
      role: z.string(),
      userId: z.string(),
    })
    .array(),
  errors: z
    .object({
      error: z.string(),
      index: z.number(),
      role: z.object({
        resourceId: z.string(),
        resourceType: ResourceTypeSchema,
        role: z.string(),
        userId: z.string(),
      }),
    })
    .array(),
  success: z.boolean(),
  summary: z.object({
    failed: z.number(),
    successful: z.number(),
    total: z.number(),
  }),
});

/**
 * Zod schema for RoleCreateBody
 */
export const RoleCreateBodySchema = z.object({
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  role: z.string(),
});

/**
 * Zod schema for RoleList
 */
export const RoleListSchema = z.object({
  limit: z.number(),
  page: z.number(),
  roles: z
    .object({
      createdAt: z.string(),
      environmentId: z.string(),
      resourceId: z.string(),
      resourceType: ResourceTypeSchema,
      role: z.string(),
      userId: z.string(),
    })
    .array(),
  total: z.number(),
});

/**
 * Zod schema for UserResourceList
 */
export const UserResourceListSchema = z.array(
  z.object({
    inherited: z.boolean(),
    resource: z
      .object({
        id: z.string(),
        name: z.string(),
        parents: z
          .object({
            id: z.string(),
            type: ResourceTypeSchema,
          })
          .array(),
        type: ResourceTypeSchema,
      })
      .catchall(z.unknown()),
    role: z.string(),
  })
);

/**
 * Zod schema for TransactionHistoryResponse
 */
export const TransactionHistoryResponseSchema = z.object({
  items: z
    .object({
      amount: z.number().int(),
      createdAt: z.iso.datetime(),
      environmentId: z.string(),
      id: z.string(),
      limitType: UsageLimitTypeSchema,
      resourceId: z.string(),
      resourceType: ResourceTypeSchema,
      tags: z.record(z.string(), z.unknown()).nullable(),
    })
    .array(),
});

/**
 * Zod schema for UsageCheckBody
 */
export const UsageCheckBodySchema = z.object({
  amount: z.number().int(),
  limitType: UsageLimitTypeSchema,
  period: z.enum(['monthly', 'yearly', 'lifetime']),
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
});

/**
 * Zod schema for UsageConsumeBody
 */
export const UsageConsumeBodySchema = z.object({
  amount: z.number().int(),
  limitType: UsageLimitTypeSchema,
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  tags: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Zod schema for UsageCreditBody
 */
export const UsageCreditBodySchema = z.object({
  amount: z.number().int(),
  limitType: UsageLimitTypeSchema,
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  tags: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Zod schema for UsageWalletResponse
 */
export const UsageWalletResponseSchema = z.object({
  amount: z.number().int(),
  createdAt: z.iso.datetime(),
  environmentId: z.string(),
  id: z.string(),
  limitType: UsageLimitTypeSchema,
  resourceId: z.string(),
  resourceType: ResourceTypeSchema,
  tags: z.record(z.string(), z.unknown()).nullable(),
});

/**
 * Zod schema for ResourceList
 */
export const ResourceListSchema = z.object({
  items: ResourceSchema.array(),
  limit: z.number(),
  page: z.number(),
  total: z.number(),
});

// Operation query parameter schemas

/**
 * Schema for query params of AuthJwks.GetOAuthAppJwks
 * Returns the public key for a specific OAuth app to verify JWT tokens. This is a public endpoint following OAuth2/OIDC standards. Provide client_id to get keys for a specific OAuth app, or use authenticated endpoint for environment keys.
 */
export const AuthJwksGetOAuthAppJwksQuerySchema = z.object({
  /** OAuth app client ID to get public keys for */
  client_id: z.string().optional(),
});

/**
 * Schema for query params of Entitlements.ListForResource
 * Returns entitlements for a specific resource and user. Only evaluates roles and plans (excludes limits). Provides detailed information about why entitlements are allowed or denied, including current roles, allowed roles, current plan, and allowed plans. Results are cached per resource for performance.
 */
export const EntitlementsListForResourceQuerySchema = z.object({
  /** The unique identifier of the user */
  userId: z.string(),
});

/**
 * Schema for query params of Entitlements.ListForTenant
 * Returns entitlements for a tenant resource and all its descendant resources. This endpoint scopes queries to a single tenant, preventing cross-tenant data access. Only evaluates roles and plans (excludes limits). Results are cached per resource for performance. The tenant resource type is automatically determined from the environment definition (resource marked as `is_tenant: true`).
 */
export const EntitlementsListForTenantQuerySchema = z.object({
  /** The unique identifier of the user */
  userId: z.string(),
});

/**
 * Schema for query params of Oauth.CheckConsentRequired
 * Checks if user consent is required for the OAuth2 app and requested scopes.
 */
export const OauthCheckConsentRequiredQuerySchema = z.object({
  /** OAuth2 client ID */
  client_id: z.string(),
  /** Redirect URI */
  redirect_uri: z.string().optional(),
  /** Space-separated list of scopes */
  scope: z.string().optional(),
});

/**
 * Schema for query params of Resource Members.List
 * Retrieves a paginated list of users who have roles (direct or inherited) on the specified resource. Supports search functionality to filter users by email or name.
 */
export const ResourceMembersListQuerySchema = z.object({
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit: z.number().optional(),
  /** Page number for pagination */
  page: z.number().optional(),
  /** Search query to filter members by email or name */
  search: z.string().optional(),
});

/**
 * Schema for query params of Resources.List
 * Retrieves a paginated list of resources of the specified type. Supports search and filtering. Resources are returned with their parent relationships and metadata.
 */
export const ResourcesListQuerySchema = z.object({
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit: z.number().optional(),
  /** Page number for pagination */
  page: z.number().optional(),
  /** Search query to filter resources by name */
  search: z.string().optional(),
});

/**
 * Schema for query params of Roles.List
 * Retrieves a paginated list of roles assigned to a user. Supports filtering by resource type, resource ID, and role name. Returns both directly assigned roles and inherited roles.
 */
export const RolesListQuerySchema = z.object({
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit: z.number().optional(),
  /** Page number for pagination */
  page: z.number().optional(),
  /** Filter roles by specific resource ID */
  resourceId: z.string().optional(),
  /** Filter roles by resource type */
  resourceType: ResourceTypeSchema.optional(),
  /** Filter by role name */
  role: z.string().optional(),
});

/**
 * Schema for query params of Usage.GetBalance
 * Retrieves the current balance of a usage wallet for a specific resource and limit type within a given time period. The balance reflects all credits and consumption transactions.
 */
export const UsageGetBalanceQuerySchema = z.object({
  /** Time period for the balance calculation */
  period: z.enum(['monthly', 'yearly', 'lifetime']),
});

/**
 * Schema for query params of Usage.GetTransactionHistory
 * Retrieves the transaction history for a usage wallet, including all credits and consumption records. Supports filtering by time period and date range.
 */
export const UsageGetTransactionHistoryQuerySchema = z.object({
  /** End date for filtering transactions (ISO 8601 format) */
  endDate: z.string().optional(),
  /** Time period for filtering transactions */
  period: z.enum(['monthly', 'yearly', 'lifetime']).optional(),
  /** Start date for filtering transactions (ISO 8601 format) */
  startDate: z.string().optional(),
});

/**
 * Schema for query params of Users.List
 * Retrieves a paginated list of users in your environment. Supports search functionality to filter users by email, name, or lookup key.
 */
export const UsersListQuerySchema = z.object({
  /** Number of items per page (minimum: 1, maximum: 100) */
  limit: z.number().optional(),
  /** Page number for pagination */
  page: z.number().optional(),
  /** Search query to filter users by email, name, or lookup key */
  search: z.string().optional(),
});
