"use client";

import React, { useState, useRef } from "react";
import {
  Sparkles,
  Image as ImageIcon,
  Type,
  Palette,
  Search,
  ArrowRight,
  Settings2,
  Cpu,
  X,
  FileText,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { generateDetailPage } from "@/lib/generator";
import { ProductInput, BrandGuide } from "@/types";
import LoadingOverlay from "@/components/LoadingOverlay";

const PRESET_COLORS = [
  "#7c3aed", "#3b82f6", "#10b981", "#f59e0b",
  "#ef4444", "#ec4899", "#8b5cf6", "#06b6d4",
  "#000000", "#1a1a2e",
];

const FONT_OPTIONS = [
  { label: "Pretendard", value: "Pretendard" },
  { label: "Noto Sans KR", value: "Noto Sans KR" },
  { label: "Spoqa Han Sans", value: "Spoqa Han Sans Neo" },
  { label: "Wanted Sans", value: "Wanted Sans" },
];

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [primaryColor, setPrimaryColor] = useState("#7c3aed");
  const [secondaryColor, setSecondaryColor] = useState("#3b82f6");
  const [fontFamily, setFontFamily] = useState("Pretendard");

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (!productName) return;

    setIsLoading(true);

    const brandGuide: BrandGuide = {
      primaryColor,
      secondaryColor,
      backgroundColor: "#f8f9fa",
      fontFamily,
    };

    const input: ProductInput = {
      productName,
      description,
      features,
      competitorUrl,
      images,
      brandGuide,
    };

    try {
      const page = await generateDetailPage(input, (step, progress) => {
        setLoadingStep(step);
        setLoadingProgress(progress);
      });

      // sessionStorage에 결과 저장 후 에디터로 이동
      sessionStorage.setItem("generatedPage", JSON.stringify(page));
      router.push("/editor");
    } catch {
      alert("생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-background text-foreground pb-24">
      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay step={loadingStep} progress={loadingProgress} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-10 glass">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Sparkles className="text-primary-foreground w-6 h-6" />
          </div>
          <h1 className="font-outfit text-xl font-bold tracking-tight">
            AI Page
          </h1>
        </div>
        <button className="p-2 rounded-full hover:bg-muted transition-colors">
          <Settings2 className="w-5 h-5 text-muted-foreground" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
            <Cpu className="w-3 h-3" /> Gemini AI Powered
          </span>
          <h2 className="text-3xl font-outfit font-extrabold leading-tight mb-3">
            팔리는 상세페이지,
            <br />
            <span className="text-primary">AI가 직접</span> 만듭니다.
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            제품 정보만 입력하면, AI가 경쟁사를 분석하고 최적의 상세페이지를
            자동으로 제작합니다.
          </p>
        </motion.div>

        {/* Input Form */}
        <div className="space-y-4">
          {/* 제품 기본 정보 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl bg-card border shadow-sm space-y-4"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Type className="w-3 h-3" /> 제품명 *
              </label>
              <input
                type="text"
                placeholder="어떤 제품을 판매하시나요?"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-secondary py-3 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3 h-3" /> 제품 설명
              </label>
              <textarea
                placeholder="제품의 특징이나 장점을 간단히 설명해주세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-secondary py-3 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> 주요 특장점
              </label>
              <input
                type="text"
                placeholder="특장점을 쉼표로 구분하여 입력 (예: 방수, 가벼움, 내구성)"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                className="w-full bg-secondary py-3 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Search className="w-3 h-3" /> 경쟁사 URL (선택)
              </label>
              <input
                type="text"
                placeholder="참고할 페이지 주소를 넣어주세요"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                className="w-full bg-secondary py-3 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
          </motion.div>

          {/* 이미지 업로드 & 브랜드 색상 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* 이미지 업로드 */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-2xl border bg-card hover:bg-secondary/50 transition-all flex flex-col items-center gap-2 group relative"
            >
              <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-xs font-bold">이미지 첨부</span>
              {images.length > 0 && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {images.length}
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* 브랜드 색상 */}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-4 rounded-2xl border bg-card hover:bg-secondary/50 transition-all flex flex-col items-center gap-2 group relative"
            >
              <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                <Palette className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="text-xs font-bold">브랜드 색상</span>
              <div className="absolute top-2 right-2 flex gap-1">
                <div
                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
            </button>
          </motion.div>

          {/* 이미지 미리보기 */}
          <AnimatePresence>
            {imagePreviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2 overflow-x-auto pb-2"
              >
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative shrink-0">
                    <img
                      src={src}
                      alt={`uploaded-${i}`}
                      className="w-20 h-20 rounded-xl object-cover border"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 색상 선택 패널 */}
          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 rounded-2xl bg-card border shadow-sm space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">
                    메인 색상
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setPrimaryColor(color)}
                        className="w-8 h-8 rounded-full border-2 transition-all relative"
                        style={{
                          backgroundColor: color,
                          borderColor:
                            primaryColor === color ? color : "transparent",
                          transform:
                            primaryColor === color ? "scale(1.15)" : "scale(1)",
                        }}
                      >
                        {primaryColor === color && (
                          <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                        )}
                      </button>
                    ))}
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-full cursor-pointer border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">
                    보조 색상
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSecondaryColor(color)}
                        className="w-8 h-8 rounded-full border-2 transition-all relative"
                        style={{
                          backgroundColor: color,
                          borderColor:
                            secondaryColor === color ? color : "transparent",
                          transform:
                            secondaryColor === color
                              ? "scale(1.15)"
                              : "scale(1)",
                        }}
                      >
                        {secondaryColor === color && (
                          <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                        )}
                      </button>
                    ))}
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-8 h-8 rounded-full cursor-pointer border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground">
                    폰트
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => setFontFamily(font.value)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                          fontFamily === font.value
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-secondary border-transparent"
                        }`}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer Generate Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none z-20">
        <div className="max-w-[480px] mx-auto pointer-events-auto">
          <button
            disabled={!productName || isLoading}
            onClick={handleGenerate}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-outfit font-bold shadow-xl transition-all active:scale-95 ${
              productName
                ? "bg-primary text-primary-foreground shadow-primary/30"
                : "bg-muted text-muted-foreground grayscale cursor-not-allowed"
            }`}
          >
            AI로 상세페이지 생성하기
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}
