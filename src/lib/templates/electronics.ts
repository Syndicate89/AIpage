import { CategoryTemplate } from "@/types";

export const electronicsTemplate: CategoryTemplate = {
  id: "electronics",
  name: "전자기기",
  icon: "📱",
  description: "KC 인증, 1년 AS 보장, 스펙 비교 강조",
  sectionOrder: ["hero", "features", "detail", "solution", "trust", "problem", "reviews", "cta"],
  colorPalette: { primaryColor: "#1d4ed8", secondaryColor: "#6b7280", backgroundColor: "#f9fafb" },
  defaults: {
    badge: "KC 안전 인증 제품",
    socialProofCount: 6200,
    highlights: ["KC 안전 인증 완료", "1년 무상 AS 보장", "최신 기술 탑재"],
    comparisons: [
      { label: "KC 인증", competitor: "미인증", ours: "인증 완료" },
      { label: "AS 기간", competitor: "6개월", ours: "1년 무상" },
      { label: "기술 사양", competitor: "보급형", ours: "프리미엄" },
    ],
    trustItems: [
      { number: "6.2만+", label: "누적 판매" },
      { number: "4.8", label: "평균 별점" },
      { number: "91%", label: "만족도" },
      { number: "1년", label: "무상 AS" },
    ],
    badges: ["KC 인증", "1년 AS", "무료 배송", "정품 등록"],
    satisfactionBars: [
      { label: "성능 만족", percentage: 94 },
      { label: "내구성", percentage: 91 },
      { label: "가성비", percentage: 93 },
      { label: "디자인", percentage: 88 },
    ],
    specs: [
      { label: "제품명", value: "{productName}" },
      { label: "모델명", value: "PRO-2024" },
      { label: "인증", value: "KC 안전 인증" },
      { label: "보증", value: "1년 무상 AS" },
      { label: "배송", value: "주문 후 1~2일" },
    ],
    originalPrice: "199,000원",
    salePrice: "149,000원",
    discountRate: "25%",
    urgencyText: "얼리버드 특가 한정 수량",
  },
};
