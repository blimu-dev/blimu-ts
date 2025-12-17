import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blimu-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-blimu-primary text-blimu-primary-foreground hover:bg-blimu-primary/80',
        secondary:
          'border-transparent bg-blimu-secondary text-blimu-secondary-foreground hover:bg-blimu-secondary/80',
        destructive:
          'border-transparent bg-blimu-destructive text-blimu-destructive-foreground hover:bg-blimu-destructive/80',
        outline: 'text-blimu-foreground border-blimu-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
