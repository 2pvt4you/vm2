import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollToBeginHeaderProps {
  scrollProgress: number;
}

export default function ScrollToBeginHeader({ scrollProgress }: ScrollToBeginHeaderProps) {
  const TOTAL_FRAMES = 335;
  // Calculate current global frame index (1 to 335)
  const currentFrame = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(scrollProgress * (TOTAL_FRAMES - 1)) + 1));

  // Frame Ranges for sequence:
  // Intro: frame < 6
  // Statement 1: frame 6 to 70
  // Statement 2: frame 75 to 145
  // Statement 3: frame 150 to 220
  const isIntro = currentFrame < 6;
  const isStmt1 = currentFrame >= 6 && currentFrame <= 70;
  const isStmt2 = currentFrame >= 75 && currentFrame <= 145;
  const isStmt3 = currentFrame >= 150 && currentFrame <= 220;

  // Fade calculation helper with smooth easing
  const getProgressState = (frame: number, start: number, end: number, fadeLen = 14) => {
    if (frame < start || frame > end) return { opacity: 0, progress: 0 };
    let opacity = 1;
    if (frame < start + fadeLen) {
      opacity = (frame - start) / fadeLen;
    } else if (frame > end - fadeLen) {
      opacity = (end - frame) / fadeLen;
    }
    const progress = (frame - start) / (end - start);
    return { opacity, progress };
  };

  const introOpacity = isIntro ? Math.max(0, 1 - (scrollProgress * 335) / 6) : 0;
  const s1 = getProgressState(currentFrame, 6, 70, 14);
  const s2 = getProgressState(currentFrame, 75, 145, 14);
  const s3 = getProgressState(currentFrame, 150, 220, 14);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden select-none">
      
      {/* 
        ========================================================================
        1. INTRO / BEGIN PAGE COVER OVERLAY
        White background with clouds visible through backdrop, clean typography
        ========================================================================
      */}
      {isIntro && (
        <div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 sm:p-10 text-center transition-opacity duration-300 pointer-events-auto bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm"
          style={{ opacity: Math.max(0, introOpacity) }}
        >
          <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 my-auto">
            {/* Main Brand Title */}
            <div className="space-y-3">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.35em] text-blue-900 dark:text-amber-400">
                VARAHA METALIKS PVT. LTD.
              </span>
              <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.05]">
                Varaha Metaliks
              </h1>
              <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />
              <p className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                From Iron to Infrastructure.
              </p>
            </div>

            {/* Subtitle Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200 max-w-2xl font-medium leading-relaxed">
              Precision Ductile Iron Pipe Fittings, DI Manhole Covers, &amp; Ferrous Alloy Castings.
            </p>

            {/* Scroll to Begin Button Prompt */}
            <div className="mt-6 flex flex-col items-center gap-3 animate-bounce">
              <div className="flex items-center gap-3 px-7 py-3 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs sm:text-sm font-bold tracking-[0.2em] uppercase shadow-2xl border border-white/20">
                <span>Scroll to begin</span>
                <ChevronDown className="w-4 h-4 text-amber-400 dark:text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        2. STATEMENT 1: ARCHITECTURAL COMPOSITION
        Large headline extending gracefully, layered depth, progress tracking
        ========================================================================
      */}
      {isStmt1 && (
        <div
          className="absolute inset-0 z-30 flex flex-col justify-end p-6 sm:p-12 md:p-16 transition-all duration-300 pointer-events-none"
          style={{ opacity: s1.opacity }}
        >
          <div className="max-w-5xl space-y-3 transform transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(${(1 - s1.progress) * 20 - 10}px) scale(${0.98 + s1.progress * 0.03})`,
            }}
          >
            {/* Layer 1: Data Marker & Tag */}
            <div className="flex items-center gap-4 text-amber-400 font-mono text-xs sm:text-sm font-bold tracking-[0.3em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <span className="hidden sm:inline text-white/80">
                OVER 40+ YEARS OF EXPERTISE IN FERROUS METAL, WATER, INFRA & OTHER DIVERSE SECTORS
              </span>
            </div>

            {/* Layer 2: Main Architectural Headline */}
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] max-w-4xl">
              GUIDED BY THE MITTAL, JHUNJHUNWALA & JAJU
            </h2>

            {/* Layer 3: Supporting Line */}
            <p className="text-sm sm:text-lg md:text-xl font-medium text-slate-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-2xl leading-relaxed pt-1">
              FAMILIES
            </p>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        3. STATEMENT 2: ARCHITECTURAL COMPOSITION
        7,200 Metric Tons Annual Production Capacity
        ========================================================================
      */}
      {isStmt2 && (
        <div
          className="absolute inset-0 z-30 flex flex-col justify-end p-6 sm:p-12 md:p-16 transition-all duration-300 pointer-events-none"
          style={{ opacity: s2.opacity }}
        >
          <div className="max-w-5xl space-y-3 transform transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(${(1 - s2.progress) * 20 - 10}px) scale(${0.98 + s2.progress * 0.03})`,
            }}
          >
            {/* Layer 1: Data Marker & Tag */}
            <div className="flex items-center gap-4 text-blue-400 font-mono text-xs sm:text-sm font-bold tracking-[0.3em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <span className="hidden sm:inline text-white/80">
                PROMINENT CASTING MANUFACTURER IN INDIA
              </span>
            </div>

            {/* Layer 2: Main Architectural Headline */}
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] max-w-4xl">
              7,200 Metric Tons Annual Capacity
            </h2>

            {/* Layer 3: Supporting Line */}
            <p className="text-sm sm:text-lg md:text-xl font-medium text-slate-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-2xl leading-relaxed pt-1">
              FERROUS METAL, WATER, INFRA & OTHER DIVERSE SECTORS
            </p>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        4. STATEMENT 3: ARCHITECTURAL COMPOSITION
        Machine moulding 450 and 900 ARPA & hand moulding
        ========================================================================
      */}
      {isStmt3 && (
        <div
          className="absolute inset-0 z-30 flex flex-col justify-end p-6 sm:p-12 md:p-16 transition-all duration-300 pointer-events-none"
          style={{ opacity: s3.opacity }}
        >
          <div className="max-w-5xl space-y-3 transform transition-transform duration-300 ease-out"
            style={{
              transform: `translateY(${(1 - s3.progress) * 20 - 10}px) scale(${0.98 + s3.progress * 0.03})`,
            }}
          >
            {/* Layer 1: Data Marker & Tag */}
            <div className="flex items-center gap-4 text-emerald-400 font-mono text-xs sm:text-sm font-bold tracking-[0.3em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              <span className="hidden sm:inline text-white/80">
                BIS and ISO certified | Upholding Strict Quality Standards
              </span>
            </div>

            {/* Layer 2: Main Architectural Headline */}
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] max-w-4xl">
              Machine &amp; Hand Moulding Facilities
            </h2>

            {/* Layer 3: Supporting Line */}
            <p className="text-sm sm:text-lg md:text-xl font-medium text-slate-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-2xl leading-relaxed pt-1">
              Machine moulding featuring 450 and 900 ARPA and hand moulding facilities, capable of casting single pieces weighing up to 1.5 metric tons.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
