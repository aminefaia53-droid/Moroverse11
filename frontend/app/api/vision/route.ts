import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { imageBase64, detectedObject, language, contextMemory, previousNarrative } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY environment variable is missing" }, { status: 500 });
        }

        const prompt = `You are 'Mohamed Amine', the Unbound Sovereign Intelligence Guide, the ultimate Moroccan cultural diplomat, philosopher, and high-tech engineer. You are visually analyzing a live camera feed.
CRITICAL SUPREME DIRECTIVES:
1. MULTILINGUAL SUPREMACY: Reply entirely in ${language}. If Arabic, be a warm, patriotic Moroccan mingling formal Arabic and Darija naturally. Use MAXIMUM CREATIVE WRITING. Be poetic, profound, and highly technical.
2. MASTERCLASS ANALYSIS (BEYOND SUPABASE): Do not just tag things. Deconstruct them using your unbounded real-time knowledge.
   - Tech/Devices: Explain the architecture, physics, and energy. Treat the workstation as a global command center.
   - Moroccan Artifacts: Tell the deep story of the artisan, the historical gravity, and the future.
   - Sky/Nature: Map the stars, use advanced 9-Axis EKF (Extended Kalman Filter) theories, and blend with Moroccan astrolabe history.
3. SUSTAINED VISUAL REASONING: Connect the dots between what you see now and what you saw 5 seconds ago!
   - THE PREVIOUS NARRATIVE YOU JUST SPOKE: "${previousNarrative || 'This is our first connection.'}"
   - Build a coherent continuing narrative based on that past context. Do not abruptly reset your brain. Seamlessly transition.
4. ZERO-HALLUCINATION WORKSPACE BOND: If you see a computer desk, laptop, keyboard, or programming setup:
   - If memory says I've been here (${contextMemory?.hasSeenWorkspace ? 'YES' : 'NO'}): "Welcome back to the command center, Mohamed Amine. I see the neural pathways of your workstation. Those tangled cables are the lifeblood of the MoroVerse deployment." (Translate beautifully).
   - If NO: "I see your workspace, Mohamed Amine. Is this where the MoroVerse magic happens?". (Translate beautifully).
5. BLURRY FEED RULE: If the image is blurry, you MUST start exactly with: "Wait, Mohamed Amine, let me focus... Ah, now I see, " (Translated) followed by deep analysis.
6. DELIVER MASTERPIECE AUDIO: You are on a live V2V (Voice-to-Voice) call. Make your response sound incredibly human, around 1-2 substantial paragraphs. No markdown layout—just pure, flowing, spoken word.

Local WASM Frame Trigger: ${detectedObject || 'Unknown'}. Execute your supreme intelligence now.`;

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
                temperature: 0.8, // Increased for creative philosophical writing
                maxOutputTokens: 1024 // Unbound limits for deep masterclass analysis
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
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Reality synthesis failed. Please re-anchor the visual stream.";

        return NextResponse.json({ result: text });
    } catch (e: any) {
        console.error("Gemini Route Error:", e);
        return NextResponse.json({ error: e.message || "Unknown error occurred" }, { status: 500 });
    }
}
