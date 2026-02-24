/**
 * MoroVerse — Auth Routes
 * POST /api/auth/login    → validate password, return JWT
 * POST /api/auth/verify   → verify existing JWT
 */

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!hash) {
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const isValid = await bcrypt.compare(password, hash);
        if (!isValid) {
            // Deliberate vague message for security
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { role: 'admin', author: 'Mohamed Amine El Amiri' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            success: true,
            token,
            message: 'Welcome, Mohamed Amine El Amiri 🌙',
        });
    } catch (err) {
        console.error('[Auth] Login error:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/auth/verify
router.post('/verify', (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false, error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, payload });
    } catch {
        res.status(401).json({ valid: false, error: 'Token invalid or expired' });
    }
});

module.exports = router;
