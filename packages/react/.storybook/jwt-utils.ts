/**
 * JWT token expiration constants (in seconds)
 */
const ONE_HOUR = 60 * 60;
const THIRTY_DAYS = 30 * 24 * 60 * 60;

export interface MockJWTPayload {
  sub: string;
  environmentId: string;
  type: string;
  iat: number;
  exp: number;
  se: number;
}

/**
 * Base64 URL encode a string (browser-compatible)
 * Converts to base64 and replaces URL-unsafe characters
 */
function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Create a mock JWT token for Storybook
 * Note: This creates a JWT format without actual signature verification
 * since browsers don't verify JWT signatures in this context.
 *
 * @param userId - User ID (default: 'user_123')
 * @param environmentId - Environment ID (default: 'test_environment_id')
 * @param expiresIn - Token expiration in seconds (default: 1 hour)
 * @returns JWT token string (header.payload.signature format)
 */
export function createMockJWT(
  userId: string = 'user_123',
  environmentId: string = 'test_environment_id',
  expiresIn: number = ONE_HOUR,
): string {
  const now = Math.floor(Date.now() / 1000);

  const payload: MockJWTPayload = {
    sub: userId,
    environmentId,
    type: 'session',
    iat: now,
    exp: now + expiresIn,
    se: now + THIRTY_DAYS, // Session expiration (30 days)
  };

  // Create JWT header (standard for HS256)
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Create a mock signature (just base64-encoded string, not actually signed)
  // Since browser doesn't verify signatures, this is sufficient
  const mockSignature = base64UrlEncode('storybook_mock_signature');

  // Return JWT format: header.payload.signature
  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
}
