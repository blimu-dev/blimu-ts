# SSL Certificate Handling in CLI

## Why `@blimu/fetch` Doesn't Handle Self-Signed Certificates

The `@blimu/fetch` library is designed to be universal - it works in both browsers and Node.js. However, it relies on the underlying `fetch` implementation:

1. **In browsers**: Uses the browser's native `fetch`, which respects browser certificate stores
2. **In Node.js**: Uses Node.js's native `fetch` (available since Node.js 18+)

### The Problem

Node.js's native `fetch` API **does not expose SSL certificate configuration options**. It uses `undici` under the hood, but the standard `fetch` API doesn't allow you to:

- Configure custom CA certificates
- Disable certificate verification (for self-signed certs)
- Use custom SSL agents

This is by design - the `fetch` API is meant to be a simple, universal interface that doesn't expose low-level networking details.

### Why It Works in NestJS

In NestJS applications, the `@blimu/fetch` library likely works because:

1. **Different endpoints**: NestJS apps might connect to properly signed certificates (not self-signed)
2. **Environment variables**: Some environments might set `NODE_TLS_REJECT_UNAUTHORIZED=0` globally (not recommended)
3. **Different network setup**: The NestJS app might be running in a different network context where certificates are properly configured

### The Solution

Since `@blimu/fetch` supports a custom `fetch` implementation via the `fetch` config option, we can provide our own implementation that handles SSL certificates properly.

#### Current Implementation

We use `undici` directly (which is built into Node.js 18+) to create a custom fetch that accepts self-signed certificates:

```typescript
import { Agent, fetch as undiciFetch } from 'undici';

function createLocalDevFetch(): typeof fetch {
  const agent = new Agent({
    connect: {
      rejectUnauthorized: false, // Accept self-signed certificates for local dev
    },
  });

  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    return undiciFetch(input, {
      ...init,
      dispatcher: agent,
    }) as Promise<Response>;
  };
}
```

This custom fetch is then passed to the `Blimu` client:

```typescript
this.client = new Blimu({
  baseURL: runtimeApiBaseUrl,
  fetch: createLocalDevFetch(), // Custom fetch for local dev
});
```

### Why This Approach Works

1. **Uses undici directly**: `undici` is the underlying HTTP client that Node.js's `fetch` uses, but it exposes SSL configuration options
2. **Only for local environments**: We only use this custom fetch for `local-dev` and `local-prod` environments
3. **Maintains compatibility**: The custom fetch implements the same `fetch` interface, so it's a drop-in replacement
4. **No external dependencies**: `undici` is built into Node.js 18+, so no additional packages needed

### Alternative Solutions

1. **Environment variable**: Set `NODE_TLS_REJECT_UNAUTHORIZED=0` (not recommended - affects all Node.js processes)
2. **Custom CA store**: Add the self-signed certificate to Node.js's CA store (more secure but complex)
3. **Use http instead of https**: For local dev only, use HTTP (less secure)

### Future Improvements

If `@blimu/fetch` wanted to support SSL certificate configuration natively, it could:

1. Add a `ssl` or `tls` config option that gets passed to the underlying HTTP client
2. Detect Node.js environment and use `undici` directly with SSL options
3. Provide a utility function to create a custom fetch with SSL configuration

However, this would break the "universal" nature of the library, as browsers don't have the same SSL configuration needs.
