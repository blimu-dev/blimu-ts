# Blimu TypeScript SDK

This is an auto-generated TypeScript/JavaScript SDK for the Blimu API.

## Installation

```bash
npm install @blimu/client
# or
yarn add @blimu/client
```

## Quick Start

```typescript
import { BlimuClient } from '@blimu/client';

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

// Example: Logout and invalidate session
try {
  const result = await client.auth.logout();
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
// Example: List entitlements for a tenant and all its sub-resources
try {
  const result = await client.entitlements.listForTenant('tenantResourceId');
  console.log('Result:', result);
} catch (error) {
  // FetchError with structured data
  console.error(error);
}
```

## TypeScript Support

This SDK is written in TypeScript and provides full type safety:

```typescript
import { BlimuClient, Schema } from '@blimu/client';

const client = new BlimuClient({
  /* config */
});

// All methods are fully typed
// Schema types are available
const data: Schema.EntitlementType = {
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
import { BlimuClient } from '@blimu/client';

const client = new BlimuClient({
  baseURL: 'https://api.blimu.dev',
  fetch,
});
```

## Models and Types

The SDK includes the following TypeScript interfaces:

- **EntitlementType**: Entitlement identifier
- **EntitlementsListResult**
- **RefreshResponse**
- **ResourceType**: Resource type identifier
- **SessionResponse**

All types are available under the `Schema` namespace:

```typescript
import { Schema } from '@blimu/client';

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
