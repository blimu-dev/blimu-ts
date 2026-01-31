import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  TokenVerifier,
  verifyToken,
  verifyOAuthToken,
  type JWK,
  type JWKSet,
} from '../token-verifier';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

// Mock fetch globally
global.fetch = vi.fn();

/** Response-like object so FetchClient's parseResponse (response.headers.get) works when using AuthJwksService. */
function createMockFetchResponse<T>(body: T) {
  return {
    ok: true,
    status: 200,
    headers: {
      get: (name: string) => (name.toLowerCase() === 'content-type' ? 'application/json' : null),
    },
    json: () => Promise.resolve(body),
  };
}

// Mock console methods to avoid noise in tests
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

describe('TokenVerifier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    consoleLogSpy.mockClear();
    consoleErrorSpy.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('JWKS fetching (via TokenVerifier)', () => {
    it('should call environment JWKS endpoint when secretKey is provided', async () => {
      const mockJWKSet: JWKSet = {
        keys: [{ kty: 'RSA', use: 'sig', kid: 'test-kid-1', alg: 'RS256', n: 'n', e: 'AQAB' }],
      };

      (global.fetch as any).mockResolvedValueOnce(createMockFetchResponse(mockJWKSet));

      const verifier = new TokenVerifier();
      const token = jwt.sign({ sub: 'user123' }, 'secret', {
        algorithm: 'HS256',
        header: { alg: 'HS256', kid: 'test-kid-1' },
      });

      try {
        await verifier.verifyToken({ secretKey: 'test-key', token });
      } catch {
        // Verification fails; we only check fetch was called with env JWKS URL
      }

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.blimu.dev/v1/auth/.well-known/jwks.json',
        expect.any(Object)
      );
    });
  });

  describe('JWK to KeyObject conversion', () => {
    it('should convert valid JWK to KeyObject', () => {
      // Generate a real RSA key pair to get valid JWK values
      const { publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
      });

      const keyObject = crypto.createPublicKey(publicKey);
      const jwk = keyObject.export({ format: 'jwk' }) as any;

      const mockJWK: JWK = {
        kty: jwk.kty,
        use: 'sig',
        kid: 'test-kid-1',
        alg: 'RS256',
        n: jwk.n!,
        e: jwk.e!,
      };

      const verifier = new TokenVerifier();

      // Should not throw for valid JWK
      const result = (verifier as any).jwkToKeyObject(mockJWK);
      expect(result).toBeInstanceOf(crypto.KeyObject);
    });

    it('should throw error for invalid JWK', () => {
      // Use an invalid kty that will definitely cause an error
      const invalidJWK: JWK = {
        kty: 'INVALID',
        use: 'sig',
        kid: 'test-kid-1',
        alg: 'RS256',
        n: 'invalid-n-value',
        e: 'invalid-e-value',
      };

      const verifier = new TokenVerifier();

      expect(() => {
        (verifier as any).jwkToKeyObject(invalidJWK);
      }).toThrow();
    });
  });

  describe('Token verification', () => {
    it('should throw error if none of secretKey or clientId is provided', async () => {
      const verifier = new TokenVerifier();

      await expect(
        verifier.verifyToken({
          token: 'invalid-token',
        })
      ).rejects.toThrow('Exactly one of secretKey or clientId must be provided');
    });

    it('should throw error if more than one of secretKey, clientId is provided', async () => {
      const verifier = new TokenVerifier();

      await expect(
        verifier.verifyToken({
          secretKey: 'test-key',
          clientId: 'my-client',
          token: 'invalid-token',
        })
      ).rejects.toThrow('Exactly one of secretKey or clientId must be provided');
    });

    it('should use OAuth JWKS endpoint when clientId is provided', async () => {
      const customUrl = 'https://custom-api.example.com';
      const verifier = new TokenVerifier({ runtimeApiUrl: customUrl });
      const clientId = 'my-oauth-app-client-id';

      const token = jwt.sign({ sub: 'user123' }, 'secret', {
        algorithm: 'HS256',
        header: { alg: 'HS256', kid: 'test-kid' },
      });

      const mockJWKSet: JWKSet = {
        keys: [
          {
            kty: 'RSA',
            use: 'sig',
            kid: 'test-kid',
            alg: 'RS256',
            n: 'test-n-value',
            e: 'AQAB',
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce(createMockFetchResponse(mockJWKSet));

      try {
        await verifier.verifyToken({
          clientId,
          token,
        });
      } catch {
        // Expected to fail at verification; we only check the endpoint
      }

      const expectedUrl = `${customUrl}/v1/auth/oauth/.well-known/jwks.json?client_id=${encodeURIComponent(clientId)}`;
      expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
      // OAuth endpoint does not use api key
      const firstCall = (global.fetch as any).mock.calls[0];
      const init = firstCall?.[1];
      expect(init?.headers?.get?.('X-API-KEY') ?? init?.headers?.['X-API-KEY']).toBeFalsy();
    });

    it('should throw error for invalid token format', async () => {
      const verifier = new TokenVerifier();

      await expect(
        verifier.verifyToken({
          secretKey: 'test-key',
          token: 'not-a-valid-jwt',
        })
      ).rejects.toThrow('Invalid token format');
    });

    it('should throw error if token missing kid in header', async () => {
      // Create a token without kid
      const tokenWithoutKid = jwt.sign({ sub: 'user123' }, 'secret', {
        algorithm: 'HS256',
        header: { alg: 'HS256' }, // No kid
      });

      const verifier = new TokenVerifier();

      await expect(
        verifier.verifyToken({
          secretKey: 'test-key',
          token: tokenWithoutKid,
        })
      ).rejects.toThrow('Token missing kid in header');
    });

    it('should use custom runtimeApiUrl when provided', async () => {
      const customUrl = 'https://custom-api.example.com';
      const verifier = new TokenVerifier({ runtimeApiUrl: customUrl });

      // Create a mock token with kid
      const token = jwt.sign({ sub: 'user123' }, 'secret', {
        algorithm: 'HS256',
        header: { alg: 'HS256', kid: 'test-kid' },
      });

      const mockJWKSet: JWKSet = {
        keys: [
          {
            kty: 'RSA',
            use: 'sig',
            kid: 'test-kid',
            alg: 'RS256',
            n: 'test-n-value',
            e: 'AQAB',
          },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce(createMockFetchResponse(mockJWKSet));

      // This will fail at verification, but we can check the endpoint
      try {
        await verifier.verifyToken({
          secretKey: 'test-key',
          token,
        });
      } catch {
        // Expected to fail, but check that correct endpoint was called
        expect(global.fetch).toHaveBeenCalledWith(
          `${customUrl}/v1/auth/.well-known/jwks.json`,
          expect.any(Object)
        );
      }
    });
  });

  describe('Cache functionality', () => {
    it('should cache JWK keys (second call uses cache)', async () => {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });

      const keyObject = crypto.createPublicKey(publicKey);
      const jwk = keyObject.export({ format: 'jwk' }) as any;

      const mockJWKSet: JWKSet = {
        keys: [
          {
            kty: jwk.kty,
            use: 'sig',
            kid: 'test-kid-1',
            alg: 'RS256',
            n: jwk.n!,
            e: jwk.e!,
          },
        ],
      };

      const token = jwt.sign({ sub: 'user123' }, privateKey, {
        algorithm: 'RS256',
        header: { alg: 'RS256', kid: 'test-kid-1' },
      });

      (global.fetch as any).mockResolvedValue(createMockFetchResponse(mockJWKSet));

      const verifier = new TokenVerifier();

      const payload1 = await verifier.verifyToken({
        secretKey: 'test-api-key',
        token,
      });
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(payload1).toBeDefined();

      const payload2 = await verifier.verifyToken({
        secretKey: 'test-api-key',
        token,
      });
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(payload2).toBeDefined();
    });

    it('should clear cache when clearCache is called', () => {
      const verifier = new TokenVerifier();

      // Generate a real key for the cache
      const { publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
      });
      const keyObject = crypto.createPublicKey(publicKey);

      // Add something to cache manually
      (verifier as any).cache.set('test-key', {
        key: keyObject,
        kid: 'test-kid',
        expiresAt: Date.now() + 3600000,
      });

      expect((verifier as any).cache.has('test-key')).toBe(true);

      verifier.clearCache('test-key');

      expect((verifier as any).cache.has('test-key')).toBe(false);
    });

    it('should clear all cache when clearCache is called without argument', () => {
      const verifier = new TokenVerifier();

      // Add multiple items to cache
      (verifier as any).cache.set('key1', { key: null, kid: 'kid1', expiresAt: Date.now() });
      (verifier as any).cache.set('key2', { key: null, kid: 'kid2', expiresAt: Date.now() });

      expect((verifier as any).cache.size).toBe(2);

      verifier.clearCache();

      expect((verifier as any).cache.size).toBe(0);
    });
  });

  describe('Retry logic', () => {
    it('should retry once after cache clear on failure', async () => {
      // Generate a real RSA key pair
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });

      const keyObject = crypto.createPublicKey(publicKey);
      const jwk = keyObject.export({ format: 'jwk' }) as any;

      const mockJWKSet: JWKSet = {
        keys: [
          {
            kty: jwk.kty,
            use: 'sig',
            kid: 'test-kid-1',
            alg: 'RS256',
            n: jwk.n!,
            e: jwk.e!,
          },
        ],
      };

      const token = jwt.sign({ sub: 'user123' }, privateKey, {
        algorithm: 'RS256',
        header: { alg: 'RS256', kid: 'test-kid-1' },
      });

      // First call fails, second succeeds (FetchClient needs headers.get on response)
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          headers: { get: () => null },
          text: () => Promise.resolve('Internal Server Error'),
        })
        .mockResolvedValueOnce(createMockFetchResponse(mockJWKSet));

      const verifier = new TokenVerifier();

      // This should fail on first attempt, clear cache, retry, and succeed
      const payload = await verifier.verifyToken({
        secretKey: 'test-api-key',
        token,
      });

      // Should succeed after retry
      expect(payload).toBeDefined();
      expect((payload as any).sub).toBe('user123');

      // Should have been called twice (first failed, retry succeeded)
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('verifyOAuthToken convenience function', () => {
    it('should verify OAuth token using clientId', async () => {
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });

      const keyObject = crypto.createPublicKey(publicKey);
      const jwk = keyObject.export({ format: 'jwk' }) as any;

      const mockJWKSet: JWKSet = {
        keys: [
          {
            kty: jwk.kty,
            use: 'sig',
            kid: 'test-kid-1',
            alg: 'RS256',
            n: jwk.n!,
            e: jwk.e!,
          },
        ],
      };

      const token = jwt.sign({ sub: 'user123' }, privateKey, {
        algorithm: 'RS256',
        header: { alg: 'RS256', kid: 'test-kid-1' },
      });

      (global.fetch as any).mockResolvedValueOnce(createMockFetchResponse(mockJWKSet));

      const payload = await verifyOAuthToken({
        token,
        clientId: 'my-oauth-client',
        runtimeApiUrl: 'https://api.blimu.dev',
      });

      expect(payload).toBeDefined();
      expect((payload as any).sub).toBe('user123');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.blimu.dev/v1/auth/oauth/.well-known/jwks.json?client_id=my-oauth-client',
        expect.any(Object)
      );
    });
  });

  describe('verifyToken convenience function', () => {
    it('should create TokenVerifier and verify token', async () => {
      // Generate a real RSA key pair
      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
      });

      const keyObject = crypto.createPublicKey(publicKey);
      const jwk = keyObject.export({ format: 'jwk' }) as any;

      const mockJWKSet: JWKSet = {
        keys: [
          {
            kty: jwk.kty,
            use: 'sig',
            kid: 'test-kid-1',
            alg: 'RS256',
            n: jwk.n!,
            e: jwk.e!,
          },
        ],
      };

      const token = jwt.sign({ sub: 'user123' }, privateKey, {
        algorithm: 'RS256',
        header: { alg: 'RS256', kid: 'test-kid-1' },
      });

      (global.fetch as any).mockResolvedValueOnce(createMockFetchResponse(mockJWKSet));

      const payload = await verifyToken({
        secretKey: 'test-api-key',
        token,
      });

      expect(payload).toBeDefined();
      expect((payload as any).sub).toBe('user123');
    });
  });
});
