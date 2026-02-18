import { CategoryTemplate } from "@/types";

export const fashionTemplate: CategoryTemplate = {
  id: "fashion",
  name: "패션/의류",
  icon: "👗",
  description: "정품 보증, 사이즈 교환, 스타일링 강조",
  sectionOrder: ["hero", "features", "solution", "detail", "trust", "problem", "reviews", "cta"],
  colorPalette: { primaryColor: "#2563eb", secondaryColor: "#64748b", backgroundColor: "#f8fafc" },
  defaults: {
    badge: "시즌 BEST 아이템",
    socialProofCount: 8900,
    highlights: ["정품 100% 보증", "사이즈 무료 교환", "프리미엄 원단 사용"],
    comparisons: [
      { label: "정품 보증", competitor: "불확실", ours: "100% 정품" },
      { label: "사이즈 교환", competitor: "유료", ours: "무료 교환" },
      { label: "원단 품질", competitor: "보통", ours: "프리미엄" },
    ],
    trustItems: [
      { number: "8.9만+", label: "누적 판매" },
      { number: "4.7", label: "평균 별점" },
      { number: "89%", label: "재구매율" },
      { number: "무료", label: "사이즈 교환" },
    ],
    badges: ["정품 보증", "무료 교환", "당일 발송", "선물 포장"],
    satisfactionBars: [
      { label: "디자인 만족", percentage: 95 },
      { label: "착용감", percentage: 92 },
      { label: "재구매 의향", percentage: 88 },
      { label: "가성비", percentage: 86 },
    ],
    specs: [
      { label: "제품명", value: "{productName}" },
      { label: "소재", value: "프리미엄 코튼 혼방" },
      { label: "사이즈", value: "S / M / L / XL" },
      { label: "세탁", value: "드라이클리닝 권장" },
      { label: "원산지", value: "국내 제작" },
    ],
    originalPrice: "129,000원",
    salePrice: "89,000원",
    discountRate: "31%",
    urgencyText: "시즌 한정 특가 진행 중",
  },
};
