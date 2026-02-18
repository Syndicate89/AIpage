"use client";

import React, { useState, useEffect } from "react";
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
  CheckCircle2,
  ChevronRight,
  BadgeCheck,
  TrendingUp,
  Award,
  Heart,
  Truck,
  ShieldCheck,
  Clock,
  X as XIcon,
  ArrowDown,
  Flame,
  Eye,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  star: <Star className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
  award: <Award className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  trending: <TrendingUp className="w-6 h-6" />,
  truck: <Truck className="w-6 h-6" />,
  flame: <Flame className="w-6 h-6" />,
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

/* ================================================================
   HERO — 다크 프리미엄 히어로
   ================================================================ */
function HeroBlock({ section }: { section: HeroSection }) {
  const accent = section.style.accentColor || "#f59e0b";
  const hasBgImage = !!section.backgroundImageUrl;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: hasBgImage
          ? undefined
          : `radial-gradient(ellipse at 50% 30%, ${accent}18 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, ${accent}0a 0%, transparent 50%), ${section.style.backgroundColor}`,
        color: section.style.textColor,
        fontFamily: section.style.fontFamily,
      }}
    >
      {/* 배경 이미지 + 오버레이 */}
      {hasBgImage && (
        <>
          <div className="absolute inset-0" style={{ backgroundImage: `url(${section.backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${section.style.backgroundColor}ee 0%, ${section.style.backgroundColor}cc 50%, ${section.style.backgroundColor}ee 100%)` }} />
        </>
      )}

      {/* 배경 글로우 */}
      {!hasBgImage && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-[0.08]" style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }} />
          <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />
        </div>
      )}

      <div className="relative z-10 px-6 pt-20 pb-12">
        {/* 뱃지 */}
        {section.badge && (
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border backdrop-blur-sm" style={{ borderColor: `${accent}50`, backgroundColor: `${accent}15` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
            <span className="text-[11px] font-bold tracking-[0.08em] uppercase" style={{ color: accent }}>
              {section.badge}
            </span>
          </div>
        )}

        {/* 메인 카피 — 줄바꿈 & 그라데이션 텍스트 */}
        <h1 className="text-[32px] font-black leading-[1.15] tracking-[-0.04em] mb-5">
          {section.hookingText.split(/[,.]/).map((part, i) => {
            const trimmed = part.trim();
            if (!trimmed) return null;
            return i === 0 ? (
              <span key={i} className="block">{trimmed}</span>
            ) : (
              <span key={i} className="block bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                {trimmed}
              </span>
            );
          })}
        </h1>

        <p className="text-[15px] opacity-70 leading-[1.8] mb-8 max-w-[340px]">
          {section.subText}
        </p>

        {/* 제품 이미지 */}
        {section.imageUrl && (
          <div className="rounded-3xl overflow-hidden shadow-2xl mb-8" style={{ boxShadow: `0 20px 60px ${accent}20` }}>
            <img src={section.imageUrl} alt="Product" className="w-full h-auto" />
          </div>
        )}

        {/* 소셜 프루프 */}
        {section.socialProofCount && (
          <div className="flex items-center gap-3 mb-8">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold" style={{ borderColor: section.style.backgroundColor, backgroundColor: `${accent}${20 + i * 15}`, color: section.style.textColor }}>
                  {["김", "이", "박", "최", "정"][i]}
                </div>
              ))}
            </div>
            <p className="text-[13px] opacity-60">
              <span className="font-bold opacity-100" style={{ color: accent }}>{section.socialProofCount.toLocaleString()}명</span>이 이번 달 구매
            </p>
          </div>
        )}

        {/* 하단 신뢰 배지 */}
        <div className="flex items-center justify-center gap-5 text-[11px] font-semibold opacity-50 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> 무료배송</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> 정품보증</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 당일발송</span>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   PROBLEM — 다크 배경 + 감성적 공감
   ================================================================ */
function ProblemBlock({ section }: { section: ProblemSection }) {
  const accent = section.style.accentColor || "#ef4444";
  const hasBgImage = !!section.backgroundImageUrl;

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: hasBgImage ? undefined : section.style.backgroundColor, color: section.style.textColor, padding: section.style.padding, fontFamily: section.style.fontFamily }}>
      {hasBgImage && (
        <>
          <div className="absolute inset-0" style={{ backgroundImage: `url(${section.backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0" style={{ background: `${section.style.backgroundColor}e6` }} />
        </>
      )}
      <div className={hasBgImage ? "relative z-10" : ""}>
      {/* 헤더 */}
      <div className="text-center mb-10">
        {section.subtitle && (
          <p className="text-[12px] font-bold tracking-[0.1em] uppercase mb-3" style={{ color: accent }}>
            {section.subtitle}
          </p>
        )}
        <h2 className="text-[26px] font-black leading-[1.2] tracking-[-0.03em]">
          {section.title.split(/[,?]/).map((part, i) => {
            const trimmed = part.trim();
            if (!trimmed) return null;
            return i > 0 ? (
              <span key={i}>
                <br />
                <span style={{ color: accent }}>{trimmed}{section.title.includes("?") && i === section.title.split(/[,?]/).filter(s => s.trim()).length - 1 ? "?" : ""}</span>
              </span>
            ) : (
              <span key={i}>{trimmed}</span>
            );
          })}
        </h2>
      </div>

      {/* 문제 카드 — 왼쪽 빨간 테두리 */}
      <div className="space-y-3 mb-10">
        {section.problems.map((problem, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 rounded-xl border-l-4"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.08)", borderLeftColor: accent }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}20` }}>
              <XIcon className="w-4 h-4" style={{ color: accent }} />
            </div>
            <p className="text-[14px] leading-[1.7] font-medium opacity-85">{problem}</p>
          </div>
        ))}
      </div>

      {/* 전환 블록 */}
      {section.transitionText && (
        <div className="text-center p-6 rounded-2xl border" style={{ background: `linear-gradient(135deg, ${accent}10, ${accent}05)`, borderColor: `${accent}25` }}>
          <p className="text-[20px] font-extrabold tracking-[-0.02em]">
            {section.transitionText}
          </p>
          <div className="mt-3 flex justify-center">
            <ArrowDown className="w-5 h-5 animate-bounce" style={{ color: accent }} />
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

/* ================================================================
   SOLUTION — 클린 화이트 + 하이라이트
   ================================================================ */
function SolutionBlock({ section }: { section: SolutionSection }) {
  const accent = section.style.accentColor || "#2563eb";

  return (
    <div style={{ backgroundColor: section.style.backgroundColor, color: section.style.textColor, padding: section.style.padding, fontFamily: section.style.fontFamily }}>
      {/* 카테고리 태그 */}
      <p className="text-[12px] font-bold tracking-[0.08em] uppercase mb-3" style={{ color: accent }}>
        ✦ 솔루션
      </p>

      <h2 className="text-[26px] font-black leading-[1.2] tracking-[-0.03em] mb-4">
        {section.title}
      </h2>

      {section.imageUrl && (
        <div className="mb-6 rounded-2xl overflow-hidden shadow-lg" style={{ boxShadow: `0 8px 32px ${accent}12` }}>
          <img src={section.imageUrl} alt="Solution" className="w-full h-auto" />
        </div>
      )}

      <p className="text-[15px] opacity-65 leading-[1.8] mb-6">
        {section.description}
      </p>

      {/* 하이라이트 칩 */}
      {section.highlights && section.highlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {section.highlights.map((h, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold" style={{ backgroundColor: `${accent}10`, color: accent }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              {h}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   FEATURES — 넘버링 카드 + VS 비교 테이블
   ================================================================ */
function FeaturesBlock({ section }: { section: FeaturesSection }) {
  const accent = section.style.accentColor || "#2563eb";

  return (
    <div style={{ backgroundColor: section.style.backgroundColor, color: section.style.textColor, padding: section.style.padding, fontFamily: section.style.fontFamily }}>
      {/* 헤더 */}
      <div className="text-center mb-10">
        {section.subtitle && (
          <div className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.06em] uppercase mb-4" style={{ backgroundColor: `${accent}10`, color: accent }}>
            {section.subtitle}
          </div>
        )}
        <h2 className="text-[24px] font-black tracking-[-0.03em] leading-[1.2]">
          왜 <span style={{ color: accent }}>{section.title.replace(/왜\s*/, "").replace(/이어야 하는가/, "")}</span>이어야 하는가
        </h2>
      </div>

      {/* 넘버링 피처 카드 */}
      <div className="space-y-4 mb-10">
        {section.items.map((item, i) => {
          const num = String(i + 1).padStart(2, "0");
          return (
            <div key={i} className="group relative p-6 rounded-2xl border overflow-hidden" style={{ borderColor: `${section.style.textColor}08`, backgroundColor: section.style.backgroundColor === "#ffffff" ? "#ffffff" : "rgba(255,255,255,0.05)" }}>
              {/* 배경 대형 번호 */}
              <span className="absolute top-2 right-3 text-[72px] font-black leading-none select-none pointer-events-none" style={{ color: `${section.style.textColor}05` }}>
                {num}
              </span>

              <div className="relative flex gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}10` }}>
                  <span style={{ color: accent }}>
                    {iconMap[item.icon] || <Star className="w-6 h-6" />}
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-[16px] mb-1.5 tracking-[-0.01em]">{item.title}</h3>
                  <p className="text-[13px] opacity-55 leading-[1.8]">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VS 비교 테이블 */}
      {section.comparisons && section.comparisons.length > 0 && (
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: `${section.style.textColor}0a` }}>
          {/* 헤더 */}
          <div className="grid grid-cols-3 text-center">
            <div className="p-3.5 text-[12px] font-semibold opacity-40" style={{ backgroundColor: `${section.style.textColor}05` }}>항목</div>
            <div className="p-3.5 text-[12px] font-semibold opacity-40" style={{ backgroundColor: `${section.style.textColor}05` }}>일반 제품</div>
            <div className="p-3.5 text-[12px] font-bold text-white" style={{ backgroundColor: accent }}>우리 제품</div>
          </div>
          {section.comparisons.map((row, i) => (
            <div key={i} className="grid grid-cols-3 text-center border-t" style={{ borderColor: `${section.style.textColor}08` }}>
              <div className="p-3.5 text-[13px] font-medium opacity-60" style={{ backgroundColor: `${section.style.textColor}03` }}>{row.label}</div>
              <div className="p-3.5 text-[13px] text-red-400">{row.competitor}</div>
              <div className="p-3.5 text-[13px] font-bold" style={{ color: accent, backgroundColor: `${accent}05` }}>{row.ours}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   TRUST — 대형 숫자 + 만족도 바 + 인증 배지
   ================================================================ */
function TrustBlock({ section }: { section: TrustSection }) {
  const accent = section.style.accentColor || "#2563eb";

  return (
    <div style={{ backgroundColor: section.style.backgroundColor, color: section.style.textColor, padding: section.style.padding, fontFamily: section.style.fontFamily }}>
      <h2 className="text-[22px] font-black mb-8 text-center tracking-[-0.03em]">
        {section.title}
      </h2>

      {/* 통계 그리드 — 2x2 */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {section.items.map((item, i) => (
          <div key={i} className="text-center p-5 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <div className="text-[28px] font-black tracking-[-0.04em] mb-0.5" style={{ color: accent }}>
              {item.number}
            </div>
            <div className="text-[12px] font-semibold opacity-45">{item.label}</div>
          </div>
        ))}
      </div>

      {/* 만족도 바 */}
      {section.satisfactionBars && section.satisfactionBars.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] mb-8">
          <h3 className="font-extrabold text-[15px] mb-5 tracking-[-0.01em]">고객 만족도 분석</h3>
          <div className="space-y-4">
            {section.satisfactionBars.map((bar, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[13px] font-medium opacity-55 w-20 shrink-0">{bar.label}</span>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${bar.percentage}%`, background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }} />
                </div>
                <span className="text-[13px] font-bold w-10 text-right" style={{ color: accent }}>{bar.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 인증 배지 */}
      <div className="flex flex-wrap justify-center gap-2">
        {section.badges.map((badge, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border-2 bg-white text-[12px] font-bold" style={{ borderColor: `${section.style.textColor}0e` }}>
            <BadgeCheck className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   DETAIL — 스펙 테이블 + 이미지
   ================================================================ */
function DetailBlock({ section }: { section: DetailSection }) {
  const accent = section.style.accentColor || "#2563eb";

  return (
    <div style={{ backgroundColor: section.style.backgroundColor, color: section.style.textColor, padding: section.style.padding, fontFamily: section.style.fontFamily }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accent }} />
        <h2 className="text-[22px] font-black tracking-[-0.03em]">{section.title}</h2>
      </div>
      <p className="text-[13px] opacity-40 mb-6 pl-4">제품의 모든 것을 확인하세요</p>

      {section.imageUrl && (
        <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
          <img src={section.imageUrl} alt="Detail" className="w-full h-auto" />
        </div>
      )}

      <p className="text-[14px] opacity-60 leading-[1.8] mb-6">
        {section.content}
      </p>

      {section.specs.length > 0 && (
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: `${section.style.textColor}0a` }}>
          {section.specs.map((spec, i) => (
            <div
              key={i}
              className="flex justify-between items-center px-5 py-4"
              style={{
                backgroundColor: i % 2 === 0 ? `${section.style.textColor}03` : "transparent",
                borderBottom: i < section.specs.length - 1 ? `1px solid ${section.style.textColor}08` : "none",
              }}
            >
              <span className="text-[13px] font-medium opacity-45">{spec.label}</span>
              <span className="text-[13px] font-bold">{spec.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   REVIEWS — 별점 분포 + BEST 후기 + 개별 리뷰
   ================================================================ */
function ReviewsBlock({ section }: { section: ReviewsSection }) {
  const accent = section.style.accentColor || "#2563eb";
  const avg = section.averageRating || 4.9;
  const total = section.totalReviews || 8420;

  return (
    <div style={{ backgroundColor: section.style.backgroundColor, color: section.style.textColor, padding: section.style.padding, fontFamily: section.style.fontFamily }}>
      {/* 섹션 헤더 */}
      <div className="text-center mb-8">
        <p className="text-[12px] font-bold tracking-[0.08em] uppercase mb-2" style={{ color: "#eab308" }}>
          ★ 실제 구매자 리뷰
        </p>
        <h2 className="text-[24px] font-black tracking-[-0.03em]">
          {total.toLocaleString()}명이 직접 경험했습니다
        </h2>
      </div>

      {/* 별점 요약 + 분포 */}
      <div className="flex gap-6 p-6 rounded-2xl mb-8" style={{ backgroundColor: `${section.style.textColor}04` }}>
        {/* 왼쪽: 큰 평점 */}
        <div className="text-center shrink-0">
          <div className="text-[48px] font-black leading-none tracking-[-0.04em]">{avg}</div>
          <div className="flex justify-center gap-0.5 my-2">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star key={j} className={`w-4 h-4 ${j < Math.round(avg) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
            ))}
          </div>
          <div className="text-[12px] opacity-40">{total.toLocaleString()}개 리뷰</div>
        </div>

        {/* 오른쪽: 별점 분포 바 */}
        {section.starDistribution && (
          <div className="flex-1 space-y-1.5 pt-1">
            {section.starDistribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-2">
                <span className="text-[11px] opacity-40 w-5 text-right">{d.stars}★</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${d.percentage}%` }} />
                </div>
                <span className="text-[11px] opacity-40 w-7">{d.percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BEST 후기 */}
      {section.items.filter(r => r.tag).length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 rounded-full bg-yellow-400" />
            <h3 className="font-bold text-[14px]">BEST 후기</h3>
          </div>
          <div className="space-y-3">
            {section.items.filter(r => r.tag).slice(0, 2).map((review, i) => (
              <div key={i} className="p-5 rounded-2xl border-2" style={{ borderColor: "#fde04730", background: "linear-gradient(135deg, #fef9c310, #fed7aa10)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex gap-0.5 mb-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                      ))}
                    </div>
                    <span className="font-bold text-[13px]">{review.author}</span>
                  </div>
                  {review.tag && (
                    <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-[11px] font-bold">
                      {review.tag}
                    </span>
                  )}
                </div>
                <p className="text-[13px] opacity-65 leading-[1.8]">&ldquo;{review.content}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 일반 리뷰 */}
      <div className="space-y-3">
        {section.items.filter(r => !r.tag).map((review, i) => (
          <div key={i} className="p-4 rounded-2xl border" style={{ borderColor: `${section.style.textColor}08` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: accent }}>
                  {review.author.charAt(0)}
                </div>
                <div>
                  <span className="font-bold text-[13px]">{review.author}</span>
                  {review.verified && (
                    <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-600">인증구매</span>
                  )}
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-3 h-3 ${j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                ))}
              </div>
            </div>
            <p className="text-[13px] opacity-55 leading-[1.7] pl-[42px]">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   CTA — 카운트다운 + 가격 + 긴급성
   ================================================================ */
function CTABlock({ section }: { section: CTASection }) {
  const accent = section.style.accentColor || "#2563eb";
  const hasBgImage = !!section.backgroundImageUrl;
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 47, s: 33 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: section.style.backgroundColor, color: section.style.textColor, fontFamily: section.style.fontFamily }}
    >
      {hasBgImage && (
        <>
          <div className="absolute inset-0" style={{ backgroundImage: `url(${section.backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0" style={{ background: `${section.style.backgroundColor}e6` }} />
        </>
      )}

      {!hasBgImage && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full" style={{ background: `radial-gradient(circle, ${accent}12, transparent 70%)` }} />
        </div>
      )}

      <div className="relative z-10 px-6 py-14">
        {/* 실시간 뷰어 배너 */}
        <div className="flex items-center justify-center gap-2.5 mb-8 p-3.5 rounded-xl border" style={{ backgroundColor: "#ef444415", borderColor: "#ef444430" }}>
          <Eye className="w-4 h-4 text-red-400" />
          <p className="text-[13px] font-bold">
            <span className="text-red-400">지금 147명</span>
            <span className="opacity-60">이 이 페이지를 보고 있습니다</span>
          </p>
        </div>

        {/* 카운트다운 */}
        {section.urgencyText && (
          <div className="text-center mb-8">
            <p className="text-[13px] opacity-50 mb-3">{section.urgencyText}</p>
            <div className="flex items-center justify-center gap-2.5">
              {[
                { val: pad(timeLeft.h), label: "시간" },
                { val: pad(timeLeft.m), label: "분" },
                { val: pad(timeLeft.s), label: "초" },
              ].map((unit, i) => (
                <React.Fragment key={unit.label}>
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[24px] font-black tabular-nums" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                      {unit.val}
                    </div>
                    <span className="text-[10px] opacity-35 mt-1">{unit.label}</span>
                  </div>
                  {i < 2 && <span className="text-[20px] font-bold opacity-25 mb-4">:</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* 메인 카피 */}
        <div className="text-center mb-8">
          <h2 className="text-[28px] font-black tracking-[-0.03em] leading-[1.2] mb-3">
            {section.title}
          </h2>
          <p className="text-[14px] opacity-65 leading-[1.7]">{section.description}</p>
        </div>

        {/* 가격 */}
        {section.salePrice && (
          <div className="text-center mb-8 p-6 rounded-2xl bg-white/[0.05]">
            {section.originalPrice && (
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-[16px] line-through opacity-35">{section.originalPrice}</span>
                {section.discountRate && (
                  <span className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[12px] font-bold">{section.discountRate} OFF</span>
                )}
              </div>
            )}
            <div className="text-[40px] font-black tracking-[-0.04em]">
              {section.salePrice}
            </div>
            <p className="text-[12px] opacity-35 mt-1">무료배송 · VAT 포함</p>
          </div>
        )}

        {/* CTA 버튼 */}
        <button
          className="w-full py-5 rounded-2xl font-black text-[18px] transition-all flex items-center justify-center gap-2"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)`, color: "#ffffff", boxShadow: `0 8px 32px ${accent}40` }}
        >
          {section.buttonText}
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* 하단 보증 */}
        <div className="flex justify-center gap-5 mt-5">
          {["안전결제", "무료배송", "30일 환불보장"].map((t) => (
            <span key={t} className="text-[11px] opacity-40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-400" /> {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
