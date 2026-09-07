import React, { useLayoutEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

interface ScrollToBeginHeaderProps {
  scrollProgress: number;
}

/**
 * Final cinematic text overlay.
 *
 * IMPORTANT:
 * - The parent Three.js section should remain the single owner of Lenis/
 *   ScrollTrigger/scrollProgress.
 * - This component only consumes scrollProgress.
 * - All three statements stay mounted so SplitText can safely work with them.
 * - The factory/video remains visible underneath the typography.
 */

type StatementProps = {
  progress: number;
  opacity: number;
  children: React.ReactNode;
  className?: string;
};

function SplitReveal({
  progress,
  children,
  className = '',
  highlight = true,
}: {
  progress: number;
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const smoothProgress = useRef(0);
  const targetProgress = useRef(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const ticker = () => {
        /*
         * Smooth the scroll-driven progress.
         *
         * 0.10 gives us a much more responsive movement than the
         * previous 0.075 while still preventing jitter.
         */
        smoothProgress.current +=
          (targetProgress.current - smoothProgress.current) * 0.10;

        const p = gsap.utils.clamp(0, 1, smoothProgress.current);

        /*
         * Left → right information reveal.
         *
         * Unlike the previous character-by-character vertical reveal,
         * the complete phrase behaves as one visual object.
         */
        const revealPercent = p * 100;

        if (!ref.current) return;

        gsap.set(ref.current, {
          '--reveal': `${revealPercent}%`,
          '--reveal-x': `${-18 + p * 18}px`,
          '--beam-x': `${revealPercent}%`,
        });
      };

      gsap.ticker.add(ticker);

      return () => {
        gsap.ticker.remove(ticker);
      };
    }, ref);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    targetProgress.current = gsap.utils.clamp(0, 1, progress);
  }, [progress]);

  return (
    <span
      ref={ref}
      className={`relative inline-block ${className}`}
      style={
        {
          color: '#061B57',
          '--reveal': '0%',
          '--reveal-x': '-18px',
          '--beam-x': '0%',
        } as React.CSSProperties
      }
    >
      {/* -------------------------------------------------------------
          BASE / GHOST TEXT

          Always slightly visible.

          This is important because the headline should never suddenly
          disappear while the user is scrolling backwards.
         ------------------------------------------------------------- */}
      <span
        aria-hidden="true"
        className="relative z-10"
        style={{
          color: 'rgba(6, 27, 87, 0.24)',
        }}
      >
        {children}
      </span>

      {/* -------------------------------------------------------------
          ACTIVE REVEAL

          A single left → right wipe.

          This is the main visual change from the old animation.
         ------------------------------------------------------------- */}
      <span
        aria-hidden="true"
        className="absolute inset-0 z-20"
        style={{
          color: '#061B57',

          clipPath:
            'inset(0 calc(100% - var(--reveal)) 0 0)',

          transform:
            'translate3d(var(--reveal-x), 0, 0)',

          willChange:
            'clip-path, transform',

          textShadow:
            '0 2px 10px rgba(255,255,255,0.28), 0 4px 20px rgba(3,21,80,0.20)',
        }}
      >
        {children}
      </span>

      {/* -------------------------------------------------------------
          MOVING SCAN EDGE

          Gives the wipe a subtle "broadcast graphics / stock ticker"
          feeling without becoming flashy.
         ------------------------------------------------------------- */}
      {highlight && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-30"
          style={{
            left: 'var(--beam-x)',
            width: '2px',

            transform:
              'translateX(-1px)',

            background:
              'linear-gradient(' +
              '180deg,' +
              'transparent 0%,' +
              'rgba(255,255,255,0.05) 15%,' +
              'rgba(255,255,255,0.95) 50%,' +
              'rgba(255,255,255,0.05) 85%,' +
              'transparent 100%' +
              ')',

            opacity:
              'var(--reveal)' === '100%' ? 0 : 0.75,

            filter:
              'blur(0.2px)',

            boxShadow:
              '0 0 12px rgba(255,255,255,0.32)',

            willChange:
              'left, opacity',
          }}
        />
      )}
    </span>
  );
}

/**
 * Small scroll-linked atmospheric text reveal.
 *
 * This keeps a faint "ghost" version of the text in the sky while the
 * highlighted version follows scroll progress. It is deliberately subtle
 * so the factory remains visible.
 */
function CloudRevealText({
  children,
  progress,
  className = '',
  color = '#031550',
  ghostOpacity = 0.22,
  as: Tag = 'span',
}: {
  children: React.ReactNode;
  progress: number;
  className?: string;
  color?: string;
  ghostOpacity?: number;
  as?: keyof JSX.IntrinsicElements;
}) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <Tag className={`relative inline-block ${className}`}>
      {/* Soft white reading surface — deliberately transparent so the factory
          and sky still remain visible. */}
      <span
        aria-hidden
        className="absolute -inset-x-3 -inset-y-2 -z-10 rounded-sm"
        style={{
          background: `
            linear-gradient(
              90deg,
              rgba(255,255,255,0) 90%,
              rgba(255,255,255,0.72) 18%,
              rgba(255,255,255,0.72) 82%,
              rgba(255,255,255,0) 1%
              rgba(255,255,255,0) 1%
            )
          `,
          opacity: 0.82,
          filter: 'blur(88px)',
        }}
      />

      {/* Quiet ghost layer */}
      <span
        aria-hidden
        className="block"
        style={{
          color: `rgba(3,21,80,${ghostOpacity})`,
        }}
      >
        {children}
      </span>

      {/* Blue highlight layer. It is intentionally restrained. */}
      <span
        aria-hidden
        className="absolute inset-0 block"
        style={{
          color,
          opacity: 1,
          WebkitMaskImage: `linear-gradient(
            90deg,
            #000 0%,
            #000 ${Math.max(0, pct - 20)}%,
            rgba(0,0,0,0.88) ${pct}%,
            transparent ${Math.min(100, pct + 20)}%,
            transparent 100%
          )`,
          maskImage: `linear-gradient(
            90deg,
            #000 0%,
            #000 ${Math.max(0, pct - 20)}%,
            rgba(0,0,0,0.88) ${pct}%,
            transparent ${Math.min(100, pct + 20)}%,
            transparent 100%
          )`,
        }}
      >
        {children}
      </span>

      <span className="sr-only">{children}</span>
    </Tag>
  );
}

export default function ScrollToBeginHeader({
  scrollProgress,
}: ScrollToBeginHeaderProps) {
  const TOTAL_FRAMES = 335;

  /*
   * Master frame position.
   *
   * Your existing Three.js sequence uses 335 frames, so the mapping is
   * deliberately preserved.
   */
  const currentFrame = Math.min(
    TOTAL_FRAMES,
    Math.max(
      1,
      Math.round(scrollProgress * (TOTAL_FRAMES - 1)) + 1
    )
  );

  /*
   * Existing narrative ranges preserved from the supplied component.
   */
  const isIntro = currentFrame < 6;
  const isStmt1 = currentFrame >= 6 && currentFrame <= 70;
  const isStmt2 = currentFrame >= 75 && currentFrame <= 145;
  const isStmt3 = currentFrame >= 150 && currentFrame <= 220;

  /**
   * Smooth frame-state helper.
   *
   * opacity:
   *   controls entrance/exit
   *
   * progress:
   *   drives the SplitText reveal and movement
   */
  const getProgressState = (
    frame: number,
    start: number,
    end: number,
    fadeLen = 14
  ) => {
    if (frame < start || frame > end) {
      return { opacity: 0, progress: 0 };
    }

    let opacity = 1;

    if (frame < start + fadeLen) {
      opacity = (frame - start) / fadeLen;
    } else if (frame > end - fadeLen) {
      opacity = (end - frame) / fadeLen;
    }

    const progress = (frame - start) / (end - start);

    return {
      opacity: gsap.utils.clamp(0, 1, opacity),
      progress: gsap.utils.clamp(0, 1, progress),
    };
  };

  /*
   * Existing timing preserved.
   */
  const introOpacity = isIntro
    ? Math.max(0, 1 - (scrollProgress * TOTAL_FRAMES) / 6)
    : 0;

  const s1 = getProgressState(currentFrame, 6, 70, 20);
  const s2 = getProgressState(currentFrame, 75, 145, 20);
  const s3 = getProgressState(currentFrame, 150, 220, 20);

  /*
   * We keep a tiny amount of global atmosphere over the whole scene.
   * This is intentionally NOT an opaque overlay.
   */
  const sceneAtmosphereOpacity = Math.max(
    s1.opacity,
    s2.opacity,
    s3.opacity
  );

  return (
    <div
      className="
        absolute inset-0 z-30
        pointer-events-none
        overflow-hidden
        select-none
      "
    >
      {/* ================================================================
          CINEMATIC READABILITY LAYER
          Factory remains visible; the gradient only protects typography.
          ================================================================ */}
      <div
        className="absolute inset-0 z-0"
        style={{
          opacity: 0.42 + sceneAtmosphereOpacity * 0.04,
          background: `
            linear-gradient(
              180deg,
              rgba(255,255,255,0.30) 0%,
              rgba(255,255,255,0.10) 35%,
              rgba(255,255,255,0.00) 62%,
              rgba(255,255,255,0.08) 100%
            )
          `,
        }}
      />

      {/* ================================================================
          1. INTRO / BEGIN PAGE COVER
          Kept as the original content and wording.
          ================================================================ */}
      <div
        className="
          absolute inset-0 z-40
          flex flex-col items-center justify-center
          p-6 sm:p-10
          text-center
          bg-white/60 dark:bg-slate-950/60
          backdrop-blur-[2px]
          pointer-events-auto
        "
        style={{
          opacity: introOpacity,
          visibility: introOpacity > 0.001 ? 'visible' : 'hidden',
        }}
      >
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6 my-auto">
          <div className="space-y-3">
            <span
              className="
                text-xs sm:text-sm
                font-extrabold
                uppercase
                tracking-[0.35em]
                text-blue-900
                dark:text-amber-400
              "
            >
              VARAHA METALIKS PVT. LTD.
            </span>

            <h1
              className="
                font-sans
                text-4xl sm:text-6xl md:text-7xl
                font-black
                tracking-tight
                text-slate-950
                dark:text-white
                leading-[1.05]
              "
            >
              Varaha Metaliks
            </h1>

            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full" />

            <p
              className="
                font-sans
                text-2xl sm:text-3xl md:text-4xl
                font-bold
                text-slate-900
                dark:text-slate-100
                tracking-tight
              "
            >
              From Iron to Infrastructure.
            </p>
          </div>

          <p
            className="
              text-sm sm:text-base md:text-lg
              text-slate-700 dark:text-slate-200
              max-w-2xl
              font-medium
              leading-relaxed
            "
          >
            Precision Ductile Iron Pipe Fittings, DI Manhole Covers, &amp;
            Ferrous Alloy Castings.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 animate-bounce">
            <div
              className="
                flex items-center gap-3
                px-7 py-3
                rounded-full
                bg-slate-950 text-white
                dark:bg-white dark:text-slate-950
                text-xs sm:text-sm
                font-bold
                tracking-[0.2em]
                uppercase
                shadow-2xl
                border border-white/20
              "
            >
              <span>Scroll to begin</span>
              <ChevronDown className="w-4 h-4 text-amber-400 dark:text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          2. STATEMENT 1 — FOUNDING FAMILIES
          Typography lives in the clear sky band.
          The factory remains completely visible below it.
          ================================================================ */}
      <div
        className="absolute inset-0 z-30"
        style={{
          opacity: s1.opacity,
          visibility: isStmt1 ? 'visible' : 'hidden',
        }}
      >
        <div
          className="
            absolute
            left-[4vw]
            top-[7vh]
            sm:top-[8vh]
            md:top-[9vh]
            w-[92vw]
            max-w-[1120px]
          "
          style={{
            transform: `
              translate3d(
                0,
                ${(1 - s1.progress) * 18 - 6}px,
                0
              )
            `,
          }}
        >
          <div className="mb-4 sm:mb-5">
            <CloudRevealText
              progress={s1.progress}
              color="#0a0227"
              ghostOpacity={0.9}
              className="
                font-sans
                text-[10px] sm:text-[11px] md:text-xs
                font-medium
                tracking-[0.28em]
                sm:tracking-[0.35em]
                uppercase
                drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]
              "
            >
              40+ Years of Expertise · Ferrous Metal · Water · Infrastructure
            </CloudRevealText>
          </div>

          <CloudRevealText
            progress={s1.progress}
            color="#0a0227"
            ghostOpacity={0.8}
            className="
              font-sans
              text-sm sm:text-base md:text-lg
              font-normal
              tracking-wide
              mb-1 sm:mb-2
              drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)]
            "
          >
            Guided by the
          </CloudRevealText>

          <h2
            className="
              leading-[0.9]
              tracking-[-0.035em]
              text-white
            "
            style={{
              fontFamily: "'Fraunces', ui-serif, Georgia, serif",
            }}
          >
            <CloudRevealText
              progress={s1.progress}
              color="#0a0227"
              ghostOpacity={0.8}
              className="
                block
                font-medium
                text-[clamp(3rem,6vw,6.5rem)]
                drop-shadow-[0_3px_16px_rgba(0,0,0,0.3)]
              "
            >
              Mittal, Jhunjhunwala
            </CloudRevealText>

            <CloudRevealText
              progress={s1.progress}
              color="#0a0227"
              ghostOpacity={0.22}
              className="
                block
                italic
                font-normal
                text-[clamp(3rem,6vw,6.5rem)]
                drop-shadow-[0_3px_16px_rgba(0,0,0,0.3)]
              "
            >
              &amp; Jaju
            </CloudRevealText>
          </h2>

          <div className="mt-5 sm:mt-6 flex items-center gap-3">
            <span
              className="h-[1.5px] w-8 sm:w-12 bg-[#fcf9f5] origin-left"
              style={{
                opacity: s1.progress,
                transform: `scaleX(${s1.progress})`,
              }}
            />

            <CloudRevealText
              progress={s1.progress}
              color="#0a0227"
              ghostOpacity={0.18}
              className="
                font-sans
                text-[10px] sm:text-xs
                font-semibold
                tracking-[0.3em]
                uppercase
              "
            >
              Families
            </CloudRevealText>
          </div>
        </div>
      </div>

      {/* ================================================================
          3. STATEMENT 2 — 7,200 METRIC TONS
          Lower editorial composition.
          The headline rises from the factory floor.
          ================================================================ */}
      <div
        className="absolute inset-0 z-30"
        style={{
          opacity: s2.opacity,
          visibility: isStmt2 ? 'visible' : 'hidden',
        }}
      >
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            px-6
            pb-[7vh]
            sm:px-12
            sm:pb-[8vh]
            md:px-16
            lg:px-[5vw]
          "
          style={{
            transform: `
              translate3d(
                0,
                ${(1 - s2.progress) * 45}px,
                0
              )
              scale(${0.965 + s2.progress * 0.035})
            `,
            transformOrigin: 'left bottom',
          }}
        >
          <div
            className="
              mb-4
              flex items-center gap-4
              font-mono
              text-[10px] sm:text-xs
              font-bold
              tracking-[0.24em]
              sm:tracking-[0.3em]
              uppercase
            "
          >
            <span className="h-px w-8 sm:w-12 bg-[#031550]/55" />

            <span className="text-[#031550]/80 drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]">
              PROMINENT CASTING MANUFACTURER IN INDIA
            </span>
          </div>

          <h2
            className="
              relative
              max-w-[1080px]
              font-sans
              text-[clamp(3.4rem,7.2vw,7.8rem)]
              font-black
              tracking-[-0.055em]
              leading-[0.86]
            "
            style={{
              textRendering: 'geometricPrecision',
            }}
          >
            <SplitReveal progress={s2.progress}>
              7,200 Metric Tons
            </SplitReveal>

            <br />

            <SplitReveal
              progress={Math.max(0, s2.progress - 0.08) / 0.92}
              className="text-[#031550]"
            >
              Annual Capacity
            </SplitReveal>
          </h2>

          <div
            className="mt-5 flex items-start sm:items-center gap-8"
            style={{
              opacity: gsap.utils.clamp(0, 1, s2.progress * 1.35),
            }}
          >
            <span className="hidden sm:block h-px w-10 bg-[#031550]/45 shrink-0" />

            <p
              className="
                max-w-2xl
                text-xs sm:text-sm md:text-base
                font-medium
                text-[#031550]/78
                uppercase
                tracking-[0.12em]
                sm:tracking-[0.16em]
                leading-relaxed
                drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]
              "
            >
              FERROUS METAL, WATER, INFRA &amp; OTHER DIVERSE SECTORS
            </p>
          </div>
        </div>
      </div>

      {/* ================================================================
          4. STATEMENT 3 — MOULDING FACILITIES
          Technical/industrial treatment while preserving original copy.
          ================================================================ */}
      <div
        className="absolute inset-0 z-30"
        style={{
          opacity: s3.opacity,
          visibility: isStmt3 ? 'visible' : 'hidden',
        }}
      >
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            px-6
            pb-[7vh]
            sm:px-12
            sm:pb-[8vh]
            md:px-16
            lg:px-[5vw]
          "
          style={{
            transform: `
              translate3d(
                0,
                ${(1 - s3.progress) * 45}px,
                0
              )
              scale(${0.965 + s3.progress * 0.035})
            `,
            transformOrigin: 'left bottom',
          }}
        >
          <div
            className="
              mb-4
              flex items-center gap-4
              font-mono
              text-[10px] sm:text-xs
              font-bold
              tracking-[0.2em]
              sm:tracking-[0.3em]
              uppercase
            "
          >
            <span className="h-px w-8 sm:w-12 bg-white/60" />

            <span className="text-[#031550]/80 drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]">
              BIS and ISO certified | Upholding Strict Quality Standards
            </span>
          </div>

          <h2
            className="
              max-w-[1080px]
              font-sans
              text-[clamp(3rem,6.8vw,7.2rem)]
              font-extrabold
              text-white
              tracking-[-0.045em]
              leading-[0.88]
              drop-shadow-[0_5px_24px_rgba(0,0,0,0.7)]
            "
          >
            <SplitReveal progress={s3.progress}>
              Machine &amp; Hand Moulding Facilities
            </SplitReveal>
          </h2>

          <p
            className="
              mt-5
              max-w-3xl
              text-sm sm:text-lg md:text-xl
              font-medium
              text-[#031550]/80
              leading-relaxed
              drop-shadow-[0_3px_14px_rgba(0,0,0,0.75)]
            "
            style={{
              opacity: gsap.utils.clamp(0, 1, (s3.progress - 0.18) / 0.5),
              transform: `
                translateY(
                  ${(1 - gsap.utils.clamp(0, 1, (s3.progress - 0.18) / 0.82)) * 18}px
                )
              `,
            }}
          >
            Machine moulding featuring 450 and 900 ARPA and hand moulding
            facilities, capable of casting single pieces weighing up to 1.5
            metric tons.
          </p>
        </div>
      </div>

      {/* ================================================================
          EDGE VIGNETTE
          Very subtle cinematic framing. Does not hide the factory.
          ================================================================ */}
      <div
        className="absolute inset-0 z-50 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 52%,
              rgba(255,255,255,0.10) 100%
            )
          `,
        }}
      />
    </div>
  );
}
