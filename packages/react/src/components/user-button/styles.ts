import { cva, type VariantProps } from 'class-variance-authority';

/**
 * UserButton trigger variant styles
 */
export const userButtonTriggerVariants = cva(
  'inline-flex items-center justify-center rounded-full transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blimu-ring focus-visible:ring-offset-2 focus-visible:ring-offset-blimu-background disabled:pointer-events-none disabled:opacity-50 hover:opacity-80 text-blimu-foreground p-1',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-blimu-input bg-blimu-background',
        ghost: 'hover:bg-blimu-accent hover:text-blimu-accent-foreground',
      },
      size: {
        default: 'h-10 min-w-[2.5rem]',
        sm: 'h-8 min-w-[2rem]',
        lg: 'h-12 min-w-[3rem]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type UserButtonTriggerVariants = VariantProps<typeof userButtonTriggerVariants>;

/**
 * UserButton dropdown content styles
 */
export const userButtonContentVariants = cva(
  'z-50 min-w-[260px] overflow-hidden rounded-blimu border border-blimu-border bg-blimu-popover text-blimu-popover-foreground shadow-md',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type UserButtonContentVariants = VariantProps<typeof userButtonContentVariants>;
