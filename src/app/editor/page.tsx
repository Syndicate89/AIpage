"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  X,
  FileImage,
  Stamp,
} from "lucide-react";
import { DetailPage, PageSection } from "@/types";
import SectionRenderer from "@/components/SectionRenderer";
import SectionEditor from "@/components/SectionEditor";

export default function EditorPage() {
  const router = useRouter();
  const captureRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<DetailPage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [history, setHistory] = useState<DetailPage[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  const handleExportPNG = async (withWatermark: boolean) => {
    if (!page || !captureRef.current) return;

    setIsExporting(true);
    setShowExportModal(false);

    // 편집 UI 숨기기 위해 선택 해제
    const prevSelected = selectedIndex;
    setSelectedIndex(null);

    // DOM 업데이트 대기
    await new Promise((r) => setTimeout(r, 300));

    try {
      const { toPng } = await import("html-to-image");
      const target = captureRef.current;

      const dataUrl = await toPng(target, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
        filter: (node: HTMLElement) => {
          // ring/선택 UI 관련 스타일 필터링 안 함 (전부 캡처)
          return true;
        },
      });

      if (withWatermark) {
        // 워터마크를 위해 canvas로 변환
        const img = new Image();
        img.src = dataUrl;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);

          const w = canvas.width;
          const h = canvas.height;
          const fontSize = Math.max(w * 0.12, 60);
          const gap = fontSize * 2.5;

          ctx.font = `900 ${fontSize}px Arial, sans-serif`;
          ctx.fillStyle = "rgba(0, 0, 0, 0.13)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.save();
          ctx.translate(w / 2, h / 2);
          ctx.rotate(-Math.PI / 6);

          const diag = Math.sqrt(w * w + h * h);
          for (let y = -diag; y < diag; y += gap) {
            for (let x = -diag; x < diag; x += gap * 1.8) {
              ctx.fillText("SAMPLE", x, y);
            }
          }
          ctx.restore();

          const watermarkedUrl = canvas.toDataURL("image/png");
          downloadDataUrl(watermarkedUrl, `${page.productName}_상세페이지_sample.png`);
        }
      } else {
        downloadDataUrl(dataUrl, `${page.productName}_상세페이지.png`);
      }
    } catch (err) {
      console.error("PNG export error:", err);
      alert("이미지 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsExporting(false);
      setSelectedIndex(prevSelected);
    }
  };

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[480px] bg-card rounded-t-3xl p-6 pb-10 space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-outfit font-bold text-lg">PNG 내보내기</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-1.5 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* 샘플 버전 */}
              <button
                onClick={() => handleExportPNG(true)}
                className="w-full p-4 rounded-2xl border-2 border-transparent bg-secondary/50 hover:bg-secondary hover:border-primary/20 transition-all flex items-center gap-4 group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors">
                  <Stamp className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm mb-0.5">샘플 버전</div>
                  <div className="text-xs text-muted-foreground">
                    &quot;SAMPLE&quot; 워터마크가 포함된 미리보기용
                  </div>
                </div>
              </button>

              {/* 완성본 */}
              <button
                onClick={() => handleExportPNG(false)}
                className="w-full p-4 rounded-2xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all flex items-center gap-4 group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
                  <FileImage className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm mb-0.5">완성본</div>
                  <div className="text-xs text-muted-foreground">
                    워터마크 없는 최종 이미지
                  </div>
                </div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exporting Overlay */}
      <AnimatePresence>
        {isExporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Download className="w-8 h-8 text-white" />
              </motion.div>
              <p className="text-white font-bold text-sm">PNG 이미지 생성 중...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            onClick={() => setShowExportModal(true)}
            disabled={isExporting}
            className="py-2 px-3 rounded-xl text-xs font-bold bg-secondary text-muted-foreground flex items-center gap-1.5 hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Section List — capture target */}
      <div
        ref={captureRef}
        data-capture
        className={`flex-1 ${selectedIndex !== null ? "pb-[50vh]" : ""}`}
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
