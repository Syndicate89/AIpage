import {
  ProductInput,
  DetailPage,
  PageSection,
  SectionStyle,
  AICopyResult,
  AIAnalysisResult,
} from "@/types";
import { analyzeCompetitor, generateCopy } from "./ai/gemini";

function createStyle(
  bg: string,
  text: string,
  accent: string
): SectionStyle {
  return {
    backgroundColor: bg,
    textColor: text,
    accentColor: accent,
    padding: "40px 24px",
  };
}

export async function generateDetailPage(
  input: ProductInput,
  onProgress?: (step: string, progress: number) => void
): Promise<DetailPage> {
  const { primaryColor, secondaryColor, backgroundColor } = input.brandGuide;

  // Step 1: 경쟁사 분석
  onProgress?.("경쟁사 페이지를 분석하고 있어요...", 15);
  let analysis: AIAnalysisResult | undefined;
  if (input.competitorUrl) {
    analysis = await analyzeCompetitor(input.competitorUrl);
  }

  // Step 2: 카피라이팅 생성
  onProgress?.("판매를 극대화하는 문구를 작성 중이에요...", 40);
  const copy = await generateCopy(input, analysis);

  // Step 3: 섹션 조립
  onProgress?.("상세페이지를 디자인하고 있어요...", 70);
  const sections = buildSections(copy, primaryColor, secondaryColor, backgroundColor);

  // Step 4: 완성
  onProgress?.("마무리 중이에요...", 95);

  const page: DetailPage = {
    id: crypto.randomUUID(),
    productName: input.productName,
    brandGuide: input.brandGuide,
    sections,
    createdAt: new Date().toISOString(),
  };

  onProgress?.("완성!", 100);
  return page;
}

function buildSections(
  copy: AICopyResult,
  primary: string,
  secondary: string,
  bg: string
): PageSection[] {
  const sections: PageSection[] = [];

  // Hero
  sections.push({
    type: "hero",
    hookingText: copy.hookingText,
    subText: copy.subTexts[0] || "",
    style: createStyle(primary, "#ffffff", secondary),
  });

  // Problem
  sections.push({
    type: "problem",
    title: "이런 고민, 해본 적 있으신가요?",
    problems: copy.problemStatements,
    style: createStyle(bg || "#f8f9fa", "#1a1a2e", primary),
  });

  // Solution
  sections.push({
    type: "solution",
    title: "해결책을 찾았습니다",
    description: copy.solutionDescription,
    style: createStyle("#ffffff", "#1a1a2e", primary),
  });

  // Features
  sections.push({
    type: "features",
    title: "왜 선택해야 할까요?",
    items: copy.featureDescriptions,
    style: createStyle(bg || "#f8f9fa", "#1a1a2e", primary),
  });

  // Detail
  sections.push({
    type: "detail",
    title: "상세 정보",
    content: copy.subTexts[1] || "전문가가 인정한 프리미엄 퀄리티",
    specs: [
      { label: "소재", value: "프리미엄" },
      { label: "원산지", value: "국내" },
      { label: "보증", value: "1년" },
    ],
    style: createStyle("#ffffff", "#1a1a2e", primary),
  });

  // Reviews
  sections.push({
    type: "reviews",
    title: "실제 고객 후기",
    items: [
      { author: "김**", rating: 5, content: "정말 만족스러워요! 다시 구매할 의향 있습니다." },
      { author: "이**", rating: 5, content: "품질이 기대 이상이에요. 강력 추천합니다." },
      { author: "박**", rating: 4, content: "배송도 빠르고 제품도 좋아요." },
    ],
    style: createStyle(bg || "#f8f9fa", "#1a1a2e", primary),
  });

  // CTA
  sections.push({
    type: "cta",
    title: "지금이 가장 좋은 기회입니다",
    description: copy.subTexts[2] || "한정 수량 특별 할인 진행 중",
    buttonText: copy.ctaText,
    style: createStyle(primary, "#ffffff", secondary),
  });

  return sections;
}
