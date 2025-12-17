import * as React from 'react';

import { cn } from '../lib/utils';
import { buttonVariants, type ButtonVariants } from '../lib/variants';

import { useAuth } from '../hooks/use-auth';

export interface SignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variant style
   * @default "default"
   */
  variant?: ButtonVariants['variant'];

  /**
   * Size variant
   * @default "default"
   */
  size?: ButtonVariants['size'];

  /**
   * URL to redirect to after sign-in
   */
  redirectUrl?: string;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Button content
   */
  children?: React.ReactNode;
}

/**
 * Button component that triggers the authentication flow
 *
 * @example
 * ```tsx
 * <SignInButton>Sign In</SignInButton>
 * ```
 *
 * @example With custom variant and redirect
 * ```tsx
 * <SignInButton
 *   variant="outline"
 *   size="lg"
 *   redirectUrl="/dashboard"
 * >
 *   Sign In to Dashboard
 * </SignInButton>
 * ```
 */
export function SignInButton({
  variant = 'default',
  size = 'default',
  redirectUrl,
  className,
  children = 'Sign In',
  ...props
}: SignInButtonProps) {
  const { login, isAuthenticated } = useAuth();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) {
      props.onClick(e);
    }

    if (!isAuthenticated) {
      const returnUrl = redirectUrl || window.location.href;
      login(returnUrl);
    }
  };

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
