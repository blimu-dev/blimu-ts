import * as React from 'react';

import { UserAvatar } from './user-avatar';
import { cn } from '../lib/utils';

import { useMembers, type ResourceMember } from '../hooks/use-members';

export interface MembersListProps {
  /**
   * Resource type (e.g., 'organization', 'workspace')
   */
  resourceType: string;

  /**
   * Resource ID
   */
  resourceId: string;

  /**
   * Initial page number
   * @default 1
   */
  initialPage?: number;

  /**
   * Items per page
   * @default 20
   */
  pageSize?: number;

  /**
   * Search query
   */
  search?: string;

  /**
   * Custom render function for each member
   */
  renderMember?: (member: ResourceMember) => React.ReactNode;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Show pagination controls
   * @default true
   */
  showPagination?: boolean;
}

/**
 * Paginated list of organization/resource members
 *
 * @example
 * ```tsx
 * <MembersList
 *   resourceType="organization"
 *   resourceId="org_123"
 * />
 * ```
 *
 * @example With custom rendering
 * ```tsx
 * <MembersList
 *   resourceType="workspace"
 *   resourceId="ws_456"
 *   renderMember={(member) => (
 *     <div className="flex items-center gap-2">
 *       <UserAvatar src={member.user.avatarUrl} alt={member.user.email} />
 *       <div>
 *         <p>{member.user.firstName} {member.user.lastName}</p>
 *         <p className="text-sm text-muted-foreground">{member.user.email}</p>
 *       </div>
 *       <Badge>{member.role}</Badge>
 *     </div>
 *   )}
 * />
 * ```
 */
export function MembersList({
  resourceType,
  resourceId,
  initialPage = 1,
  pageSize = 20,
  search,
  renderMember,
  className,
  showPagination = true,
}: MembersListProps) {
  const [page, setPage] = React.useState(initialPage);
  const { members, total, isLoading, error, hasNextPage, hasPreviousPage, refetch } = useMembers({
    resourceType,
    resourceId,
    page,
    limit: pageSize,
    search,
  });

  const defaultRenderMember = (member: ResourceMember) => {
    const displayName =
      member.user.firstName && member.user.lastName
        ? `${member.user.firstName} ${member.user.lastName}`
        : member.user.firstName || member.user.email?.split('@')[0] || 'User';

    return (
      <div className="flex items-center justify-between p-3 rounded-blimu hover:bg-blimu-accent transition-colors">
        <div className="flex items-center gap-3">
          <UserAvatar
            src={member.user.avatarUrl || undefined}
            alt={member.user.email}
            fallback={displayName}
            size="default"
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium text-blimu-foreground">{displayName}</p>
            <p className="text-xs text-blimu-muted-foreground">{member.user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {member.inherited && (
            <span className="text-xs text-blimu-muted-foreground">(inherited)</span>
          )}
          <span className="text-xs font-medium text-blimu-foreground bg-blimu-muted px-2 py-1 rounded-blimu-sm">
            {member.role}
          </span>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className={cn('p-4 text-center', className)}>
        <p className="text-sm text-blimu-destructive">Error loading members: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-sm text-blimu-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading && members.length === 0) {
    return (
      <div className={cn('p-4 text-center', className)}>
        <p className="text-sm text-blimu-muted-foreground">Loading members...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className={cn('p-4 text-center', className)}>
        <p className="text-sm text-blimu-muted-foreground">No members found</p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex flex-col divide-y divide-blimu-border">
        {members.map((member) => (
          <div key={member.userId}>
            {renderMember ? renderMember(member) : defaultRenderMember(member)}
          </div>
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-blimu-border">
          <div className="text-sm text-blimu-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total}{' '}
            members
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!hasPreviousPage || isLoading}
              className="px-3 py-1 text-sm rounded-blimu border border-blimu-input bg-blimu-background hover:bg-blimu-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-blimu-foreground">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!hasNextPage || isLoading}
              className="px-3 py-1 text-sm rounded-blimu border border-blimu-input bg-blimu-background hover:bg-blimu-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
