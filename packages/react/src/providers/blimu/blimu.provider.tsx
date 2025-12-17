import { useStore } from '../../hooks/use-store';
import React, { useEffect, useMemo } from 'react';

import { BlimuRuntimeClientWrapper } from '../../client/runtime-client';
import { AuthProvider } from '../auth/auth.provider';
import { ThemeProvider } from '../theme';
import { BlimuContext, type AppearanceConfig } from './blimu.context';

interface BlimuProviderProps {
  publishableKey: string;
  children: React.ReactNode;
  /**
   * Appearance configuration for theming and customization
   */
  appearance?: AppearanceConfig;
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
 *
 * @example With appearance configuration
 * ```tsx
 * <BlimuProvider
 *   publishableKey="pk_..."
 *   appearance={{
 *     baseTheme: 'dark',
 *     inheritTheme: true,
 *     variables: {
 *       colorPrimary: '#3b82f6',
 *     },
 *   }}
 * >
 *   <YourApp />
 * </BlimuProvider>
 * ```
 */
export function BlimuProvider({ publishableKey, children, appearance }: BlimuProviderProps) {
  const client = useMemo(() => new BlimuRuntimeClientWrapper({ publishableKey }), [publishableKey]);
  const state = useStore(client.store);

  // Apply CSS variable overrides if provided
  useEffect(() => {
    if (appearance?.variables && typeof document !== 'undefined') {
      const root = document.documentElement;
      const variables = appearance.variables;
      Object.entries(variables).forEach(([key, value]) => {
        // Ensure key starts with -- if not already
        const cssVar = key.startsWith('--') ? key : `--${key}`;
        root.style.setProperty(cssVar, value);
      });

      return () => {
        // Cleanup: remove custom variables on unmount
        if (variables) {
          Object.keys(variables).forEach((key) => {
            const cssVar = key.startsWith('--') ? key : `--${key}`;
            root.style.removeProperty(cssVar);
          });
        }
      };
    }
  }, [appearance?.variables]);

  const value = useMemo(
    () => ({
      client,
      state,
      config: {
        publishableKey,
        redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
      },
      appearance,
    }),
    [client, state, publishableKey, appearance],
  );

  const themeProviderProps = {
    defaultTheme: appearance?.baseTheme || 'system',
    autoDetect: appearance?.inheritTheme !== false,
  };

  return (
    <BlimuContext.Provider value={value}>
      <ThemeProvider {...themeProviderProps}>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </BlimuContext.Provider>
  );
}
