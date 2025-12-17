import React, { useEffect, useState } from 'react';
import type { Preview } from '@storybook/react';
import { setupWorker } from 'msw/browser';
import Cookies from 'js-cookie';
import '../src/index.css';
import '../src/styles/globals.css';
import { handlers } from './msw-handlers';
import { createMockJWT } from './jwt-utils';

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
  },
  decorators: [
    // Dark mode decorator - syncs with system preference or Storybook theme
    (Story) => {
      useEffect(() => {
        // Check system preference on mount
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const updateDarkMode = (isDark: boolean) => {
          if (isDark) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
          }
        };

        // Initial update based on system preference
        updateDarkMode(prefersDark);

        // Listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
          updateDarkMode(e.matches);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleChange);
          return () => {
            mediaQuery.removeEventListener('change', handleChange);
          };
        } else {
          // Fallback for older browsers
          mediaQuery.addListener(handleChange);
          return () => {
            mediaQuery.removeListener(handleChange);
          };
        }
      }, []);

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
        <div style={{ padding: '2rem', minHeight: '100vh' }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
