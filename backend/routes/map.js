/**
 * MoroVerse — Map Pins Routes
 * Modern POIs + Ancient Dynasty markers
 */

const router = require('express').Router();
const { db } = require('../db');
const { mapPins } = require('../db/schema');
const { requireAuth } = require('../middleware/auth');
const { eq, and } = require('drizzle-orm');

// GET /api/map — get all pins (optionally filter by mode)
router.get('/', async (req, res) => {
    try {
        const { mode, dynasty, type } = req.query;
        let conditions = [];
        if (mode) conditions.push(eq(mapPins.mode, mode));
        if (dynasty) conditions.push(eq(mapPins.dynasty, dynasty));
        if (type) conditions.push(eq(mapPins.type, type));

        const result = conditions.length
            ? await db.select().from(mapPins).where(and(...conditions))
            : await db.select().from(mapPins);

        res.json({ pins: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/map/dynasties — unique dynasty names for time-slider
router.get('/dynasties', async (req, res) => {
    const dynasties = [
        { name: 'Idrisid', yearStart: 789, yearEnd: 985, color: '#6B8E23' },
        { name: 'Almoravid', yearStart: 1040, yearEnd: 1147, color: '#8B4513' },
        { name: 'Almohad', yearStart: 1121, yearEnd: 1269, color: '#2F4F4F' },
        { name: 'Marinid', yearStart: 1244, yearEnd: 1465, color: '#8B0000' },
        { name: 'Saadian', yearStart: 1510, yearEnd: 1659, color: '#DAA520' },
        { name: 'Alaoui', yearStart: 1631, yearEnd: 1912, color: '#DC143C' },
        { name: 'Colonial Era', yearStart: 1912, yearEnd: 1956, color: '#708090' },
        { name: 'Independence', yearStart: 1956, yearEnd: 2025, color: '#006400' },
    ];
    res.json({ dynasties });
});

// POST /api/map — add a pin (admin)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, description, lat, lng, type, mode, dynasty, yearStart, yearEnd, imageUrl, externalUrl, weather } = req.body;
        if (!name || lat == null || lng == null || !type) {
            return res.status(400).json({ error: 'name, lat, lng, and type are required' });
        }
        const [pin] = await db.insert(mapPins).values({
            name, description, lat: Number(lat), lng: Number(lng),
            type, mode: mode || 'modern', dynasty, yearStart, yearEnd,
            imageUrl, externalUrl, weather: !!weather,
        }).returning();

        res.status(201).json({ pin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/map/:id (admin)
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const [updated] = await db
            .update(mapPins)
            .set(req.body)
            .where(eq(mapPins.id, Number(req.params.id)))
            .returning();

        if (!updated) return res.status(404).json({ error: 'Pin not found' });
        res.json({ pin: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/map/:id (admin)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        await db.delete(mapPins).where(eq(mapPins.id, Number(req.params.id)));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
