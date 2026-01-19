import { LogOut } from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { useAuth, useUser } from '../../hooks/use-auth';
import type { BlimuComponentProps } from '../../types';
import {
  userButtonContentVariants,
  type UserButtonTriggerVariants,
  userButtonTriggerVariants,
} from './styles';

export interface UserButtonProps extends BlimuComponentProps, UserButtonTriggerVariants {
  /** Callback when user clicks "Manage account" */
  onManageAccount?: () => void;
  /** Show user name in trigger button */
  showNameInTrigger?: boolean;
  /** Show user email in trigger button */
  showEmailInTrigger?: boolean;
  /** Avatar position when text is shown in trigger */
  avatarPos?: 'start' | 'end';
}

export function UserButton({
  className,
  classes,
  onManageAccount: _onManageAccount,
  variant,
  size,
  showNameInTrigger = false,
  showEmailInTrigger = false,
  avatarPos = 'start',
}: UserButtonProps = {}) {
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

  const showText = showNameInTrigger || showEmailInTrigger;

  const avatarElement = (
    <Avatar className={cn('w-8 h-8', classes?.avatar)}>
      <AvatarFallback
        className={cn(
          'bg-blimu-muted text-blimu-muted-foreground text-sm font-medium',
          classes?.avatarFallback,
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  const textElement = showText && (
    <div className={cn('flex flex-col items-start', classes?.userInfo)}>
      {showNameInTrigger && (
        <span className={cn('text-sm leading-tight font-medium', classes?.userName)}>
          {displayName}
        </span>
      )}
      {showEmailInTrigger && (
        <span className={cn('text-xs leading-tight opacity-70', classes?.userEmail)}>
          {user.email}
        </span>
      )}
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            userButtonTriggerVariants({ variant, size }),
            'flex items-center gap-2',
            className,
            classes?.trigger,
          )}
        >
          {avatarPos === 'start' ? (
            <>
              {avatarElement}
              {textElement}
            </>
          ) : (
            <>
              {textElement}
              {avatarElement}
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn(userButtonContentVariants(), 'w-64 p-0', classes?.popover)}
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-0 ">
          <div className="flex items-center gap-3 p-4">
            <Avatar className="size-10">
              <AvatarFallback className="bg-blimu-primary text-blimu-primary-foreground text-base font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            {displayName && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-blimu-foreground">{displayName}</span>
                <span className="text-xs text-blimu-muted-foreground">{user.email}</span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="m-0" />
        <div className="py-1.5 space-y-2">
          {/* <DropdownMenuItem
            onClick={onManageAccount}
            className={cn(
              'flex items-center gap-3 text-sm cursor-pointer',
              classes?.manageAccountButton,
            )}
          >
            <Settings className="size-4 text-blimu-muted-foreground" />
            <span>Manage account</span>
          </DropdownMenuItem> */}

          <DropdownMenuItem
            onClick={logout}
            className={cn('flex items-center gap-3 text-sm cursor-pointer', classes?.signOutButton)}
          >
            <LogOut className="w-4 h-4 text-blimu-muted-foreground" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="m-0" />

        <div className="p-4 bg-blimu-muted/50">
          <div className="flex justify-center items-center gap-2 text-xs text-blimu-muted-foreground">
            <span>Secured by</span>
            <span className="font-semibold text-blimu-foreground">Blimu</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
