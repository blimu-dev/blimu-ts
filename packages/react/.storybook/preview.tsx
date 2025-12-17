import '../src/index.css';

import React, { useEffect, useState } from 'react';
import type { Preview } from '@storybook/react';
import { setupWorker } from 'msw/browser';
import Cookies from 'js-cookie';
import { handlers } from './msw-handlers';
import { createMockJWT } from './jwt-utils';
import { ThemeProvider } from '../src/providers';

// Pre-set a session cookie for Storybook so components start authenticated
const SESSION_COOKIE_NAME = '__bli_session';
if (typeof window !== 'undefined' && !Cookies.get(SESSION_COOKIE_NAME)) {
  const initialJWT = createMockJWT('user_123', 'test_environment_id');
  Cookies.set(SESSION_COOKIE_NAME, initialJWT, { path: '/' });
}

// Set up MSW worker for Storybook
let worker: ReturnType<typeof setupWorker> | null = null;
let workerPromise: Promise<void> | null = null;

const initMSW = async (): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }

  if (worker) {
    return; // Already initialized
  }

  if (workerPromise) {
    return workerPromise; // Initialization in progress
  }

  workerPromise = (async () => {
    worker = setupWorker(...handlers);
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
  })();

  return workerPromise;
};

// Initialize MSW when preview loads
if (typeof window !== 'undefined') {
  initMSW();
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Add theme switcher to toolbar
    backgrounds: {
      disable: true, // Disable default backgrounds addon
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'system', title: 'System', icon: 'computer' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    // Theme decorator - syncs with Storybook toolbar theme selector
    // This applies the theme class to the document, and BlimuProvider will handle ThemeProvider
    (Story, context) => {
      const theme = context.globals.theme || 'light';

      useEffect(() => {
        const updateTheme = (newTheme: string) => {
          const root = document.documentElement;
          root.classList.remove('light', 'dark');

          if (newTheme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
            root.classList.add(systemTheme);
          } else {
            root.classList.add(newTheme);
          }
        };

        updateTheme(theme);

        // Listen for system preference changes when theme is 'system'
        if (theme === 'system') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = (e: MediaQueryListEvent) => {
            const systemTheme = e.matches ? 'dark' : 'light';
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(systemTheme);
          };

          if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => {
              mediaQuery.removeEventListener('change', handleChange);
            };
          } else {
            mediaQuery.addListener(handleChange);
            return () => {
              mediaQuery.removeListener(handleChange);
            };
          }
        }
      }, [theme]);

      return <Story />;
    },
    // MSW initialization decorator
    (Story) => {
      const [mswReady, setMswReady] = useState(false);

      useEffect(() => {
        initMSW().then(() => {
          setMswReady(true);
        });
      }, []);

      // Wait for MSW to be ready before rendering stories
      if (!mswReady) {
        return <div>Loading...</div>;
      }

      return (
        <div style={{ padding: '2rem', minHeight: 'calc(100vh - 4rem)' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
