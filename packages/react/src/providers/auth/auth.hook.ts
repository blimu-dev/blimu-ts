import { useContext } from 'react';

import { AuthContext } from './auth.context';

/**
 * Internal hook for accessing auth context
 * Use the exported useAuth from hooks/use-auth.ts instead
 * @internal
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
