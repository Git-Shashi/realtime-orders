import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full bg-bg-tertiary border border-border px-3 py-2',
        'text-sm text-text-primary font-mono placeholder:text-text-muted',
        'focus-visible:outline-none focus-visible:border-text-muted',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
