// Core exports
export type {
  RedirectToSignInProps,
  UserButtonProps,
  UserAvatarProps,
  SignInButtonProps,
  MembersListProps,
} from './components';
export { RedirectToSignIn, UserButton, UserAvatar, SignInButton, MembersList } from './components';
export { useAuth, useBlimu, useUser, useMembers, useClient } from './hooks';
export type { ResourceMember, UseMembersOptions, UseMembersResult } from './hooks';
export { BlimuProvider, ThemeProvider, useTheme } from './providers';
export type { Theme, ThemeContextValue, AppearanceConfig } from './providers';

// Types
export type { AuthContextValue, AuthState, BlimuConfig, User } from './types';
export { AuthStateGuards } from './types';

// Client (for advanced usage)
export { BlimuRuntimeClientWrapper } from './client/runtime-client';

// Utilities
export type { DecodedPublishableKey } from './utils/publishable-key';
export {
  decodePublishableKey,
  getAuthApiUrl,
  getAuthDomainFromPublishableKey,
} from './utils/publishable-key';

// Tailwind plugin
export { blimuPlugin } from './tailwind.plugin';
