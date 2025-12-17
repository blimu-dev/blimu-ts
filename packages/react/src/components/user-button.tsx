import * as React from 'react';
import { LogOut, Settings } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '../lib/utils';

import { useAuth, useUser } from '../hooks/use-auth';
import { userButtonContentVariants, userButtonTriggerVariants } from './user-button/styles';

export interface UserButtonProps {
  /**
   * Override default styles
   */
  className?: string;

  /**
   * Show user email in dropdown
   * @default true
   */
  showEmail?: boolean;

  /**
   * Show user name in trigger button
   * @default false
   */
  showNameInTrigger?: boolean;

  /**
   * Show user email in trigger button
   * @default false
   */
  showEmailInTrigger?: boolean;

  /**
   * Avatar position in trigger button when text is shown
   * @default 'left'
   */
  avatarPos?: 'left' | 'right';

  /**
   * Custom sign out callback
   */
  onSignOut?: () => void | Promise<void>;

  /**
   * Custom menu items to append
   */
  children?: React.ReactNode;

  /**
   * Appearance configuration
   */
  appearance?: {
    elements?: {
      userButtonTrigger?: string;
      userButtonPopover?: string;
      userButtonAvatar?: string;
    };
  };
}

/**
 * A button component that displays the current user's avatar and provides
 * a dropdown menu for account actions.
 *
 * @example
 * ```tsx
 * <UserButton />
 * ```
 *
 * @example With name and email in trigger
 * ```tsx
 * <UserButton
 *   showNameInTrigger
 *   showEmailInTrigger
 * />
 * ```
 *
 * @example With avatar on the right
 * ```tsx
 * <UserButton
 *   showNameInTrigger
 *   showEmailInTrigger
 *   avatarPos="right"
 * />
 * ```
 *
 * @example With custom styling
 * ```tsx
 * <UserButton
 *   className="ring-2 ring-blue-500"
 *   appearance={{
 *     elements: {
 *       userButtonPopover: 'bg-slate-900'
 *     }
 *   }}
 * />
 * ```
 *
 * @example With custom menu items
 * ```tsx
 * <UserButton>
 *   <DropdownMenuItem>
 *     <Settings className="mr-2 h-4 w-4" />
 *     <span>Settings</span>
 *   </DropdownMenuItem>
 * </UserButton>
 * ```
 */
export function UserButton({
  className,
  showEmail = true,
  showNameInTrigger = false,
  showEmailInTrigger = false,
  avatarPos = 'left',
  onSignOut,
  children,
  appearance,
}: UserButtonProps) {
  const { logout } = useAuth();
  const { user } = useUser();

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || user?.email?.split('@')[0] || 'User';

  const initials =
    displayName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    if (onSignOut) {
      await onSignOut();
    }
    await logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            userButtonTriggerVariants({ variant: 'ghost', size: 'default' }),
            'relative',
            (showNameInTrigger || showEmailInTrigger) && 'gap-2 px-3 rounded-blimu',
            appearance?.elements?.userButtonTrigger,
            className,
          )}
          aria-label="User menu"
        >
          {avatarPos === 'left' && (
            <Avatar className={cn('h-8 w-8 shrink-0', appearance?.elements?.userButtonAvatar)}>
              {(user as { avatarUrl?: string | null })?.avatarUrl && (
                <AvatarImage
                  src={(user as { avatarUrl?: string | null }).avatarUrl || undefined}
                  alt={displayName}
                />
              )}
              <AvatarFallback className="bg-blimu-muted text-blimu-muted-foreground text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
          {(showNameInTrigger || showEmailInTrigger) && (
            <div className="flex flex-col items-start text-left">
              {showNameInTrigger && (
                <span className="text-sm font-medium text-blimu-foreground">{displayName}</span>
              )}
              {showEmailInTrigger && user.email && (
                <span className="text-xs text-blimu-muted-foreground">{user.email}</span>
              )}
            </div>
          )}
          {avatarPos === 'right' && (
            <Avatar className={cn('h-8 w-8 shrink-0', appearance?.elements?.userButtonAvatar)}>
              {(user as { avatarUrl?: string | null })?.avatarUrl && (
                <AvatarImage
                  src={(user as { avatarUrl?: string | null }).avatarUrl || undefined}
                  alt={displayName}
                />
              )}
              <AvatarFallback className="bg-blimu-muted text-blimu-muted-foreground text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className={cn(
          userButtonContentVariants(),
          'min-w-[260px] p-1',
          appearance?.elements?.userButtonPopover,
        )}
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className={cn('h-10 w-10', appearance?.elements?.userButtonAvatar)}>
            {(user as { avatarUrl?: string | null })?.avatarUrl && (
              <AvatarImage
                src={(user as { avatarUrl?: string | null }).avatarUrl || undefined}
                alt={displayName}
              />
            )}
            <AvatarFallback className="bg-blimu-muted text-blimu-muted-foreground text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-blimu-foreground">{displayName}</p>
            {showEmail && user.email && (
              <p className="text-xs text-blimu-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            // TODO: Navigate to account settings
          }}
        >
          <Settings className="mr-2 h-3.5 w-3.5" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        {children}

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
          <LogOut className="mr-2 h-3.5 w-3.5" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
