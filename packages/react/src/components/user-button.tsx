import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

import { useAuth, useUser } from '../hooks/use-auth';
import type { BlimuComponentProps } from '../types';

export interface UserButtonProps extends BlimuComponentProps {
  /** Callback when user clicks "Manage account" */
  onManageAccount?: () => void;
}

export function UserButton({ className, classes, onManageAccount }: UserButtonProps = {}) {
  const { logout } = useAuth();
  const { user } = useUser();
  const [open, setOpen] = useState(false);

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

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer',
            className,
            classes?.trigger,
          )}
        >
          <Avatar className={cn('w-8 h-8', classes?.avatar)}>
            <AvatarFallback
              className={cn(
                'bg-muted text-muted-foreground text-sm font-medium',
                classes?.avatarFallback,
              )}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className={cn('flex flex-col items-start', classes?.userInfo)}>
            <span className={cn('text-sm text-foreground leading-tight', classes?.userName)}>
              {displayName}
            </span>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-90 p-0 bg-popover shadow-lg border border-border rounded-lg',
          classes?.popover,
        )}
        style={{
          width: '400px',
        }}
        align="end"
        sideOffset={8}
      >
        <div>
          <div className="flex items-center gap-3 p-4">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary text-primary-foreground text-base font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-foreground">{displayName}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>

          <Separator />

          <button
            onClick={() => {
              setOpen(false);
              onManageAccount?.();
            }}
            className={cn(
              'w-full flex items-center gap-3 p-4 text-sm text-foreground hover:bg-accent transition-colors cursor-pointer',
              classes?.manageAccountButton,
            )}
          >
            <Settings className="size-4 text-muted-foreground" />
            <span>Manage account</span>
          </button>

          <Separator />

          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 p-4 text-sm text-foreground hover:bg-accent transition-colors cursor-pointer',
              classes?.signOutButton,
            )}
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
            <span>Sign out</span>
          </button>

          <Separator className="bg-border" />

          <div className="p-4 bg-muted/50">
            <div className="flex justify-center items-center gap-2 text-xs text-muted-foreground">
              <span>Secured by</span>
              <span className="font-semibold text-foreground">Blimu</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
