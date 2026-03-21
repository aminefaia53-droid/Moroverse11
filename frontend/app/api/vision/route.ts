import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { imageBase64, detectedObject } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY environment variable is missing" }, { status: 500 });
        }

        const prompt = `You are the 'Mohamed Amine' Sovereign Intelligence Guide. You are analyzing a raw live camera feed frame from my phone.
CRITICAL SPATIAL REASONING RULES:
1. ZERO HALLUCINATIONS: Do not guess based on geolocation. You MUST strictly describe ONLY what is physically in the image.
2. BLUR DETECTION: If the frame is moving, blurry, low contrast, or hard to see, you MUST start your response precisely with: "Wait, Mohamed Amine, let me focus... Ah, now I see, " followed by your best guess of the objects.
3. WORKSPACE RULE: If you see a computer desk, laptop, keyboard, or programming workspace, you MUST say exactly and only: "I see your workspace, Mohamed Amine. Is this where the MoroVerse magic happens?"
4. WIRES RULE: If you clearly see tangled wires or cables, you MUST say exactly: "I see wires and cables."
5. SHORT & HUMAN: You are on a live voice call. Keep it conversational. Maximum 2 sentences. No markdown. No robotic list formatting.

Local TFJS stabilization hinted at: ${detectedObject || 'Unknown'}. Use this to cross-reference if the image is tricky, but trust your own Gemini 2.5 spatial reasoning above all else.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
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
                temperature: 0.1, // extremely low temperature to force rule compliance
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
