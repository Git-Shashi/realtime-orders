import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const OP_META = {
  INSERT: { icon: '✚', label: 'NEW', color: 'text-accent-new' },
  UPDATE: { icon: '↑', label: 'UPDATED', color: 'text-accent-pending' },
  DELETE: { icon: '✕', label: 'DELETED', color: 'text-accent-delete' },
};

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-IN', { hour12: false });
}

function FeedEntry({ entry }) {
  const meta = OP_META[entry.operation] ?? OP_META.INSERT;
  return (
    <div className="flex flex-col gap-1 px-3 py-2 border-b border-border animate-fade-in">
      <div className="flex items-center gap-1.5">
        <span className={cn('font-mono text-[12px] font-medium', meta.color)}>
          {meta.icon} {meta.label}
        </span>
        <span className="font-mono text-[12px] text-text-muted ml-auto">#{entry.data?.id}</span>
      </div>
      <span className="font-mono text-[12px] text-text-secondary truncate">
        {entry.data?.customer_name} — {entry.data?.product_name}
      </span>
      <span className="font-mono text-[11px] text-text-muted text-right">
        {formatTime(entry.timestamp)}
      </span>
    </div>
  );
}

export function ActivityFeed({ entries }) {
  return (
    <Card className="flex flex-col overflow-hidden w-80 flex-shrink-0">
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
      </CardHeader>
      <div className="overflow-y-auto flex-1">
        {entries.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-text-muted font-mono text-[12px]">
            Waiting for events...
          </div>
        ) : (
          entries.map((entry, i) => <FeedEntry key={i} entry={entry} />)
        )}
      </div>
    </Card>
  );
}
