import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '../lib/utils';
import { avatarVariants, type AvatarVariants } from '../lib/variants';

export interface UserAvatarProps extends React.ComponentPropsWithoutRef<typeof Avatar> {
  /**
   * Image source URL
   */
  src?: string;

  /**
   * Alt text for the image
   */
  alt?: string;

  /**
   * Fallback text or initials to display when image is not available
   */
  fallback?: string;

  /**
   * Size variant
   * @default "default"
   */
  size?: AvatarVariants['size'];

  /**
   * Custom className
   */
  className?: string;
}

/**
 * UserAvatar component that displays a user's profile picture with fallback
 *
 * @example
 * ```tsx
 * <UserAvatar
 *   src="/avatar.jpg"
 *   alt="John Doe"
 *   fallback="JD"
 *   size="lg"
 * />
 * ```
 */
export function UserAvatar({
  src,
  alt,
  fallback,
  size = 'default',
  className,
  ...props
}: UserAvatarProps) {
  const fallbackText =
    fallback ||
    alt
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ||
    'U';

  return (
    <Avatar className={cn(avatarVariants({ size }), className)} {...props}>
      {src && <AvatarImage src={src} alt={alt} />}
      <AvatarFallback className="bg-blimu-muted text-blimu-muted-foreground text-sm font-medium">
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
}
