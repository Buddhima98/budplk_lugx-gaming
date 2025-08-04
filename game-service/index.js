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

app.get('/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.post('/games', async (req, res) => {
  const { name, category, release_date, price } = req.body;
  try {
    await pool.query(
      'INSERT INTO games (name, category, release_date, price) VALUES ($1, $2, $3, $4)',
      [name, category, release_date, price]
    );
    res.json({ message: 'Game added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add game' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Game service running on port ${PORT}`));
