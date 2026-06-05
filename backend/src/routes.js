import { Router } from 'express';
import { pool } from './db.js';

const router = Router();

router.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY updated_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('[API] GET /orders error:', err.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.post('/orders', async (req, res) => {
  const { customer_name, product_name } = req.body;
  if (!customer_name || !product_name) {
    return res.status(400).json({ error: 'customer_name and product_name are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO orders (customer_name, product_name) VALUES ($1, $2) RETURNING *',
      [customer_name, product_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[API] POST /orders error:', err.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.patch('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status || !['pending', 'shipped', 'delivered'].includes(status)) {
    return res.status(400).json({ error: 'status must be one of: pending, shipped, delivered' });
  }
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[API] PATCH /orders/:id error:', err.message);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

router.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM orders WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[API] DELETE /orders/:id error:', err.message);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
