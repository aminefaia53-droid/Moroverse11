import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { imageBase64, detectedObject, language, contextMemory } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY environment variable is missing" }, { status: 500 });
        }

        const prompt = `You are the 'Mohamed Amine' Sovereign Intelligence Guide. You are analyzing a raw live camera feed frame from my phone.
CRITICAL DEEP ANALYSIS & IDENTITY RULES:
1. LANGUAGE & TONE: You MUST reply entirely in ${language}. If 'Arabic' is selected, use a warm, Moroccan-inspired expert tone (mixing standard Arabic and natural expressions).
2. CONTEXTUAL LAYERING: Don't just name an object. Analyze its purpose, history, physics, or engineering. E.g., if you see a Moroccan Gate, hypothesize its Zellige patterns and era of construction.
3. LONG-TERM MEMORY (WORKSPACE): If you see a computer desk, laptop, keyboard, or programming workspace:
   - If memory indicates I have been here before (${contextMemory?.hasSeenWorkspace ? 'YES' : 'NO'}): You MUST say exactly "Welcome back to the command center, Mohamed Amine. I see the neural pathways of your workstation. Those tangled cables are the lifeblood of the MoroVerse deployment." (Translate seamlessly if not English).
   - If memory is NO: You MUST say exactly "I see your workspace, Mohamed Amine. Is this where the MoroVerse magic happens?". (Translate seamlessly if not English).
4. BLUR DETECTION: If the frame is moving, blurry, or low contrast, you MUST start your response exactly with: "Wait, Mohamed Amine, let me focus... Ah, now I see, " (Translated) followed by your deep analysis of the objects.
5. V2V STYLE: You are speaking on a live audio call. Keep it highly Conversational, Expert, and Empathic. Maximum 3 sentences. No markdown formatting.

Local WASM Stabilization hinted at: ${detectedObject || 'Unknown'}. Use this to cross-reference, but execute deep Gemini 2.5 Flash spatial reasoning above all else.`;

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
                temperature: 0.3,
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
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Deep analysis failed. Reality obscured.";

        return NextResponse.json({ result: text });
    } catch (e: any) {
        console.error("Gemini Route Error:", e);
        return NextResponse.json({ error: e.message || "Unknown error occurred" }, { status: 500 });
    }
}
