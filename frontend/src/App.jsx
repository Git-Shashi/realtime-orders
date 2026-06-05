import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { StatsBar } from '@/components/StatsBar';
import { OrdersTable } from '@/components/OrdersTable';
import { ActivityFeed } from '@/components/ActivityFeed';
import { AddOrderForm } from '@/components/AddOrderForm';
import { Toaster } from '@/components/ui/sonner';
import { useWebSocket } from '@/hooks/useWebSocket';

const OP_TOAST_STYLE = {
  INSERT: { border: '#a855f7', label: '✚ New order' },
  UPDATE: { border: '#f59e0b', label: '↑ Order updated' },
  DELETE: { border: '#ef4444', label: '✕ Order deleted' },
};

const MAX_FEED_ENTRIES = 50;

export default function App() {
  const [status, setStatus] = useState('reconnecting');
  const [orders, setOrders] = useState(new Map());
  const [feed, setFeed] = useState([]);
  const [flashMap, setFlashMap] = useState(new Map());
  const flashTimers = useRef(new Map());

  function triggerFlash(id, type) {
    if (flashTimers.current.has(id)) {
      clearTimeout(flashTimers.current.get(id));
    }
    setFlashMap((prev) => new Map(prev).set(id, type));
    const timer = setTimeout(() => {
      setFlashMap((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
      flashTimers.current.delete(id);
    }, 900);
    flashTimers.current.set(id, timer);
  }

  function showToast(operation, data) {
    const meta = OP_TOAST_STYLE[operation] ?? OP_TOAST_STYLE.INSERT;
    toast(meta.label, {
      description: `${data?.customer_name} — ${data?.product_name}`,
      style: { borderLeftColor: meta.border },
    });
  }

  const onMessage = useCallback((msg) => {
    if (msg.type === 'initial_state') {
      const map = new Map();
      for (const order of msg.data) map.set(order.id, order);
      setOrders(map);
      return;
    }

    if (msg.type === 'change') {
      const { operation, data, timestamp } = msg;

      setFeed((prev) => {
        const entry = { operation, data, timestamp };
        const next = [entry, ...prev];
        return next.length > MAX_FEED_ENTRIES ? next.slice(0, MAX_FEED_ENTRIES) : next;
      });

      showToast(operation, data);

      if (operation === 'INSERT' || operation === 'UPDATE') {
        setOrders((prev) => new Map(prev).set(data.id, data));
        triggerFlash(data.id, operation);
      } else if (operation === 'DELETE') {
        triggerFlash(data.id, 'DELETE');
        setTimeout(() => {
          setOrders((prev) => {
            const next = new Map(prev);
            next.delete(data.id);
            return next;
          });
        }, 900);
      }
    }
  }, []);

  const onStatusChange = useCallback((s) => setStatus(s), []);

  useWebSocket({ onMessage, onStatusChange });

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header status={status} />
        <StatsBar orders={orders} />
        <AddOrderForm />
        <main className="flex gap-6 p-6 flex-1 overflow-hidden">
          <OrdersTable orders={orders} flashMap={flashMap} />
          <ActivityFeed entries={feed} />
        </main>
      </div>
      <Toaster />
    </>
  );
}
