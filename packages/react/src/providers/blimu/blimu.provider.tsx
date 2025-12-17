import React, { useMemo } from 'react';

import { BlimuRuntimeClientWrapper } from '../../client/runtime-client';
import { useStore } from '../../hooks/use-store';
import type { BlimuRadiusPreset, BlimuTheme } from '../../types';
import { AuthProvider } from '../auth/auth.provider';
import { BlimuContext } from './blimu.context';

interface BlimuProviderProps {
  publishableKey: string;
  children: React.ReactNode;
  theme?: BlimuTheme;
}

/**
 * Convert theme configuration to CSS custom properties
 */
function themeToStyleVars(theme?: BlimuTheme): React.CSSProperties {
  if (!theme) return {};

  const vars: Record<string, string> = {};

  // Map colors to CSS variables
  if (theme.colors) {
    const colorMap: Record<keyof typeof theme.colors, string> = {
      background: '--blimu-background',
      foreground: '--blimu-foreground',
      card: '--blimu-card',
      cardForeground: '--blimu-card-foreground',
      popover: '--blimu-popover',
      popoverForeground: '--blimu-popover-foreground',
      primary: '--blimu-primary',
      primaryForeground: '--blimu-primary-foreground',
      secondary: '--blimu-secondary',
      secondaryForeground: '--blimu-secondary-foreground',
      muted: '--blimu-muted',
      mutedForeground: '--blimu-muted-foreground',
      accent: '--blimu-accent',
      accentForeground: '--blimu-accent-foreground',
      destructive: '--blimu-destructive',
      destructiveForeground: '--blimu-destructive-foreground',
      border: '--blimu-border',
      input: '--blimu-input',
      ring: '--blimu-ring',
    };

    Object.entries(theme.colors).forEach(([key, value]) => {
      if (value) {
        const varName = colorMap[key as keyof typeof theme.colors];
        if (varName) {
          vars[varName] = value;
        }
      }
    });
  }

  // Map radius to CSS variable
  if (theme.radius) {
    const radiusMap: Record<BlimuRadiusPreset, string> = {
      none: '0',
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      full: '9999px',
    };

    vars['--blimu-radius'] =
      radiusMap[theme.radius as BlimuRadiusPreset] ?? theme.radius;
  }

  return vars as React.CSSProperties;
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
 * @example With theme customization
 * ```tsx
 * function App() {
 *   return (
 *     <BlimuProvider
 *       publishableKey="pk_..."
 *       theme={{
 *         colors: {
 *           primary: 'oklch(0.5 0.2 250)',
 *           background: '#ffffff',
 *         },
 *         radius: 'lg',
 *       }}
 *     >
 *       <YourApp />
 *     </BlimuProvider>
 *   );
 * }
 * ```
 */
export function BlimuProvider({ publishableKey, children, theme }: BlimuProviderProps) {
  const client = useMemo(() => new BlimuRuntimeClientWrapper({ publishableKey }), [publishableKey]);
  const state = useStore(client.store);
  const themeVars = useMemo(() => themeToStyleVars(theme), [theme]);

  const value = {
    client,
    state,
    config: {
      publishableKey,
      redirectUri: window.location.origin,
      theme,
    },
  };

  return (
    <div data-blimu style={themeVars}>
      <BlimuContext.Provider value={value}>
        <AuthProvider>{children}</AuthProvider>
      </BlimuContext.Provider>
    </div>
  );
}
