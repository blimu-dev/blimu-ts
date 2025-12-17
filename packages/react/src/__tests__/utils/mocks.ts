import React from 'react';
import { vi } from 'vitest';

import { mockUser } from './fixtures';

/**
 * Mock implementations for external dependencies
 */

// Mock @blimu/client
export const createMockBlimuClient = () => {
  const mockClient = {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        isAuthenticated: true,
        user: mockUser,
      }),
      logout: vi.fn().mockResolvedValue(undefined),
    },
    entitlements: {
      listForTenant: vi.fn().mockResolvedValue({ data: [] }),
    },
  };

  return mockClient;
};

// Mock Blimu class constructor
export const mockBlimu = vi.fn().mockImplementation(() => createMockBlimuClient());

// Mock @blimu/ui components
export const mockAvatar = vi.fn(
  ({ children, className }: { children: React.ReactNode; className?: string }) =>
    React.createElement('div', { 'data-testid': 'avatar', className }, children),
);

export const mockAvatarFallback = vi.fn(
  ({ children, className }: { children: React.ReactNode; className?: string }) =>
    React.createElement('div', { 'data-testid': 'avatar-fallback', className }, children),
);

export const mockPopover = vi.fn(
  ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => React.createElement('div', { 'data-testid': 'popover', 'data-open': open }, children),
);

export const mockPopoverTrigger = vi.fn(
  ({ children }: { children: React.ReactNode; asChild?: boolean }) =>
    React.createElement('div', { 'data-testid': 'popover-trigger' }, children),
);

export const mockPopoverContent = vi.fn(
  ({
    children,
    className,
    align,
  }: {
    children: React.ReactNode;
    className?: string;
    align?: string;
    sideOffset?: number;
  }) =>
    React.createElement(
      'div',
      { 'data-testid': 'popover-content', className, 'data-align': align },
      children,
    ),
);

export const mockSeparator = vi.fn(({ className }: { className?: string }) =>
  React.createElement('hr', { 'data-testid': 'separator', className }),
);

// Browser API mocks
export const mockWindowLocation = (initialHref = 'http://localhost:3000') => {
  const location = {
    href: initialHref,
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  };

  Object.defineProperty(window, 'location', {
    value: location,
    writable: true,
  });

  return location;
};

export const mockCookies = () => {
  const cookies: Record<string, string> = {};

  Object.defineProperty(document, 'cookie', {
    get: () => {
      return Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ');
    },
    set: (cookieString: string) => {
      const [keyValue] = cookieString.split(';');
      const [key, value] = keyValue?.split('=') ?? [];
      if (key && value) {
        cookies[key.trim()] = value.trim();
      }
    },
    configurable: true,
  });

  return {
    get: (name: string) => cookies[name],
    set: (name: string, value: string) => {
      cookies[name] = value;
    },
    clear: () => {
      Object.keys(cookies).forEach((key) => delete cookies[key]);
    },
    getAll: () => ({ ...cookies }),
  };
};

export const mockLocalStorage = () => {
  const storage: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => storage[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key];
    }),
    clear: vi.fn(() => {
      Object.keys(storage).forEach((key) => delete storage[key]);
    }),
    get length() {
      return Object.keys(storage).length;
    },
    key: vi.fn((index: number) => Object.keys(storage)[index] || null),
  };
};

/**
 * Creates a mock ExternalStore for testing
 * @param initialState - Initial state for the store
 * @returns Mock store with subscribe, getSnapshot, and setState methods
 */
export const createMockStore = <T>(initialState: T) => {
  let currentState = initialState;

  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subscribe: vi.fn((_listener: (state: T) => void) => {
      // Return unsubscribe function
      return () => {};
    }),
    getSnapshot: vi.fn(() => currentState),
    setState: vi.fn((newState: T | ((prev: T) => T)) => {
      if (typeof newState === 'function') {
        currentState = (newState as (prev: T) => T)(currentState);
      } else {
        currentState = newState;
      }
    }),
    // Helper to update state directly (for test setup)
    _setState: (state: T) => {
      currentState = state;
    },
  };
};

// Setup browser mocks (vi.mock() calls must be at module level, not in functions)
export const setupMocks = () => {
  // Setup browser mocks
  mockWindowLocation();
  mockCookies();
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage(),
    writable: true,
  });
};
