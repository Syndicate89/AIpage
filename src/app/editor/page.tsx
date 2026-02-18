"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  Pencil,
  Download,
  Undo2,
  Redo2,
  Sparkles,
} from "lucide-react";
import { DetailPage, PageSection } from "@/types";
import SectionRenderer from "@/components/SectionRenderer";
import SectionEditor from "@/components/SectionEditor";

export default function EditorPage() {
  const router = useRouter();
  const [page, setPage] = useState<DetailPage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [history, setHistory] = useState<DetailPage[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const stored = sessionStorage.getItem("generatedPage");
    if (stored) {
      const parsed = JSON.parse(stored) as DetailPage;
      setPage(parsed);
      setHistory([parsed]);
      setHistoryIndex(0);
    } else {
      router.push("/");
    }
  }, [router]);

  const pushHistory = useCallback(
    (newPage: DetailPage) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newPage);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPage(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPage(history[historyIndex + 1]);
    }
  };

  const updateSection = (index: number, updated: PageSection) => {
    if (!page) return;
    const newSections = [...page.sections];
    newSections[index] = updated;
    const newPage = { ...page, sections: newSections };
    setPage(newPage);
    pushHistory(newPage);
  };

  const deleteSection = (index: number) => {
    if (!page) return;
    const newSections = page.sections.filter((_, i) => i !== index);
    const newPage = { ...page, sections: newSections };
    setPage(newPage);
    pushHistory(newPage);
    setSelectedIndex(null);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (!page) return;
    const newSections = [...page.sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];

    const newPage = { ...page, sections: newSections };
    setPage(newPage);
    pushHistory(newPage);
    setSelectedIndex(targetIndex);
  };

  const handleExportHTML = () => {
    if (!page) return;

    // 간단한 HTML 내보내기
    const sectionsHTML = page.sections
      .map((section) => {
        const style = `background-color:${section.style.backgroundColor};color:${section.style.textColor};padding:${section.style.padding};`;
        switch (section.type) {
          case "hero":
            return `<div style="${style};background:linear-gradient(135deg,${section.style.backgroundColor},${section.style.accentColor}dd);text-align:center;padding:60px 24px;">
              <h1 style="font-size:28px;font-weight:800;margin-bottom:12px;">${section.hookingText}</h1>
              <p style="font-size:15px;opacity:0.9;">${section.subText}</p>
            </div>`;
          case "problem":
            return `<div style="${style}">
              <h2 style="font-size:20px;font-weight:700;margin-bottom:20px;">${section.title}</h2>
              ${section.problems.map((p) => `<div style="padding:16px;margin-bottom:12px;border-radius:12px;background:rgba(255,255,255,0.6);">${p}</div>`).join("")}
            </div>`;
          case "solution":
            return `<div style="${style}">
              <h2 style="font-size:20px;font-weight:700;margin-bottom:12px;">${section.title}</h2>
              <p style="font-size:14px;opacity:0.8;">${section.description}</p>
            </div>`;
          case "features":
            return `<div style="${style}">
              <h2 style="font-size:20px;font-weight:700;margin-bottom:20px;text-align:center;">${section.title}</h2>
              ${section.items.map((item) => `<div style="padding:20px;margin-bottom:12px;border-radius:16px;background:white;">
                <h3 style="font-weight:700;margin-bottom:4px;">${item.title}</h3>
                <p style="font-size:13px;opacity:0.7;">${item.description}</p>
              </div>`).join("")}
            </div>`;
          case "detail":
            return `<div style="${style}">
              <h2 style="font-size:20px;font-weight:700;margin-bottom:12px;">${section.title}</h2>
              <p style="font-size:14px;opacity:0.8;margin-bottom:20px;">${section.content}</p>
              <table style="width:100%;border-collapse:collapse;">
                ${section.specs.map((s) => `<tr><td style="padding:12px;border-bottom:1px solid #eee;opacity:0.6;">${s.label}</td><td style="padding:12px;border-bottom:1px solid #eee;font-weight:700;text-align:right;">${s.value}</td></tr>`).join("")}
              </table>
            </div>`;
          case "reviews":
            return `<div style="${style}">
              <h2 style="font-size:20px;font-weight:700;margin-bottom:20px;">${section.title}</h2>
              ${section.items.map((r) => `<div style="padding:20px;margin-bottom:12px;border-radius:16px;background:white;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;"><strong>${r.author}</strong><span>${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</span></div>
                <p style="font-size:13px;opacity:0.7;">${r.content}</p>
              </div>`).join("")}
            </div>`;
          case "cta":
            return `<div style="${style};background:linear-gradient(135deg,${section.style.backgroundColor},${section.style.accentColor}cc);text-align:center;padding:60px 24px;">
              <h2 style="font-size:24px;font-weight:800;margin-bottom:12px;">${section.title}</h2>
              <p style="font-size:14px;opacity:0.9;margin-bottom:28px;">${section.description}</p>
              <a style="display:inline-block;padding:16px 32px;border-radius:16px;background:white;color:#1a1a2e;font-weight:700;text-decoration:none;">${section.buttonText}</a>
            </div>`;
          default:
            return "";
        }
      })
      .join("\n");

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.productName} - 상세페이지</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: '${page.brandGuide.fontFamily}', -apple-system, sans-serif; max-width: 480px; margin: 0 auto; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
${sectionsHTML}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${page.productName}_상세페이지.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 glass px-4 pt-10 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-outfit font-bold text-sm truncate max-w-[160px]">
            {page.productName}
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 rounded-xl hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded-xl hover:bg-secondary transition-colors disabled:opacity-30"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPreviewMode(false);
              setSelectedIndex(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              !isPreviewMode
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <Pencil className="w-3.5 h-3.5" /> 편집
          </button>
          <button
            onClick={() => {
              setIsPreviewMode(true);
              setSelectedIndex(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              isPreviewMode
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> 미리보기
          </button>
          <button
            onClick={handleExportHTML}
            className="py-2 px-3 rounded-xl text-xs font-bold bg-secondary text-muted-foreground flex items-center gap-1.5 hover:bg-secondary/80 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Section List */}
      <div
        className={`flex-1 ${selectedIndex !== null ? "pb-[50vh]" : "pb-6"}`}
        style={{ fontFamily: page.brandGuide.fontFamily }}
      >
        {page.sections.map((section, index) => (
          <motion.div
            key={`${section.type}-${index}`}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <SectionRenderer
              section={section}
              index={index}
              isSelected={!isPreviewMode && selectedIndex === index}
              onSelect={
                isPreviewMode
                  ? undefined
                  : () =>
                      setSelectedIndex(
                        selectedIndex === index ? null : index
                      )
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Section Editor Panel */}
      <AnimatePresence>
        {selectedIndex !== null && !isPreviewMode && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <SectionEditor
              section={page.sections[selectedIndex]}
              onUpdate={(updated) => updateSection(selectedIndex, updated)}
              onDelete={() => deleteSection(selectedIndex)}
              onMoveUp={() => moveSection(selectedIndex, "up")}
              onMoveDown={() => moveSection(selectedIndex, "down")}
              onClose={() => setSelectedIndex(null)}
              isFirst={selectedIndex === 0}
              isLast={selectedIndex === page.sections.length - 1}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
