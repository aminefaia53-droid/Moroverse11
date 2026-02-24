/**
 * MoroVerse — Audio Clips Routes
 * Upload & manage Darija / regional audio clips
 */

const router = require('express').Router();
const { db } = require('../db');
const { audioClips } = require('../db/schema');
const { requireAuth } = require('../middleware/auth');
const { upload } = require('../middleware/multer');
const { eq, and } = require('drizzle-orm');
const fs = require('fs');
const path = require('path');

// GET /api/audio — get active clips (optionally filter by region)
router.get('/', async (req, res) => {
    try {
        const { region, genre } = req.query;
        let conditions = [eq(audioClips.isActive, true)];
        if (region) conditions.push(eq(audioClips.region, region));
        if (genre) conditions.push(eq(audioClips.genre, genre));

        const result = await db.select().from(audioClips).where(and(...conditions));
        res.json({ clips: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/audio/all — all clips including inactive (admin)
router.get('/all', requireAuth, async (req, res) => {
    try {
        const result = await db.select().from(audioClips);
        res.json({ clips: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/audio/upload — upload audio file (admin)
router.post('/upload', requireAuth, upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No audio file provided' });

        const { title, region, genre, duration } = req.body;
        if (!title || !region) return res.status(400).json({ error: 'title and region required' });

        const filePath = `/uploads/audio/${req.file.filename}`;
        const [clip] = await db.insert(audioClips).values({
            title, region, genre, filePath,
            duration: duration ? Number(duration) : null,
            isActive: true,
        }).returning();

        res.status(201).json({ clip });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/audio/:id/toggle — activate/deactivate (admin)
router.patch('/:id/toggle', requireAuth, async (req, res) => {
    try {
        const [clip] = await db.select().from(audioClips).where(eq(audioClips.id, Number(req.params.id)));
        if (!clip) return res.status(404).json({ error: 'Clip not found' });

        const [updated] = await db
            .update(audioClips)
            .set({ isActive: !clip.isActive })
            .where(eq(audioClips.id, Number(req.params.id)))
            .returning();

        res.json({ clip: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/audio/:id (admin)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const [clip] = await db.select().from(audioClips).where(eq(audioClips.id, Number(req.params.id)));
        if (!clip) return res.status(404).json({ error: 'Clip not found' });

        // Remove file from disk
        const fullPath = path.join(__dirname, '..', clip.filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

        await db.delete(audioClips).where(eq(audioClips.id, Number(req.params.id)));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
