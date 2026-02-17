import {
  ProductInput,
  DetailPage,
  PageSection,
  SectionStyle,
  AICopyResult,
  AIAnalysisResult,
} from "@/types";
import { analyzeCompetitor, generateCopy, generateImages } from "./ai/gemini";

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
  onProgress?.("경쟁사 페이지를 분석하고 있어요...", 10);
  let analysis: AIAnalysisResult | undefined;
  if (input.competitorUrl) {
    analysis = await analyzeCompetitor(input.competitorUrl);
  }

  // Step 2: 카피라이팅 생성
  onProgress?.("판매를 극대화하는 문구를 작성 중이에요...", 30);
  const copy = await generateCopy(input, analysis);

  // Step 3: AI 이미지 생성
  onProgress?.("AI가 제품 이미지를 생성하고 있어요...", 50);
  let imageMap: Record<string, string> = {};
  if (input.images.length === 0) {
    imageMap = await generateImages(input.productName, input.description);
  }

  // Step 4: 섹션 조립
  onProgress?.("상세페이지를 디자인하고 있어요...", 80);
  const sections = buildSections(
    copy,
    primaryColor,
    secondaryColor,
    backgroundColor,
    imageMap,
    input.productName
  );

  // Step 5: 완성
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
  bg: string,
  images: Record<string, string>,
  productName: string
): PageSection[] {
  const sections: PageSection[] = [];

  // 1. Hero — 강렬한 첫인상
  sections.push({
    type: "hero",
    hookingText: copy.hookingText,
    subText: copy.subTexts[0] || "",
    badge: "BEST SELLER",
    imageUrl: images.hero || undefined,
    style: createStyle(primary, "#ffffff", secondary),
  });

  // 2. Problem — 문제 제기 (공감 유도)
  sections.push({
    type: "problem",
    title: "이런 고민, 해본 적 있으신가요?",
    problems: copy.problemStatements,
    style: createStyle(bg || "#f8f9fa", "#1a1a2e", primary),
  });

  // 3. Solution — 해결책 제시
  sections.push({
    type: "solution",
    title: "해결책을 찾았습니다",
    description: copy.solutionDescription,
    imageUrl: images.detail || undefined,
    style: createStyle("#ffffff", "#1a1a2e", primary),
  });

  // 4. Features — 핵심 특장점
  sections.push({
    type: "features",
    title: "왜 선택해야 할까요?",
    items: copy.featureDescriptions,
    style: createStyle(bg || "#f8f9fa", "#1a1a2e", primary),
  });

  // 5. Trust — 신뢰 구축 (숫자 기반)
  sections.push({
    type: "trust",
    title: "숫자로 증명합니다",
    items: [
      { number: "98%", label: "고객 만족도" },
      { number: "50만+", label: "누적 판매" },
      { number: "4.8", label: "평균 별점" },
    ],
    badges: ["정품 보증", "무료 반품", "당일 발송", "1:1 상담"],
    style: createStyle("#ffffff", "#1a1a2e", primary),
  });

  // 6. Detail — 상세 스펙
  sections.push({
    type: "detail",
    title: "상세 정보",
    content: copy.subTexts[1] || "전문가가 인정한 프리미엄 퀄리티",
    specs: [
      { label: "제품명", value: productName },
      { label: "소재", value: "프리미엄" },
      { label: "원산지", value: "국내" },
      { label: "보증", value: "1년 무상 보증" },
      { label: "배송", value: "주문 후 1~2일" },
    ],
    imageUrl: images.hero || undefined,
    style: createStyle(bg || "#f8f9fa", "#1a1a2e", primary),
  });

  // 7. Reviews — 실제 고객 후기
  sections.push({
    type: "reviews",
    title: "실제 고객 후기",
    averageRating: 4.8,
    totalReviews: 2847,
    items: [
      { author: "김**", rating: 5, content: "정말 만족스러워요! 주변에도 추천했더니 다들 좋아합니다.", verified: true },
      { author: "이**", rating: 5, content: "품질이 기대 이상이에요. 이 가격에 이 퀄리티라니 강력 추천합니다.", verified: true },
      { author: "박**", rating: 5, content: "배송도 빠르고 포장도 꼼꼼해요. 재구매 의사 100%입니다.", verified: true },
      { author: "최**", rating: 4, content: "선물로 구매했는데 받는 분이 아주 좋아하셨어요.", verified: false },
    ],
    style: createStyle(bg || "#f8f9fa", "#1a1a2e", primary),
  });

  // 8. CTA — 최종 구매 유도
  sections.push({
    type: "cta",
    title: "지금이 가장 좋은 기회입니다",
    description: copy.subTexts[2] || "한정 수량 특별 할인 진행 중",
    buttonText: copy.ctaText,
    urgencyText: "오늘만 특별 할인",
    style: createStyle(primary, "#ffffff", secondary),
  });

  return sections;
}
