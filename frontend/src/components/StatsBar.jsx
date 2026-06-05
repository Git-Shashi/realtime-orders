function StatPill({ label, count, color }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted">{label}</span>
      <span className={`text-xl font-semibold font-mono ${color ?? 'text-text-primary'}`}>{count}</span>
    </div>
  );
}

export function StatsBar({ orders }) {
  const values = Array.from(orders.values());
  const total = values.length;
  const pending = values.filter((o) => o.status === 'pending').length;
  const shipped = values.filter((o) => o.status === 'shipped').length;
  const delivered = values.filter((o) => o.status === 'delivered').length;

  return (
    <div className="bg-bg-secondary border-b border-border px-6 py-3 flex gap-6 flex-shrink-0">
      <StatPill label="Total" count={total} />
      <StatPill label="Pending" count={pending} color="text-accent-pending" />
      <StatPill label="Shipped" count={shipped} color="text-accent-shipped" />
      <StatPill label="Delivered" count={delivered} color="text-accent-delivered" />
    </div>
  );
}
