import type { Context } from "@netlify/functions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { productName, description } = await req.json();

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify({ images: {} }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const images: Record<string, string> = {};

  const heroPrompt = `Professional commercial product photography of "${productName}". ${description || ""}. Clean white studio background, soft studio lighting, high-end product shot, minimalist composition. 4K quality, photorealistic.`;

  const detailPrompt = `Close-up detail shot of "${productName}". ${description || ""}. Showing texture and craftsmanship, macro product photography, professional lighting, shallow depth of field. 4K quality.`;

  const prompts: { key: string; prompt: string }[] = [
    { key: "hero", prompt: heroPrompt },
    { key: "detail", prompt: detailPrompt },
  ];

  // 병렬로 이미지 생성
  await Promise.allSettled(
    prompts.map(async ({ key, prompt }) => {
      const imageData = await generateImage(prompt);
      if (imageData) {
        images[key] = imageData;
      }
    })
  );

  return new Response(JSON.stringify({ images }), {
    headers: { "Content-Type": "application/json" },
  });
};

async function generateImage(prompt: string): Promise<string | null> {
  // Gemini 2.0 Flash Image Generation 모델 사용
  try {
    const response = await fetch(
      `${GEMINI_API_URL}/nano-banana-pro-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
          },
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
  } catch {}

  return null;
}
