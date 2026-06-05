import * as React from 'react';
import { cn } from '@/lib/utils';

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('bg-bg-secondary border border-border', className)} {...props} />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center px-4 py-2.5 border-b border-border bg-bg-tertiary', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <span ref={ref} className={cn('text-[11px] font-mono uppercase tracking-widest text-text-muted', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
));
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
