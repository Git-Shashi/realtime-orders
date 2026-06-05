import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function AddOrderForm() {
  const [customer, setCustomer] = useState('');
  const [product, setProduct] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | success

  async function handleSubmit(e) {
    e.preventDefault();
    if (!customer.trim() || !product.trim()) return;
    setState('loading');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_name: customer.trim(), product_name: product.trim() }),
      });
      if (!res.ok) throw new Error('Request failed');
      setCustomer('');
      setProduct('');
      setState('success');
      setTimeout(() => setState('idle'), 1500);
    } catch {
      setState('idle');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-bg-secondary border-t border-border px-6 py-3 flex gap-3 items-center flex-shrink-0"
    >
      <Input
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        placeholder="Customer name"
        className="w-48"
        disabled={state === 'loading'}
      />
      <Input
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        placeholder="Product name"
        className="w-48"
        disabled={state === 'loading'}
      />
      <Button type="submit" disabled={state === 'loading' || !customer.trim() || !product.trim()}>
        {state === 'success' ? 'Added!' : state === 'loading' ? 'Adding...' : '+ Add Order'}
      </Button>
    </form>
  );
}
