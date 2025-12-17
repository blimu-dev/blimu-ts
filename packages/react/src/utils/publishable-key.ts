/**
 * Utility functions for working with publishable keys
 *
 * Publishable key format: pk_test_<base64(fullUIDomain)>
 * or pk_live_<base64(fullUIDomain)> for production
 *
 * Test: {subdomain}.blimuauth.com
 * Live: id.{rootDomain}
 */

export interface DecodedPublishableKey {
  uiDomain: string;
  isProduction: boolean;
}

// CAUTION: Order matters, dev-blimuauth.com must be first
const developmentDomains = ['.dev-blimuauth.com', '.blimuauth.com'];

/**
 * Decode publishable key to extract full UI domain
 *
 * @param publishableKey - The publishable key (e.g., pk_test_... or pk_live_...)
 * @returns Decoded information or null if invalid
 */
export function decodePublishableKey(publishableKey: string): DecodedPublishableKey | null {
  try {
    // Remove prefix (pk_test_ or pk_live_)
    const prefixMatch = publishableKey.match(/^pk_(test|live)_(.+)$/);
    if (!prefixMatch) {
      return null;
    }

    const isProduction = prefixMatch[1] === 'live';
    const encoded = prefixMatch[2];

    if (!encoded) {
      return null;
    }

    // Decode base64url
    const decoded = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    const uiDomain = decoded.trim().split('$')[0];

    if (!uiDomain) {
      return null;
    }

    return { uiDomain, isProduction };
  } catch (error) {
    console.error('Failed to decode publishable key:', publishableKey, error);
    return null;
  }
}

/**
 * Get auth UI domain URL from publishable key
 *
 * @param publishableKey - The publishable key
 * @returns Auth UI domain URL (e.g., https://subdomain.blimuauth.com or https://id.scrunchai.com)
 */
export function getAuthDomainFromPublishableKey(publishableKey: string): string | null {
  const decoded = decodePublishableKey(publishableKey);
  if (!decoded) {
    return null;
  }

  // For localhost development, use http://
  if (decoded.uiDomain === 'localhost' || decoded.uiDomain.includes('localhost')) {
    return `http://${decoded.uiDomain}`;
  }

  return `https://${decoded.uiDomain}`;
}

/**
 * Get auth API domain URL from publishable key
 *
 * Test environment: {subdomain}.api.blimuauth.com
 * Live environment: blimu.{customDomain}
 *
 * @param publishableKey - The publishable key
 * @returns Auth API domain URL (e.g., https://subdomain.api.blimuauth.com or https://blimu.scrunchai.com)
 */
export function getAuthApiUrl(publishableKey: string): string | null {
  const decoded = decodePublishableKey(publishableKey);
  if (!decoded) {
    return null;
  }

  // For localhost development
  if (decoded.uiDomain === 'localhost' || decoded.uiDomain.includes('localhost')) {
    return `http://${decoded.uiDomain}`;
  }

  if (decoded.isProduction) {
    // Live: Replace "id." with "blimu." to get API domain
    // e.g., id.scrunchai.com -> blimu.scrunchai.com
    if (decoded.uiDomain.startsWith('id.')) {
      const apiDomain = decoded.uiDomain.replace(/^id\./, 'blimu.');
      return `https://${apiDomain}`;
    }
    return null;
  } else {
    for (const domain of developmentDomains) {
      if (decoded.uiDomain.endsWith(domain)) {
        const subdomain = decoded.uiDomain.replace(domain, '');
        return `https://${subdomain}.api${domain}`;
      }
    }

    return null;
  }
}
