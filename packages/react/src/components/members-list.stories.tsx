import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './ui/badge';
import { withAuthenticatedUser } from '../../.storybook/decorators';
import { MembersList } from './members-list';
import { UserAvatar } from './user-avatar';

const meta = {
  title: 'Components/MembersList',
  component: MembersList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A paginated list component that displays organization/resource members with support for custom rendering.',
      },
    },
  },
  decorators: [withAuthenticatedUser()],
  argTypes: {
    resourceType: {
      control: 'text',
      description: 'Resource type (e.g., organization, workspace)',
    },
    resourceId: {
      control: 'text',
      description: 'Resource ID',
    },
    initialPage: {
      control: 'number',
      description: 'Initial page number',
    },
    pageSize: {
      control: 'number',
      description: 'Items per page',
    },
    search: {
      control: 'text',
      description: 'Search query',
    },
    showPagination: {
      control: 'boolean',
      description: 'Show pagination controls',
    },
    className: {
      control: 'text',
      description: 'Custom className for styling',
    },
  },
} satisfies Meta<typeof MembersList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default members list
 */
export const Default: Story = {
  args: {
    resourceType: 'organization',
    resourceId: 'org_123',
    pageSize: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default members list with standard rendering and pagination.',
      },
    },
  },
};

/**
 * Members list with custom rendering
 */
export const CustomRendering: Story = {
  args: {
    resourceType: 'workspace',
    resourceId: 'ws_456',
    pageSize: 5,
    renderMember: (member) => (
      <div className="flex items-center justify-between p-4 rounded-blimu border border-blimu-border hover:bg-blimu-accent transition-colors">
        <div className="flex items-center gap-3">
          <UserAvatar
            src={member.user.avatarUrl || undefined}
            alt={member.user.email}
            fallback={
              member.user.firstName && member.user.lastName
                ? `${member.user.firstName[0]}${member.user.lastName[0]}`
                : member.user.email[0].toUpperCase()
            }
            size="lg"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blimu-foreground">
                {member.user.firstName && member.user.lastName
                  ? `${member.user.firstName} ${member.user.lastName}`
                  : member.user.email.split('@')[0]}
              </span>
              {member.inherited && (
                <Badge variant="outline" className="text-xs">
                  Inherited
                </Badge>
              )}
            </div>
            <span className="text-xs text-blimu-muted-foreground">{member.user.email}</span>
          </div>
        </div>
        <Badge>{member.role}</Badge>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Members list with custom rendering function for each member.',
      },
    },
  },
};

/**
 * Members list without pagination
 */
export const WithoutPagination: Story = {
  args: {
    resourceType: 'organization',
    resourceId: 'org_123',
    pageSize: 20,
    showPagination: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Members list with pagination controls hidden.',
      },
    },
  },
};

/**
 * Members list with search
 */
export const WithSearch: Story = {
  args: {
    resourceType: 'workspace',
    resourceId: 'ws_456',
    search: 'john',
    pageSize: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Members list with search query applied.',
      },
    },
  },
};

/**
 * Members list with custom styling
 */
export const CustomStyling: Story = {
  args: {
    resourceType: 'organization',
    resourceId: 'org_123',
    pageSize: 10,
    className: 'border border-blimu-border rounded-blimu p-4 bg-blimu-card',
  },
  parameters: {
    docs: {
      description: {
        story: 'Members list with custom styling via className prop.',
      },
    },
  },
};

/**
 * Compact members list
 */
export const Compact: Story = {
  args: {
    resourceType: 'workspace',
    resourceId: 'ws_456',
    pageSize: 15,
    renderMember: (member) => (
      <div className="flex items-center gap-2 p-2 rounded-blimu hover:bg-blimu-accent transition-colors">
        <UserAvatar src={member.user.avatarUrl || undefined} alt={member.user.email} size="sm" />
        <span className="text-sm text-blimu-foreground">
          {member.user.firstName || member.user.email.split('@')[0]}
        </span>
        <span className="text-xs text-blimu-muted-foreground ml-auto">{member.role}</span>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact members list with minimal information displayed.',
      },
    },
  },
};

/**
 * Empty state (no members)
 */
export const EmptyState: Story = {
  args: {
    resourceType: 'organization',
    resourceId: 'org_empty',
    pageSize: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Members list showing empty state when no members are found.',
      },
    },
  },
};
