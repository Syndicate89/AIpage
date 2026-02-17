"use client";

import React from "react";
import {
  PageSection,
  HeroSection,
  ProblemSection,
  SolutionSection,
  FeaturesSection,
  DetailSection,
  ReviewsSection,
  CTASection,
} from "@/types";
import {
  Star,
  Shield,
  Zap,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Quote,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  star: <Star className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
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
    case "detail":
      return <DetailBlock section={section} />;
    case "reviews":
      return <ReviewsBlock section={section} />;
    case "cta":
      return <CTABlock section={section} />;
  }
}

function HeroBlock({ section }: { section: HeroSection }) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${section.style.backgroundColor}, ${section.style.accentColor || section.style.backgroundColor}dd)`,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[-50%] right-[-20%] w-[300px] h-[300px] rounded-full bg-white/20" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[200px] h-[200px] rounded-full bg-white/10" />
      </div>
      <div className="relative z-10 py-12 text-center">
        <h1 className="text-3xl font-extrabold leading-tight mb-4 font-outfit">
          {section.hookingText}
        </h1>
        <p className="text-base opacity-90 leading-relaxed">
          {section.subText}
        </p>
        {section.imageUrl && (
          <div className="mt-8 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={section.imageUrl}
              alt="Hero"
              className="w-full h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ProblemBlock({ section }: { section: ProblemSection }) {
  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <h2 className="text-xl font-bold mb-6 font-outfit">{section.title}</h2>
      <div className="space-y-4">
        {section.problems.map((problem, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm shadow-sm"
          >
            <AlertCircle
              className="w-5 h-5 mt-0.5 shrink-0"
              style={{ color: section.style.accentColor }}
            />
            <p className="text-sm leading-relaxed">{problem}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SolutionBlock({ section }: { section: SolutionSection }) {
  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2
          className="w-6 h-6"
          style={{ color: section.style.accentColor }}
        />
        <h2 className="text-xl font-bold font-outfit">{section.title}</h2>
      </div>
      <p className="text-sm leading-relaxed opacity-80">
        {section.description}
      </p>
      {section.imageUrl && (
        <div className="mt-6 rounded-2xl overflow-hidden shadow-lg">
          <img src={section.imageUrl} alt="Solution" className="w-full h-auto" />
        </div>
      )}
    </div>
  );
}

function FeaturesBlock({ section }: { section: FeaturesSection }) {
  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <h2 className="text-xl font-bold mb-6 text-center font-outfit">
        {section.title}
      </h2>
      <div className="space-y-4">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-white/5 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: `${section.style.accentColor}15` }}
              >
                <span style={{ color: section.style.accentColor }}>
                  {iconMap[item.icon] || <Star className="w-6 h-6" />}
                </span>
              </div>
              <h3 className="font-bold">{item.title}</h3>
            </div>
            <p className="text-sm opacity-70 leading-relaxed pl-[52px]">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailBlock({ section }: { section: DetailSection }) {
  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <h2 className="text-xl font-bold mb-4 font-outfit">{section.title}</h2>
      <p className="text-sm opacity-80 leading-relaxed mb-6">
        {section.content}
      </p>
      {section.imageUrl && (
        <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
          <img src={section.imageUrl} alt="Detail" className="w-full h-auto" />
        </div>
      )}
      {section.specs.length > 0 && (
        <div className="rounded-2xl overflow-hidden border">
          {section.specs.map((spec, i) => (
            <div
              key={i}
              className={`flex justify-between px-5 py-3.5 text-sm ${
                i < section.specs.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="font-medium opacity-60">{spec.label}</span>
              <span className="font-bold">{spec.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReviewsBlock({ section }: { section: ReviewsSection }) {
  return (
    <div
      style={{
        backgroundColor: section.style.backgroundColor,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <h2 className="text-xl font-bold mb-6 font-outfit">{section.title}</h2>
      <div className="space-y-4">
        {section.items.map((review, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-white/5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm">{review.author}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-3.5 h-3.5 ${
                      j < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Quote className="w-4 h-4 shrink-0 opacity-20 mt-0.5" />
              <p className="text-sm opacity-70 leading-relaxed">
                {review.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTABlock({ section }: { section: CTASection }) {
  return (
    <div
      className="text-center relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${section.style.backgroundColor}, ${section.style.accentColor || section.style.backgroundColor}cc)`,
        color: section.style.textColor,
        padding: section.style.padding,
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[-30%] left-[50%] translate-x-[-50%] w-[400px] h-[400px] rounded-full bg-white/20" />
      </div>
      <div className="relative z-10 py-8">
        <h2 className="text-2xl font-extrabold mb-3 font-outfit">
          {section.title}
        </h2>
        <p className="text-sm opacity-90 mb-8 leading-relaxed">
          {section.description}
        </p>
        <button className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold text-base shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-2 mx-auto">
          {section.buttonText}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
