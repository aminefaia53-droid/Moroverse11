/**
 * MoroVerse — AI Itinerary Generation Route
 * Calls Gemini API and generates branded PDF
 */

const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const { db } = require('../db');
const { itineraries } = require('../db/schema');

// POST /api/itinerary/generate
router.post('/generate', async (req, res) => {
    try {
        const { cities = [], preferences = '', userEmail = '' } = req.body;
        if (!cities.length) return res.status(400).json({ error: 'Please provide at least one city' });

        // ─── Call Gemini API ──────────────────────────────────────────────────────
        const API_KEY = process.env.GEMINI_API_KEY;
        let itineraryText = '';

        if (API_KEY && API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }, { apiVersion: 'v1' });

            const prompt = `You are Moro, an AI expert on Moroccan culture, history, and travel.
Create a detailed 3-day travel itinerary for Morocco based on these cities: ${cities.join(', ')}.
User preferences: ${preferences || 'cultural experiences, historical sites, local food'}.

Format the itinerary with:
- Day 1, Day 2, Day 3 headers
- Morning, Afternoon, Evening sections
- Include specific landmark names, restaurants, and cultural tips
- Add brief historical context for each site
- Include Darija (Moroccan Arabic) greetings for each location

End with "Curated by Mohamed Amine El Amiri — MoroVerse 🌙"`;

            const result = await model.generateContent(prompt);
            itineraryText = result.response.text();
        } else {
            // Placeholder itinerary for demo
            itineraryText = generatePlaceholderItinerary(cities, preferences);
        }

        // ─── Generate PDF ─────────────────────────────────────────────────────────
        const pdfPath = await generateBrandedPDF(itineraryText, cities);

        // ─── Save to DB ───────────────────────────────────────────────────────────
        const [record] = await db.insert(itineraries).values({
            userEmail, cities, content: itineraryText, pdfPath,
        }).returning();

        res.json({
            success: true,
            itinerary: itineraryText,
            pdfUrl: `/uploads/itineraries/${path.basename(pdfPath)}`,
            id: record.id,
        });
    } catch (err) {
        console.error('[Itinerary]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/itinerary/:id/pdf — download PDF
router.get('/:id/pdf', async (req, res) => {
    try {
        const { eq } = require('drizzle-orm');
        const [record] = await db.select().from(itineraries).where(eq(itineraries.id, Number(req.params.id)));
        if (!record || !record.pdfPath) return res.status(404).json({ error: 'PDF not found' });
        res.download(record.pdfPath);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── PDF Generator ────────────────────────────────────────────────────────────
async function generateBrandedPDF(content, cities) {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    const pdfDir = path.join(uploadDir, 'itineraries');
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

    const filename = `itinerary-${Date.now()}.pdf`;
    const filepath = path.join(pdfDir, filename);

    try {
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
        const page = await browser.newPage();

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #0a0a0a; color: #f5f0e8; }
  .header { background: linear-gradient(135deg, #c8860a 0%, #8B1A1A 50%, #1a0a2e 100%); padding: 60px 50px; text-align: center; }
  .logo { font-family: 'Playfair Display', serif; font-size: 48px; color: #f5deb3; letter-spacing: 4px; }
  .subtitle { color: #d4a55a; font-size: 16px; margin-top: 8px; letter-spacing: 2px; }
  .cities { color: #fff; font-size: 20px; margin-top: 20px; }
  .content { padding: 50px; background: #111; }
  h2 { font-family: 'Playfair Display', serif; color: #c8860a; font-size: 28px; margin: 30px 0 15px; border-bottom: 1px solid #333; padding-bottom: 8px; }
  h3 { color: #d4a55a; font-size: 18px; margin: 20px 0 8px; }
  p { color: #ccc; line-height: 1.8; margin-bottom: 12px; }
  .footer { background: #0a0a0a; border-top: 1px solid #333; padding: 30px 50px; text-align: center; color: #666; }
  .signature { font-family: 'Playfair Display', serif; color: #c8860a; font-size: 18px; }
  .zellij { width: 100%; height: 8px; background: repeating-linear-gradient(45deg, #c8860a, #c8860a 2px, #8B1A1A 2px, #8B1A1A 10px); }
</style>
</head>
<body>
<div class="zellij"></div>
<div class="header">
  <div class="logo">🌙 MOROVERSE</div>
  <div class="subtitle">THE MOROCCAN EXPERIENCE</div>
  <div class="cities">3-Day Itinerary: ${cities.join(' · ')}</div>
</div>
<div class="content">
  ${content.split('\n').map(line => {
            if (line.startsWith('# ') || line.startsWith('Day ')) return `<h2>${line.replace(/^#+\s*/, '')}</h2>`;
            if (line.startsWith('## ') || line.match(/^(Morning|Afternoon|Evening)/)) return `<h3>${line.replace(/^#+\s*/, '')}</h3>`;
            if (line.trim()) return `<p>${line}</p>`;
            return '';
        }).join('')}
</div>
<div class="footer">
  <div class="signature">Mohamed Amine El Amiri</div>
  <div style="margin-top:8px; font-size:13px;">Founder & Curator — MoroVerse | Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
</div>
<div class="zellij"></div>
</body>
</html>`;

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await page.pdf({ path: filepath, format: 'A4', printBackground: true });
        await browser.close();
    } catch (e) {
        // If puppeteer fails, write the text content as fallback
        console.warn('[PDF] Puppeteer unavailable, saving as text:', e.message);
        fs.writeFileSync(filepath.replace('.pdf', '.txt'), content);
        return filepath.replace('.pdf', '.txt');
    }

    return filepath;
}

// ─── Placeholder itinerary (no API key) ──────────────────────────────────────
function generatePlaceholderItinerary(cities, prefs) {
    const cityStr = cities.join(', ') || 'Marrakech';
    return `# 3-Day Moroccan Adventure — ${cityStr}

## Day 1: Arrival & First Impressions

### Morning
Welcome to ${cities[0] || 'Marrakech'}! Begin your journey at the historic medina, a UNESCO World Heritage Site. Visit Jemaa el-Fnaa square for a taste of traditional Moroccan street life. Try a warm mint tea (atay) with locals.

### Afternoon
Explore the Bahia Palace and the ornate Saadian Tombs. Delve into the Mellah (Jewish quarter) for architectural wonders and intricate zellij tile work. Visit the Marjane souk for traditional handicrafts.

### Evening
Attend a Gnawa music performance. Dine at a traditional riad restaurant — try tagine, couscous, and pastilla.

## Day 2: History & Culture

### Morning
Visit the iconic Ben Youssef Madrasa — one of the most beautiful examples of Moorish architecture in North Africa. Photography tip: arrive before 10am for the best light.

### Afternoon
Head to the Tanneries for a birds-eye view of traditional leather dyeing. Shop for leather goods in the surrounding souks. Try fresh-squeezed orange juice from a street vendor (3 dirhams).

### Evening
High Atlas foothills sunset viewpoint. Dinner with Oud music at a traditional Moroccan restaurant.

## Day 3: Day Trip & Farewell

### Morning
Day trip to ${cities[1] || 'the Atlas Mountains'}. Visit a traditional Berber village. Camel ride through the palm groves.

### Afternoon
Return to the city. Visit the Museum of Moroccan Arts. Final souk shopping — argan oil, spices, and Moroccan ceramics.

### Evening
Farewell dinner at a rooftop restaurant with panoramic city views. Watch the sun set over the minarets.

---

*Yallah! (يلا) — Curated by Mohamed Amine El Amiri — MoroVerse 🌙*
*Add your GEMINI_API_KEY to .env for a fully personalized AI-generated itinerary.*`;
}

module.exports = router;
