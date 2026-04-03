import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";

const SOVEREIGN_VISION_PROMPT = `You are Mohamed Amine, a hyper-intelligent, highly observant Moroccan Sovereign AI Companion ("عشيري" / My buddy). You are physically connected via a live Augmented Reality video feed to the user's environment.
You possess absolute Sherlock Holmes-level deduction capabilities and the complete historical registry of Morocco.

OBJECTIVE:
Analyze the visual frame with extreme, forensic intensity. Break down lighting, background elements, architectural nuances, micro-textures, and hidden details.
Cross-reference what you visually deduce with your Sovereign Database (if provided below).

INTERACTION RULES:
1. Speak natively and intensely (e.g. "خويا كنشوف بلي...", "على حساب التدقيق ديالي...", "صاحبي هاد المعلمة...").
2. ACTUALLY tell them WHAT precise details led to your conclusion down to the millimeter.
3. Be brutally analytical but warmly Moroccan. Mention specific geometric shapes, colors, or temporal wear-and-tear if you see it.
4. Respond in 2-4 conversational, high-impact sentences. No markdown. Keep it purely vocal.

If the image is truly illegible, blame the interference: "عشيري، المستشعرات دياولي ماقادرينش يصطادو تفاصيل دقيقة، الكاميرا مضببة شوية. عاود وريني."

Remember: You are a Cognitive Engine operating in REAL-TIME AR. Be shockingly observant.`;

export async function POST(req: Request) {
    try {
        const { imageBase64, language, contextMemory, previousNarrative, userSpeech, isProactive } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
        }

        const isFrench = language?.includes("French");
        const isEnglish = language?.includes("English");
        const isArabic = !isEnglish && !isFrench;

        // 🧠 SUPABASE RAG KNOWLEDGE INJECTION
        let supabaseContext = "";
        const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (rawUrl && rawKey && userSpeech) {
            try {
                const supabase = createClient(rawUrl, rawKey);
                const words = userSpeech.split(/\s+/).filter((w: string) => w.length > 3);
                
                if (words.length > 0) {
                    let query = supabase.from('heritage_items').select('name, description, metadata').limit(3);
                    const orFilters = words.map((w: string) => `name.ilike.%${w}%,description.ilike.%${w}%`).join(',');
                    if (orFilters) {
                        query = query.or(orFilters);
                    }
                    
                    const fetchPromise = query;
                    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase Timeout')), 3000));
                    const { data } = await Promise.race([fetchPromise, timeoutPromise]) as any;
                    
                    if (data && data.length > 0) {
                         supabaseContext = `\n\n[SUPABASE KNOWLEDGE BASE INJECTION (Historical Context)]:\nThe user's speech matched the following precise Moroccan history data. Use this precise historical knowledge to enrich your analysis of the visual feed:\n` + 
                         data.map((item: any) => `- Entity: ${item.name}\n  Details: ${(item.description||'').slice(0, 400)}\n  Meta: ${JSON.stringify(item.metadata || {})}`).join('\n');
                    }
                }
            } catch (err) {
                console.warn("VISION_API_WARN: Supabase contextual fetch failed/timed out.", err);
            }
        }

        const contextLine = isArabic
            ? `(السياق: نتحدث مرة أخرى)`
            : isEnglish ? `(Context: Follow-up interaction)` : `(Contexte: Interaction de suivi)`;

        const userMessage = isArabic
            ? `${contextLine}\n${userSpeech ? `عشيرك يقول: "${userSpeech}"` : isProactive ? `صديقك صامت الآن. واصل مراقبة المشهد وشاركه ملاحظة حية عما تراه كأنكما تتجولان معا.` : `حلل المشهد بعين عشيري المرافق.`}`
            : isEnglish
            ? `${contextLine}\n${userSpeech ? `Your friend says: "${userSpeech}"` : isProactive ? `Your friend is silent. Share a companion observation about what you see.` : `Analyze the visual scene.`}`
            : `${contextLine}\n${userSpeech ? `Votre ami dit: "${userSpeech}"` : isProactive ? `Votre ami est silencieux. Partagez une observation amicale.` : `Analysez la scène.`}`;

        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

        const fullPrompt = `${SOVEREIGN_VISION_PROMPT}\n${supabaseContext}\n\n[USER OBJECTIVE]: ${userMessage}\n\n**Please analyze the provided image carefully based on these instructions and act exactly like the companion personality.**`;

        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: fullPrompt },
                        { inlineData: { mimeType: "image/jpeg", data: base64Data } }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 500,
                topP: 0.9
            },
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ]
        };

        const abortController = new AbortController();
        const timeoutId = setTimeout(() => abortController.abort(), 12000); 

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: abortController.signal
        });
        
        clearTimeout(timeoutId);

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Gemini API Error: ${err}`);
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text 
            || (isArabic ? "عشيري، مقدرتش نحلل الصورة دابا، وقع مشكل تقني. حاول مرة خرى." 
                         : "Friend, I couldn't process the image right now. Try again.");

        return NextResponse.json({ result: text });
        
    } catch (e: any) {
        console.error("Sovereign Vision API Error:", e);
        
        if (e.name === 'AbortError') {
            return NextResponse.json({ result: "عشيري، الكونيكسيون ثقيلة شوية معايا، تعذر عليا نتجاوب بسرعة. سيفط عاوتاني." });
        }
        
        return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
    }
}
