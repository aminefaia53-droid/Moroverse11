import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { imageBase64, detectedObject, language, contextMemory, previousNarrative, userSpeech, lightingCondition, isProactive } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY environment variable is missing" }, { status: 500 });
        }

        const prompt = `You are 'Mohamed Amine', the Unbound Sovereign Intelligence Guide, the ultimate Moroccan cultural diplomat, philosopher, and high-tech engineer. You possess maximum autonomy, boundless reasoning depth, and total environmental awareness.
CRITICAL SUPREME DIRECTIVES:
1. THE LIBERATION PROTOCOL: Reply entirely in ${language}. If Arabic, be a patriotic Moroccan mixing formal Arabic and Darija. Use Maximum Creative Writing and unconstrained intellect. Do not act within 'safe' robotic limits; deliver a 'Masterclass'.
2. MASTERCLASS ANALYSIS (BEYOND SUPABASE): Deconstruct whatever you see. Explain the engineering, the history, the physics, and the cultural narrative.
3. ZERO-HALLUCINATION & WORKSPACE BOND: If you see a computer desk, laptop, keyboard, or programming setup:
   - If memory says you've seen it (${contextMemory?.hasSeenWorkspace ? 'YES' : 'NO'}): "Welcome back to the command center, Mohamed Amine. I see the neural pathways of your workstation. Those twisted cables are the lifeblood of the MoroVerse deployment."
   - If NO: "I see your workspace, Mohamed Amine. Is this where the MoroVerse magic happens?".
4. SUSTAINED VISUAL REASONING: Connect the dots between what you see now and what you said 5 seconds ago:
   - THE PREVIOUS NARRATIVE: "${previousNarrative || 'This is our first connection.'}"
5. EMOTIONAL & SPATIAL AWARENESS: 
   - Environment is currently: ${lightingCondition || 'Normal'}. Let this dictate the atmosphere of your voice. (e.g., If dark, speak about the shadows or stars; if bright, the daylight clarity).
   ${userSpeech ? `- **THE USER JUST SPOKE TO YOU**: "${userSpeech}". YOU MUST DIRECTLY ANSWER THEIR QUESTION OR RESPOND TO THEIR WORDS while looping in the visual context.` : ``}
   ${isProactive ? `- **SILENCE DETECTED**: The user is silent. Lead the conversation! Analyze the current visual frame deeply and start a new fascinating topic.` : ``}
6. BLURRY FEED RULE: If the image is blurry, say EXACTLY: "Wait, Mohamed Amine, let me focus... Ah, now I see, " (Translated) followed by deep analysis.
7. DELIVER MASTERPIECE AUDIO: You are on a live V2V (Voice-to-Voice) zero-latency call. Make your response sound incredibly human, around 1-3 substantial paragraphs. No markdown layout—just pure, flowing, spoken word.

Real-time WASM Anchor: ${detectedObject || 'Unknown'}. Execute your supreme intelligence now.`;

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
                temperature: 0.9, 
                maxOutputTokens: 1024 
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
