import React, { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

interface ScrollToBeginHeaderProps {
  scrollProgress: number;
}

/**
 * Cinematic scroll-driven editorial typography over the factory frame sequence.
 *
 * OWNERSHIP
 * - The parent (HeroVideo) remains the single owner of the scroll container and
 *   the 335-frame sequence. This component only *consumes* scrollProgress.
 *
 * CHOREOGRAPHY
 * - Every statement runs one continuous ENTER -> TRAVEL -> HOLD -> EXIT arc.
 * - Desktop: the headline physically travels LEFT -> RIGHT across the upper
 *   half of the viewport, so the factory below is never covered.
 * - Mobile: the same story beats play as a vertically-composed, tightly
 *   clamped sequence. The horizontal journey is reduced to a short parallax
 *   drift so it can never produce horizontal page scroll.
 */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Smooth, symmetric easing for the travel arc. */
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Fast-out easing for entrances. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface Phase {
  /** 0 outside the statement, ramps 0->1->0 across enter/hold/exit */
  opacity: number;
  /** 0->1 across the whole statement, drives the horizontal travel */
  travel: number;
  /** 0->1 during the entrance only, drives the reveal wipe */
  reveal: number;
  /** true while the statement occupies the stage */
  active: boolean;
}

/**
 * Splits one frame range into enter / travel+hold / exit.
 *
 * `enterRatio` and `exitRatio` are fractions of the range, which keeps the
 * pacing identical regardless of how long a statement is on screen.
 */
function usePhase(
  frame: number,
  start: number,
  end: number,
  enterRatio = 0.24,
  exitRatio = 0.2
): Phase {
  return useMemo(() => {
    if (frame < start || frame > end) {
      return { opacity: 0, travel: frame > end ? 1 : 0, reveal: 0, active: false };
    }

    const span = Math.max(1, end - start);
    const t = clamp01((frame - start) / span);

    const enterEnd = enterRatio;
    const exitStart = 1 - exitRatio;

    let opacity: number;
    if (t < enterEnd) {
      opacity = easeOut(t / enterEnd);
    } else if (t > exitStart) {
      opacity = easeOut(clamp01((1 - t) / exitRatio));
    } else {
      opacity = 1;
    }

    const reveal = clamp01(t / enterEnd);

    return { opacity, travel: t, reveal, active: true };
  }, [frame, start, end, enterRatio, exitRatio]);
}

/* ==========================================================================
   REVEAL PRIMITIVE
   A single left -> right wipe over a permanently-present ghost layer, so the
   words never pop in or vanish while scrubbing backwards.
   ========================================================================== */

function Reveal({
  children,
  reveal,
  className = '',
  tone = '#061b57',
  ghost = 0.26,
  glow = true,
}: {
  children: React.ReactNode;
  reveal: number;
  className?: string;
  tone?: string;
  ghost?: number;
  glow?: boolean;
}) {
  const pct = clamp01(reveal) * 100;

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Ghost — always faintly present */}
      <span aria-hidden className="block" style={{ color: `rgba(6,27,87,${ghost})` }}>
        {children}
      </span>

      {/* Wipe — the active, fully-saturated layer */}
      <span
        aria-hidden
        className="absolute inset-0 block"
        style={{
          color: tone,
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
          willChange: 'clip-path',
          textShadow: glow
            ? '0 2px 12px rgba(255,255,255,0.42), 0 6px 26px rgba(3,21,80,0.22)'
            : undefined,
        }}
      >
        {children}
      </span>

      <span className="sr-only">{children}</span>
    </span>
  );
}

/* ==========================================================================
   STATEMENT SHELL
   Owns the horizontal travel. Held in the upper band of the viewport on
   desktop; recomposed as a centred stack on phones.
   ========================================================================== */

function Statement({
  phase,
  children,
  isMobile,
  /** How far the block travels across the viewport, in vw */
  distance = 14,
  /** Vertical anchor within the upper band */
  top,
}: {
  phase: Phase;
  children: React.ReactNode;
  isMobile: boolean;
  distance?: number;
  top: string;
}) {
  // LEFT -> RIGHT journey. Starts left of its resting place, drifts right,
  // and keeps drifting on the way out so the exit feels like continued
  // camera motion rather than a fade in place.
  const eased = easeInOut(phase.travel);
  const travelX = isMobile
    ? (eased - 0.5) * 3.2 // gentle parallax only — cannot overflow
    : -distance * 0.5 + eased * distance;

  // A touch of vertical settle on entry keeps it from feeling like a slider.
  const settleY = (1 - easeOut(clamp01(phase.travel / 0.24))) * (isMobile ? 14 : 22);

  return (
    <div
      className="absolute inset-x-0 z-30"
      style={{
        top,
        opacity: phase.opacity,
        visibility: phase.active ? 'visible' : 'hidden',
        transform: `translate3d(${travelX}vw, ${settleY}px, 0)`,
        willChange: 'transform, opacity',
      }}
    >
      <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12">{children}</div>
    </div>
  );
}

/** Small technical eyebrow used above every headline. */
function Eyebrow({ reveal, children }: { reveal: number; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3 sm:mb-4 sm:gap-4">
      <span
        className="h-px w-6 origin-left bg-[#061b57]/50 sm:w-12"
        style={{ transform: `scaleX(${clamp01(reveal)})` }}
      />
      <Reveal
        reveal={reveal}
        ghost={0.34}
        glow={false}
        className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] sm:text-[11px] sm:tracking-[0.32em]"
      >
        {children}
      </Reveal>
    </div>
  );
}

export default function ScrollToBeginHeader({ scrollProgress }: ScrollToBeginHeaderProps) {
  const { isMobile, prefersReducedMotion } = useDeviceProfile();

  const TOTAL_FRAMES = 335;

  const currentFrame = Math.min(
    TOTAL_FRAMES,
    Math.max(1, Math.round(scrollProgress * (TOTAL_FRAMES - 1)) + 1)
  );

  // Narrative ranges preserved from the original sequence timing.
  const s1 = usePhase(currentFrame, 6, 70);
  const s2 = usePhase(currentFrame, 75, 145);
  const s3 = usePhase(currentFrame, 150, 220);

  const introOpacity =
    currentFrame < 6 ? Math.max(0, 1 - (scrollProgress * TOTAL_FRAMES) / 6) : 0;

  const atmosphere = Math.max(s1.opacity, s2.opacity, s3.opacity);

  // With reduced motion the statements are simply presented, fully revealed,
  // with no travel — the story still reads, nothing moves.
  const r = (v: number) => (prefersReducedMotion ? (v > 0 ? 1 : 0) : v);

  return (
    <div className="pointer-events-none absolute inset-0 z-30 select-none overflow-hidden">
      {/* ==================================================================
          READABILITY LAYER
          A soft sky-side wash only. The factory stays fully visible; this
          exists purely so type sitting on bright cloud remains legible.
          ================================================================== */}
      <div
        className="absolute inset-0 z-0"
        style={{
          opacity: 0.34 + atmosphere * 0.18,
          background: `
            linear-gradient(
              180deg,
              rgba(244,246,250,0.62) 0%,
              rgba(244,246,250,0.28) 26%,
              rgba(244,246,250,0.00) 52%,
              rgba(5,7,12,0.00) 74%,
              rgba(5,7,12,0.22) 100%
            )
          `,
        }}
      />

      {/* ==================================================================
          1. INTRO COVER
          ================================================================== */}
      <div
        className="pointer-events-auto absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/60 p-6 text-center backdrop-blur-[2px] sm:p-10"
        style={{
          opacity: introOpacity,
          visibility: introOpacity > 0.001 ? 'visible' : 'hidden',
        }}
      >
        <div className="my-auto mx-auto flex max-w-3xl flex-col items-center gap-5 sm:gap-6">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-blue-900 sm:text-sm sm:tracking-[0.35em]">
              VARAHA METALIKS PVT. LTD.
            </span>

            <h1 className="font-sans text-[clamp(2.25rem,10vw,4.5rem)] font-black leading-[1.05] tracking-tight text-slate-950 md:text-7xl">
              Varaha Metaliks
            </h1>

            <div className="mx-auto h-1 w-24 rounded-full bg-amber-500" />

            <p className="font-sans text-[clamp(1.15rem,5vw,2.25rem)] font-bold tracking-tight text-slate-900">
              From Iron to Infrastructure.
            </p>
          </div>

          <p className="max-w-2xl text-sm font-medium leading-relaxed text-slate-700 sm:text-base md:text-lg">
            Precision Ductile Iron Pipe Fittings, DI Manhole Covers, &amp; Ferrous Alloy
            Castings.
          </p>

          <div className="mt-4 flex animate-bounce flex-col items-center gap-3 sm:mt-6">
            <div className="tap-target flex items-center gap-3 rounded-full border border-white/20 bg-slate-950 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-2xl sm:px-7 sm:text-sm">
              <span>Scroll to begin</span>
              <ChevronDown className="h-4 w-4 text-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================
          2. STATEMENT ONE — FOUNDING FAMILIES
          Sits highest in the sky band.
          ================================================================== */}
      <Statement phase={s1} isMobile={isMobile} distance={16} top={isMobile ? '9%' : '8%'}>
        <Eyebrow reveal={r(s1.reveal)}>
          40+ Years of Expertise · Ferrous Metal · Water · Infrastructure
        </Eyebrow>

        <Reveal
          reveal={r(s1.reveal)}
          ghost={0.3}
          className="mb-1 font-sans text-xs font-normal tracking-wide sm:mb-2 sm:text-base md:text-lg"
        >
          Guided by the
        </Reveal>

        <h2
          className="leading-[0.92] tracking-[-0.035em]"
          style={{ fontFamily: "'Fraunces', ui-serif, Georgia, serif" }}
        >
          <Reveal
            reveal={r(s1.reveal)}
            ghost={0.3}
            className="block font-medium text-[clamp(2rem,9vw,6.5rem)]"
          >
            Mittal, Jhunjhunwala
          </Reveal>

          <Reveal
            reveal={r(clamp01((s1.reveal - 0.12) / 0.88))}
            ghost={0.24}
            className="block font-normal italic text-[clamp(2rem,9vw,6.5rem)]"
          >
            &amp; Jaju
          </Reveal>
        </h2>

        <div className="mt-4 flex items-center gap-3 sm:mt-6">
          <span
            className="h-[1.5px] w-8 origin-left bg-[#061b57]/60 sm:w-12"
            style={{ transform: `scaleX(${clamp01(r(s1.reveal))})` }}
          />
          <Reveal
            reveal={r(s1.reveal)}
            ghost={0.24}
            glow={false}
            className="font-mono text-[9px] font-semibold uppercase tracking-[0.28em] sm:text-xs"
          >
            Families
          </Reveal>
        </div>
      </Statement>

      {/* ==================================================================
          3. STATEMENT TWO — ANNUAL CAPACITY
          ================================================================== */}
      <Statement phase={s2} isMobile={isMobile} distance={13} top={isMobile ? '10%' : '9%'}>
        <Eyebrow reveal={r(s2.reveal)}>Prominent Casting Manufacturer in India</Eyebrow>

        <h2 className="max-w-[1080px] font-sans text-[clamp(2.4rem,9.5vw,7.2rem)] font-black leading-[0.88] tracking-[-0.05em]">
          <Reveal reveal={r(s2.reveal)} ghost={0.28}>
            7,200 Metric Tons
          </Reveal>
          <br />
          <Reveal reveal={r(clamp01((s2.reveal - 0.14) / 0.86))} ghost={0.22}>
            Annual Capacity
          </Reveal>
        </h2>

        <div
          className="mt-4 flex items-start gap-4 sm:mt-6 sm:items-center sm:gap-8"
          style={{ opacity: clamp01(r(s2.reveal) * 1.3) }}
        >
          <span className="hidden h-px w-10 shrink-0 bg-[#061b57]/45 sm:block" />
          <p className="max-w-2xl text-[10px] font-semibold uppercase leading-relaxed tracking-[0.14em] text-[#061b57]/80 sm:text-sm sm:tracking-[0.16em] md:text-base">
            Ferrous Metal, Water, Infra &amp; Other Diverse Sectors
          </p>
        </div>
      </Statement>

      {/* ==================================================================
          4. STATEMENT THREE — MOULDING FACILITIES
          ================================================================== */}
      <Statement phase={s3} isMobile={isMobile} distance={11} top={isMobile ? '10%' : '9%'}>
        <Eyebrow reveal={r(s3.reveal)}>
          BIS and ISO Certified · Strict Quality Standards
        </Eyebrow>

        <h2 className="max-w-[1080px] font-sans text-[clamp(2.2rem,8.6vw,6.8rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
          <Reveal reveal={r(s3.reveal)} ghost={0.26}>
            Machine &amp; Hand Moulding
          </Reveal>
          <br />
          <Reveal reveal={r(clamp01((s3.reveal - 0.16) / 0.84))} ghost={0.22}>
            Facilities
          </Reveal>
        </h2>

        <p
          className="mt-4 max-w-3xl text-xs font-medium leading-relaxed text-[#061b57]/80 sm:mt-6 sm:text-lg md:text-xl"
          style={{
            opacity: clamp01((r(s3.reveal) - 0.25) / 0.5),
          }}
        >
          Machine moulding featuring 450 and 900 ARPA and hand moulding facilities,
          capable of casting single pieces weighing up to 1.5 metric tons.
        </p>
      </Statement>

      {/* ==================================================================
          EDGE VIGNETTE — cinematic framing, never hides the factory
          ================================================================== */}
      <div
        className="pointer-events-none absolute inset-0 z-50"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 54%, rgba(5,7,12,0.16) 100%)',
        }}
      />
    </div>
  );
}
