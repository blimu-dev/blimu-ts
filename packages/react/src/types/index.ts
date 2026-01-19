/**
 * Theme colors that can be customized
 */
export interface BlimuThemeColors {
  background?: string;
  foreground?: string;
  card?: string;
  cardForeground?: string;
  popover?: string;
  popoverForeground?: string;
  primary?: string;
  primaryForeground?: string;
  secondary?: string;
  secondaryForeground?: string;
  muted?: string;
  mutedForeground?: string;
  accent?: string;
  accentForeground?: string;
  destructive?: string;
  destructiveForeground?: string;
  border?: string;
  input?: string;
  ring?: string;
}

/**
 * Border radius presets
 */
export type BlimuRadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Theme configuration for Blimu components
 */
export interface BlimuTheme {
  /** Color overrides using CSS color values (e.g., 'oklch(0.5 0.2 250)', '#3b82f6') */
  colors?: BlimuThemeColors;
  /** Border radius preset or custom CSS value */
  radius?: BlimuRadiusPreset | string;
}

export interface BlimuConfig {
  /** Redirect URI for auth flow (where to return after authentication) */
  redirectUri?: string | undefined;
  /** Publishable key for the environment (contains full UI domain) */
  publishableKey: string;
  /** Theme customization */
  theme?: BlimuTheme | undefined;
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
  getToken: (options: { template: 'web' }) => Promise<string | undefined>;
  getAuthState: () => AuthState;
}

/**
 * Known class keys for component customization
 * These are the specific sub-elements that can be styled via the `classes` prop
 */
export type ComponentClassKey =
  // UserButton component
  | 'avatar'
  | 'avatarFallback'
  | 'userInfo'
  | 'userName'
  | 'userEmail'
  | 'trigger'
  | 'popover'
  | 'signOutButton'
  | 'manageAccountButton';

/**
 * Component customization props for className overrides
 * Allows styling specific sub-elements of components
 *
 * @example
 * ```tsx
 * <UserButton
 *   classes={{
 *     avatar: 'ring-2 ring-primary',
 *     trigger: 'hover:scale-105',
 *   }}
 * />
 * ```
 */
export type ComponentClasses = Partial<Record<ComponentClassKey, string>>;

/**
 * Common props for all Blimu components
 */
export interface BlimuComponentProps {
  /** Custom className to apply to the root element */
  className?: string | undefined;
  /** Object of classNames to apply to specific sub-elements */
  classes?: ComponentClasses | undefined;
}
