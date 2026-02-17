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
  accent: string,
  padding = "48px 24px"
): SectionStyle {
  return { backgroundColor: bg, textColor: text, accentColor: accent, padding };
}

export async function generateDetailPage(
  input: ProductInput,
  onProgress?: (step: string, progress: number) => void
): Promise<DetailPage> {
  const { primaryColor, secondaryColor, backgroundColor } = input.brandGuide;

  onProgress?.("경쟁사 페이지를 분석하고 있어요...", 10);
  let analysis: AIAnalysisResult | undefined;
  if (input.competitorUrl) {
    analysis = await analyzeCompetitor(input.competitorUrl);
  }

  onProgress?.("판매를 극대화하는 문구를 작성 중이에요...", 30);
  const copy = await generateCopy(input, analysis);

  onProgress?.("AI가 제품 이미지를 생성하고 있어요...", 50);
  let imageMap: Record<string, string> = {};
  if (input.images.length === 0) {
    imageMap = await generateImages(input.productName, input.description);
  }

  onProgress?.("상세페이지를 디자인하고 있어요...", 80);
  const sections = buildSections(
    copy,
    primaryColor,
    secondaryColor,
    backgroundColor,
    imageMap,
    input.productName
  );

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

  // 1. Hero
  sections.push({
    type: "hero",
    hookingText: copy.hookingText,
    subText: copy.subTexts[0] || "",
    badge: "누적 판매 1위",
    imageUrl: images.hero || undefined,
    socialProofCount: 4820,
    style: createStyle("#0a0a0a", "#ffffff", primary, "0"),
  });

  // 2. Problem — 다크 배경, 공감 유도
  sections.push({
    type: "problem",
    title: "왜 결과가 안 나올까요?",
    subtitle: "혹시 이런 경험 있으신가요?",
    problems: copy.problemStatements,
    transitionText: "그 이유, 저희가 찾았습니다.",
    style: createStyle("#111827", "#ffffff", "#ef4444", "48px 24px"),
  });

  // 3. Solution
  sections.push({
    type: "solution",
    title: "해결책을 찾았습니다",
    description: copy.solutionDescription,
    imageUrl: images.detail || undefined,
    highlights: ["임상 실험 완료", "전문가 추천", "특허 기술 적용"],
    style: createStyle("#ffffff", "#111827", primary, "48px 24px"),
  });

  // 4. Features — 비교 테이블 포함
  sections.push({
    type: "features",
    title: `왜 ${productName}이어야 하는가`,
    subtitle: "핵심 장점을 확인하세요",
    items: copy.featureDescriptions,
    comparisons: [
      { label: "품질 인증", competitor: "✕", ours: "✓" },
      { label: "환불 보장", competitor: "✕", ours: "100% 보장" },
      { label: "고객 지원", competitor: "제한적", ours: "1:1 전담" },
    ],
    style: createStyle("#ffffff", "#111827", primary, "48px 24px"),
  });

  // 5. Trust — 만족도 바 포함
  sections.push({
    type: "trust",
    title: "숫자로 증명합니다",
    items: [
      { number: "12만+", label: "누적 판매" },
      { number: "4.9", label: "평균 별점" },
      { number: "93%", label: "재구매율" },
      { number: "30일", label: "효과 보장" },
    ],
    badges: ["정품 보증", "무료 반품", "당일 발송", "1:1 상담"],
    satisfactionBars: [
      { label: "효과 만족", percentage: 94 },
      { label: "품질 신뢰", percentage: 96 },
      { label: "재구매 의향", percentage: 91 },
      { label: "지인 추천", percentage: 89 },
    ],
    style: createStyle("#f8f9fa", "#111827", primary, "48px 24px"),
  });

  // 6. Detail
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
    style: createStyle("#ffffff", "#111827", primary, "48px 24px"),
  });

  // 7. Reviews — 별점 분포 포함
  sections.push({
    type: "reviews",
    title: "실제 구매자 리뷰",
    averageRating: 4.9,
    totalReviews: 8420,
    starDistribution: [
      { stars: 5, percentage: 82 },
      { stars: 4, percentage: 11 },
      { stars: 3, percentage: 4 },
      { stars: 2, percentage: 2 },
      { stars: 1, percentage: 1 },
    ],
    items: [
      { author: "김*희", rating: 5, content: "정말 만족스러워요! 주변에도 추천했더니 다들 좋아합니다. 이제 없으면 안 될 정도예요.", verified: true, tag: "BEST" },
      { author: "이*수", rating: 5, content: "품질이 기대 이상이에요. 이 가격에 이 퀄리티라니 강력 추천합니다. 재구매 확정!", verified: true, tag: "재구매" },
      { author: "박*연", rating: 5, content: "배송도 빠르고 포장도 꼼꼼해요. 3주 사용 후 확실한 변화를 느꼈습니다.", verified: true, tag: "인증구매" },
      { author: "최*진", rating: 4, content: "선물로 구매했는데 받는 분이 아주 좋아하셨어요. 다음엔 저도 쓸 거예요.", verified: false },
    ],
    style: createStyle("#ffffff", "#111827", primary, "48px 24px"),
  });

  // 8. CTA — 가격/카운트다운/긴급성
  sections.push({
    type: "cta",
    title: "지금이 가장 좋은 기회입니다",
    description: copy.subTexts[2] || "한정 수량 특별 할인 진행 중",
    buttonText: copy.ctaText,
    urgencyText: "오늘 자정에 종료됩니다",
    originalPrice: "89,000원",
    salePrice: "59,000원",
    discountRate: "33%",
    style: createStyle("#111827", "#ffffff", primary, "0"),
  });

  return sections;
}
