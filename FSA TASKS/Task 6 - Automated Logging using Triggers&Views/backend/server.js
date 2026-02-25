const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Backend server is running! Use /api/daily-activity to see data.');
});

// API to get daily activity
app.get('/api/daily-activity', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM daily_employee_activity ORDER BY activity_date DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database query failed' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
