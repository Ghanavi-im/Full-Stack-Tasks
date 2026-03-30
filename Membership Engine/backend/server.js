const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('./db');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }
    next();
};

// ==========================================
// AUTHENTICATION APIs
// ==========================================
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }

        // Check if user exists
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email already in use.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user (default role is User unless explicitly requested Registration as Admin - for simplicity, we allow it here)
        const userRole = role === 'Admin' ? 'Admin' : 'User';
        
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, userRole]
        );

        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid email or password.' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

        // Create token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({ message: 'Logged in successfully', token, user: { id: user.id, name: user.name, role: user.role } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// ==========================================
// PUBLIC/USER APIs
// ==========================================
// Get all available plans
app.get('/api/plans', async (req, res) => {
    try {
        const [plans] = await db.query('SELECT * FROM plans');
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch plans' });
    }
});

// Get user's current subscription
app.get('/api/my-subscription', authenticateToken, async (req, res) => {
    try {
        // We get the most recent subscription
        const [subs] = await db.query(`
            SELECT s.*, p.name as plan_name, p.price 
            FROM subscriptions s 
            JOIN plans p ON s.plan_id = p.id 
            WHERE s.user_id = ? 
            ORDER BY s.id DESC LIMIT 1
        `, [req.user.id]);

        if (subs.length === 0) {
            return res.json({ message: 'No active subscription.' });
        }

        const sub = subs[0];
        
        // Auto-expire logic Check
        const today = new Date();
        const endDate = new Date(sub.end_date);
        
        if (today > endDate && sub.status === 'Active') {
            await db.query('UPDATE subscriptions SET status = "Expired" WHERE id = ?', [sub.id]);
            sub.status = 'Expired';
        }

        res.json(sub);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch subscription' });
    }
});

// Subscribe to a plan
app.post('/api/subscribe', authenticateToken, async (req, res) => {
    try {
        const { plan_id } = req.body;
        
        // Get plan details
        const [plans] = await db.query('SELECT * FROM plans WHERE id = ?', [plan_id]);
        if (plans.length === 0) return res.status(404).json({ error: 'Plan not found.' });
        
        const plan = plans[0];

        // Expire any previous active subscriptions for this user
        await db.query('UPDATE subscriptions SET status = "Expired" WHERE user_id = ? AND status = "Active"', [req.user.id]);

        // Calculate dates
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + plan.duration_days);

        // Insert new subscription
        await db.query(
            'INSERT INTO subscriptions (user_id, plan_id, start_date, end_date, status) VALUES (?, ?, ?, ?, "Active")',
            [req.user.id, plan_id, startDate, endDate]
        );

        res.json({ message: 'Subscribed successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

// Access premium feature
app.get('/api/feature/premium', authenticateToken, async (req, res) => {
    try {
        const [subs] = await db.query(`
            SELECT s.*, p.name as plan_name 
            FROM subscriptions s 
            JOIN plans p ON s.plan_id = p.id 
            WHERE s.user_id = ? AND s.status = 'Active'
            ORDER BY s.id DESC LIMIT 1
        `, [req.user.id]);

        if (subs.length === 0) return res.status(403).json({ error: 'Access Denied: No active subscription found.' });
        
        const sub = subs[0];
        
        // Let's say basic doesn't get this feature
        if (sub.plan_name === 'Basic Plan') {
            return res.status(403).json({ error: 'Access Denied: Please upgrade to Standard or Premium.' });
        }

        res.json({ message: 'Welcome to the premium feature area!', plan: sub.plan_name });
    } catch (error) {
        res.status(500).json({ error: 'Server validation error' });
    }
});


// ==========================================
// ADMIN APIs
// ==========================================

// Get all users
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, email, role, created_at FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get all subscriptions
app.get('/api/admin/subscriptions', authenticateToken, isAdmin, async (req, res) => {
    try {
        const [subs] = await db.query(`
            SELECT s.id, u.name as user_name, u.email, p.name as plan_name, s.start_date, s.end_date, s.status 
            FROM subscriptions s
            JOIN users u ON s.user_id = u.id
            JOIN plans p ON s.plan_id = p.id
        `);
        res.json(subs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

// Create a new plan
app.post('/api/admin/plans', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { name, price, duration_days } = req.body;
        await db.query('INSERT INTO plans (name, price, duration_days) VALUES (?, ?, ?)', [name, price, duration_days]);
        res.json({ message: 'Plan created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create plan' });
    }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
