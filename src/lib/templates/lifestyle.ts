import { CategoryTemplate } from "@/types";

export const lifestyleTemplate: CategoryTemplate = {
  id: "lifestyle",
  name: "생활용품",
  icon: "🏠",
  description: "KC 안전 인증, 환경 마크, 실용성 강조",
  sectionOrder: ["hero", "problem", "solution", "features", "trust", "detail", "reviews", "cta"],
  colorPalette: { primaryColor: "#78716c", secondaryColor: "#a8a29e", backgroundColor: "#fafaf9" },
  defaults: {
    badge: "생활 필수 아이템",
    socialProofCount: 11300,
    highlights: ["KC 안전 인증 완료", "친환경 소재 사용", "인체공학 디자인"],
    comparisons: [
      { label: "KC 인증", competitor: "미인증", ours: "인증 완료" },
      { label: "친환경 인증", competitor: "✕", ours: "환경 마크" },
      { label: "내구성", competitor: "보통", ours: "3년 이상" },
    ],
    trustItems: [
      { number: "11만+", label: "누적 판매" },
      { number: "4.7", label: "평균 별점" },
      { number: "90%", label: "재구매율" },
      { number: "2년", label: "품질 보증" },
    ],
    badges: ["KC 인증", "환경 마크", "무료 배송", "무료 반품"],
    satisfactionBars: [
      { label: "실용성", percentage: 94 },
      { label: "내구성", percentage: 92 },
      { label: "재구매 의향", percentage: 89 },
      { label: "디자인", percentage: 87 },
    ],
    specs: [
      { label: "제품명", value: "{productName}" },
      { label: "소재", value: "친환경 소재" },
      { label: "크기", value: "표준" },
      { label: "인증", value: "KC 안전 인증" },
      { label: "보증", value: "2년 무상 보증" },
    ],
    originalPrice: "49,000원",
    salePrice: "35,900원",
    discountRate: "26%",
    urgencyText: "생활용품 특가 한정 수량",
  },
};
