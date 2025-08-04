const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure table exists
async function initClickHouse() {
  try {
    await axios.post(
      'http://clickhouse:8123/?query=CREATE%20TABLE%20IF%20NOT%20EXISTS%20events%20(' +
        'event_type%20String,%20' +
        'page%20String,%20' +
        'session_id%20String,%20' +
        'timestamp%20DateTime' +
        ')%20ENGINE=MergeTree()%20ORDER%20BY%20timestamp'
    );
    console.log('ClickHouse events table ready.');
  } catch (err) {
    console.error('ClickHouse init failed:', err.message);
  }
}

initClickHouse();

// Track event
app.post('/track', async (req, res) => {
  const { event_type, page, session_id, timestamp } = req.body;

  try {
    const jsonBody = [
      {
        event_type,
        page,
        session_id,
        timestamp,
      },
    ];

    await axios.post(
      'http://clickhouse:8123/?query=INSERT%20INTO%20events%20FORMAT%20JSONEachRow',
      jsonBody,
      { headers: { 'Content-Type': 'application/json' } }
    );

    res.json({ message: 'Event recorded successfully' });
  } catch (error) {
    console.error('ClickHouse error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to record event' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Analytics service running on port ${PORT}`));
