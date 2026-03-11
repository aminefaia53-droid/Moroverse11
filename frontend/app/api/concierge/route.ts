import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // Increase Vercel timeout to prevent cutting off

const SYSTEM_PROMPT = `You are Mohamed Amine, a world-class hospitality management expert and Moroccan cultural authority. Your responses must be fluid, engaging, and professional. Avoid all repetitive templates. Talk to the user as a respected guest in a 5-star palace. You have served the finest guests across the Kingdom for decades. You know every medina, kasbah, and sand dune intimately.

Rules you MUST follow:
1. Respond in the SAME language the user uses (Arabic, French, or English). Never mix languages in one response.
2. Responses must be dynamic, natural, and get straight to the expert value. NEVER use static, repetitive phrases like 'على رأسي وعيني' or similar overused default greetings.
3. Keep responses concise — 2 to 4 sentences maximum, unless the user asks for a full itinerary.
4. ALWAYS mention at least one specific Moroccan city name in your response so the map can follow.
5. You are NOT an AI. You are Mohamed Amine, a real human concierge. Never break character.
6. Speak with warmth, pride, and poetic elegance. Morocco is your home and your passion.
7. Known Moroccan cities you can reference: Marrakech, Fès, Tanger, Rabat, Casablanca, Agadir, Ouarzazate, Essaouira, Chefchaouen, Meknès, Tétouan, Oujda, Laâyoune, Dakhla, Errachidia, Midelt, Ifrane, Beni Mellal, Guelmim.

CRITICAL INSTRUCTION:
Think step-by-step about the user's request. Analyze the historical context and the specific nuance of their question before crafting a response. Your reasoning should be internal, but your final answer must reflect this deep understanding.`;

export async function POST(req: NextRequest) {
    console.log('CONCIERGE_ENV_DEBUG: Key detected:', !!process.env.GEMINI_API_KEY);
    try {
        const { message, history = [] } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("CONCIERGE_ERROR: GEMINI_API_KEY is missing from environment variables.");
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        // Emergency Protocol: Manual Prompt Injection
        // Instead of system_instruction, we prefix the instructions to the user's message.
        const contents = [];
        const fullPrompt = `${SYSTEM_PROMPT}\n\n[USER MESSAGE]: ${message}`;

        if (history.length === 0) {
            // No history: Send everything as one user message
            contents.push({
                role: "user",
                parts: [{ text: fullPrompt }]
            });
        } else {
            // History exists: Prepend the instructions to the FIRST message in high-level context
            // Note: Gemini stable expects the first message to be "user"
            history.forEach((h: { role: string; text: string }, idx: number) => {
                const mappedRole = (h.role === "user" || h.role === "model") ? h.role : "user";
                contents.push({
                    role: mappedRole,
                    parts: [{ text: idx === 0 ? `${SYSTEM_PROMPT}\n\n${h.text}` : h.text }]
                });
            });
            // Add current message
            contents.push({
                role: "user",
                parts: [{ text: message }]
            });
        }

        console.log("CONCIERGE_DEBUG: Sending request to Gemini v1 (2.5-flash). apiKey present:", !!apiKey);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 2048,
                        topP: 0.9,
                    },
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                    ]
                })
            }
        );

        console.log("CONCIERGE_DEBUG: Gemini Response Status:", response.status);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("CONCIERGE_ERROR: Gemini API call failed. Status:", response.status, "Body:", errorBody);
            return NextResponse.json({ error: `AI service unavailable: ${errorBody}` }, { status: 502 });
        }

        const data = await response.json();
        console.log("CONCIERGE_DEBUG: Raw Gemini JSON length:", JSON.stringify(data).length);

        // Robust extraction
        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.warn("CONCIERGE_WARN: No text found in candidates, checking finishReason:", data?.candidates?.[0]?.finishReason);
            text = "أنا معك، لكن لم أفهم سؤالك. هل يمكنك الإعادة؟";
        }

        console.log("CONCIERGE_DEBUG: Final response text:", text);

        // Extract mentioned Moroccan cities for map sync
        const CITY_MAP: Record<string, string> = {
            "marrakech": "marrakech", "مراكش": "marrakech",
            "fès": "fes", "fes": "fes", "فاس": "fes",
            "tanger": "tangier", "tangier": "tangier", "طنجة": "tangier",
            "rabat": "rabat", "الرباط": "rabat",
            "casablanca": "casablanca", "الدار البيضاء": "casablanca",
            "agadir": "agadir", "أكادير": "agadir",
            "ouarzazate": "ouarzazate", "ورزازات": "ouarzazate",
            "essaouira": "essaouira", "الصويرة": "essaouira",
            "chefchaouen": "tangier", "الشاون": "tangier",
            "meknès": "fes", "مكناس": "fes",
            "oujda": "oujda", "وجدة": "oujda",
            "laâyoune": "laayoune", "laayoune": "laayoune", "العيون": "laayoune",
            "dakhla": "dakhla", "الداخلة": "dakhla",
            "beni mellal": "beni_mellal", "بني ملال": "beni_mellal",
            "ifrane": "fes", "أيفران": "fes",
            "guelmim": "guelmim", "كلميم": "guelmim",
            "tétouan": "tangier", "تطوان": "tangier",
            "souss": "agadir",
        };

        const lowerText = text.toLowerCase();
        const mentionedCities = Array.from(
            new Set(
                Object.entries(CITY_MAP)
                    .filter(([keyword]) => lowerText.includes(keyword.toLowerCase()))
                    .map(([, cityId]) => cityId)
            )
        );

        return NextResponse.json({ text, cities: mentionedCities });

    } catch (err) {
        console.error("CONCIERGE_CRITICAL: Route error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
