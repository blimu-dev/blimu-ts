import { render, type RenderOptions } from '@testing-library/react';
import React, { type ReactElement } from 'react';

import { BlimuProvider } from '../../providers';
import type { BlimuConfig } from '../../types';
import { mockConfig } from './fixtures';

/**
 * Custom render function that includes all necessary providers
 * Use this instead of the default render from @testing-library/react
 *
 * @example
 * ```tsx
 * const { getByText } = renderWithProviders(<MyComponent />);
 * ```
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Custom Blimu config for testing
   * If not provided, uses mockConfig from fixtures
   */
  blimuConfig?: BlimuConfig;
}

export function renderWithProviders(
  ui: ReactElement,
  { blimuConfig = mockConfig, ...renderOptions }: CustomRenderOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <BlimuProvider publishableKey={blimuConfig.publishableKey}>{children}</BlimuProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from @testing-library/react
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';

// Re-export user-event for convenience
export { default as userEvent } from '@testing-library/user-event';
