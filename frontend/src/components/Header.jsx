import { cn } from '@/lib/utils';

export function Header({ status }) {
  const connected = status === 'connected';
  return (
    <header className="bg-bg-secondary border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-300',
            connected ? 'bg-accent-shipped' : 'bg-accent-delete'
          )}
        />
        <span className="text-[13px] font-mono text-text-secondary">
          {connected ? 'Connected' : 'Reconnecting...'}
        </span>
      </div>
      <h1 className="text-lg font-medium tracking-tight">Orders Dashboard</h1>
      <div className="w-32" />
    </header>
  );
}
