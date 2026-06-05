import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium transition-opacity focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent-pending text-black hover:opacity-85',
        destructive: 'bg-accent-delete text-white hover:opacity-85',
        outline: 'border border-border bg-bg-tertiary text-text-primary hover:bg-bg-secondary',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
      },
      size: {
        default: 'px-4 py-2',
        sm: 'px-3 py-1.5 text-xs',
        lg: 'px-6 py-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = 'Button';

export { Button, buttonVariants };
