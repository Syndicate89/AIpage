import {
  AIAnalysisResult,
  AICopyResult,
  ProductInput,
  FeatureItem,
} from "@/types";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

// ===== Gemini Flash: 경쟁사 분석 & 레이아웃 =====

export async function analyzeCompetitor(
  url: string
): Promise<AIAnalysisResult> {
  if (!GEMINI_API_KEY) {
    return getMockAnalysis();
  }

  try {
    const response = await fetch(
      `${GEMINI_API_URL}/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? JSON.parse(text) : getMockAnalysis();
  } catch {
    return getMockAnalysis();
  }
}

// ===== Gemini Nano: 카피라이팅 생성 =====

export async function generateCopy(
  input: ProductInput,
  analysis?: AIAnalysisResult
): Promise<AICopyResult> {
  if (!GEMINI_API_KEY) {
    return getMockCopy(input.productName);
  }

  try {
    const prompt = `당신은 최고의 상세페이지 카피라이터입니다.

제품명: ${input.productName}
제품 설명: ${input.description}
주요 특징: ${input.features}
${analysis ? `타겟 고객: ${analysis.targetAudience}` : ""}
${analysis ? `경쟁사 강점: ${analysis.competitorStrengths.join(", ")}` : ""}

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
      `${GEMINI_API_URL}/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ? JSON.parse(text) : getMockCopy(input.productName);
  } catch {
    return getMockCopy(input.productName);
  }
}

// ===== Mock 데이터 (API 키 없을 때) =====

function getMockAnalysis(): AIAnalysisResult {
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
      "hero",
      "problem",
      "solution",
      "features",
      "detail",
      "reviews",
      "cta",
    ],
    targetAudience: "20-40대 온라인 쇼핑에 익숙한 소비자",
  };
}

function getMockCopy(productName: string): AICopyResult {
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
