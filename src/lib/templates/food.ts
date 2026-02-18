import { CategoryTemplate } from "@/types";

export const foodTemplate: CategoryTemplate = {
  id: "food",
  name: "식품/음료",
  icon: "🍽️",
  description: "HACCP 인증, 원산지 표기, 신선도 강조",
  sectionOrder: ["hero", "solution", "trust", "features", "detail", "problem", "reviews", "cta"],
  colorPalette: { primaryColor: "#15803d", secondaryColor: "#ca8a04", backgroundColor: "#fefce8" },
  defaults: {
    badge: "HACCP 인증 식품",
    socialProofCount: 21500,
    highlights: ["HACCP 위생 인증", "국내산 원재료 100%", "당일 제조 발송"],
    comparisons: [
      { label: "HACCP 인증", competitor: "미인증", ours: "인증 완료" },
      { label: "원산지", competitor: "수입산", ours: "국내산 100%" },
      { label: "보존료", competitor: "사용", ours: "무첨가" },
    ],
    trustItems: [
      { number: "21만+", label: "누적 판매" },
      { number: "4.9", label: "평균 별점" },
      { number: "96%", label: "재구매율" },
      { number: "당일", label: "제조 발송" },
    ],
    badges: ["HACCP 인증", "국내산 원료", "무료 배송", "신선 보장"],
    satisfactionBars: [
      { label: "맛 만족도", percentage: 97 },
      { label: "신선도", percentage: 95 },
      { label: "재구매 의향", percentage: 94 },
      { label: "가성비", percentage: 91 },
    ],
    specs: [
      { label: "제품명", value: "{productName}" },
      { label: "내용량", value: "500g" },
      { label: "원산지", value: "국내산" },
      { label: "인증", value: "HACCP" },
      { label: "보관", value: "냉장 보관 (0~10°C)" },
    ],
    originalPrice: "39,000원",
    salePrice: "29,900원",
    discountRate: "23%",
    urgencyText: "신선 식품 한정 수량 특가",
  },
};
