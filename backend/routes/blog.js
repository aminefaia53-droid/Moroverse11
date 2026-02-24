/**
 * MoroVerse — Blog & Biography CMS Routes
 * All write operations require JWT auth
 */

const router = require('express').Router();
const { db } = require('../db');
const { posts } = require('../db/schema');
const { requireAuth } = require('../middleware/auth');
const { eq, desc, and } = require('drizzle-orm');

// GET /api/blog — list published posts (public)
router.get('/', async (req, res) => {
    try {
        const { category, limit = 20, offset = 0 } = req.query;
        let conditions = [eq(posts.published, true)];
        if (category) conditions.push(eq(posts.category, category));

        const result = await db
            .select({
                id: posts.id,
                title: posts.title,
                slug: posts.slug,
                excerpt: posts.excerpt,
                coverImage: posts.coverImage,
                category: posts.category,
                tags: posts.tags,
                authorName: posts.authorName,
                createdAt: posts.createdAt,
            })
            .from(posts)
            .where(and(...conditions))
            .orderBy(desc(posts.createdAt))
            .limit(Number(limit))
            .offset(Number(offset));

        res.json({ posts: result, total: result.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/blog/all — list ALL posts (admin)
router.get('/all', requireAuth, async (req, res) => {
    try {
        const result = await db.select().from(posts).orderBy(desc(posts.createdAt));
        res.json({ posts: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/blog/:slug — single post (public, must be published)
router.get('/:slug', async (req, res) => {
    try {
        const [post] = await db
            .select()
            .from(posts)
            .where(eq(posts.slug, req.params.slug));

        if (!post) return res.status(404).json({ error: 'Post not found' });
        if (!post.published) return res.status(404).json({ error: 'Post not available' });

        // Return without seals in public view (they're embedded in content)
        res.json({ post });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/blog — create post (admin)
router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, slug, excerpt, content, coverImage, category, tags, published, seals } = req.body;
        if (!title || !slug || !content) {
            return res.status(400).json({ error: 'title, slug, and content are required' });
        }
        const [newPost] = await db.insert(posts).values({
            title, slug, excerpt, content, coverImage,
            category: category || 'blog',
            tags: tags || [],
            published: published || false,
            seals: seals || [],
            authorName: 'Mohamed Amine El Amiri',
        }).returning();

        res.status(201).json({ post: newPost });
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: 'Slug already exists' });
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/blog/:id — update post (admin)
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const { title, slug, excerpt, content, coverImage, category, tags, published, seals } = req.body;
        const [updated] = await db
            .update(posts)
            .set({
                title, slug, excerpt, content, coverImage,
                category, tags, published, seals,
                updatedAt: new Date(),
            })
            .where(eq(posts.id, Number(req.params.id)))
            .returning();

        if (!updated) return res.status(404).json({ error: 'Post not found' });
        res.json({ post: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/blog/:id (admin)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        await db.delete(posts).where(eq(posts.id, Number(req.params.id)));
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
