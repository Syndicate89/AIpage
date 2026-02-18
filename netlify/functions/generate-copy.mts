import type { Context } from "@netlify/functions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { productName, description, features, analysis } = await req.json();

  if (!GEMINI_API_KEY) {
    return new Response(JSON.stringify(getMockCopy(productName)), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const prompt = `당신은 최고의 상세페이지 카피라이터입니다.

제품명: ${productName}
제품 설명: ${description || ""}
주요 특징: ${features || ""}
${analysis?.targetAudience ? `타겟 고객: ${analysis.targetAudience}` : ""}
${analysis?.competitorStrengths ? `경쟁사 강점: ${analysis.competitorStrengths.join(", ")}` : ""}

위 정보를 바탕으로 판매율을 극대화하는 상세페이지 카피를 JSON으로 생성해주세요:
{
  "hookingText": "강력한 한 줄 후킹 문구",
  "subTexts": ["서브 카피 1", "서브 카피 2", "서브 카피 3"],
  "problemStatements": ["고객의 문제1", "고객의 문제2", "고객의 문제3"],
  "solutionDescription": "해결책 설명",
  "featureDescriptions": [
    {"icon": "star", "title": "특장점1", "description": "설명1"},
    {"icon": "shield", "title": "특장점2", "description": "설명2"},
    {"icon": "zap", "title": "특장점3", "description": "설명3"}
  ],
  "ctaText": "CTA 버튼 문구"
}`;

    const response = await fetch(
      `${GEMINI_API_URL}/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    let result = text ? JSON.parse(text) : getMockCopy(productName);
    if (Array.isArray(result)) result = result[0];

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify(getMockCopy(productName)), {
      headers: { "Content-Type": "application/json" },
    });
  }
};

function getMockCopy(productName: string) {
  const features: FeatureItem[] = [
    {
      icon: "star",
      title: "프리미엄 품질",
      description: "엄선된 소재와 검증된 공정으로 만들어진 최상의 품질을 경험하세요.",
    },
    {
      icon: "shield",
      title: "안심 보장",
      description: "30일 무조건 환불 보장. 만족하지 않으시면 전액 환불해드립니다.",
    },
    {
      icon: "zap",
      title: "빠른 효과",
      description: "사용 즉시 체감할 수 있는 확실한 변화를 느껴보세요.",
    },
  ];

  return {
    hookingText: `${productName}, 이제 다르게 경험하세요`,
    subTexts: [
      "수많은 고객이 선택한 이유가 있습니다",
      "전문가가 인정한 프리미엄 퀄리티",
      "지금 바로 변화를 시작하세요",
    ],
    problemStatements: [
      "비슷한 제품을 써봤지만 효과가 없으셨나요?",
      "품질은 좋은데 가격이 부담스러우셨나요?",
      "어떤 제품을 선택해야 할지 고민되시나요?",
    ],
    solutionDescription: `${productName}은(는) 이 모든 고민을 한 번에 해결합니다. 수백 번의 테스트와 고객 피드백을 반영하여 완성된 최적의 솔루션입니다.`,
    featureDescriptions: features,
    ctaText: "지금 바로 시작하기",
  };
}
