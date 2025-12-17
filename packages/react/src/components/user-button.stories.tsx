import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { withAuthenticatedUser } from '../../.storybook/decorators';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useAuth, useUser } from '../hooks/use-auth';
import { UserButton } from './user-button';

// Subtle debug component - shows a small dot indicator in the corner
function AuthDebug() {
  const { state, isLoading, isAuthenticated } = useAuth();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

  // Green when authenticated, red when not
  const dotColor = isAuthenticated ? '#22c55e' : '#ef4444';

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
      }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: dotColor,
              border: '2px solid var(--background)',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            aria-label="Auth debug info"
          />
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end" side="bottom" sideOffset={8}>
          <div className="space-y-2">
            <div className="font-semibold text-sm mb-3">Auth Debug Info</div>
            <div className="text-xs space-y-1">
              <div>
                <span className="font-medium">Status:</span>{' '}
                <span className="text-muted-foreground">{state.status}</span>
              </div>
              <div>
                <span className="font-medium">Loading:</span>{' '}
                <span className="text-muted-foreground">{isLoading ? 'true' : 'false'}</span>
              </div>
              <div>
                <span className="font-medium">Authenticated:</span>{' '}
                <span className="text-muted-foreground">{isAuthenticated ? 'true' : 'false'}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <div className="font-medium mb-1">User:</div>
                <pre className="text-xs text-muted-foreground overflow-auto max-h-40">
                  {user ? JSON.stringify(user, null, 2) : 'null'}
                </pre>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

const meta = {
  title: 'Components/UserButton',
  component: UserButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A user button component that displays user information and provides account management options. Requires authenticated state (provided by MSW handlers).',
      },
    },
  },
  decorators: [withAuthenticatedUser()],
} satisfies Meta<typeof UserButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default user button with full user information (firstName, lastName, email)
 */
export const Default: Story = {
  render: () => (
    <>
      <AuthDebug />
      <UserButton />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default user button with authenticated user showing full name and email.',
      },
    },
  },
};

/**
 * User button with minimal user information (email only, no firstName/lastName)
 * Note: This requires updating MSW handlers to return minimal user data
 */
export const Minimal: Story = {
  parameters: {
    docs: {
      description: {
        story: 'User button with minimal user information (email only).',
      },
    },
  },
};
