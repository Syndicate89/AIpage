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

  const { url } = await req.json();

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify(getMockAnalysis()), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `다음 URL의 상세페이지를 분석해주세요: ${url}

JSON 형식으로 다음을 반환해주세요:
{
  "competitorStrengths": ["강점1", "강점2", ...],
  "designElements": ["디자인 요소1", ...],
  "suggestedStructure": ["hero", "problem", "solution", "features", "detail", "reviews", "cta"],
  "targetAudience": "타겟 고객 설명"
}`,
                },
              ],
            },
          ],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    let result = text ? JSON.parse(text) : getMockAnalysis();
    if (Array.isArray(result)) result = result[0];

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify(getMockAnalysis()), {
      headers: { "Content-Type": "application/json" },
    });
  }
};

function getMockAnalysis() {
  return {
    competitorStrengths: [
      "직관적인 비주얼 중심 레이아웃",
      "사회적 증거(리뷰) 적극 활용",
      "문제-해결 구조의 스토리텔링",
    ],
    designElements: [
      "풀스크린 히어로 이미지",
      "아이콘 기반 특장점 나열",
      "별점 리뷰 섹션",
      "그라데이션 CTA 버튼",
    ],
    suggestedStructure: [
      "hero", "problem", "solution", "features", "detail", "reviews", "cta",
    ],
    targetAudience: "20-40대 온라인 쇼핑에 익숙한 소비자",
  };
}
