"use client";

import React, { useState } from "react";
import { PageSection, SectionStyle } from "@/types";
import {
  X,
  Type,
  Palette,
  Trash2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface SectionEditorProps {
  section: PageSection;
  onUpdate: (updated: PageSection) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onClose: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function SectionEditor({
  section,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onClose,
  isFirst,
  isLast,
}: SectionEditorProps) {
  const [activeTab, setActiveTab] = useState<"content" | "style">("content");

  const updateStyle = (partial: Partial<SectionStyle>) => {
    onUpdate({
      ...section,
      style: { ...section.style, ...partial },
    } as PageSection);
  };

  const sectionLabel: Record<string, string> = {
    hero: "히어로",
    problem: "문제 제기",
    solution: "해결책",
    features: "특장점",
    trust: "신뢰 구축",
    detail: "상세 정보",
    reviews: "고객 후기",
    cta: "구매 유도",
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 max-w-[480px] mx-auto">
      <div className="bg-card border-t shadow-2xl rounded-t-3xl max-h-[60vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card z-10 px-6 pt-5 pb-3 flex items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase">
              {sectionLabel[section.type] || section.type}
            </span>
            <div className="flex gap-1">
              <button
                disabled={isFirst}
                onClick={onMoveUp}
                className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                disabled={isLast}
                onClick={onMoveDown}
                className="p-1.5 rounded-lg hover:bg-secondary disabled:opacity-30"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6">
          <button
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "content"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            <Type className="w-3.5 h-3.5" /> 내용
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === "style"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> 스타일
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {activeTab === "content" ? (
            <ContentEditor section={section} onUpdate={onUpdate} />
          ) : (
            <StyleEditor style={section.style} onUpdate={updateStyle} />
          )}
        </div>
      </div>
    </div>
  );
}

function ContentEditor({
  section,
  onUpdate,
}: {
  section: PageSection;
  onUpdate: (s: PageSection) => void;
}) {
  switch (section.type) {
    case "hero":
      return (
        <div className="space-y-4">
          <Field
            label="후킹 문구"
            value={section.hookingText}
            onChange={(v) => onUpdate({ ...section, hookingText: v })}
          />
          <Field
            label="서브 텍스트"
            value={section.subText}
            onChange={(v) => onUpdate({ ...section, subText: v })}
          />
          <Field
            label="뱃지"
            value={section.badge || ""}
            onChange={(v) => onUpdate({ ...section, badge: v })}
          />
        </div>
      );
    case "problem":
      return (
        <div className="space-y-4">
          <Field
            label="제목"
            value={section.title}
            onChange={(v) => onUpdate({ ...section, title: v })}
          />
          {section.problems.map((p, i) => (
            <Field
              key={i}
              label={`문제 ${i + 1}`}
              value={p}
              onChange={(v) => {
                const problems = [...section.problems];
                problems[i] = v;
                onUpdate({ ...section, problems });
              }}
            />
          ))}
        </div>
      );
    case "solution":
      return (
        <div className="space-y-4">
          <Field
            label="제목"
            value={section.title}
            onChange={(v) => onUpdate({ ...section, title: v })}
          />
          <Field
            label="설명"
            value={section.description}
            onChange={(v) => onUpdate({ ...section, description: v })}
            multiline
          />
        </div>
      );
    case "features":
      return (
        <div className="space-y-4">
          <Field
            label="제목"
            value={section.title}
            onChange={(v) => onUpdate({ ...section, title: v })}
          />
          {section.items.map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-secondary/50 space-y-2">
              <span className="text-xs font-bold text-muted-foreground">
                특장점 {i + 1}
              </span>
              <Field
                label="제목"
                value={item.title}
                onChange={(v) => {
                  const items = [...section.items];
                  items[i] = { ...items[i], title: v };
                  onUpdate({ ...section, items });
                }}
              />
              <Field
                label="설명"
                value={item.description}
                onChange={(v) => {
                  const items = [...section.items];
                  items[i] = { ...items[i], description: v };
                  onUpdate({ ...section, items });
                }}
              />
            </div>
          ))}
        </div>
      );
    case "detail":
      return (
        <div className="space-y-4">
          <Field
            label="제목"
            value={section.title}
            onChange={(v) => onUpdate({ ...section, title: v })}
          />
          <Field
            label="내용"
            value={section.content}
            onChange={(v) => onUpdate({ ...section, content: v })}
            multiline
          />
          {section.specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <Field
                label="항목"
                value={spec.label}
                onChange={(v) => {
                  const specs = [...section.specs];
                  specs[i] = { ...specs[i], label: v };
                  onUpdate({ ...section, specs });
                }}
              />
              <Field
                label="값"
                value={spec.value}
                onChange={(v) => {
                  const specs = [...section.specs];
                  specs[i] = { ...specs[i], value: v };
                  onUpdate({ ...section, specs });
                }}
              />
            </div>
          ))}
        </div>
      );
    case "reviews":
      return (
        <div className="space-y-4">
          <Field
            label="제목"
            value={section.title}
            onChange={(v) => onUpdate({ ...section, title: v })}
          />
          {section.items.map((review, i) => (
            <div key={i} className="p-3 rounded-xl bg-secondary/50 space-y-2">
              <span className="text-xs font-bold text-muted-foreground">
                후기 {i + 1}
              </span>
              <Field
                label="작성자"
                value={review.author}
                onChange={(v) => {
                  const items = [...section.items];
                  items[i] = { ...items[i], author: v };
                  onUpdate({ ...section, items });
                }}
              />
              <Field
                label="내용"
                value={review.content}
                onChange={(v) => {
                  const items = [...section.items];
                  items[i] = { ...items[i], content: v };
                  onUpdate({ ...section, items });
                }}
              />
            </div>
          ))}
        </div>
      );
    case "trust":
      return (
        <div className="space-y-4">
          <Field
            label="제목"
            value={section.title}
            onChange={(v) => onUpdate({ ...section, title: v })}
          />
          {section.items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <Field
                label="숫자"
                value={item.number}
                onChange={(v) => {
                  const items = [...section.items];
                  items[i] = { ...items[i], number: v };
                  onUpdate({ ...section, items });
                }}
              />
              <Field
                label="라벨"
                value={item.label}
                onChange={(v) => {
                  const items = [...section.items];
                  items[i] = { ...items[i], label: v };
                  onUpdate({ ...section, items });
                }}
              />
            </div>
          ))}
        </div>
      );
    case "cta":
      return (
        <div className="space-y-4">
          <Field
            label="제목"
            value={section.title}
            onChange={(v) => onUpdate({ ...section, title: v })}
          />
          <Field
            label="설명"
            value={section.description}
            onChange={(v) => onUpdate({ ...section, description: v })}
          />
          <Field
            label="버튼 텍스트"
            value={section.buttonText}
            onChange={(v) => onUpdate({ ...section, buttonText: v })}
          />
          <Field
            label="긴급성 문구"
            value={section.urgencyText || ""}
            onChange={(v) => onUpdate({ ...section, urgencyText: v })}
          />
        </div>
      );
  }
}

function StyleEditor({
  style,
  onUpdate,
}: {
  style: SectionStyle;
  onUpdate: (partial: Partial<SectionStyle>) => void;
}) {
  return (
    <div className="space-y-4">
      <ColorField
        label="배경색"
        value={style.backgroundColor}
        onChange={(v) => onUpdate({ backgroundColor: v })}
      />
      <ColorField
        label="텍스트 색상"
        value={style.textColor}
        onChange={(v) => onUpdate({ textColor: v })}
      />
      <ColorField
        label="강조 색상"
        value={style.accentColor}
        onChange={(v) => onUpdate({ accentColor: v })}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const cls =
    "w-full bg-secondary py-2.5 px-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all";
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-muted-foreground">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className={cls + " resize-none"}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cls}
        />
      )}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-xs font-bold text-muted-foreground w-20 shrink-0">
        {label}
      </label>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-secondary py-2 px-3 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}
