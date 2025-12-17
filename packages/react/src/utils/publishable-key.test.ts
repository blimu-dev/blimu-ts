import { describe, expect, it } from 'vitest';

import { LIVE_PUBLISHABLE_KEY, TEST_PUBLISHABLE_KEY } from '../__tests__/utils/fixtures';
import {
  decodePublishableKey,
  getAuthApiUrl,
  getAuthDomainFromPublishableKey,
} from './publishable-key';

describe('publishable-key utilities', () => {
  describe('decodePublishableKey', () => {
    it('should decode a valid test publishable key', () => {
      const result = decodePublishableKey(TEST_PUBLISHABLE_KEY);
      expect(result).not.toBeNull();
      expect(result?.isProduction).toBe(false);
      expect(result?.uiDomain).toBeTruthy();
    });

    it('should decode a valid live publishable key', () => {
      const result = decodePublishableKey(LIVE_PUBLISHABLE_KEY);
      expect(result).not.toBeNull();
      expect(result?.isProduction).toBe(true);
      expect(result?.uiDomain).toBeTruthy();
    });

    it('should return null for invalid format', () => {
      expect(decodePublishableKey('invalid_key')).toBeNull();
      expect(decodePublishableKey('pk_invalid_')).toBeNull();
      expect(decodePublishableKey('')).toBeNull();
    });

    it('should return null for key without encoded part', () => {
      expect(decodePublishableKey('pk_test_')).toBeNull();
      expect(decodePublishableKey('pk_live_')).toBeNull();
    });

    it('should handle keys with special characters in domain', () => {
      // Test with a key that has a domain with special characters
      const keyWithSpecialChars = 'pk_test_' + btoa('test-domain.blimuauth.com$extra');
      const result = decodePublishableKey(keyWithSpecialChars);
      expect(result).not.toBeNull();
      expect(result?.uiDomain).toBe('test-domain.blimuauth.com');
    });
  });

  describe('getAuthDomainFromPublishableKey', () => {
    it('should return https URL for test domain', () => {
      const result = getAuthDomainFromPublishableKey(TEST_PUBLISHABLE_KEY);
      expect(result).toMatch(/^https:\/\//);
      expect(result).not.toBeNull();
    });

    it('should return https URL for live domain', () => {
      const result = getAuthDomainFromPublishableKey(LIVE_PUBLISHABLE_KEY);
      expect(result).toMatch(/^https:\/\//);
      expect(result).not.toBeNull();
    });

    it('should return http URL for localhost', () => {
      const localhostKey = 'pk_test_' + btoa('localhost:3000');
      const result = getAuthDomainFromPublishableKey(localhostKey);
      expect(result).toBe('http://localhost:3000');
    });

    it('should return http URL for localhost with subdomain', () => {
      const localhostKey = 'pk_test_' + btoa('subdomain.localhost:3000');
      const result = getAuthDomainFromPublishableKey(localhostKey);
      expect(result).toMatch(/^http:\/\//);
      expect(result).toContain('localhost');
    });

    it('should return null for invalid key', () => {
      expect(getAuthDomainFromPublishableKey('invalid')).toBeNull();
    });
  });

  describe('getAuthApiUrl', () => {
    it('should return API URL for test environment with .blimuauth.com', () => {
      const testKey = 'pk_test_' + btoa('subdomain.blimuauth.com');
      const result = getAuthApiUrl(testKey);
      expect(result).toBe('https://subdomain.api.blimuauth.com');
    });

    it('should return API URL for test environment with .dev-blimuauth.com', () => {
      const testKey = 'pk_test_' + btoa('subdomain.dev-blimuauth.com');
      const result = getAuthApiUrl(testKey);
      expect(result).toBe('https://subdomain.api.dev-blimuauth.com');
    });

    it('should return API URL for live environment', () => {
      const liveKey = 'pk_live_' + btoa('id.example.com');
      const result = getAuthApiUrl(liveKey);
      expect(result).toBe('https://blimu.example.com');
    });

    it('should return null for live environment without id. prefix', () => {
      const liveKey = 'pk_live_' + btoa('example.com');
      const result = getAuthApiUrl(liveKey);
      // Live environment requires id. prefix
      expect(result).toBeNull();
    });

    it('should return http URL for localhost', () => {
      const localhostKey = 'pk_test_' + btoa('localhost:3000');
      const result = getAuthApiUrl(localhostKey);
      expect(result).toBe('http://localhost:3000');
    });

    it('should return null for invalid key', () => {
      expect(getAuthApiUrl('invalid')).toBeNull();
    });
  });
});
