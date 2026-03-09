/**
 * MoroVerse Gemini AI Asset Generator
 * 
 * This script integrates the Gemini API directly into the workspace to automate
 * the generation of 8K photo-realistic assets for all 103 items in generated-content.json.
 * 
 * Usage:
 * 1. npm install @google/genai
 * 2. export GEMINI_API_KEY="your_api_key_here"
 * 3. node scripts/gemini_generator.js
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const JSON_PATH = path.join(__dirname, '../frontend/data/generated-content.json');
const OUTPUT_DIR = path.join(__dirname, '../frontend/public/images/gemini-generated');

// Initialize Gemini Client
// Ensure you have set process.env.GEMINI_API_KEY
const ai = new GoogleGenAI();

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateImageForLandmark(landmark) {
    console.log(`\n[GEN] Requesting AI Generation for: ${landmark.name.ar}`);

    // Applying the strict prompt parameter as requested by the Sovereign
    const prompt = `صورة فوتوغرافية واقعية، بزاوية سينمائية دافئة، تظهر ${landmark.name.ar} في مدينة ${landmark.city.ar}، مع تفاصيل الزليج الدقيق ونقوش الجبس، إضاءة ذهبية غنية، جودة 8K، كاميرا سوني`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9'
            }
        });

        const base64Image = response.generatedImages[0].image.imageBytes;
        const fileName = `${landmark.id}.jpg`;
        const filePath = path.join(OUTPUT_DIR, fileName);

        fs.writeFileSync(filePath, Buffer.from(base64Image, 'base64'));
        console.log(`[SUCCESS] Saved: ${fileName}`);

        // Update the JSON with the local path
        return `/images/gemini-generated/${fileName}`;

    } catch (error) {
        console.error(`[ERROR] Failed to generate for ${landmark.name.en}:`, error.message);
        return null; // keep existing if failed
    }
}

async function main() {
    console.log("=== Initiating Sovereign AI Asset Generation Protocol ===");

    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    let generatedCount = 0;

    for (let i = 0; i < data.landmarks.length; i++) {
        const landmark = data.landmarks[i];

        // Skip if already generated locally
        if (landmark.imageUrl && landmark.imageUrl.includes('gemini-generated')) {
            console.log(`[SKIP] Already generated: ${landmark.name.en}`);
            continue;
        }

        const newUrl = await generateImageForLandmark(landmark);
        if (newUrl) {
            data.landmarks[i].imageUrl = newUrl;
            generatedCount++;

            // Save incrementally
            fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
        }

        // Rate Limit Protection (Wait 4 seconds between requests)
        await delay(4000);
    }

    console.log(`\n=== Protocol Complete ===`);
    console.log(`Successfully generated and linked ${generatedCount} new 8K assets.`);
}

main().catch(console.error);
