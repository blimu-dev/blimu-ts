import { FetchError } from './client';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export interface JWK {
  kty: string;
  use: string;
  kid: string;
  alg: string;
  n: string;
  e: string;
}

export interface JWKSet {
  keys: JWK[];
}

interface CachedJWK {
  key: crypto.KeyObject;
  kid: string;
  expiresAt: number;
}

export interface VerifyTokenOptions {
  url?: string; // Direct URL to JWK endpoint (for custom scenarios)
  secretKey?: string; // API key/secret key - uses runtimeApiUrl + JWK endpoint
  token: string;
  runtimeApiUrl?: string | undefined; // Optional override for runtime API URL
}

export interface TokenVerifierOptions {
  runtimeApiUrl?: string | undefined;
  cacheTTL?: number | undefined; // Default: 1 hour
}

export class TokenVerifier {
  private readonly cache = new Map<string, CachedJWK>();
  private readonly cacheTTL: number;
  private readonly runtimeApiUrl: string;

  constructor(options?: TokenVerifierOptions) {
    this.cacheTTL = options?.cacheTTL ?? 60 * 60 * 1000; // 1 hour

    this.runtimeApiUrl = options?.runtimeApiUrl ?? 'https://api.blimu.dev';
  }

  /**
   * Fetch JWK Set from runtime-api
   */
  private async fetchJWKSet(endpoint: string, headers?: Record<string, string>): Promise<JWKSet> {
    console.log(`[TokenVerifier] 📡 Fetching JWK Set from: ${endpoint}`);
    if (headers) {
      console.log(
        `[TokenVerifier] 📡 Request headers: ${JSON.stringify(Object.keys(headers).map((k) => `${k}: ${k === 'x-api-key' ? '***' : headers[k]}`))}`
      );
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    console.log(`[TokenVerifier] 📡 Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[TokenVerifier] ❌ Failed to fetch JWKs: ${response.status} ${errorText}`);
      throw new FetchError('Failed to fetch JWKs', response.status, errorText);
    }

    const jwkSet = (await response.json()) as JWKSet;
    console.log(`[TokenVerifier] ✅ Successfully fetched JWK Set with ${jwkSet.keys.length} keys`);
    return jwkSet;
  }

  /**
   * Convert JWK to KeyObject
   */
  private jwkToKeyObject(jwk: JWK): crypto.KeyObject {
    return crypto.createPublicKey({
      key: {
        kty: jwk.kty,
        n: jwk.n,
        e: jwk.e,
        alg: jwk.alg,
      },
      format: 'jwk',
    });
  }

  /**
   * Get public key for a specific key ID
   */
  private async getPublicKey(
    kid: string,
    cacheKey: string,
    endpoint: string,
    headers?: Record<string, string>
  ): Promise<crypto.KeyObject> {
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      console.log(`[TokenVerifier] ✅ Using cached key for kid: ${kid}`);
      return cached.key;
    }

    console.log(`[TokenVerifier] 🔍 Cache miss or expired. Fetching new key for kid: ${kid}`);

    // Fetch JWK Set
    const jwkSet = await this.fetchJWKSet(endpoint, headers);

    // Find the key with matching kid
    const jwk = jwkSet.keys.find((k) => k.kid === kid);
    if (!jwk) {
      const availableKids = jwkSet.keys.map((k) => k.kid).join(', ');
      console.error(
        `[TokenVerifier] ❌ Key with kid '${kid}' not found in JWK Set. Available kids: ${availableKids}`
      );
      throw new Error(
        `Key with kid '${kid}' not found in JWK Set. Available kids: ${availableKids}`
      );
    }

    console.log(`[TokenVerifier] ✅ Found key with kid: ${kid}`);

    // Convert JWK to KeyObject
    const keyObject = this.jwkToKeyObject(jwk);

    // Cache the key
    this.cache.set(cacheKey, {
      key: keyObject,
      kid,
      expiresAt: Date.now() + this.cacheTTL,
    });

    return keyObject;
  }

  /**
   * Verify JWT token using JWKs from runtime-api
   */
  async verifyToken<T = any>(options: VerifyTokenOptions): Promise<T> {
    const { url, secretKey, token, runtimeApiUrl } = options;

    if (!url && !secretKey) {
      throw new Error('Either url or secretKey must be provided');
    }

    if (url && secretKey) {
      throw new Error('Cannot provide both url and secretKey');
    }

    // Decode token header to get kid (without verification)
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string') {
      throw new Error('Invalid token format');
    }

    const header = decoded.header;
    if (!header.kid) {
      throw new Error('Token missing kid in header');
    }

    let endpoint: string;
    let cacheKey: string;
    let headers: Record<string, string> | undefined;

    if (secretKey) {
      // Use secretKey with runtimeApiUrl
      const apiUrl = runtimeApiUrl ?? this.runtimeApiUrl;
      endpoint = `${apiUrl}/v1/auth/.well-known/jwks.json`;
      cacheKey = secretKey;
      headers = {
        'x-api-key': secretKey,
      };
      console.log(
        `[TokenVerifier] 🔍 Verifying token with kid: ${header.kid}, endpoint: ${endpoint}`
      );
    } else {
      // Use direct URL
      endpoint = url!;
      cacheKey = url!;
      console.log(
        `[TokenVerifier] 🔍 Verifying token with kid: ${header.kid}, endpoint: ${endpoint}`
      );
    }

    // Get public key for this kid
    let publicKey: crypto.KeyObject;
    try {
      publicKey = await this.getPublicKey(header.kid, cacheKey, endpoint, headers);
      console.log(`[TokenVerifier] ✅ Successfully retrieved public key for kid: ${header.kid}`);
    } catch (error) {
      console.error(
        `[TokenVerifier] ❌ Failed to get public key (first attempt): ${error instanceof Error ? error.message : String(error)}`
      );
      // If verification fails, clear cache and retry once (handles key rotation)
      this.clearCache(cacheKey);
      console.log(`[TokenVerifier] 🔄 Retrying after cache clear...`);
      try {
        publicKey = await this.getPublicKey(header.kid, cacheKey, endpoint, headers);
        console.log(
          `[TokenVerifier] ✅ Successfully retrieved public key for kid: ${header.kid} (retry)`
        );
      } catch (retryError) {
        console.error(
          `[TokenVerifier] ❌ Failed to get public key (retry): ${retryError instanceof Error ? retryError.message : String(retryError)}`
        );
        throw retryError;
      }
    }

    // Verify token
    try {
      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      }) as T;
      console.log(`[TokenVerifier] ✅ Token verified successfully`);
      return payload;
    } catch (error) {
      console.error(
        `[TokenVerifier] ❌ JWT verification failed: ${error instanceof Error ? error.message : String(error)}`
      );
      throw error;
    }
  }

  /**
   * Clear cache (useful for testing or key rotation)
   */
  clearCache(secretKeyOrUrl?: string): void {
    if (secretKeyOrUrl) {
      this.cache.delete(secretKeyOrUrl);
    } else {
      this.cache.clear();
    }
  }
}

/**
 * Convenience function to verify a token
 */
export async function verifyToken<T = any>(options: VerifyTokenOptions): Promise<T> {
  const verifier = new TokenVerifier();
  return verifier.verifyToken<T>(options);
}
