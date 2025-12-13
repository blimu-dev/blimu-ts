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
// Example: Logout and invalidate session
try {
  const result = await client.auth.logout();
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
import { listAll } from '@blimu/client';

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

### Bearer

Bearer token authentication:

```typescript
const client = new BlimuClient({
  bearer: 'your-bearer-token',
});
```

## Subpath imports

```typescript
import { PaymentService, Schema } from '@blimu/client';
```

## Available Services

### AuthService

- **logout**: POST /v1/auth/logout - Logout and invalidate session
- **refresh**: POST /v1/auth/refresh - Refresh session token
- **getSession**: GET /v1/auth/session - Get current session

## TypeScript Support

This SDK is written in TypeScript and provides full type safety:

```typescript
import { BlimuClient, Schema } from '@blimu/client';

const client = new BlimuClient({
  /* config */
});

// All methods are fully typed
const result: unknown = await client.auth.logout(/* ... */);

// Schema types are available
const data: Schema.RefreshResponse = {
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
  baseURL: 'https://api.example.com',
  fetch,
});
```

## Models and Types

The SDK includes the following TypeScript interfaces:

- **RefreshResponse**
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
