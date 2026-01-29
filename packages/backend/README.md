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
  baseURL: 'https://api.blimu.dev',
  timeoutMs: 10000,
  retry: {
    retries: 2,
    strategy: 'exponential',
    backoffMs: 300,
    retryOn: [429, 500, 502, 503, 504],
  },
  // Auth configuration
  authStrategies: [
    {
      type: 'bearer',
      token: process.env.API_TOKEN,
    },
  ],
});

// Example: Bulk create resources
try {
  const result = await client.bulkResources.create(
    'resourceType',

    {
      // Request body data
    }
  );
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
// Example: Bulk create roles
try {
  const result = await client.bulkRoles.create({
    // Request body data
  });
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
// Example: Check if a user has a specific entitlement on a resource
try {
  const result = await client.entitlements.checkEntitlement({
    // Request body data
  });
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
// Example: Check consent requirement
try {
  const result = await client.oauth.checkConsentRequired({
    client_id: 'example',
  });
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
// Example: Remove plan assignment from a tenant resource
try {
  const result = await client.plans.delete('resourceType', 'resourceId');
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
// Example: List members for a resource
try {
  const result = await client.resourceMembers.list('resourceType', 'resourceId', {});
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
// Example: List resources
try {
  const result = await client.resources.list('resourceType', {});
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
// Example: List user roles
try {
  const result = await client.roles.list('userId', {});
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
// Example: Get wallet balance
try {
  const result = await client.usage.getBalance('resourceType', 'resourceId', 'limitType', {
    period: undefined,
  });
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
// Example: List users
try {
  const result = await client.users.list({});
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
```

## TypeScript Support

This SDK is written in TypeScript and provides full type safety:

```typescript
import { BlimuClient, Schema } from '@blimu/backend';

const client = new BlimuClient({
  /* config */
});

// All methods are fully typed
// Schema types are available
const data: Schema.AuthorizeRequest = {
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
  baseURL: 'https://api.blimu.dev',
  fetch,
});
```

## Models and Types

The SDK includes the following TypeScript interfaces:

- **AuthorizeRequest**
- **BalanceResponse**
- **CheckLimitResponse**
- **ConsentCheckResponse**
- **DeviceAuthorizeRequest**
- **DeviceAuthorizeResponse**
- **DeviceCodeInfoResponse**
- **DeviceCodeRequest**
- **DeviceCodeResponse**
- **DeviceTokenRequest**
- **EntitlementCheckBody**
- **EntitlementCheckResult**
- **EntitlementType**: Entitlement identifier
- **EntitlementsListResult**
- **IntrospectionRequest**
- **IntrospectionResponse**
- **PlanAssignBody**
- **PlanDeleteResponse**
- **PlanResponse**
- **PlanType**: Plan type identifier
- **Resource**
- **ResourceBulkCreateBody**
- **ResourceBulkResult**
- **ResourceCreateBody**
- **ResourceList**
- **ResourceMemberList**
- **ResourceType**: Resource type identifier
- **ResourceUpdateBody**
- **RevocationRequest**
- **Role**
- **RoleBulkCreateBody**
- **RoleBulkResult**
- **RoleCreateBody**
- **RoleList**
- **TokenRequest**
- **TokenResponse**
- **TransactionHistoryResponse**
- **UsageCheckBody**
- **UsageConsumeBody**
- **UsageCreditBody**
- **UsageLimitType**: Usage-based limit type identifier
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
