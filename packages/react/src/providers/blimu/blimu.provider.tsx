import { useStore } from '@blimu/react/hooks';
import React, { useMemo } from 'react';

import { BlimuRuntimeClientWrapper } from '../../client/runtime-client';
import { AuthProvider } from '../auth/auth.provider';
import { BlimuContext } from './blimu.context';

interface BlimuProviderProps {
  publishableKey: string;
  children: React.ReactNode;
}

/**
 * Provider component that initializes Blimu SDK and wraps the application
 *
 * This provider must be at the root of your application to enable authentication
 * and authorization features.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <BlimuProvider publishableKey="pk_...">
 *       <YourApp />
 *     </BlimuProvider>
 *   );
 * }
 * ```
 */
export function BlimuProvider({ publishableKey, children }: BlimuProviderProps) {
  const client = useMemo(() => new BlimuRuntimeClientWrapper({ publishableKey }), [publishableKey]);
  const state = useStore(client.store);

  const value = {
    client,
    state,
    config: {
      publishableKey,
      redirectUri: window.location.origin,
    },
  };

  return (
    <BlimuContext.Provider value={value}>
      <AuthProvider>{children}</AuthProvider>
    </BlimuContext.Provider>
  );
}
