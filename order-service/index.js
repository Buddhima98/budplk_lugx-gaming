const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'postgres',
  database: process.env.DB_NAME || 'lugx',
  password: process.env.DB_PASS || 'password',
  port: 5432,
});

app.get('/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/orders', async (req, res) => {
  const { customer_name, items, total_price } = req.body;
  try {
    await pool.query(
      'INSERT INTO orders (customer_name, items, total_price) VALUES ($1, $2, $3)',
      [customer_name, JSON.stringify(items), total_price]
    );
    res.json({ message: 'Order created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
