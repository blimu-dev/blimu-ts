// Core exports
export type { RedirectToSignInProps } from './components';
export { RedirectToSignIn, UserButton } from './components';
export { useAuth, useBlimu, useUser } from './hooks';
export { BlimuProvider } from './providers';

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
