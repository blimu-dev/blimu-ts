import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Button variant styles using CVA
 *
 * @example
 * ```tsx
 * import { buttonVariants } from '@blimu/react/lib/variants';
 * import { cn } from '@blimu/react/lib/utils';
 *
 * <button className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}>
 *   Click me
 * </button>
 * ```
 */
export const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-blimu transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blimu-ring focus-visible:ring-offset-2 focus-visible:ring-offset-blimu-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-blimu-primary text-blimu-primary-foreground hover:bg-blimu-primary/90',
        outline:
          'border border-blimu-input bg-blimu-background hover:bg-blimu-accent hover:text-blimu-accent-foreground',
        ghost: 'hover:bg-blimu-accent hover:text-blimu-accent-foreground',
        destructive:
          'bg-blimu-destructive text-blimu-destructive-foreground hover:bg-blimu-destructive/90',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-blimu-md px-3',
        lg: 'h-11 rounded-blimu-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

/**
 * Avatar variant styles using CVA
 *
 * @example
 * ```tsx
 * import { avatarVariants } from '@blimu/react/lib/variants';
 * import { cn } from '@blimu/react/lib/utils';
 *
 * <div className={cn(avatarVariants({ size: 'lg' }))}>
 *   <img src="..." alt="..." />
 * </div>
 * ```
 */
export const avatarVariants = cva(
  // Base styles
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        default: 'h-10 w-10',
        sm: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export type AvatarVariants = VariantProps<typeof avatarVariants>;
