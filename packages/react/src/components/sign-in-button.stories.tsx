import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { withAuthenticatedUser } from '../../.storybook/decorators';
import { SignInButton } from './sign-in-button';

const meta = {
  title: 'Components/SignInButton',
  component: SignInButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A button component that triggers the authentication flow. Redirects unauthenticated users to the sign-in page.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'destructive'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Button size variant',
    },
    redirectUrl: {
      control: 'text',
      description: 'URL to redirect to after sign-in',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
    className: {
      control: 'text',
      description: 'Custom className for styling',
    },
  },
} satisfies Meta<typeof SignInButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default sign in button
 */
export const Default: Story = {
  args: {
    children: 'Sign In',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default sign in button with standard styling.',
      },
    },
  },
};

/**
 * Sign in button variants
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <SignInButton variant="default">Default</SignInButton>
        <SignInButton variant="outline">Outline</SignInButton>
        <SignInButton variant="ghost">Ghost</SignInButton>
        <SignInButton variant="destructive">Destructive</SignInButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variant styles.',
      },
    },
  },
};

/**
 * Sign in button sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SignInButton size="sm">Small</SignInButton>
      <SignInButton size="default">Default</SignInButton>
      <SignInButton size="lg">Large</SignInButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button size variants.',
      },
    },
  },
};

/**
 * Sign in button with custom text
 */
export const CustomText: Story = {
  args: {
    children: 'Get Started',
  },
  parameters: {
    docs: {
      description: {
        story: 'Sign in button with custom text content.',
      },
    },
  },
};

/**
 * Sign in button with redirect URL
 */
export const WithRedirect: Story = {
  args: {
    children: 'Sign In to Dashboard',
    redirectUrl: '/dashboard',
  },
  parameters: {
    docs: {
      description: {
        story: 'Sign in button that redirects to a specific URL after authentication.',
      },
    },
  },
};

/**
 * Sign in button with custom styling
 */
export const CustomStyling: Story = {
  args: {
    children: 'Sign In',
    className: 'shadow-lg ring-2 ring-blimu-primary ring-offset-2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Sign in button with custom styling via className prop.',
      },
    },
  },
};

/**
 * Sign in button in different contexts
 */
export const InContext: Story = {
  render: () => (
    <div className="space-y-8 p-8 bg-blimu-background rounded-blimu border border-blimu-border">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-blimu-foreground">Welcome Back</h2>
        <p className="text-sm text-blimu-muted-foreground">Sign in to continue to your account</p>
      </div>
      <div className="flex flex-col gap-3">
        <SignInButton className="w-full">Sign In</SignInButton>
        <SignInButton variant="outline" className="w-full">
          Sign In with Email
        </SignInButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Sign in button used in a typical authentication context.',
      },
    },
  },
};
