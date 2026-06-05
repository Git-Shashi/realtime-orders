import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 text-xs font-mono',
  {
    variants: {
      variant: {
        pending: 'text-accent-pending',
        shipped: 'text-accent-shipped',
        delivered: 'text-accent-delivered',
        delete: 'text-accent-delete',
        new: 'text-accent-new',
      },
    },
    defaultVariants: { variant: 'pending' },
  }
);

function StatusDot({ variant }) {
  const colors = {
    pending: 'bg-accent-pending',
    shipped: 'bg-accent-shipped',
    delivered: 'bg-accent-delivered',
    delete: 'bg-accent-delete',
    new: 'bg-accent-new',
  };
  return <span className={cn('inline-block w-1.5 h-1.5 rounded-full flex-shrink-0', colors[variant])} />;
}

function Badge({ className, variant, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      <StatusDot variant={variant} />
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
