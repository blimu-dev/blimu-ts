# Blimu TypeScript SDK

This is an auto-generated TypeScript/JavaScript SDK for the Blimu API.

## Installation

```bash
npm install @blimu/backend
# or
yarn add @blimu/backend
```

## Quick Start

```typescript
import { BlimuClient } from '@blimu/backend';

// Create a new client
const client = new BlimuClient({
  baseURL: 'https://api.example.com',
  timeoutMs: 10000,
  retry: { retries: 2, backoffMs: 300, retryOn: [429, 500, 502, 503, 504] },
  // Environment-based baseURL (optional)
  env: 'sandbox',
  envBaseURLs: {
    sandbox: 'https://api-sandbox.example.com',
    production: 'https://api.example.com',
  },
  // Auth (generic API Key or Bearer header)
  accessToken: process.env.API_TOKEN,
  headerName: 'access_token', // or 'Authorization' (defaults to Authorization: Bearer <token>)
});
// Example: Bulk create resources
try {
  const result = await client.bulkResources.create('resourceType', {
    // Request body data
  });
  console.log('Result:', result);
} catch (error) {
  // ApiError with structured data
  console.error(error);
}
```

## Environment & Auth

```typescript
const client = new BlimuClient({
  env: 'sandbox',
  envBaseURLs: {
    sandbox: 'https://api-sandbox.example.com',
    production: 'https://api.example.com',
  },
  accessToken: async () => process.env.API_TOKEN!,
  headerName: 'access_token',
});
client.setAccessToken('new-token');
```

## Pagination

```typescript
import { listAll } from '@blimu/backend';

const allPayments = await listAll((query) => client.payment.listPayments(query), { limit: 100 });
```

## Interceptors

```typescript
const client = new BlimuClient({
  onRequest: ({ url, init }) => console.debug('->', init.method, url),
  onResponse: ({ response }) => console.debug('<-', response.status),
  onError: (err) => console.warn('request error', err),
});
```

## Authentication

This SDK supports the following authentication methods:

### ApiKeyAuth

API Key authentication (header):

```typescript
const client = new BlimuClient({
  apiKeyAuth: 'your-api-key',
});
```

### Bearer

Bearer token authentication:

```typescript
const client = new BlimuClient({
  bearer: 'your-bearer-token',
});
```

## Subpath imports

```typescript
import { PaymentService, Schema } from '@blimu/backend';
```

## Available Services

### BulkResourcesService

- **create**: POST /v1/resources/{resourceType}/bulk - Bulk create resources

### BulkRolesService

- **create**: POST /v1/users/roles/bulk - Bulk create roles

### EntitlementsService

- **checkEntitlement**: POST /v1/entitlements/check - Check if a user has a specific entitlement on a resource

### PlansService

- **delete**: DELETE /v1/resources/{resourceType}/{resourceId}/plan - Remove plan assignment from a tenant resource
- **read**: GET /v1/resources/{resourceType}/{resourceId}/plan - Get the plan assigned to a tenant resource
- **assign**: POST /v1/resources/{resourceType}/{resourceId}/plan - Assign a plan to a tenant resource

### ResourcesService

- **list**: GET /v1/resources/{resourceType} - List resources
- **create**: POST /v1/resources/{resourceType} - Create a resource
- **delete**: DELETE /v1/resources/{resourceType}/{resourceId} - Delete a resource
- **read**: GET /v1/resources/{resourceType}/{resourceId} - Read a resource
- **update**: PUT /v1/resources/{resourceType}/{resourceId} - Update a resource

### RolesService

- **list**: GET /v1/users/{userId}/roles - List user roles
- **create**: POST /v1/users/{userId}/roles - Create a role (assign role to user on resource)
- **delete**: DELETE /v1/users/{userId}/roles/{resourceType}/{resourceId} - Delete a role

### UsageService

- **getBalance**: GET /v1/usage/balance/{resourceType}/{resourceId}/{limitType} - Get wallet balance
- **checkLimit**: POST /v1/usage/check - Check if consumption is allowed
- **consume**: POST /v1/usage/consume - Record consumption (inserts negative amount)
- **credit**: POST /v1/usage/credit - Add credits to wallet (inserts positive amount)
- **getTransactionHistory**: GET /v1/usage/transactions/{resourceType}/{resourceId}/{limitType} - Get transaction history

### UsersService

- **list**: GET /v1/users - List users
- **create**: POST /v1/users - Create a user
- **delete**: DELETE /v1/users/{userId} - Delete a user
- **read**: GET /v1/users/{userId} - Get a user by ID
- **update**: PUT /v1/users/{userId} - Update a user
- **listEffectiveUserResourcesRoles**: GET /v1/users/{userId}/effective-user-resources-roles - List effective user resources roles

## TypeScript Support

This SDK is written in TypeScript and provides full type safety:

```typescript
import { BlimuClient, Schema } from '@blimu/backend';

const client = new BlimuClient({
  /* config */
});

// All methods are fully typed
const result: ResourceBulkResult = await client.bulkResources.create(/* ... */);

// Schema types are available
const data: Schema.BalanceResponse = {
  // Fully typed object
};
```

## Node.js Usage

For Node.js environments, you may need to provide a fetch implementation:

```bash
npm install undici
```

```typescript
import { fetch } from 'undici';
import { BlimuClient } from '@blimu/backend';

const client = new BlimuClient({
  baseURL: 'https://api.example.com',
  fetch,
});
```

## Models and Types

The SDK includes the following TypeScript interfaces:

- **BalanceResponse**
- **CheckLimitResponse**
- **EntitlementCheckBody**
- **EntitlementCheckResult**
- **EntitlementType**: Entitlement identifier
- **PlanAssignBody**
- **PlanDeleteResponse**
- **PlanResponse**
- **Resource**
- **ResourceBulkCreateBody**
- **ResourceBulkResult**
- **ResourceCreateBody**
- **ResourceList**
- **ResourceType**: Resource type identifier
- **ResourceUpdateBody**
- **Role**
- **RoleBulkCreateBody**
- **RoleBulkResult**
- **RoleCreateBody**
- **RoleList**
- **TransactionHistoryResponse**
- **UsageCheckBody**
- **UsageConsumeBody**
- **UsageCreditBody**
- **UsageWalletResponse**
- **User**
- **UserCreateBody**
- **UserList**
- **UserResourceList**
- **UserUpdateBody**

All types are available under the `Schema` namespace:

```typescript
import { Schema } from '@blimu/backend';

// Use any model type
const user: Schema.User = {
  /* ... */
};
```

## Contributing

This SDK is auto-generated. Please do not edit the generated files directly.
If you find issues, please report them in the main project repository.

## License

This SDK is generated from the Blimu API specification.
