import { useEffect } from 'react';

import { useAuth } from '../hooks/use-auth';

export interface RedirectToSignInProps {
  /**
   * URL to redirect to after sign up
   * Note: In Blimu, this is used as the return URL after authentication
   */
  signUpFallbackRedirectUrl?: string;
  /**
   * URL to redirect to after sign in
   * Note: In Blimu, this is used as the return URL after authentication
   */
  signInFallbackRedirectUrl?: string;
  /**
   * Force redirect even if already authenticated
   * @default false
   */
  forceRedirect?: boolean;
}

/**
 * Component that redirects unauthenticated users to the sign-in page
 *
 * This component automatically redirects users to the authentication page
 * when they are not authenticated. It matches Clerk's RedirectToSignIn API
 * for easier migration.
 *
 * @example
 * ```tsx
 * function ProtectedRoute() {
 *   const { isAuthenticated } = useAuth();
 *
 *   if (!isAuthenticated) {
 *     return <RedirectToSignIn signInFallbackRedirectUrl="/dashboard" />;
 *   }
 *
 *   return <ProtectedContent />;
 * }
 * ```
 */
export function RedirectToSignIn({
  signUpFallbackRedirectUrl,
  signInFallbackRedirectUrl,
  forceRedirect = false,
}: RedirectToSignInProps) {
  const { login, isAuthenticated, isLoading, isIdle } = useAuth();

  useEffect(() => {
    // Wait for auth to be ready (not idle) and not loading
    const isReady = !isIdle;
    if (!isReady || isLoading) {
      return;
    }

    // Redirect if not authenticated or if force redirect is enabled
    if (!isAuthenticated || forceRedirect) {
      // Use signInFallbackRedirectUrl if provided, otherwise signUpFallbackRedirectUrl, otherwise current URL
      let returnUrl =
        signInFallbackRedirectUrl || signUpFallbackRedirectUrl || window.location.href;

      // if it's not a full URL, add the current origin
      if (!returnUrl.startsWith('http')) {
        returnUrl = `${window.location.origin}${returnUrl}`;
      }

      login(returnUrl);
    }
  }, [
    isIdle,
    isLoading,
    isAuthenticated,
    forceRedirect,
    signInFallbackRedirectUrl,
    signUpFallbackRedirectUrl,
    login,
  ]);

  // Return null while redirecting (component will unmount after redirect)
  return null;
}
