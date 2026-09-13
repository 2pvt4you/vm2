import React, { useLayoutEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { useReducedMotion } from 'motion/react';
import { TONE } from './ui/primitives';

interface ScrollToBeginHeaderProps {
  scrollProgress: number;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;

/* ================================================================
   TravelStatement — the primary hero motion language.
   A statement ENTERS FROM LEFT → travels across the upper portion
   of the screen → HOLDS → EXITS RIGHT. Progress-driven, smoothed on
   the GSAP ticker so scrubbing backwards reverses naturally.
   ================================================================ */
function TravelStatement({
  progress,
  className = '',
  enter = -16,
  exit = 22,
  depth = 1,
  fade = 0.14,
  holdStart = 0.3,
  holdEnd = 0.68,
  children,
}: {
  progress: number;
  className?: string;
  enter?: number; // vw, off-screen left
  exit?: number; // vw, off-screen right
  depth?: number; // parallax depth multiplier for layered lines
  fade?: number;
  holdStart?: number;
  holdEnd?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const smooth = useRef(0);
  const target = useRef(0);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (reduce) return;
    const ticker = () => {
      smooth.current += (target.current - smooth.current) * 0.12;
      const p = clamp01(smooth.current);
      const el = ref.current;
      if (!el) return;

      const enterT = easeOutCubic(clamp01(p / holdStart));
      const exitT = easeInCubic(clamp01((p - holdEnd) / (1 - holdEnd)));
      const x = (enter * (1 - enterT) + exit * exitT) * depth;
      const opacity = Math.min(clamp01(p / fade), clamp01((1 - p) / fade));

      el.style.transform = `translate3d(${x}vw, 0, 0)`;
      el.style.opacity = String(opacity);
    };
    gsap.ticker.add(ticker);
    return () => gsap.ticker.remove(ticker);
  }, [reduce, enter, exit, depth, fade, holdStart, holdEnd]);

  useLayoutEffect(() => {
    target.current = clamp01(progress);
    if (reduce && ref.current) {
      // Reduced motion: no travel — calm opacity envelope only.
      const p = clamp01(progress);
      ref.current.style.transform = 'translate3d(0,0,0)';
      ref.current.style.opacity = String(
        Math.min(clamp01(p / 0.12), clamp01((1 - p) / 0.12))
      );
    }
  }, [progress, reduce]);

  return (
    <div
      ref={ref}
      className={`will-transform ${className}`}
      style={{ opacity: 0, transform: reduce ? 'none' : `translate3d(${enter}vw,0,0)` }}
    >
      {children}
    </div>
  );
}

/* Frame-window fade math for the scrub narrative. */
function getProgressState(frame: number, start: number, end: number, fadeLen = 14) {
  if (frame < start || frame > end) return { opacity: 0, progress: 0 };
  let opacity = 1;
  if (frame < start + fadeLen) opacity = (frame - start) / fadeLen;
  else if (frame > end - fadeLen) opacity = (end - frame) / fadeLen;
  return {
    opacity: clamp01(opacity),
    progress: clamp01((frame - start) / (end - start)),
  };
}

/* ================================================================
   SideInfo — left / right editorial blocks tied to the central
   subject with fine horizontal rules. Different vertical heights.
   ================================================================ */
function SideInfo({
  side,
  progress,
  label,
  body,
  tone,
}: {
  side: 'left' | 'right';
  progress: number;
  label: string;
  body: string;
  tone: 'light' | 'dark';
}) {
  const appear = clamp01((progress - 0.34) / 0.3);
  const leave = clamp01((1 - progress) / 0.16);
  const o = Math.min(appear, leave);
  const labelColor =
    tone === 'light' ? TONE.champagneDeep : TONE.champagne;
  const bodyColor = tone === 'light' ? 'rgba(10,32,53,0.66)' : 'rgba(244,241,234,0.66)';
  const ruleColor =
    tone === 'light' ? 'rgba(10,32,53,0.28)' : 'rgba(244,241,234,0.28)';

  return (
    <div
      className={`absolute w-[min(240px,26vw)] ${
        side === 'left' ? 'left-[6vw]' : 'right-[6vw]'
      }`}
      style={{
        opacity: o,
        transform: `translate3d(0, ${(1 - appear) * 18}px, 0)`,
        visibility: o > 0.01 ? 'visible' : 'hidden',
      }}
    >
      <div
        className={`flex items-center gap-4 ${
          side === 'right' ? 'flex-row-reverse' : ''
        }`}
      >
        <div className={side === 'right' ? 'text-right' : ''}>
          <span className="label-tech block mb-2" style={{ color: labelColor }}>
            {label}
          </span>
          <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: bodyColor }}>
            {body}
          </p>
        </div>
        <span
          className="hidden lg:block h-px shrink-0"
          style={{
            width: '7vw',
            background: ruleColor,
            transform: `scaleX(${appear})`,
            transformOrigin: side === 'left' ? 'left' : 'right',
          }}
        />
      </div>
    </div>
  );
}

export default function ScrollToBeginHeader({ scrollProgress }: ScrollToBeginHeaderProps) {
  const TOTAL_FRAMES = 335;
  const currentFrame = Math.min(
    TOTAL_FRAMES,
    Math.max(1, Math.round(scrollProgress * (TOTAL_FRAMES - 1)) + 1)
  );

  const isIntro = currentFrame < 7;
  const introOpacity = isIntro
    ? Math.max(0, 1 - (scrollProgress * TOTAL_FRAMES) / 7)
    : 0;

  const s1 = getProgressState(currentFrame, 8, 72, 16);
  const s2 = getProgressState(currentFrame, 78, 148, 16);
  const s3 = getProgressState(currentFrame, 154, 224, 16);
  const s4 = getProgressState(currentFrame, 230, 302, 16);
  const outro = clamp01((scrollProgress - 0.9) / 0.08);

  /* Legibility scrims, tuned to the film's exposure. */
  const lightScrim = Math.max(introOpacity * 0.85, s1.opacity * 0.55, s2.opacity * 0.5, s3.opacity * 0.62);
  const darkScrim = Math.max(s4.opacity * 0.72, outro * 0.5);
  const heatFlash = clamp01((scrollProgress - 0.88) / 0.12);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden select-none">
      {/* ======== Top sky bloom — keeps navy type legible on light film ======== */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: lightScrim,
          background:
            'linear-gradient(180deg, rgba(244,241,234,0.62) 0%, rgba(244,241,234,0.22) 30%, rgba(244,241,234,0) 56%)',
        }}
      />
      {/* ======== Bottom navy scrim — foundry interior + handoff ======== */}
      <div
        className="absolute inset-0"
        style={{
          opacity: darkScrim,
          background:
            'linear-gradient(180deg, rgba(7,26,47,0) 30%, rgba(7,26,47,0.32) 62%, rgba(7,26,47,0.88) 100%)',
        }}
      />
      {/* ======== Molten heat flash — hands off to the foundry chapter ======== */}
      <div
        className="absolute inset-0"
        style={{
          opacity: heatFlash * 0.85,
          background:
            'radial-gradient(120% 90% at 50% 78%, rgba(247,226,178,0.95) 0%, rgba(231,196,134,0.55) 42%, rgba(244,241,234,0) 78%)',
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
        <div className="pt-[8vh] flex justify-center px-6">
          <div className="flex flex-col items-center gap-3">
            <span className="label-tech text-copper-deep">
              Varaha Metaliks Pvt. Ltd.
            </span>
            <span className="block h-px w-10 bg-copper/70" />
          </div>
        </div>

        <div className="flex-1 relative flex flex-col items-center justify-center text-center px-6 -mt-10">
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
          BEAT 1 — THE FAMILIES · upper-half L→R travel
          ================================================================ */}
      <div
        className="absolute inset-0"
        style={{ visibility: s1.opacity > 0.001 ? 'visible' : 'hidden' }}
      >
        <div className="absolute left-0 right-0 top-[9vh] sm:top-[11vh] px-[6vw]">
          <TravelStatement progress={s1.progress} depth={0.82}>
            <span className="label-tech block mb-4 sm:mb-5 text-copper-deep">
              40+ Years of Expertise · Ferrous Metal · Water · Infrastructure
            </span>
          </TravelStatement>
          <TravelStatement progress={s1.progress}>
            <p className="font-sans text-sm sm:text-base text-ink/70 mb-2 tracking-wide">
              Guided by the
            </p>
            <h2 className="display-tight text-ink text-[clamp(2.6rem,8vw,8rem)] whitespace-nowrap">
              Mittal, Jhunjhunwala
              <span className="font-display italic font-light text-copper-deep">
                {' '}&amp; Jaju
              </span>
            </h2>
          </TravelStatement>
          <TravelStatement progress={s1.progress} depth={0.7} fade={0.18} holdStart={0.38} holdEnd={0.74}>
            <div className="mt-5 flex items-center gap-4">
              <span className="block h-px w-14 bg-copper" />
              <span className="label-tech text-ink/60">
                Families — Industrial Pioneers
              </span>
            </div>
          </TravelStatement>
        </div>

        {/* Left + right information blocks at different heights */}
        <div style={{ top: '46vh' }} className="absolute inset-x-0">
          <SideInfo
            side="left"
            progress={s1.progress}
            tone="light"
            label="Pioneering Heavy Foundry"
            body="Premier manufacturer of DI pipe fittings, engineering castings & DI manhole covers."
          />
        </div>
        <div style={{ top: '60vh' }} className="absolute inset-x-0">
          <SideInfo
            side="right"
            progress={s1.progress}
            tone="light"
            label="Mahabubnagar · Telangana"
            body="Machine & hand moulding — single pieces up to 1.5 metric tons."
          />
        </div>
      </div>

      {/* ================================================================
          BEAT 2 — 7,200 METRIC TONS · the number as a travelling object
          ================================================================ */}
      <div
        className="absolute inset-0"
        style={{ visibility: s2.opacity > 0.001 ? 'visible' : 'hidden' }}
      >
        <div className="absolute left-0 right-0 top-[8vh] sm:top-[10vh] px-[6vw]">
          <TravelStatement progress={s2.progress} depth={0.82}>
            <div className="flex items-center gap-4 mb-4 sm:mb-6">
              <span className="h-px w-12 bg-copper/80" />
              <span className="label-tech text-copper-deep">
                Prominent Casting Manufacturer in India
              </span>
            </div>
          </TravelStatement>
          <TravelStatement progress={s2.progress} enter={-20} exit={26}>
            <div className="flex items-end gap-x-5 gap-y-2 flex-wrap whitespace-nowrap">
              <span className="numeric-object text-ink text-[clamp(4.8rem,15vw,14rem)]">
                7,200
              </span>
              <span className="pb-[1.4vh] label-tech text-copper-deep text-[11px] sm:text-sm tracking-[0.34em]">
                Metric Tons
              </span>
            </div>
          </TravelStatement>
          <TravelStatement progress={s2.progress} depth={0.72} fade={0.18} holdStart={0.36} holdEnd={0.74}>
            <h2 className="mt-2 font-sans font-bold uppercase tracking-[0.16em] text-ink text-[clamp(0.95rem,2.2vw,1.7rem)]">
              Annual Capacity
            </h2>
            <p className="mt-3 max-w-2xl font-sans text-[11px] sm:text-[13px] text-ink/60 uppercase tracking-[0.16em] leading-relaxed">
              Ferrous Metal, Water, Infra &amp; Other Diverse Sectors
            </p>
          </TravelStatement>
        </div>
      </div>

      {/* ================================================================
          BEAT 3 — MOULDING FACILITIES · travelling over the approach
          ================================================================ */}
      <div
        className="absolute inset-0"
        style={{ visibility: s3.opacity > 0.001 ? 'visible' : 'hidden' }}
      >
        <div className="absolute left-0 right-0 top-[9vh] sm:top-[12vh] px-[6vw]">
          <TravelStatement progress={s3.progress} depth={0.82}>
            <div className="flex items-center gap-4 mb-4 sm:mb-6">
              <span className="h-px w-12 bg-copper" />
              <span className="label-tech text-copper-deep">
                BIS and ISO certified&nbsp;|&nbsp;Upholding Strict Quality Standards
              </span>
            </div>
          </TravelStatement>
          <TravelStatement progress={s3.progress} enter={-18} exit={24}>
            <h2 className="display-tight text-ink text-[clamp(2rem,5.6vw,5.6rem)] whitespace-nowrap">
              Machine &amp; Hand Moulding{' '}
              <span className="font-display italic font-light text-copper-deep">
                Facilities
              </span>
            </h2>
          </TravelStatement>
          <TravelStatement progress={s3.progress} depth={0.7} fade={0.18} holdStart={0.38} holdEnd={0.74}>
            <p className="mt-5 max-w-2xl font-sans text-[12px] sm:text-sm text-ink/65 leading-relaxed">
              Machine moulding featuring 450 and 900 ARPA and hand moulding
              facilities, capable of casting single pieces weighing up to 1.5
              metric tons.
            </p>
          </TravelStatement>
        </div>

        <div style={{ top: '58vh' }} className="absolute inset-x-0">
          <SideInfo
            side="right"
            progress={s3.progress}
            tone="light"
            label="Casting Bay — 01"
            body="Comprehensive UTM, BHN, spectrometer & hydrostatic testing on every melt."
          />
        </div>
      </div>

      {/* ================================================================
          BEAT 4 — THE POURING FLOOR · ivory type over molten light
          ================================================================ */}
      <div
        className="absolute inset-0"
        style={{ visibility: s4.opacity > 0.001 ? 'visible' : 'hidden' }}
      >
        <div className="absolute left-0 right-0 top-[9vh] sm:top-[11vh] px-[6vw]">
          <TravelStatement progress={s4.progress} depth={0.82}>
            <div className="flex items-center gap-4 mb-4 sm:mb-6">
              <span className="h-px w-12 bg-champagne/90" />
              <span className="label-tech text-champagne">
                Scene Within — The Pouring Floor
              </span>
            </div>
          </TravelStatement>
          <TravelStatement progress={s4.progress}>
            <h2 className="display-tight text-ivory text-[clamp(2.6rem,8vw,7.6rem)] whitespace-nowrap">
              Fire, Poured{' '}
              <span className="font-display italic font-light text-champagne">
                Into Form.
              </span>
            </h2>
          </TravelStatement>
          <TravelStatement progress={s4.progress} depth={0.72} fade={0.18} holdStart={0.36} holdEnd={0.74}>
            <p className="mt-5 max-w-xl font-sans text-[12px] sm:text-sm text-ivory/70 leading-relaxed">
              Molten ductile iron, cast into infrastructure — the finished
              fitting is discovered inside the manufacturing story.
            </p>
          </TravelStatement>
        </div>

        <div style={{ top: '58vh' }} className="absolute inset-x-0">
          <SideInfo
            side="left"
            progress={s4.progress}
            tone="dark"
            label="Metallurgy Control"
            body="UTM · BHN · Spectrometer · Hydrostatic — every melt verified."
          />
        </div>
      </div>

      {/* ================================================================
          OUTRO — the camera keeps moving into the foundry chapter
          ================================================================ */}
      <div
        className="absolute inset-x-0 bottom-[8vh] flex flex-col items-center gap-3"
        style={{ opacity: outro, visibility: outro > 0.01 ? 'visible' : 'hidden' }}
      >
        <span className="label-tech text-copper-deep text-center">
          The camera keeps moving —
        </span>
        <span className="font-display italic text-ink text-lg sm:text-xl">
          enter the foundry chapter
        </span>
        <ChevronDown className="w-4 h-4 text-copper-deep" strokeWidth={1.5} />
      </div>

      {/* ======== Film metadata — left vertical + right progress rule ======== */}
      <div className="absolute left-[3vw] top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <span
          className="label-tech text-ink/45"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.4em' }}
        >
          Factory → Foundry — One Continuous Shot
        </span>
      </div>
      <div className="absolute right-[3vw] top-1/2 -translate-y-1/2 hidden sm:flex flex-col items-center gap-3">
        <span className="font-mono text-[10px] tracking-[0.2em] text-ink/50 tabular-nums" style={{ color: darkScrim > 0.4 ? 'rgba(244,241,234,0.55)' : undefined }}>
          FR {String(currentFrame).padStart(3, '0')}
        </span>
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
            'radial-gradient(120% 100% at 50% 45%, transparent 58%, rgba(7,26,47,0.26) 100%)',
          opacity: 0.45 + darkScrim * 0.4,
        }}
      />
    </div>
  );
}
