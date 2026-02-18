import {
  ProductInput,
  DetailPage,
  PageSection,
  SectionStyle,
  SectionType,
  AICopyResult,
  AIAnalysisResult,
  CategoryTemplate,
} from "@/types";
import { analyzeCompetitor, generateCopy, generateImages } from "./ai/gemini";

// ===== 색상 유틸리티 =====

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function darken(hex: string, amount: number): string {
  const hsl = hexToHSL(hex);
  return hslToHex(hsl.h, hsl.s, Math.max(0, hsl.l - amount));
}

function lighten(hex: string, amount: number): string {
  const hsl = hexToHSL(hex);
  return hslToHex(hsl.h, Math.max(0, hsl.s - 10), Math.min(100, hsl.l + amount));
}

// ===== 스타일 생성 =====

function createStyle(
  bg: string,
  text: string,
  accent: string,
  padding = "48px 24px",
  fontFamily?: string
): SectionStyle {
  return { backgroundColor: bg, textColor: text, accentColor: accent, padding, fontFamily };
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
    input.productName,
    input.brandGuide.fontFamily,
    input.template
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
  productName: string,
  fontFamily?: string,
  template?: CategoryTemplate
): PageSection[] {
  const d = template?.defaults;

  // specs의 {productName} 치환 헬퍼
  const resolveSpecs = (specs: { label: string; value: string }[]) =>
    specs.map((s) => ({ ...s, value: s.value.replace("{productName}", productName) }));

  // 브랜드 색상 기반 동적 팔레트
  const heroBg = darken(primary, 35);
  const problemBg = darken(secondary, 30);
  const lightTint = lighten(primary, 45);
  const trustBg = lighten(primary, 42);
  const ctaBg = darken(primary, 30);

  // 섹션 빌더 맵
  const sectionBuilders: Record<SectionType, () => PageSection> = {
    hero: () => ({
      type: "hero",
      hookingText: copy.hookingText,
      subText: copy.subTexts[0] || "",
      badge: d?.badge || "누적 판매 1위",
      imageUrl: images.hero || undefined,
      backgroundImageUrl: images.hero || undefined,
      socialProofCount: d?.socialProofCount || 4820,
      style: createStyle(heroBg, "#ffffff", primary, "0", fontFamily),
    }),

    problem: () => ({
      type: "problem",
      title: "왜 결과가 안 나올까요?",
      subtitle: "혹시 이런 경험 있으신가요?",
      problems: copy.problemStatements,
      transitionText: "그 이유, 저희가 찾았습니다.",
      style: createStyle(problemBg, "#ffffff", secondary, "48px 24px", fontFamily),
    }),

    solution: () => ({
      type: "solution",
      title: "해결책을 찾았습니다",
      description: copy.solutionDescription,
      imageUrl: images.detail || undefined,
      highlights: d?.highlights || ["임상 실험 완료", "전문가 추천", "특허 기술 적용"],
      style: createStyle(lightTint, "#111827", primary, "48px 24px", fontFamily),
    }),

    features: () => ({
      type: "features",
      title: `왜 ${productName}이어야 하는가`,
      subtitle: "핵심 장점을 확인하세요",
      items: copy.featureDescriptions,
      comparisons: d?.comparisons || [
        { label: "품질 인증", competitor: "✕", ours: "✓" },
        { label: "환불 보장", competitor: "✕", ours: "100% 보장" },
        { label: "고객 지원", competitor: "제한적", ours: "1:1 전담" },
      ],
      style: createStyle("#ffffff", "#111827", primary, "48px 24px", fontFamily),
    }),

    trust: () => ({
      type: "trust",
      title: "숫자로 증명합니다",
      items: d?.trustItems || [
        { number: "12만+", label: "누적 판매" },
        { number: "4.9", label: "평균 별점" },
        { number: "93%", label: "재구매율" },
        { number: "30일", label: "효과 보장" },
      ],
      badges: d?.badges || ["정품 보증", "무료 반품", "당일 발송", "1:1 상담"],
      satisfactionBars: d?.satisfactionBars || [
        { label: "효과 만족", percentage: 94 },
        { label: "품질 신뢰", percentage: 96 },
        { label: "재구매 의향", percentage: 91 },
        { label: "지인 추천", percentage: 89 },
      ],
      style: createStyle(trustBg, "#111827", primary, "48px 24px", fontFamily),
    }),

    detail: () => ({
      type: "detail",
      title: "상세 정보",
      content: copy.subTexts[1] || "전문가가 인정한 프리미엄 퀄리티",
      specs: d ? resolveSpecs(d.specs) : [
        { label: "제품명", value: productName },
        { label: "소재", value: "프리미엄" },
        { label: "원산지", value: "국내" },
        { label: "보증", value: "1년 무상 보증" },
        { label: "배송", value: "주문 후 1~2일" },
      ],
      imageUrl: images.hero || undefined,
      style: createStyle("#ffffff", "#111827", primary, "48px 24px", fontFamily),
    }),

    reviews: () => ({
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
      style: createStyle(lightTint, "#111827", primary, "48px 24px", fontFamily),
    }),

    cta: () => ({
      type: "cta",
      title: "지금이 가장 좋은 기회입니다",
      description: copy.subTexts[2] || "한정 수량 특별 할인 진행 중",
      buttonText: copy.ctaText,
      urgencyText: d?.urgencyText || "오늘 자정에 종료됩니다",
      originalPrice: d?.originalPrice || "89,000원",
      salePrice: d?.salePrice || "59,000원",
      discountRate: d?.discountRate || "33%",
      backgroundImageUrl: images.hero || undefined,
      style: createStyle(ctaBg, "#ffffff", primary, "0", fontFamily),
    }),
  };

  // 섹션 순서: 템플릿 지정 순서 또는 기본 순서
  const order: SectionType[] = template?.sectionOrder || [
    "hero", "problem", "solution", "features", "trust", "detail", "reviews", "cta",
  ];

  return order.map((type) => sectionBuilders[type]());
}
