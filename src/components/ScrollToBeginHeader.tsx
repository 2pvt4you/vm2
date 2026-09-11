import React, { useLayoutEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { TONE } from './ui/primitives';

interface ScrollToBeginHeaderProps {
  scrollProgress: number;
}

/* ================================================================
   WipeText — progress-driven editorial wipe.
   A quiet ghost layer stays legible while scrubbing backwards;
   the active layer wipes left → right with a copper edge.
   ================================================================ */
function WipeText({
  progress,
  children,
  className = '',
  activeColor,
  ghostOpacity = 0.16,
  edgeColor = TONE.copper,
}: {
  progress: number;
  children: React.ReactNode;
  className?: string;
  activeColor: string;
  ghostOpacity?: number;
  edgeColor?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const smooth = useRef(0);
  const target = useRef(0);

  useLayoutEffect(() => {
    const ticker = () => {
      smooth.current += (target.current - smooth.current) * 0.1;
      const p = gsap.utils.clamp(0, 1, smooth.current);
      if (ref.current) {
        ref.current.style.setProperty('--r', `${p * 100}%`);
      }
    };
    gsap.ticker.add(ticker);
    return () => gsap.ticker.remove(ticker);
  }, []);

  useLayoutEffect(() => {
    target.current = gsap.utils.clamp(0, 1, progress);
  }, [progress]);

  return (
    <span
      ref={ref}
      className={`relative inline-block ${className}`}
      style={{ ['--r' as any]: '0%' }}
    >
      <span aria-hidden className="relative" style={{ color: activeColor, opacity: ghostOpacity }}>
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          color: activeColor,
          clipPath: 'inset(0 calc(100% - var(--r)) 0 0)',
        }}
      >
        {children}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 w-px"
        style={{
          left: 'var(--r)',
          background: `linear-gradient(180deg, transparent, ${edgeColor}, transparent)`,
          opacity: progress > 0.02 && progress < 0.98 ? 0.9 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </span>
  );
}

/* Frame-window fade math, preserved from original narrative. */
function getProgressState(frame: number, start: number, end: number, fadeLen = 14) {
  if (frame < start || frame > end) return { opacity: 0, progress: 0 };
  let opacity = 1;
  if (frame < start + fadeLen) opacity = (frame - start) / fadeLen;
  else if (frame > end - fadeLen) opacity = (end - frame) / fadeLen;
  return {
    opacity: gsap.utils.clamp(0, 1, opacity),
    progress: gsap.utils.clamp(0, 1, (frame - start) / (end - start)),
  };
}

export default function ScrollToBeginHeader({ scrollProgress }: ScrollToBeginHeaderProps) {
  const TOTAL_FRAMES = 335;
  const currentFrame = Math.min(
    TOTAL_FRAMES,
    Math.max(1, Math.round(scrollProgress * (TOTAL_FRAMES - 1)) + 1)
  );

  const isIntro = currentFrame < 6;
  const isStmt1 = currentFrame >= 6 && currentFrame <= 70;
  const isStmt2 = currentFrame >= 75 && currentFrame <= 145;
  const isStmt3 = currentFrame >= 150 && currentFrame <= 220;

  const introOpacity = isIntro
    ? Math.max(0, 1 - (scrollProgress * TOTAL_FRAMES) / 6)
    : 0;

  const s1 = getProgressState(currentFrame, 6, 70, 18);
  const s2 = getProgressState(currentFrame, 75, 145, 18);
  const s3 = getProgressState(currentFrame, 150, 220, 18);

  /* Scrims brighten/darken deliberately with the film's exposure. */
  const scrimDark = Math.max(s2.opacity * 0.55, s3.opacity);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden select-none">
      {/* ======== Cinematic legibility scrims ======== */}
      {/* Top sky softening for intro + statement 1 (light film) */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: Math.max(introOpacity * 0.9, s1.opacity * 0.5),
          background:
            'linear-gradient(180deg, rgba(244,241,234,0.55) 0%, rgba(244,241,234,0.18) 26%, rgba(244,241,234,0) 52%)',
        }}
      />
      {/* Bottom graphite scrim — begins the LIGHT → DARK narrative */}
      <div
        className="absolute inset-0"
        style={{
          opacity: scrimDark,
          background:
            'linear-gradient(180deg, rgba(29,32,34,0) 32%, rgba(29,32,34,0.28) 62%, rgba(20,22,24,0.82) 100%)',
        }}
      />

      {/* ================================================================
          INTRO — editorial cover over the aerial establishing shot
          ================================================================ */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          opacity: introOpacity,
          visibility: introOpacity > 0.001 ? 'visible' : 'hidden',
        }}
      >
        {/* Top wordmark */}
        <div className="pt-[8vh] flex justify-center px-6">
          <div className="flex flex-col items-center gap-3">
            <span className="label-tech text-copper-deep">
              Varaha Metaliks Pvt. Ltd.
            </span>
            <span className="block h-px w-10 bg-copper/70" />
          </div>
        </div>

        {/* Center title */}
        <div className="flex-1 relative flex flex-col items-center justify-center text-center px-6 -mt-10">
          {/* Soft light bloom for legibility — not a hard panel */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(80vw,900px)] h-[46vh] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(244,241,234,0.66) 0%, rgba(244,241,234,0.38) 42%, rgba(244,241,234,0) 72%)',
              filter: 'blur(14px)',
            }}
          />
          <h1 className="relative display-tight text-ink text-[clamp(3rem,9vw,8rem)]">
            Varaha Metaliks
          </h1>
          <p
            className="relative mt-5 font-display italic font-light text-copper-deep text-[clamp(1.25rem,3.2vw,2.6rem)]"
            style={{ letterSpacing: '0.005em' }}
          >
            From Iron to Infrastructure.
          </p>
          <p className="relative mt-7 max-w-xl font-sans text-[12px] sm:text-sm text-ink/65 leading-relaxed tracking-[0.08em] uppercase">
            Precision Ductile Iron Pipe Fittings, DI Manhole Covers, &amp;
            Ferrous Alloy Castings.
          </p>
        </div>

        {/* Scroll cue */}
        <div className="pb-[7vh] flex flex-col items-center gap-3">
          <span
            className="block w-px h-10 bg-gradient-to-b from-transparent via-copper to-copper"
            style={{ animation: 'vm-scroll-line 2.2s ease-in-out infinite' }}
          />
          <span className="label-tech text-ink/70 flex items-center gap-2">
            Scroll to begin
            <ChevronDown className="w-3.5 h-3.5 text-copper" strokeWidth={1.5} />
          </span>
        </div>
      </div>

      {/* ================================================================
          STATEMENT 1 — GUIDED BY THE FAMILIES (light / sky)
          ================================================================ */}
      <div
        className="absolute inset-0"
        style={{
          opacity: s1.opacity,
          visibility: isStmt1 ? 'visible' : 'hidden',
          transform: `translate3d(0, ${(1 - s1.progress) * 22}px, 0)`,
        }}
      >
        <div className="absolute left-[6vw] right-[6vw] top-[10vh] sm:top-[12vh] max-w-5xl">
          <WipeText
            progress={s1.progress}
            activeColor={TONE.copperDeep}
            ghostOpacity={0.3}
            edgeColor={TONE.copperDeep}
            className="label-tech block mb-5"
          >
            40+ Years of Expertise · Ferrous Metal · Water · Infrastructure
          </WipeText>

          <p className="font-sans text-sm sm:text-base text-ink/70 mb-2 tracking-wide">
            <WipeText
              progress={s1.progress}
              activeColor={TONE.ink}
              ghostOpacity={0.14}
              edgeColor={TONE.copper}
            >
              Guided by the
            </WipeText>
          </p>

          <h2 className="display-tight text-ink text-[clamp(2.4rem,6vw,5.6rem)]">
            <span className="block">
              <WipeText
                progress={s1.progress}
                activeColor={TONE.ink}
                ghostOpacity={0.14}
                edgeColor={TONE.copper}
              >
                Mittal, Jhunjhunwala
              </WipeText>
            </span>
            <span className="block font-display italic font-light text-copper-deep">
              <WipeText
                progress={Math.max(0, s1.progress - 0.15) / 0.85}
                activeColor={TONE.copperDeep}
                ghostOpacity={0.2}
                edgeColor={TONE.copper}
              >
                &amp; Jaju
              </WipeText>
            </span>
          </h2>

          <div className="mt-6 flex items-center gap-4">
            <span
              className="block h-px w-12 bg-copper"
              style={{
                transform: `scaleX(${gsap.utils.clamp(0, 1, s1.progress * 1.6)})`,
                transformOrigin: 'left',
              }}
            />
            <span className="label-tech text-ink/60">Families</span>
          </div>
        </div>
      </div>

      {/* ================================================================
          STATEMENT 2 — 7,200 METRIC TONS (number as visual object)
          ================================================================ */}
      <div
        className="absolute inset-0"
        style={{
          opacity: s2.opacity,
          visibility: isStmt2 ? 'visible' : 'hidden',
          transform: `translate3d(0, ${(1 - s2.progress) * 42}px, 0) scale(${
            0.97 + s2.progress * 0.03
          })`,
          transformOrigin: 'left bottom',
        }}
      >
        <div className="absolute inset-x-0 bottom-0 px-[6vw] pb-[9vh]">
          <div className="flex items-center gap-4 mb-5">
            <span className="h-px w-12 bg-champagne/80" />
            <span className="label-tech text-champagne">
              Prominent Casting Manufacturer in India
            </span>
          </div>

          <div className="flex items-end gap-x-5 gap-y-2 flex-wrap">
            <span className="numeric-object text-ivory text-[clamp(4.6rem,13vw,12.5rem)]">
              <WipeText
                progress={s2.progress}
                activeColor={TONE.ivory}
                ghostOpacity={0.12}
                edgeColor={TONE.champagne}
              >
                7,200
              </WipeText>
            </span>
            <span className="pb-[1.2vh] sm:pb-[1.6vh] label-tech text-champagne text-[11px] sm:text-sm tracking-[0.34em]">
              Metric Tons
            </span>
          </div>

          <h2 className="mt-1 font-sans font-bold uppercase tracking-[0.16em] text-ivory text-[clamp(1rem,2.4vw,1.9rem)]">
            <WipeText
              progress={Math.max(0, s2.progress - 0.12) / 0.88}
              activeColor={TONE.ivory}
              ghostOpacity={0.12}
              edgeColor={TONE.champagne}
            >
              Annual Capacity
            </WipeText>
          </h2>

          <p
            className="mt-5 max-w-2xl font-sans text-[11px] sm:text-[13px] text-ivory/65 uppercase tracking-[0.16em] leading-relaxed"
            style={{ opacity: gsap.utils.clamp(0, 1, s2.progress * 1.4 - 0.3) }}
          >
            Ferrous Metal, Water, Infra &amp; Other Diverse Sectors
          </p>
        </div>
      </div>

      {/* ================================================================
          STATEMENT 3 — MOULDING FACILITIES (dark foundry film)
          ================================================================ */}
      <div
        className="absolute inset-0"
        style={{
          opacity: s3.opacity,
          visibility: isStmt3 ? 'visible' : 'hidden',
          transform: `translate3d(0, ${(1 - s3.progress) * 42}px, 0) scale(${
            0.97 + s3.progress * 0.03
          })`,
          transformOrigin: 'left bottom',
        }}
      >
        <div className="absolute inset-x-0 bottom-0 px-[6vw] pb-[9vh]">
          <div className="flex items-center gap-4 mb-5">
            <span className="h-px w-12 bg-copper" />
            <span className="label-tech text-champagne">
              BIS and ISO certified&nbsp;|&nbsp;Upholding Strict Quality
              Standards
            </span>
          </div>

          <h2 className="max-w-5xl display-tight text-ivory text-[clamp(2.2rem,6.2vw,5.8rem)]">
            <WipeText
              progress={s3.progress}
              activeColor={TONE.ivory}
              ghostOpacity={0.1}
              edgeColor={TONE.copper}
            >
              Machine &amp; Hand Moulding Facilities
            </WipeText>
          </h2>

          <p
            className="mt-5 max-w-2xl font-sans text-sm sm:text-base text-ivory/70 leading-relaxed"
            style={{
              opacity: gsap.utils.clamp(0, 1, (s3.progress - 0.2) / 0.5),
              transform: `translateY(${(1 - gsap.utils.clamp(0, 1, (s3.progress - 0.2) / 0.8)) * 16}px)`,
            }}
          >
            Machine moulding featuring 450 and 900 ARPA and hand moulding
            facilities, capable of casting single pieces weighing up to 1.5
            metric tons.
          </p>
        </div>
      </div>

      {/* ======== Right-edge film progress rule ======== */}
      <div className="absolute right-[3vw] top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-3">
        <span className="block w-px h-24 bg-ink/15 overflow-hidden relative">
          <span
            className="absolute inset-x-0 top-0 bg-copper"
            style={{
              height: '100%',
              transform: `scaleY(${scrollProgress})`,
              transformOrigin: 'top',
            }}
          />
        </span>
      </div>

      {/* ======== Edge vignette — keeps the frame cinematic ======== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 45%, transparent 58%, rgba(20,22,24,0.22) 100%)',
          opacity: 0.5 + scrimDark * 0.4,
        }}
      />
    </div>
  );
}
