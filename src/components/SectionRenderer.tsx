"use client";

import React from "react";
import {
  PageSection,
  HeroSection,
  ProblemSection,
  SolutionSection,
  FeaturesSection,
  TrustSection,
  DetailSection,
  ReviewsSection,
  CTASection,
} from "@/types";
import {
  Star,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Quote,
  BadgeCheck,
  Clock,
  TrendingUp,
  Award,
  Heart,
  Users,
  ThumbsUp,
  ShieldCheck,
  Truck,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  star: <Star className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  trending: <TrendingUp className="w-6 h-6" />,
  truck: <Truck className="w-6 h-6" />,
};

interface SectionRendererProps {
  section: PageSection;
  index: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function SectionRenderer({
  section,
  index,
  isSelected,
  onSelect,
}: SectionRendererProps) {
  const wrapperClass = `relative transition-all ${
    isSelected ? "ring-2 ring-primary ring-offset-2 rounded-lg" : ""
  } ${onSelect ? "cursor-pointer" : ""}`;

  return (
    <div className={wrapperClass} onClick={onSelect} data-section-index={index}>
      {renderSection(section)}
    </div>
  );
}

function renderSection(section: PageSection) {
  switch (section.type) {
    case "hero":
      return <HeroBlock section={section} />;
    case "problem":
      return <ProblemBlock section={section} />;
    case "solution":
      return <SolutionBlock section={section} />;
    case "features":
      return <FeaturesBlock section={section} />;
    case "trust":
      return <TrustBlock section={section} />;
    case "detail":
      return <DetailBlock section={section} />;
    case "reviews":
      return <ReviewsBlock section={section} />;
    case "cta":
      return <CTABlock section={section} />;
  }
}

/* ======== HERO ======== */
function HeroBlock({ section }: { section: HeroSection }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${section.style.backgroundColor} 0%, ${section.style.accentColor || section.style.backgroundColor}ee 50%, ${section.style.backgroundColor}dd 100%)`,
        color: section.style.textColor,
        padding: "0",
      }}
    >
      {/* 배경 데코레이션 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-40%] right-[-30%] w-[350px] h-[350px] rounded-full bg-white/[0.07]" />
        <div className="absolute bottom-[-20%] left-[-15%] w-[250px] h-[250px] rounded-full bg-white/[0.05]" />
        <div className="absolute top-[20%] left-[10%] w-[80px] h-[80px] rounded-full bg-white/[0.04]" />
      </div>

      <div className="relative z-10 px-6 pt-16 pb-10">
        {/* 뱃지 */}
        {section.badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-bold uppercase tracking-wider mb-5 border border-white/10">
            <TrendingUp className="w-3 h-3" />
            {section.badge}
          </div>
        )}

        {/* 메인 카피 */}
        <h1 className="text-[28px] font-extrabold leading-[1.25] mb-4 font-outfit tracking-tight">
          {section.hookingText}
        </h1>
        <p className="text-[15px] opacity-85 leading-[1.7] mb-8 font-medium">
          {section.subText}
        </p>

        {/* 제품 이미지 */}
        {section.imageUrl && (
          <div className="mt-4 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10">
            <img
              src={section.imageUrl}
              alt="Product"
              className="w-full h-auto"
            />
          </div>
        )}

        {/* 하단 신뢰 미니 배지 */}
        <div className="flex items-center justify-center gap-4 mt-8 text-[11px] font-semibold opacity-70">
          <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> 무료배송</span>
          <span className="w-1 h-1 rounded-full bg-current opacity-40" />
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100% 정품</span>
          <span className="w-1 h-1 rounded-full bg-current opacity-40" />
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 당일발송</span>
        </div>
      </div>
    </div>
  );
}

/* ======== PROBLEM ======== */
function ProblemBlock({ section }: { section: ProblemSection }) {
  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <div className="text-center mb-8">
        <span
          className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
          style={{ backgroundColor: `${section.style.accentColor}12` }}
        >
          <AlertTriangle className="w-6 h-6" style={{ color: section.style.accentColor }} />
        </span>
        <h2 className="text-[22px] font-extrabold leading-tight font-outfit">
          {section.title}
        </h2>
      </div>
      <div className="space-y-3">
        {section.problems.map((problem, i) => (
          <div
            key={i}
            className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-black/[0.04]"
          >
            <span
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-extrabold text-white mt-0.5"
              style={{ backgroundColor: section.style.accentColor }}
            >
              {i + 1}
            </span>
            <p className="text-[14px] leading-[1.7] font-medium">{problem}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======== SOLUTION ======== */
function SolutionBlock({ section }: { section: SolutionSection }) {
  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ backgroundColor: `${section.style.accentColor}12` }}
        >
          <CheckCircle2 className="w-5 h-5" style={{ color: section.style.accentColor }} />
        </span>
        <h2 className="text-[22px] font-extrabold font-outfit">{section.title}</h2>
      </div>

      {section.imageUrl && (
        <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-black/[0.04]">
          <img src={section.imageUrl} alt="Solution" className="w-full h-auto" />
        </div>
      )}

      <p className="text-[14px] leading-[1.8] opacity-75 font-medium">
        {section.description}
      </p>
    </div>
  );
}

/* ======== FEATURES ======== */
function FeaturesBlock({ section }: { section: FeaturesSection }) {
  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <h2 className="text-[22px] font-extrabold mb-2 text-center font-outfit">
        {section.title}
      </h2>
      <p className="text-center text-[13px] opacity-50 mb-7">핵심 장점을 확인하세요</p>

      <div className="space-y-3.5">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-black/[0.04]"
          >
            <div className="flex items-center gap-3.5 mb-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${section.style.accentColor}10` }}
              >
                <span style={{ color: section.style.accentColor }}>
                  {iconMap[item.icon] || <Star className="w-6 h-6" />}
                </span>
              </div>
              <h3 className="font-bold text-[15px]">{item.title}</h3>
            </div>
            <p className="text-[13px] opacity-60 leading-[1.7] pl-[56px]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======== TRUST ======== */
function TrustBlock({ section }: { section: TrustSection }) {
  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <h2 className="text-[20px] font-extrabold mb-7 text-center font-outfit">
        {section.title}
      </h2>

      {/* 숫자 통계 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {section.items.map((item, i) => (
          <div key={i} className="text-center p-4 rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-black/[0.04]">
            <div
              className="text-[24px] font-extrabold font-outfit mb-1"
              style={{ color: section.style.accentColor }}
            >
              {item.number}
            </div>
            <div className="text-[11px] font-semibold opacity-50 uppercase tracking-wider">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* 신뢰 배지 */}
      <div className="flex flex-wrap justify-center gap-2">
        {section.badges.map((badge, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold border border-black/[0.06] bg-white dark:bg-white/5"
          >
            <BadgeCheck className="w-3.5 h-3.5" style={{ color: section.style.accentColor }} />
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ======== DETAIL ======== */
function DetailBlock({ section }: { section: DetailSection }) {
  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <h2 className="text-[22px] font-extrabold mb-2 font-outfit">{section.title}</h2>
      <p className="text-[13px] opacity-50 mb-6">제품의 모든 것을 확인하세요</p>

      {section.imageUrl && (
        <div className="mb-6 rounded-2xl overflow-hidden shadow-lg border border-black/[0.04]">
          <img src={section.imageUrl} alt="Detail" className="w-full h-auto" />
        </div>
      )}

      <p className="text-[14px] opacity-70 leading-[1.8] mb-6 font-medium">
        {section.content}
      </p>

      {section.specs.length > 0 && (
        <div className="rounded-2xl overflow-hidden border border-black/[0.06] bg-white dark:bg-white/5">
          {section.specs.map((spec, i) => (
            <div
              key={i}
              className={`flex justify-between items-center px-5 py-4 ${
                i < section.specs.length - 1 ? "border-b border-black/[0.04]" : ""
              }`}
            >
              <span className="text-[13px] font-semibold opacity-50">{spec.label}</span>
              <span className="text-[13px] font-bold">{spec.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ======== REVIEWS ======== */
function ReviewsBlock({ section }: { section: ReviewsSection }) {
  const avg = section.averageRating || 4.8;
  const total = section.totalReviews || 2847;

  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <h2 className="text-[22px] font-extrabold mb-6 font-outfit">{section.title}</h2>

      {/* 리뷰 요약 카드 */}
      <div className="p-5 rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-black/[0.04] mb-5">
        <div className="flex items-center gap-5">
          <div className="text-center">
            <div className="text-[36px] font-extrabold font-outfit leading-none" style={{ color: section.style.accentColor }}>
              {avg}
            </div>
            <div className="flex gap-0.5 mt-1.5 justify-center">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={`w-3.5 h-3.5 ${
                    j < Math.round(avg)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-bold mb-1">
              <Users className="w-3.5 h-3.5 inline mr-1 opacity-50" />
              {total.toLocaleString()}명이 구매했어요
            </div>
            <div className="text-[12px] opacity-50">
              구매자 {Math.round(avg / 5 * 100)}%가 만족했습니다
            </div>
            {/* 만족도 바 */}
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(avg / 5) * 100}%`, backgroundColor: section.style.accentColor }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 개별 리뷰 */}
      <div className="space-y-3">
        {section.items.map((review, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-white/5 shadow-sm border border-black/[0.04]"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ backgroundColor: section.style.accentColor }}
                >
                  {review.author.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-[13px]">{review.author}</span>
                  {review.verified && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <ThumbsUp className="w-2.5 h-2.5" /> 구매인증
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-3 h-3 ${
                      j < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 pl-10">
              <Quote className="w-3.5 h-3.5 shrink-0 opacity-15 mt-0.5" />
              <p className="text-[13px] opacity-65 leading-[1.7]">
                {review.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ======== CTA ======== */
function CTABlock({ section }: { section: CTASection }) {
  return (
    <div
      className="text-center relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${section.style.backgroundColor} 0%, ${section.style.accentColor || section.style.backgroundColor}dd 100%)`,
        color: section.style.textColor,
        padding: "0",
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-30%] left-[50%] translate-x-[-50%] w-[500px] h-[500px] rounded-full bg-white/[0.06]" />
      </div>

      <div className="relative z-10 px-6 py-14">
        {/* 긴급성 배지 */}
        {section.urgencyText && (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-bold mb-5 border border-white/10">
            <Clock className="w-3 h-3" />
            {section.urgencyText}
          </div>
        )}

        <h2 className="text-[26px] font-extrabold mb-3 font-outfit leading-tight">
          {section.title}
        </h2>
        <p className="text-[14px] opacity-85 mb-10 leading-[1.7] font-medium">
          {section.description}
        </p>

        {/* CTA 버튼 */}
        <button className="w-full max-w-[320px] py-[18px] rounded-2xl bg-white text-gray-900 font-extrabold text-[16px] shadow-xl hover:shadow-2xl transition-all active:scale-[0.97] flex items-center justify-center gap-2 mx-auto">
          {section.buttonText}
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 하단 보증 */}
        <div className="flex items-center justify-center gap-3 mt-5 text-[11px] font-semibold opacity-60">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> 안전결제</span>
          <span className="w-1 h-1 rounded-full bg-current opacity-40" />
          <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> 무료배송</span>
        </div>
      </div>
    </div>
  );
}
