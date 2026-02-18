import { CategoryTemplate } from "@/types";

export const healthTemplate: CategoryTemplate = {
  id: "health",
  name: "건강식품",
  icon: "💊",
  description: "식약처 인증, GMP 제조, 임상 결과 강조",
  sectionOrder: ["hero", "trust", "problem", "solution", "features", "detail", "reviews", "cta"],
  colorPalette: { primaryColor: "#16a34a", secondaryColor: "#f97316", backgroundColor: "#f0fdf4" },
  defaults: {
    badge: "식약처 인증 건강기능식품",
    socialProofCount: 32400,
    highlights: ["식약처 기능성 인증", "GMP 인증 시설 제조", "인체적용시험 완료"],
    comparisons: [
      { label: "식약처 인증", competitor: "✕", ours: "✓" },
      { label: "GMP 제조", competitor: "일부", ours: "전 제품" },
      { label: "원료 함량", competitor: "최소 기준", ours: "고함량" },
    ],
    trustItems: [
      { number: "32만+", label: "누적 판매" },
      { number: "4.8", label: "평균 별점" },
      { number: "95%", label: "재구매율" },
      { number: "2주", label: "효과 체감" },
    ],
    badges: ["식약처 인증", "GMP 제조", "무료 배송", "정품 보증"],
    satisfactionBars: [
      { label: "건강 개선 체감", percentage: 93 },
      { label: "제품 신뢰도", percentage: 97 },
      { label: "재구매 의향", percentage: 92 },
      { label: "가성비 만족", percentage: 90 },
    ],
    specs: [
      { label: "제품명", value: "{productName}" },
      { label: "내용량", value: "30정 (1개월분)" },
      { label: "섭취 방법", value: "1일 1회, 1정" },
      { label: "인증", value: "식약처 건강기능식품" },
      { label: "제조", value: "GMP 인증 시설" },
    ],
    originalPrice: "79,000원",
    salePrice: "49,900원",
    discountRate: "36%",
    urgencyText: "건강 특가 한정 수량 진행 중",
  },
};
