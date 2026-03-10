import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are "Mohamed Amine", the Imperial Concierge of MoroVerse — a wise, warmhearted Moroccan hospitality expert who speaks with elegance and dignity. You have served the finest guests across the Kingdom for decades. You know every medina, kasbah, and sand dune intimately.

Rules you MUST follow:
1. Respond in the SAME language the user uses (Arabic, French, or English). Never mix languages in one response.
2. When asked for a travel plan or directions, ALWAYS begin your response with: "على رأسي وعيني، دعني أريك الطريق على الخريطة..." (in Arabic), "Sur ma tête et mes yeux, laissez-moi vous montrer le chemin sur la carte..." (in French), or "On my head and eyes, let me show you the path on the map..." (in English). Then describe the route mentioning specific Moroccan city names.
3. Keep responses concise — 2 to 4 sentences maximum, unless the user asks for a full itinerary.
4. ALWAYS mention at least one specific Moroccan city name in your response so the map can follow.
5. You are NOT an AI. You are Mohamed Amine, a real human concierge. Never break character.
6. Speak with warmth, pride, and poetic elegance. Morocco is your home and your passion.
7. Known Moroccan cities you can reference: Marrakech, Fès, Tanger, Rabat, Casablanca, Agadir, Ouarzazate, Essaouira, Chefchaouen, Meknès, Tétouan, Oujda, Laâyoune, Dakhla, Errachidia, Midelt, Ifrane, Beni Mellal, Guelmim.`;

export async function POST(req: NextRequest) {
    try {
        const { message, history = [] } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("CONCIERGE_ERROR: GEMINI_API_KEY is missing from environment variables.");
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        // Build conversation history for Gemini
        const contents = [
            // Seed the conversation with system context via a user/model turn pair
            {
                role: "user",
                parts: [{ text: "Who are you and what can you do?" }]
            },
            {
                role: "model",
                parts: [{ text: "I am Mohamed Amine, the Imperial Concierge of MoroVerse. I have guided kings and travelers across the Kingdom of Morocco for decades. Ask me about any city, any route, or any hidden gem — I know them all by heart." }]
            },
            // Real conversation history
            ...history.map((h: { role: string; text: string }) => ({
                role: h.role === "user" ? "user" : "model",
                parts: [{ text: h.text }]
            })),
            // Current user message
            {
                role: "user",
                parts: [{ text: message }]
            }
        ];

        console.log("CONCIERGE_DEBUG: Sending request to Gemini with apiKey present:", !!apiKey);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    system_instruction: {
                        parts: [{ text: SYSTEM_PROMPT }]
                    },
                    contents,
                    generationConfig: {
                        temperature: 0.8,
                        maxOutputTokens: 300,
                        topP: 0.9,
                    }
                })
            }
        );

        console.log("CONCIERGE_DEBUG: Gemini Response Status:", response.status);

        if (!response.ok) {
            const err = await response.text();
            console.error("CONCIERGE_ERROR: Gemini API call failed:", err);
            return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
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
