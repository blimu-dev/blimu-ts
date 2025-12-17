import React from 'react';
import type { Decorator } from '@storybook/react';

import { BlimuProvider } from '../src/providers';
import type { User } from '../src/types';

/**
 * Publishable key for Storybook stories
 * This key decodes to: blackbird.dev-blimuauth.com
 */
const STORYBOOK_PUBLISHABLE_KEY = 'pk_test_YmxhY2tiaXJkLmRldi1ibGltdWF1dGguY29tJA';

export interface AuthenticatedUserOptions {
  /**
   * Custom user data to use in the story
   * If not provided, uses default mock user from MSW handlers
   */
  user?: Partial<User>;
  /**
   * Custom publishable key
   * If not provided, uses the default Storybook publishable key
   */
  publishableKey?: string;
}

/**
 * Decorator that wraps stories with BlimuProvider and authenticated state
 * MSW handlers will automatically provide authenticated responses
 *
 * @example
 * ```tsx
 * export default {
 *   decorators: [withAuthenticatedUser()],
 *   // ... story config
 * };
 * ```
 */
export const withAuthenticatedUser = (options: AuthenticatedUserOptions = {}): Decorator => {
  const { publishableKey = STORYBOOK_PUBLISHABLE_KEY } = options;

  return (Story, context) => {
    // Get theme from Storybook globals (set by toolbar)
    const theme = context.globals.theme || 'light';

    return (
      <BlimuProvider
        publishableKey={publishableKey}
        appearance={{
          baseTheme: theme,
          inheritTheme: false, // Don't auto-detect, use Storybook toolbar value
        }}
      >
        <div className="p-8">
          <Story />
        </div>
      </BlimuProvider>
    );
  };
};
