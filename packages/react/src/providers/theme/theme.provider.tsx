import React, { useEffect, useMemo, useState } from 'react';

import type { Theme, ThemeContextValue } from './theme.context';
import { ThemeContext } from './theme.context';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  /**
   * Whether to automatically detect and sync with parent app's theme
   * @default true
   */
  autoDetect?: boolean;
}

/**
 * ThemeProvider component that manages theme state and syncs with system preferences
 *
 * Supports automatic detection of parent app's theme (e.g., next-themes) via
 * MutationObserver watching for class changes on the document element.
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultTheme="system" storageKey="my-app-theme">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'blimu-theme',
  autoDetect = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }
    const stored = localStorage.getItem(storageKey) as Theme | null;
    return stored || defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }
    return getResolvedTheme(theme);
  });

  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
      return;
    }

    root.classList.add(theme);
    setResolvedTheme(theme);
  }, [theme]);

  // Persist theme to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // Auto-detect parent app's theme changes (e.g., next-themes)
  useEffect(() => {
    if (!autoDetect || typeof window === 'undefined') {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          const isLight = document.documentElement.classList.contains('light');

          // Only sync if parent app has explicitly set a theme class
          if (isDark || isLight) {
            const detectedTheme = isDark ? 'dark' : 'light';
            if (resolvedTheme !== detectedTheme) {
              setResolvedTheme(detectedTheme);
            }
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [autoDetect, resolvedTheme]);

  // Listen to system theme changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      const systemTheme = e.matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
    }),
    [theme, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Get the resolved theme (light or dark) from a Theme value
 */
function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    if (typeof window === 'undefined') {
      return 'light';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
}
