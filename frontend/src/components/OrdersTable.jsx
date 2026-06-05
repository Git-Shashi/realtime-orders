import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleTimeString('en-IN', { hour12: false });
}

function OrderRow({ order, flash }) {
  const rowRef = useRef(null);

  useEffect(() => {
    if (!flash || !rowRef.current) return;
    const el = rowRef.current;
    el.classList.add(`flash-${flash.toLowerCase()}`);
    const timer = setTimeout(() => el.classList.remove(`flash-${flash.toLowerCase()}`), 900);
    return () => clearTimeout(timer);
  }, [flash]);

  return (
    <div
      ref={rowRef}
      className={cn(
        'grid grid-cols-[60px_1fr_1fr_110px_160px] px-4 py-3 border-b border-border',
        'items-center border-l-[3px] border-l-transparent hover:bg-bg-tertiary transition-colors'
      )}
    >
      <span className="font-mono text-[13px] text-text-muted">#{order.id}</span>
      <span className="font-mono text-[13px] text-text-primary truncate pr-2">{order.customer_name}</span>
      <span className="font-mono text-[13px] text-text-secondary truncate pr-2">{order.product_name}</span>
      <Badge variant={order.status}>{order.status}</Badge>
      <span className="font-mono text-[12px] text-text-muted">{formatDate(order.updated_at)}</span>
    </div>
  );
}

export function OrdersTable({ orders, flashMap }) {
  const rows = Array.from(orders.values()).sort((a, b) => b.id - a.id);

  return (
    <Card className="flex flex-col overflow-hidden" style={{ flex: 2 }}>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <span className="ml-auto font-mono text-[11px] text-text-muted">{rows.length} records</span>
      </CardHeader>

      <div className="grid grid-cols-[60px_1fr_1fr_110px_160px] px-4 py-2.5 bg-bg-tertiary border-b border-border">
        {['ID', 'Customer', 'Product', 'Status', 'Updated'].map((h) => (
          <span key={h} className="text-[11px] font-mono uppercase tracking-widest text-text-muted">{h}</span>
        ))}
      </div>

      <div className="overflow-y-auto flex-1">
        {rows.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-text-muted font-mono text-sm">
            No orders yet. Waiting for data...
          </div>
        ) : (
          rows.map((order) => (
            <OrderRow key={order.id} order={order} flash={flashMap.get(order.id)} />
          ))
        )}
      </div>
    </Card>
  );
}
