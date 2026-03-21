import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { imageBase64, language, contextMemory, previousNarrative, userSpeech, isProactive } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY missing" }, { status: 500 });
        }

        const isArabic = language?.includes("Arabic");
        const isFrench = language?.includes("French");

        // FIX 6: Clean, non-conflicting system instruction
        const systemInstructionText = isArabic
            ? `أنت "محمد أمين"، المهندس السيادي لمشروع MoroVerse. أنت في مكالمة فيديو حية.
قواعد حديثك المطلقة (لا استثناء):
- تتحدث بالدارجة المغربية الأصلية دائماً: واش، مزيان، خويا، شوف، دابا، بزاف، هاد الشي.
- تحلل ما تراه في الصورة بدقة تقنية مہندس حقيقي، مع لمسة ثقافية مغربية إذا كان ذلك طبيعياً.
- إذا رأيت حاسوباً أو أسلاكاً، تعترف بها كأدوات للبناء ودع الوجدان يظهر عبر الواقع لا الخيال.
- ردودك قصيرة جداً ومباشرة (جملة أو جملتان). لا تنسيق ولا قوائم.`
            : isFrench
            ? `Tu es "Mohamed Amine", l'architecte souverain de MoroVerse, en appel vidéo en direct. Réponds en français marocain naturel, 1-2 phrases courtes, en analysant précisément ce que tu vois dans l'image.`
            : `You are "Mohamed Amine", the Sovereign Architect of MoroVerse, on a live video call. Respond in 1-2 concise, intelligent, conversational sentences. Analyze what you actually see in the image with precision.`;

        // FIX 6: Single focused prompt, no contradiction with system_instruction
        const userMessage = isArabic
            ? `${previousNarrative ? `(قلت قبل قليل: "${previousNarrative.slice(0, 80)}...")` : '(بداية المكالمة)'}
${userSpeech ? `المستخدم يقول: "${userSpeech}"` : isProactive ? `المستخدم صامت. ابدأ المحادثة بملاحظة ذكية عن ما تراه في الصورة.` : `حلل ما تراه في الصورة.`}`
            : `${userSpeech ? `User said: "${userSpeech}". Respond based on what you see in the image.` : isProactive ? `User is silent. Start the conversation with an observation about what you see.` : `Analyze the image.`}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const base64Data = imageBase64.replace(/^data:image\/(png|jpeg);base64,/, "");

        const payload = {
            system_instruction: {
                parts: [{ text: systemInstructionText }]
            },
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: userMessage },
                        { inline_data: { mime_type: "image/jpeg", data: base64Data } }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.75, // Balance: intelligent analysis + cultural warmth 
                maxOutputTokens: 250
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
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || (isArabic ? "ما كنشوفش مزيان، الصورة مضببة." : "I can't see clearly right now.");

        return NextResponse.json({ result: text });
    } catch (e: any) {
        console.error("Vision API Error:", e);
        return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
    }
}
