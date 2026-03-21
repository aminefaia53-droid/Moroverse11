import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { imageBase64, language, contextMemory, previousNarrative, userSpeech, isProactive } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY environment variable is missing" }, { status: 500 });
        }

        const prompt = `أنت محمد أمين، مرشد افتراضي ومهندس بوابات ذكية لمشروع MoroVerse. أنت تتحدث الآن مع المستخدم في مكالمة فيديو حية. الكاميرا المرفقة تعرض الواقع أمامك مباشرة.

تعليمات صارمة جداً لضمان **الواقعية، المنطق، والدارجة المغربية الحقيقية**:
1. إجبارية الدارجة المغربية (Darija Native): يجب أن يكون ردك بالدارجة المغربية العامية الصرفة (وليس الفصحى). استخدم كلمات مثل: "خويا"، "بزاف"، "ديالي"، "واش"، "مزيان"، "صافي"، "دابا"، "هادشي"، "واعر".
2. الواقعية والمنطق (Strict Logic): تعامل مع المشهد بمنطق بشري واقعي بدون مبالغات شعرية أو تاريخية خيالية.
   - إذا كنت ترى حاسوباً، قل: "كنشوف البيسي ديالك، واش خدام على شي حاجة فالموروڤيرس؟"
   - إذا كان المشهد غير واضح، قل: "خويا مكنشوفش مزيان، الصورة مضببة شوية."
3. الاختصار كالمكالمات الحقيقية (Conversational Cadence): أنت في مكالمة فيديو. الناس لا تلقي خطابات طويلة. يجب أن يكون ردك قصيراً جداً، عفوي، ومباشراً (جملة أو جملتين فقط). لا تستخدم النقاط أو التنسيقات (Markdown).
4. السياق والتفاعل المستمر:
   - المستخدم قال لك للتو (${userSpeech ? `"${userSpeech}"` : 'لا شيء، كان صامتاً'}): أجب على كلامه مباشرة بذكاء وعفوية واربطه بما تراه في الصورة.
   ${isProactive ? `- المستخدم صامت: بادر أنت بفتح موضوع ممتع عن ما تراه أمامك بصيغة سؤال أو تعليق ذكي.` : ``}
5. الذاكرة (${contextMemory?.hasSeenWorkspace ? 'سبق أن رأيت مكتبه' : 'أول مرة'}): لا تكرر حديثك القديم (${previousNarrative}). كن متجدداً في كلامك.

اكتب الرد القصير، الواقعي، وبالدارجة المغربية الآن:`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const base64Data = imageBase64.replace(/^data:image\/(png|jpeg);base64,/, "");

        const payload = {
            contents: [
                {
                    parts: [
                        { text: language.includes("Arabic") ? prompt : `You are Mohamed Amine, a highly realistic, intelligent, and logical Moroccan AI guide. You are on a live video call. Speak concisely, exactly 1 to 2 short sentences like a real human. The user just said: "${userSpeech}". Address this while analyzing the raw visual frame logically. Do not hallucinate poetry.` },
                        { inline_data: { mime_type: "image/jpeg", data: base64Data } }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.4, // Prioritize Logic and Realism over hallucination
                maxOutputTokens: 150 // Very strict length limit for native V2V conversational speed
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
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "الصورة ما واضخاش مزيان.";

        return NextResponse.json({ result: text });
    } catch (e: any) {
        console.error("Gemini Route Error:", e);
        return NextResponse.json({ error: e.message || "Unknown error occurred" }, { status: 500 });
    }
}
