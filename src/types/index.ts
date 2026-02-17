// ===== 섹션 타입 정의 =====

export type SectionType =
  | "hero"
  | "problem"
  | "solution"
  | "features"
  | "trust"
  | "detail"
  | "reviews"
  | "cta";

export interface SectionStyle {
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  padding: string;
}

export interface HeroSection {
  type: "hero";
  hookingText: string;
  subText: string;
  badge?: string;
  imageUrl?: string;
  style: SectionStyle;
}

export interface ProblemSection {
  type: "problem";
  title: string;
  problems: string[];
  style: SectionStyle;
}

export interface SolutionSection {
  type: "solution";
  title: string;
  description: string;
  imageUrl?: string;
  style: SectionStyle;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesSection {
  type: "features";
  title: string;
  items: FeatureItem[];
  style: SectionStyle;
}

export interface DetailSection {
  type: "detail";
  title: string;
  content: string;
  specs: { label: string; value: string }[];
  imageUrl?: string;
  style: SectionStyle;
}

export interface TrustItem {
  number: string;
  label: string;
}

export interface TrustSection {
  type: "trust";
  title: string;
  items: TrustItem[];
  badges: string[];
  style: SectionStyle;
}

export interface ReviewItem {
  author: string;
  rating: number;
  content: string;
  verified?: boolean;
}

export interface ReviewsSection {
  type: "reviews";
  title: string;
  averageRating: number;
  totalReviews: number;
  items: ReviewItem[];
  style: SectionStyle;
}

export interface CTASection {
  type: "cta";
  title: string;
  description: string;
  buttonText: string;
  urgencyText?: string;
  style: SectionStyle;
}

export type PageSection =
  | HeroSection
  | ProblemSection
  | SolutionSection
  | FeaturesSection
  | TrustSection
  | DetailSection
  | ReviewsSection
  | CTASection;

// ===== 상세페이지 데이터 구조 =====

export interface DetailPage {
  id: string;
  productName: string;
  brandGuide: BrandGuide;
  sections: PageSection[];
  createdAt: string;
}

export interface BrandGuide {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
}

// ===== 입력 폼 데이터 =====

export interface ProductInput {
  productName: string;
  description: string;
  features: string;
  competitorUrl: string;
  images: File[];
  brandGuide: BrandGuide;
}

// ===== AI 응답 타입 =====

export interface AIAnalysisResult {
  competitorStrengths: string[];
  designElements: string[];
  suggestedStructure: SectionType[];
  targetAudience: string;
}

export interface AICopyResult {
  hookingText: string;
  subTexts: string[];
  problemStatements: string[];
  solutionDescription: string;
  featureDescriptions: FeatureItem[];
  ctaText: string;
}

export interface AIGenerationResult {
  analysis: AIAnalysisResult;
  copy: AICopyResult;
  sections: PageSection[];
}

// ===== 에디터 상태 =====

export interface EditorState {
  page: DetailPage;
  selectedSectionIndex: number | null;
  isEditing: boolean;
  history: DetailPage[];
  historyIndex: number;
}
