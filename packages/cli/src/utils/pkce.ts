import { createHash, randomBytes } from 'crypto';

/**
 * Generate a random code verifier for PKCE
 * @returns Base64URL-encoded string (128 characters recommended)
 */
export function generateCodeVerifier(): string {
  // Generate 96 random bytes (128 base64url characters)
  const bytes = randomBytes(96);
  return base64UrlEncode(bytes);
}

/**
 * Generate a code challenge from a code verifier using S256 (SHA256)
 * @param verifier - The code verifier
 * @returns Base64URL-encoded SHA256 hash
 */
export function generateCodeChallenge(verifier: string): string {
  const hash = createHash('sha256').update(verifier).digest();
  return base64UrlEncode(hash);
}

/**
 * Validate that a code verifier produces the expected challenge
 * @param verifier - The code verifier
 * @param challenge - The expected code challenge
 * @returns True if the verifier produces the challenge
 */
export function validateCodeVerifier(verifier: string, challenge: string): boolean {
  const computedChallenge = generateCodeChallenge(verifier);
  return computedChallenge === challenge;
}

/**
 * Base64URL encode (RFC 4648 Section 5)
 * Converts base64 to base64url by replacing + with -, / with _, and removing padding
 */
function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
