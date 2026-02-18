import { CategoryTemplate } from "@/types";

export const beautyTemplate: CategoryTemplate = {
  id: "beauty",
  name: "뷰티/화장품",
  icon: "💄",
  description: "피부과 추천, EWG 등급, 임상 시험 강조",
  sectionOrder: ["hero", "problem", "solution", "trust", "features", "detail", "reviews", "cta"],
  colorPalette: { primaryColor: "#e91e8c", secondaryColor: "#f472b6", backgroundColor: "#fdf2f8" },
  defaults: {
    badge: "피부과 전문의 추천",
    socialProofCount: 15200,
    highlights: ["피부과 임상 시험 완료", "EWG 그린 등급", "저자극 인증"],
    comparisons: [
      { label: "EWG 등급", competitor: "옐로우", ours: "그린" },
      { label: "임상 시험", competitor: "✕", ours: "완료" },
      { label: "피부과 추천", competitor: "✕", ours: "✓" },
    ],
    trustItems: [
      { number: "15만+", label: "누적 판매" },
      { number: "4.9", label: "평균 별점" },
      { number: "97%", label: "재구매율" },
      { number: "48시간", label: "효과 체감" },
    ],
    badges: ["피부과 추천", "EWG 그린", "무료 반품", "당일 발송"],
    satisfactionBars: [
      { label: "피부 개선 효과", percentage: 96 },
      { label: "저자극 만족도", percentage: 98 },
      { label: "재구매 의향", percentage: 94 },
      { label: "지인 추천", percentage: 92 },
    ],
    specs: [
      { label: "제품명", value: "{productName}" },
      { label: "용량", value: "50ml" },
      { label: "피부 타입", value: "모든 피부" },
      { label: "EWG 등급", value: "그린" },
      { label: "유통기한", value: "제조일로부터 24개월" },
    ],
    originalPrice: "68,000원",
    salePrice: "45,900원",
    discountRate: "32%",
    urgencyText: "뷰티 특가 오늘 자정 마감",
  },
};
