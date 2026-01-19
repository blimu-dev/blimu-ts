import { useMemo } from 'react';

import { useAuthContext } from '../providers/auth/auth.hook';
import { type AuthContextValue, AuthStateGuards } from '../types';

/**
 * Return type for useAuth hook
 */
export type UseAuthReturn = AuthContextValue & {
  isIdle: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  isUnauthenticated: boolean;
  isReady: boolean;
  isError: boolean;
};

/**
 * Hook for accessing authentication state and actions
 *
 * Provides a type-safe interface to authentication state with discriminated union states
 * and convenient boolean properties for common checks.
 *
 * @example Using boolean properties
 * ```tsx
 * function MyComponent() {
 *   const { isAuthenticated, isLoading, login, logout } = useAuth();
 *
 *   if (isLoading) {
 *     return <Spinner />;
 *   }
 *
 *   if (isAuthenticated) {
 *     return (
 *       <div>
 *         <p>Welcome!</p>
 *         <button onClick={logout}>Logout</button>
 *       </div>
 *     );
 *   }
 *
 *   return <LoginForm onLogin={login} />;
 * }
 * ```
 *
 * @example Using discriminated union state for advanced cases
 * ```tsx
 * function AuthStatus() {
 *   const { state, isError } = useAuth();
 *
 *   if (isError && state.status === 'error') {
 *     return <div>Error: {state.error}</div>;
 *   }
 *
 *   return <div>Status: {state.status}</div>;
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const context = useAuthContext();
  const { state } = context;

  const booleanState = useMemo(
    () => ({
      isIdle: AuthStateGuards.isIdle(state),
      isLoading: AuthStateGuards.isLoading(state),
      isAuthenticated: AuthStateGuards.isAuthenticated(state),
      isUnauthenticated: AuthStateGuards.isUnauthenticated(state),
      isReady: AuthStateGuards.isReady(state),
      isError: AuthStateGuards.isError(state),
    }),
    [state],
  );

  return {
    ...context,
    ...booleanState,
  };
}

/**
 * Hook for getting current user information with auth state
 *
 * Returns the user object if authenticated (null otherwise) along with boolean state properties.
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { user, isAuthenticated, isLoading } = useUser();
 *
 *   if (isLoading) {
 *     return <Spinner />;
 *   }
 *
 *   if (!isAuthenticated || !user) {
 *     return <div>Not authenticated</div>;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>{user.firstName} {user.lastName}</h1>
 *       <p>{user.email}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useUser() {
  const { state } = useAuthContext();

  const user = AuthStateGuards.isAuthenticated(state) ? state.user : null;

  const booleanState = useMemo(
    () => ({
      isIdle: AuthStateGuards.isIdle(state),
      isLoading: AuthStateGuards.isLoading(state),
      isAuthenticated: AuthStateGuards.isAuthenticated(state),
      isUnauthenticated: AuthStateGuards.isUnauthenticated(state),
      isError: AuthStateGuards.isError(state),
    }),
    [state],
  );

  return {
    user,
    ...booleanState,
  };
}
