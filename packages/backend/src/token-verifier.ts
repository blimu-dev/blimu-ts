import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { FetchClient } from '@blimu/fetch';
import { buildAuthStrategies } from './auth-strategies';
import { AuthJwksService } from './services/auth_jwks';
import type * as Schema from './schema';

/** Single JWK (element of a JWK Set's keys array). */
export type JWK = Schema.JWK['keys'][number];
/** JWK Set as returned by Blimu auth JWKS endpoints. */
export type JWKSet = Schema.JWK;

interface CachedJWK {
  key: crypto.KeyObject;
  kid: string;
  expiresAt: number;
}

export interface VerifyTokenOptions {
  /** API key/secret key – uses runtimeApiUrl + environment JWKS (authenticated). For environment/session tokens. */
  secretKey?: string;
  /** OAuth app client_id – uses runtimeApiUrl + public OAuth JWKS (no auth). For validating tokens issued by your OAuth2 apps. */
  clientId?: string;
  token: string;
  /** Optional override for runtime API URL */
  runtimeApiUrl?: string | undefined;
}

export interface TokenVerifierOptions {
  runtimeApiUrl?: string | undefined;
  cacheTTL?: number | undefined; // Default: 1 hour
}

export class TokenVerifier {
  private readonly cache = new Map<string, CachedJWK>();
  private readonly cacheTTL: number;
  private readonly baseURL: string;

  constructor(options?: TokenVerifierOptions) {
    this.cacheTTL = options?.cacheTTL ?? 60 * 60 * 1000; // 1 hour
    this.baseURL = options?.runtimeApiUrl ?? 'https://api.blimu.dev';
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
    fetchJwks: () => Promise<JWKSet>
  ): Promise<crypto.KeyObject> {
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.key;
    }

    const jwkSet = await fetchJwks();

    // Find the key with matching kid
    const jwk = jwkSet.keys.find((k) => k.kid === kid);
    if (!jwk) {
      const availableKids = jwkSet.keys.map((k) => k.kid).join(', ');
      throw new Error(
        `Key with kid '${kid}' not found in JWK Set. Available kids: ${availableKids}`
      );
    }

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
   * Verify JWT token using JWKs from Blimu runtime API.
   * Supports: environment/session tokens (secretKey) or OAuth app tokens (clientId).
   */
  async verifyToken<T = unknown>(options: VerifyTokenOptions): Promise<T> {
    const { secretKey, clientId, token, runtimeApiUrl } = options;

    const provided = [secretKey, clientId].filter(Boolean);
    if (provided.length !== 1) {
      throw new Error(
        'Exactly one of secretKey or clientId must be provided. ' +
          'Use secretKey for environment/session tokens, clientId for OAuth app access tokens.'
      );
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

    const baseURL = runtimeApiUrl ?? this.baseURL;
    let cacheKey: string;
    let fetchJwks: () => Promise<JWKSet>;

    if (secretKey) {
      cacheKey = secretKey;
      const core = new FetchClient({
        baseURL,
        authStrategies: buildAuthStrategies({ apiKey: secretKey, baseURL }),
      });
      const authJwks = new AuthJwksService(core);
      fetchJwks = () => authJwks.getJwks();
    } else {
      cacheKey = `oauth:${clientId!}`;
      const core = new FetchClient({ baseURL });
      const authJwks = new AuthJwksService(core);
      fetchJwks = () => authJwks.getOAuthAppJwks({ client_id: clientId! });
    }

    let publicKey: crypto.KeyObject;
    try {
      publicKey = await this.getPublicKey(header.kid, cacheKey, fetchJwks);
    } catch {
      this.clearCache(cacheKey);
      publicKey = await this.getPublicKey(header.kid, cacheKey, fetchJwks);
    }

    return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as T;
  }

  /**
   * Clear cache (useful for testing or key rotation)
   */
  clearCache(cacheKey?: string): void {
    if (cacheKey) {
      this.cache.delete(cacheKey);
    } else {
      this.cache.clear();
    }
  }
}

/**
 * Convenience function to verify a token (environment or OAuth app).
 */
export async function verifyToken<T = unknown>(options: VerifyTokenOptions): Promise<T> {
  const verifier = new TokenVerifier();
  return verifier.verifyToken<T>(options);
}

export interface VerifyOAuthTokenOptions {
  token: string;
  clientId: string;
  runtimeApiUrl?: string | undefined;
}

/**
 * Convenience function to verify an OAuth app access token using the app's client_id.
 * Fetches the public JWKS from the runtime API (no auth required).
 */
export async function verifyOAuthToken<T = unknown>(options: VerifyOAuthTokenOptions): Promise<T> {
  return verifyToken<T>({
    ...options,
    clientId: options.clientId,
  });
}
