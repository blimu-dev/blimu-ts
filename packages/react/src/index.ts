/*
 * @blimu/react - Blimu React SDK
 *
 * ## Styling
 *
 * Choose the appropriate CSS import for your project:
 *
 * ### Non-Tailwind Projects (Full Styles)
 * ```ts
 * import '@blimu/react/styles';
 * ```
 * Includes all Tailwind base styles and Blimu component styles.
 *
 * ### Tailwind v4 Projects (Components Only)
 * ```ts
 * import '@blimu/react/tw-styles';
 * ```
 * Use this in your main CSS file. Includes only Blimu CSS variables and component styles.
 * The blimuPlugin is optional for v4 projects.
 *
 * ### Tailwind v3 Projects (Components Only + Plugin)
 * ```ts
 * import '@blimu/react/tw-styles';
 * ```
 * Import in your main CSS file, and add the blimuPlugin to your tailwind.config.js:
 * ```js
 * import { blimuPlugin } from '@blimu/react';
 * export default {
 *   plugins: [blimuPlugin],
 * };
 * ```
 */

// Core exports
export type {
  MembersListProps,
  RedirectToSignInProps,
  SignInButtonProps,
  UserAvatarProps,
  UserButtonProps,
} from './components';
export { MembersList, RedirectToSignIn, SignInButton, UserAvatar, UserButton } from './components';
export type { ResourceMember, UseAuthReturn, UseMembersOptions, UseMembersResult } from './hooks';
export { useAuth, useBlimu, useClient, useMembers, useUser } from './hooks';
export type { AppearanceConfig, Theme, ThemeContextValue } from './providers';
export { BlimuProvider, ThemeProvider, useTheme } from './providers';

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

// Tailwind plugin (required for Tailwind v3, optional for v4)
export { blimuPlugin } from './tailwind.plugin';
