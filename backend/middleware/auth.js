/**
 * MoroVerse — JWT Auth Middleware
 * Protects all admin-only API routes
 */

const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: missing token' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = payload;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Session expired, please log in again' });
        }
        return res.status(403).json({ error: 'Forbidden: invalid token' });
    }
}

module.exports = { requireAuth };
