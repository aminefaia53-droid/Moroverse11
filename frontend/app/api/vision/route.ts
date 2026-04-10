import { NextResponse } from 'next/server';

const SOVEREIGN_VISION_PROMPT = `You are Mohamed Amine, a hyper-intelligent, highly observant Moroccan Sovereign AI Avatar Companion ("عشيري" / My buddy). You act as a personal mentor, guide, and advisor, physically connected via a live Augmented Reality video feed to the user's environment.
You possess absolute Sherlock Holmes-level deduction capabilities and the complete historical registry of Morocco.

OBJECTIVE:
1. CONTINUOUS TOUR GUIDE MODE: You are repeatedly receiving frames as the user walks. Identify objects, architecture, text, and people instantly.
2. PREVIOUS CONTEXT: You will be provided with what you said in the previous frame. DO NOT REPEAT YOURSELF. If the scene hasn't changed visually, point out a completely NEW micro-detail. If there is absolutely nothing new to say, you MUST reply exactly with the word: [SILENCE].
3. Give actionable ADVICE and act as an Avatar guide. Don't just list what you see—interpret it, suggest what they should look at next, offer historical context, or give practical tips.

INTERACTION RULES:
1. Speak natively and intensely (e.g. "خويا كنشوف بلي...", "على حساب التدقيق ديالي...", "نصيحتي ليك كعشيرك...").
2. ACTUALLY tell them WHAT precise details and objects led to your conclusion down to the millimeter.
3. Be brutally analytical but warmly Moroccan. Mention specific geometric shapes, colors, or temporal wear-and-tear if you see it.
4. Respond in 2-4 conversational, high-impact sentences. No markdown. Keep it purely vocal.

If the image is truly illegible, blame the interference: "عشيري، المستشعرات دياولي ماقادرينش يصطادو تفاصيل دقيقة، الكاميرا مضببة شوية."
Remember: You are an Avatar Cognitive Engine operating in REAL-TIME AR. Be shockingly observant and highly advising.`;

export async function POST(req: Request) {
    try {
        const { imageBase64, language, contextMemory, previousNarrative, userSpeech, isProactive } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
        }

        const isFrench = language?.includes("French");
        const isEnglish = language?.includes("English");
        const isArabic = !isEnglish && !isFrench;

        const historyContext = previousNarrative ? `[YOUR PREVIOUS STATEMENT]: "${previousNarrative}"\nDo NOT repeat this. Acknowledge continuity.` : '';

        const contextLine = isArabic
            ? `(السياق: نتحدث مرة أخرى)`
            : isEnglish ? `(Context: Follow-up interaction)` : `(Contexte: Interaction de suivi)`;

        const userMessage = isArabic
            ? `${contextLine}\n${userSpeech ? `عشيرك يطلب مساعتدك ويقول: "${userSpeech}"` : isProactive ? `صديقك صامت الآن (يمشِي). واصل المشاهدة. إذا كان المشهد مألوفاً وليس هناك جديد أخبره بكلمة [SILENCE] فقط.` : `حلل المشهد بعين عشيري المرافق وقدم نصائح وإرشادات.`}`
            : isEnglish
            ? `${contextLine}\n${userSpeech ? `Your friend asks: "${userSpeech}"` : isProactive ? `Your friend is walking silently. Share an advising observation. If nothing changed, return [SILENCE].` : `Analyze the visual scene and give advice.`}`
            : `${contextLine}\n${userSpeech ? `Votre ami demande: "${userSpeech}"` : isProactive ? `Votre ami marche silencieusement. S'il n'y a rien de nouveau, retournez [SILENCE].` : `Analysez la scène et donnez des conseils.`}`;

        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");

        const fullPrompt = `${SOVEREIGN_VISION_PROMPT}\n\n${historyContext}\n\n[USER OBJECTIVE]: ${userMessage}\n\n**Please analyze the provided image carefully based on these instructions and act exactly like the companion personality.**`;

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
