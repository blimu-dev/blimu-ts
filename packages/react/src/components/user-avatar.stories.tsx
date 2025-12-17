import type { Meta, StoryObj } from '@storybook/react';

import { UserAvatar } from './user-avatar';

const meta = {
  title: 'Components/UserAvatar',
  component: UserAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A user avatar component that displays a user profile picture with fallback initials.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'Size variant of the avatar',
    },
    src: {
      control: 'text',
      description: 'Image source URL',
    },
    alt: {
      control: 'text',
      description: 'Alt text for the image',
    },
    fallback: {
      control: 'text',
      description: 'Fallback text or initials to display when image is not available',
    },
    className: {
      control: 'text',
      description: 'Custom className for styling',
    },
  },
} satisfies Meta<typeof UserAvatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default avatar with image
 */
export const Default: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    alt: 'John Doe',
    fallback: 'JD',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default avatar with an image source.',
      },
    },
  },
};

/**
 * Avatar with fallback only (no image)
 */
export const FallbackOnly: Story = {
  args: {
    alt: 'Jane Smith',
    fallback: 'JS',
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar showing only fallback initials when no image is provided.',
      },
    },
  },
};

/**
 * Avatar sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <UserAvatar size="sm" alt="Small" fallback="SM" />
        <span className="text-xs text-blimu-muted-foreground">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar size="default" alt="Default" fallback="DF" />
        <span className="text-xs text-blimu-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar size="lg" alt="Large" fallback="LG" />
        <span className="text-xs text-blimu-muted-foreground">Large</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <UserAvatar size="xl" alt="Extra Large" fallback="XL" />
        <span className="text-xs text-blimu-muted-foreground">Extra Large</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available avatar size variants.',
      },
    },
  },
};

/**
 * Avatar with custom styling
 */
export const CustomStyling: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Custom',
    alt: 'Custom Avatar',
    fallback: 'CA',
    className: 'ring-2 ring-blimu-primary ring-offset-2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar with custom styling via className prop.',
      },
    },
  },
};

/**
 * Avatar with long name fallback
 */
export const LongNameFallback: Story = {
  args: {
    alt: 'Christopher Alexander Johnson',
    fallback: 'CAJ',
  },
  parameters: {
    docs: {
      description: {
        story: 'Avatar with fallback showing initials from a long name.',
      },
    },
  },
};

/**
 * Avatar grid showcase
 */
export const GridShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4">
      {[
        { name: 'Alice', seed: 'alice' },
        { name: 'Bob', seed: 'bob' },
        { name: 'Charlie', seed: 'charlie' },
        { name: 'Diana', seed: 'diana' },
        { name: 'Eve', seed: 'eve' },
        { name: 'Frank', seed: 'frank' },
        { name: 'Grace', seed: 'grace' },
        { name: 'Henry', seed: 'henry' },
      ].map((person) => (
        <div key={person.seed} className="flex flex-col items-center gap-2">
          <UserAvatar
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.seed}`}
            alt={person.name}
            fallback={person.name[0]}
          />
          <span className="text-xs text-blimu-muted-foreground">{person.name}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grid showcase of multiple avatars with different images.',
      },
    },
  },
};

/**
 * Avatar in dark mode
 * Note: Dark mode is automatically applied via Storybook preview decorator
 */
export const DarkMode: Story = {
  render: () => (
    <div className="p-8 bg-blimu-background rounded-blimu border border-blimu-border">
      <div className="flex items-center gap-4">
        <UserAvatar
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=dark"
          alt="Dark Mode Avatar"
          fallback="DM"
          size="lg"
        />
        <div>
          <p className="text-sm font-medium text-blimu-foreground">Dark Mode Example</p>
          <p className="text-xs text-blimu-muted-foreground">
            Toggle dark mode in Storybook toolbar
          </p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Avatar in dark mode. Toggle dark mode in Storybook toolbar to see the theme change.',
      },
    },
    backgrounds: {
      default: 'dark',
    },
  },
};
