import React, { useCallback, useEffect, useMemo } from 'react';

import type { AuthContextValue } from '../../types';
import { useBlimu } from '../blimu/blimu.hook';
import { AuthContext } from './auth.context';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { client, state } = useBlimu();

  useEffect(() => {
    const cleanup = client.initialize();
    return cleanup;
  }, [client]);

  // Automatic token refresh scheduling when authenticated
  // The SessionManager schedules refreshes at T-10 seconds (10 seconds before token expiration)
  // This effect manages the refresh scheduling lifecycle tied to React component lifecycle
  useEffect(() => {
    // Start scheduling when user becomes authenticated
    if (state.status === 'authenticated') {
      return client.scheduleRefresh();
    }
  }, [client, state.status]);

  const login = useCallback((returnUrl?: string) => client.redirectToAuth(returnUrl), [client]);
  const logout = useCallback(async () => client.logout(), [client]);
  const getToken = useCallback(
    (options: { template: 'web' }) => client.getAccessToken(options),
    [client],
  );

  const getAuthState = useCallback(() => client.store.getSnapshot(), [client]);

  const value: AuthContextValue = useMemo(
    () => ({
      state,
      login,
      logout,
      getToken,
      getAuthState,
    }),
    [state, login, logout, getToken, getAuthState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
