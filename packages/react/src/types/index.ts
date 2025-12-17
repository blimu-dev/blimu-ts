export interface BlimuConfig {
  /** Redirect URI for auth flow (where to return after authentication) */
  redirectUri?: string;
  /** Publishable key for the environment (contains full UI domain) */
  publishableKey: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  emailVerified: boolean;
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

/**
 * Discriminated union for auth states
 * Provides type-safe state management with clear state transitions
 */
export type AuthState =
  | {
      status: 'idle';
      user: null;
      error: null;
    }
  | {
      status: 'loading';
      user: null;
      error: null;
    }
  | {
      status: 'authenticated';
      user: User;
      error: null;
    }
  | {
      status: 'unauthenticated';
      user: null;
      error: null;
    }
  | {
      status: 'error';
      user: null;
      error: string;
    };

type ReadyState = Extract<AuthState, { status: 'authenticated' | 'unauthenticated' | 'error' }>;

/**
 * Helper type guards for auth states
 */
export const AuthStateGuards = {
  isIdle: (state: AuthState): state is Extract<AuthState, { status: 'idle' }> =>
    state.status === 'idle',
  isLoading: (state: AuthState): state is Extract<AuthState, { status: 'loading' }> =>
    state.status === 'loading',
  isAuthenticated: (state: AuthState): state is Extract<AuthState, { status: 'authenticated' }> =>
    state.status === 'authenticated',
  isUnauthenticated: (
    state: AuthState,
  ): state is Extract<AuthState, { status: 'unauthenticated' }> =>
    state.status === 'unauthenticated',
  isError: (state: AuthState): state is Extract<AuthState, { status: 'error' }> =>
    state.status === 'error',
  isReady: (state: AuthState): state is ReadyState =>
    state.status === 'authenticated' || state.status === 'unauthenticated',
} as const;

export interface AuthContextValue {
  // State (discriminated union)
  state: AuthState;

  // Actions
  login: (returnUrl?: string) => void; // Redirects to auth domain for authentication
  logout: () => Promise<void>;

  // Utilities
  getToken: (options: { template: 'web' }) => Promise<string | null>;
  getAuthState: () => AuthState;
}
