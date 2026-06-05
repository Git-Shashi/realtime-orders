import { pool } from './db.js';

const customers = [
  'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Neha Gupta', 'Suresh Reddy',
  'Kavita Singh', 'Arjun Mehta', 'Deepa Nair', 'Vikram Joshi', 'Anita Desai',
];

const products = [
  'Wireless Mouse', 'Mechanical Keyboard', 'USB-C Hub', 'Monitor Stand',
  'Laptop Sleeve', 'Webcam HD', 'Desk Lamp', 'Ergonomic Chair',
  'Standing Desk', 'Noise-Cancelling Headphones',
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInterval() {
  return 3000 + Math.random() * 2000;
}

async function doInsert() {
  const customer = pick(customers);
  const product = pick(products);
  const result = await pool.query(
    'INSERT INTO orders (customer_name, product_name) VALUES ($1, $2) RETURNING id',
    [customer, product]
  );
  console.log(`[SEED] INSERT order #${result.rows[0].id} - ${customer} - ${product}`);
}

async function doUpdate() {
  const result = await pool.query(
    `UPDATE orders
     SET status = CASE status
       WHEN 'pending' THEN 'shipped'
       WHEN 'shipped' THEN 'delivered'
       ELSE 'delivered'
     END
     WHERE id = (
       SELECT id FROM orders WHERE status IN ('pending', 'shipped') ORDER BY RANDOM() LIMIT 1
     )
     RETURNING id, customer_name, status`
  );
  if (result.rows.length > 0) {
    const { id, customer_name, status } = result.rows[0];
    console.log(`[SEED] UPDATE order #${id} - ${customer_name} → ${status}`);
    return true;
  }
  return false;
}

async function doDelete() {
  const result = await pool.query(
    `DELETE FROM orders
     WHERE id = (
       SELECT id FROM orders WHERE status = 'delivered' ORDER BY RANDOM() LIMIT 1
     )
     RETURNING id, customer_name`
  );
  if (result.rows.length > 0) {
    const { id, customer_name } = result.rows[0];
    console.log(`[SEED] DELETE order #${id} - ${customer_name}`);
    return true;
  }
  return false;
}

async function tick() {
  try {
    const roll = Math.random();
    if (roll < 0.40) {
      await doInsert();
    } else if (roll < 0.75) {
      const ok = await doUpdate();
      if (!ok) await doInsert();
    } else {
      const ok = await doDelete();
      if (!ok) await doInsert();
    }
  } catch (err) {
    console.error('[SEED] Error:', err.message);
  }
}

export function startSeed() {
  console.log('[SEED] Auto-seeder started (every 3-5 seconds)');
  const schedule = () => {
    const delay = randomInterval();
    setTimeout(async () => {
      await tick();
      schedule();
    }, delay);
  };
  schedule();
}
