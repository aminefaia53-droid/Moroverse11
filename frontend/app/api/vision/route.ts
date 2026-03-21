import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { imageBase64, detectedObject } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY environment variable is missing" }, { status: 500 });
        }

        const prompt = `I am looking at this object. Give me a cultural, local, or astrological perspective ONLY if it fits. For example, if it's a laptop, describe it as 'The portal to MoroVerse 2030'. If it's the sky, identify stars using the Astro-coordinates. Object detected by local TF.js context: ${detectedObject || 'Unknown'}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        // Strip out the data URL prefix if present
        const base64Data = imageBase64.replace(/^data:image\/(png|jpeg);base64,/, "");

        const payload = {
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: base64Data
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 256
            }
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Gemini API Error: ${err}`);
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Vision analysis failed. The frame was unclear.";

        return NextResponse.json({ result: text });
    } catch (e: any) {
        console.error("Gemini Route Error:", e);
        return NextResponse.json({ error: e.message || "Unknown error occurred" }, { status: 500 });
    }
}
