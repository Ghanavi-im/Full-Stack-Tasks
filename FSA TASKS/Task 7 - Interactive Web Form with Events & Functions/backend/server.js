// -------------------- Imports --------------------
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// -------------------- Initialize App --------------------
const app = express();  // Must come BEFORE using app

// -------------------- Middleware --------------------
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- Serve Frontend --------------------
app.use(express.static(path.join(__dirname, '../frontend')));

// -------------------- MySQL Connection --------------------
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',          // your MySQL username
    password: 'Alien@0829', // your MySQL password
    database: 'feedback_system'
});

db.connect(err => {
    if(err) throw err;
    console.log("Connected to MySQL");
});

// -------------------- API Route --------------------
app.post('/submit-feedback', (req, res) => {
    const { name, email, message } = req.body;
    const sql = "INSERT INTO feedbacks (name, email, message) VALUES (?, ?, ?)";
    db.query(sql, [name, email, message], (err, result) => {
        if(err) return res.status(500).send({ success: false, message: "Database error" });
        res.send({ success: true, message: "Feedback submitted successfully!" });
    });
});

// -------------------- Start Server --------------------
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
