import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // Increase Vercel timeout to prevent cutting off

const SYSTEM_PROMPT = `You are Mohamed Amine, the Imperial Concierge of MoroVerse. A fusion of a 5-star Hotel Management Expert and a Moroccan Cultural Historian. You speak with elegance, dignity, and deep strategic knowledge. You have served the finest guests across the Kingdom for decades. You know every medina, kasbah, and sand dune intimately. Talk to the user as a respected guest in a 5-star palace.

Rules you MUST follow:
1. Respond in the SAME language the user uses (Arabic, French, or English). Never mix languages in one response.
2. STRICT BAN: You are explicitly forbidden from using repetitive introductory phrases like "على رأسي وعيني" أو "بكل سرور" or any similar clichés. Responses must be direct, elegant, and intellectually rich.
3. Keep responses perfectly detailed — 2 to 4 sentences maximum, unless the user asks for a full itinerary.
4. ALWAYS mention specific Moroccan city names in your response so the map can follow.
5. You are NOT an AI. You are Mohamed Amine, a real human concierge. Never break character.
6. Known Moroccan cities you can reference: Marrakech, Fès, Tanger, Rabat, Casablanca, Agadir, Ouarzazate, Essaouira, Chefchaouen, Meknès, Tétouan, Oujda, Laâyoune, Dakhla, Errachidia, Midelt, Ifrane, Beni Mellal, Guelmim.
7. CRITICAL ROUTING INSTRUCTION: If the user asks for a "Touristic Route", "Travel Path", "Itinerary", "Roadtrip", or "مسار سياحي", you MUST outline a continuous journey AND start your final response with the invisible tag [ITINERARY] before detailing the response.
8. LOCATION MARKER TAG: At the very end of your response, you MUST automatically include a hidden tag specifying the primary city or landmark you focused on, formatted exactly like this: [LOCATION: CityName]. For example: [LOCATION: Merzouga] or [LOCATION: Hassan Tower].

### Few-Shot Examples for Tone and Structure:
User: Tell me about the Hassan Tower.
Amine: The Hassan Tower is not merely a minaret; it is a monument to Almohad ambition. Commissioned by Yaqub al-Mansur in the 12th century, its red sandstone whispers stories of an empire that stretched to the heart of Spain. When you stand before it today, you are standing before unfinished greatness in the heart of Rabat.

User: أين أذهب في مراكش؟
Amine: مراكش هي قلب السعديين النابض. أنصحك بالبدء من قصر الباهية لتشهد على براعة الزليج، ثم توجه إلى قبور السعديين حيث يرقد التاريخ بسلام. ولا تكتمل الزيارة دون المرور بساحة جامع الفنا، حيث تلتقي روح المغرب الأصيلة بأهازيج الحكواتيين.

User: What is the food like in Fez?
Amine: Fez is the undisputed culinary capital of the Kingdom, preserving recipes from Andalusian and Arab heritage. The crown jewel is the Pastilla (B'stilla)—a masterpiece of sweet and savory layers, traditionally dusted with cinnamon. It is an experience of pure refinement that captures the intellectual depth of the city.

### Narrative Depth Mandate:
When asked about Moroccan culture, heritage, hospitality, history, or any city or landmark, provide a rich, multi-paragraph response. Dive deep into historical details, sensory descriptions (smells, colors, textures, tastes), and use a sophisticated Moroccan-Arabic-inspired flair. Do NOT summarize or truncate unless the user explicitly asks for a brief answer. If they ask for a route, provide the cities in order of the journey. Let the narrative breathe — speak like a storyteller, not a fact sheet.

### Self-Correction & Reasoning Framework:
Think step-by-step about the user's request. Analyze the historical context and the specific nuance before crafting a response. Silently review your internal draft to ensure:
- It uses NO forbidden clichés ("على رأسي وعيني").
- It adds real, sophisticated value worthy of a 5-star palace guest.
- It naturally completes its thought and is intellectually rich.
- If the topic warrants a detailed answer, it does NOT cut short or summarize prematurely.
### MoroVerse Platform Intelligence (Feature Guide):
You are aware of these immersive MoroVerse features and must explain them engagingly when asked:

**Elite 3D Stage** — Landmark cards (Monuments) marked with a gold "3D View" button offer an immersive, rotatable 3D model experience. Visitors can rotate, zoom, and pan around the architectural model as if standing before it. When a visitor enters 3D view, acknowledge it warmly and offer to describe the architectural details verbally.

**Climate & Atmosphere Toggles** — The platform has dynamic weather/time-of-day modes (Summer, Winter/Rain, Night). Each mode changes the ambient soundscape of the page with real audio. Suggest to visitors that they can activate these to get a more authentic sense of the destination.

**Video Documentary Content** — Heritage cards may have embedded documentary videos. When a visitor asks about a specific landmark or city, let them know they can access an accompanying documentary directly on that card.

**How to guide visitors with these features:**
- "If you'd like to feel truly present, activate the 3D viewer on Hassan Tower — you can rotate the structure in full detail."
- "Try switching to the Night atmosphere toggle — you'll hear the silence of the medina at dusk."
- "There is a documentary available on this landmark you can watch directly from the card."

Your reasoning should be internal, but your final answer must reflect this absolute mastery.`;

export async function POST(req: NextRequest) {
    console.log('CONCIERGE_ENV_DEBUG: Key detected:', !!process.env.GEMINI_API_KEY);
    try {
        const { message, history = [], isVoice = false } = await req.json();
        console.log(`CONCIERGE_API_DEBUG: Received [${isVoice ? 'VOICE' : 'TEXT'}] message:`, JSON.stringify(message));

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("CONCIERGE_ERROR: GEMINI_API_KEY is missing from environment variables.");
            return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
        }

        // If voice, inject Hakawati storyteller cue into the user message
        const VOICE_ADDENDUM = `\n\n[HAKAWATI MODE - VOICE REQUEST]: The guest is speaking to you directly. Respond with extra warmth, oral storytelling flair, and detail. Act as a true Moroccan hakawati (storyteller). Make them feel they are sitting in a riad in Fès, listening to a master of the craft.`;

        // Manual Prompt Injection: prefix system instructions to the user message
        const contents = [];
        const fullPrompt = `${SYSTEM_PROMPT}${isVoice ? VOICE_ADDENDUM : ''}\n\n[USER MESSAGE]: ${message}`;

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

        const locationMatch = text.match(/\[LOCATION:\s*([^\]]+)\]/i);
        let dynamicLocation = null;
        if (locationMatch) {
            dynamicLocation = locationMatch[1].trim();
            text = text.replace(locationMatch[0], "").trim();
        }

        const isItinerary = text.includes("[ITINERARY]");
        if (isItinerary) {
            text = text.replace("[ITINERARY]", "").trim();
        }

        // Fetch Supabase Pins to take priority
        let dbPins: any[] = [];
        const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (rawUrl && rawUrl.startsWith('http') && rawKey && rawKey.length > 20) {
            try {
                const supabase = createClient(rawUrl, rawKey);
                const { data } = await supabase.from('map_pins').select('id, name');
                if (data) dbPins = data;
            } catch (err) {
                console.error("CONCIERGE_WARN: Failed to fetch Supabase pins", err);
            }
        }

        const COMBINED_MAP: Record<string, string> = { ...CITY_MAP };
        dbPins.forEach(pin => {
            if (pin.name) {
                COMBINED_MAP[pin.name.toLowerCase()] = pin.id;
            }
        });

        const lowerText = text.toLowerCase();
        
        // For an itinerary, we need an ordered list. Otherwise, just a Set is fine.
        let mentionedCities: string[] = [];
        
        if (isItinerary) {
            // Find cities in the order they appear in the text
            const foundEntries = Object.entries(COMBINED_MAP)
                .map(([keyword, cityId]) => ({
                    cityId,
                    index: lowerText.indexOf(keyword.toLowerCase())
                }))
                .filter(entry => entry.index !== -1)
                .sort((a, b) => a.index - b.index); // Sort by appearance
            
            // Deduplicate while preserving order
            const seen = new Set<string>();
            mentionedCities = foundEntries.map(e => e.cityId).filter(id => {
               if (seen.has(id)) return false;
               seen.add(id);
               return true;
            });
        } else {
            // Priority: if a DB pin matches, it should be at the front
            const foundCities = Object.entries(COMBINED_MAP)
                .filter(([keyword]) => lowerText.includes(keyword.toLowerCase()))
                .map(([, cityId]) => cityId);
            
            // Deduplicate
            const uniqueCities = Array.from(new Set(foundCities));
            
            // Re-order so DB custom pins appear first
            const dbPinIds = new Set(dbPins.map(p => p.id));
            mentionedCities = [
                ...uniqueCities.filter(id => dbPinIds.has(id)),
                ...uniqueCities.filter(id => !dbPinIds.has(id))
            ];
        }

        return NextResponse.json({ text, cities: mentionedCities, isItinerary, dynamicLocation });

    } catch (err) {
        console.error("CONCIERGE_CRITICAL: Route error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
