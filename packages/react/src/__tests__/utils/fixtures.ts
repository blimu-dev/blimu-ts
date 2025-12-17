import type { AuthState, BlimuConfig, User } from '../../types';

/**
 * Test fixtures for common test data
 */

// Sample publishable keys
export const TEST_PUBLISHABLE_KEY = 'pk_test_dGVzdC5ibGltdWF1dGguY29t';
export const LIVE_PUBLISHABLE_KEY = 'pk_live_aWQuc2NydW5jaGFpLmNvbQ==';

// Sample user objects
export const mockUser: User = {
  id: 'user_123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  emailVerified: true,
};

export const mockUserMinimal: User = {
  id: 'user_456',
  email: 'minimal@example.com',
  emailVerified: false,
};

// Sample config objects
export const mockConfig: BlimuConfig = {
  publishableKey: TEST_PUBLISHABLE_KEY,
  redirectUri: 'http://localhost:3000',
};

export const mockConfigLive: BlimuConfig = {
  publishableKey: LIVE_PUBLISHABLE_KEY,
  redirectUri: 'https://example.com',
};

// Sample auth states
export const idleState: AuthState = {
  status: 'idle',
  user: null,
  error: null,
};

export const loadingState: AuthState = {
  status: 'loading',
  user: null,
  error: null,
};

export const authenticatedState: AuthState = {
  status: 'authenticated',
  user: mockUser,
  error: null,
};

export const unauthenticatedState: AuthState = {
  status: 'unauthenticated',
  user: null,
  error: null,
};

export const errorState: AuthState = {
  status: 'error',
  user: null,
  error: 'Authentication failed',
};
