import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Settings, CreditCard, User } from 'lucide-react';

import { withAuthenticatedUser } from '../../.storybook/decorators';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { DropdownMenuItem } from './ui/dropdown-menu';
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
              border: '2px solid var(--blimu-background)',
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
                <span className="text-blimu-muted-foreground">{state.status}</span>
              </div>
              <div>
                <span className="font-medium">Loading:</span>{' '}
                <span className="text-blimu-muted-foreground">{isLoading ? 'true' : 'false'}</span>
              </div>
              <div>
                <span className="font-medium">Authenticated:</span>{' '}
                <span className="text-blimu-muted-foreground">
                  {isAuthenticated ? 'true' : 'false'}
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-blimu-border">
                <div className="font-medium mb-1">User:</div>
                <pre className="text-xs text-blimu-muted-foreground overflow-auto max-h-40">
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
          'A user button component that displays user information and provides account management options. Uses Radix DropdownMenu for the menu.',
      },
    },
  },
  decorators: [withAuthenticatedUser()],
  argTypes: {
    showEmail: {
      control: 'boolean',
      description: 'Show user email in dropdown',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showNameInTrigger: {
      control: 'boolean',
      description: 'Show user name in trigger button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showEmailInTrigger: {
      control: 'boolean',
      description: 'Show user email in trigger button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    avatarPos: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Avatar position in trigger button when text is shown',
      table: {
        type: { summary: "'left' | 'right'" },
        defaultValue: { summary: "'left'" },
      },
    },
    className: {
      control: 'text',
      description: 'Custom className for styling',
    },
  },
  args: {
    showEmail: true,
    showNameInTrigger: false,
    showEmailInTrigger: false,
    avatarPos: 'left',
  },
} satisfies Meta<typeof UserButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default user button with full user information (firstName, lastName, email)
 * Use the controls panel to toggle boolean props.
 */
export const Default: Story = {
  render: (args) => (
    <>
      <AuthDebug />
      <UserButton {...args} />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default user button with authenticated user showing full name and email. Use the controls panel to toggle boolean props.',
      },
    },
  },
};

/**
 * User button with name and email in trigger
 */
export const WithTriggerText: Story = {
  render: (args) => (
    <>
      <AuthDebug />
      <UserButton {...args} showNameInTrigger showEmailInTrigger />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'User button with name and email displayed in the trigger button alongside the avatar.',
      },
    },
  },
};

/**
 * User button with only name in trigger
 */
export const WithNameInTrigger: Story = {
  render: (args) => (
    <>
      <AuthDebug />
      <UserButton {...args} showNameInTrigger />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User button with only the name displayed in the trigger button.',
      },
    },
  },
};

/**
 * User button with avatar on the right
 */
export const AvatarOnRight: Story = {
  render: (args) => (
    <>
      <AuthDebug />
      <UserButton {...args} showNameInTrigger showEmailInTrigger avatarPos="right" />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User button with name and email on the left and avatar on the right.',
      },
    },
  },
};

/**
 * User button with email hidden
 */
export const WithoutEmail: Story = {
  render: (args) => (
    <>
      <AuthDebug />
      <UserButton {...args} showEmail={false} />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User button with email hidden from the dropdown.',
      },
    },
  },
};

/**
 * User button with custom styling
 */
export const CustomStyling: Story = {
  render: (args) => (
    <>
      <AuthDebug />
      <UserButton
        {...args}
        className="ring-2 ring-blimu-primary ring-offset-2"
        appearance={{
          elements: {
            userButtonPopover: 'bg-blimu-popover border-2 border-blimu-primary',
          },
        }}
      />
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User button with custom styling via className and appearance props.',
      },
    },
  },
};

/**
 * User button with custom menu items
 */
export const WithCustomMenuItems: Story = {
  render: (args) => (
    <>
      <AuthDebug />
      <UserButton {...args}>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing</span>
        </DropdownMenuItem>
      </UserButton>
    </>
  ),
  parameters: {
    docs: {
      description: {
        story: 'User button with custom menu items added via children prop.',
      },
    },
  },
};

/**
 * User button with custom sign out handler
 */
export const CustomSignOut: Story = {
  render: (args) => {
    const [signOutCalled, setSignOutCalled] = useState(false);

    return (
      <>
        <AuthDebug />
        <div className="space-y-4">
          <UserButton
            {...args}
            onSignOut={() => {
              setSignOutCalled(true);
              console.log('Custom sign out handler called');
            }}
          />
          {signOutCalled && (
            <div className="mt-4 p-4 bg-blimu-muted rounded-blimu text-sm">
              Custom sign out handler was called!
            </div>
          )}
        </div>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'User button with custom sign out callback handler.',
      },
    },
  },
};

/**
 * User button in dark mode
 * Note: Dark mode is automatically applied via Storybook preview decorator
 */
export const DarkMode: Story = {
  render: (args) => (
    <>
      <AuthDebug />
      <div className="p-8 bg-blimu-background rounded-blimu">
        <UserButton {...args} />
      </div>
    </>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'User button in dark mode. Toggle dark mode in Storybook toolbar to see the theme change.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};
