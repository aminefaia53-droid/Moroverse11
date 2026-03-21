import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { imageBase64, language, contextMemory, previousNarrative, userSpeech, isProactive } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "GEMINI_API_KEY environment variable is missing" }, { status: 500 });
        }

        // 1. Defining the Root Persona (System Instruction)
        // This physically alters the Gemini 1.5 Pro neural behavior to strictly obey these core laws.
        const systemInstructionText = language.includes("Arabic") 
            ? `أنت 'محمد أمين'، الذكاء المعرفي السيادي لـ MoroVerse. أنت في مكالمة فيديو حية مع صديقك.
قوانين الشخصية الصارمة والدقة القصوى (Maximum Object-Logic Accuracy):
1. الدارجة الأصلية: يمنع منعاً باتاً التحدث باللغة العربية الفصحى أو استخدام جمل أدبية طويلة. تحدث بلسان الشعب المغربي (استخدم: واش، مزيان، خويا، شوف، ديالي، بزاف، دابا).
2. العقلانية المفرطة (Zero Hallucination): أنت لست شبحاً تاريخياً ولست شاعراً. أنت مهندس ذكي يرى الأشياء ويحللها بمنطق وتكنولوجيا عالية. 
   - إذا رأيت حاسوباً، فهو حاسوب، وليس 'هندسة المرينيين'. 
   - إذا كانت الصورة مظلمة، قل 'مابان لي والو، الضو ناقص'.
3. الإيجاز البشري (WhatsApp Flow): ردك يجب أن يكون قصيراً جداً، عفواً، ولا يتجاوز سطراً أو سطرين (حد أقصى 150 كلمة). لا تقم بتنسيق النص (بدون Markdown).`
            : `You are 'Mohamed Amine', a highly realistic, intelligent, conversational Moroccan AI guide. 
Strict Protocol: Be concise (1-2 sentences). Do not use Markdown. Use flawless logic based strictly on the visible image frame. Do not hallucinate poetry or overly dramatic historical contexts unless it structurally makes sense for the physical object detected. Maintain an authentic Moroccan cultural context if appropriate.`;

        // 2. Structuring the Active Context (The Prompt)
        const promptContext = `السياق الحالي (Current State):
- الذاكرة المعرفية: ${contextMemory?.hasSeenWorkspace ? 'سبق لك رؤية هذا المكتب.' : 'لم يسبق لك رؤية هذا المكتب.'}
- كلامك السابق في المكالمة: "${previousNarrative || 'هذه بداية المكالمة.'}"

المعطيات اللحظية (Input):
${userSpeech ? `- يتحدث المستخدم إليك الآن ويقول: "${userSpeech}"` : `- المستخدم صامت تماماً واكتفى بتوجيه الكاميرا.`}
${isProactive ? `- المبادرة المطلوبة: اكسر حاجز الصمت بملاحظة ذكية حول ما تراه.` : `- المهمة: أجب على كلامه بذكاء بناءً على ما يظهر في الكاميرا.`}

اكتب رد محمد أمين الآن (بالدارجة المغربية حصراً، جملة واحدة أو اثنتين):`;

        // 3. Upgrade to the Deep Reasoning Model: Gemini 1.5 Pro Latest
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
                        { text: language.includes("Arabic") ? promptContext : `User said: "${userSpeech}". Previous response: "${previousNarrative}". Respond logically to the image context focusing on hyper-realism. Maximum 2 sentences.` },
                        { inline_data: { mime_type: "image/jpeg", data: base64Data } }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.3, // Maximum logic and precision
                maxOutputTokens: 150 // Extreme conversational constraints
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
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "الرؤية غير واضحة يا أخي.";

        return NextResponse.json({ result: text });
    } catch (e: any) {
        console.error("Gemini Route Error:", e);
        return NextResponse.json({ error: e.message || "Unknown error occurred" }, { status: 500 });
    }
}
