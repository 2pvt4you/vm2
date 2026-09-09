import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

import foundryFloor from '../assets/images/mouldingfloor.png';
import pourImage from '../assets/images/photo1714113133.jpg';
import finishedProduct from '../assets/images/telegram-cloud-photo-size-5-6221737969593728021-y-removebg-preview.png';

/**
 * Foundry -> Products bridge.
 *
 * A single scroll-linked shot that carries the film from MANUFACTURING,
 * through FINISHED PRODUCT, into the INTERACTIVE SHOWCASE. It exists to
 * remove the hard cut between the photographic story section and the WebGL
 * product stage: it opens on the same warm foundry tone the gallery ends on
 * and closes on the exact void the product stage opens on.
 */

const BEATS = [
  {
    index: '01',
    label: 'Manufacturing',
    title: 'Molten iron, held to tolerance',
    body: 'Machine and hand moulding lines running to 7,200 metric tons a year.',
  },
  {
    index: '02',
    label: 'Finished Product',
    title: 'Cast, machined, coated, tested',
    body: 'Every fitting proved against IS 9523:2000 and ISO 2531 before it leaves the floor.',
  },
  {
    index: '03',
    label: 'Interactive Showcase',
    title: 'Examine the range in full',
    body: 'Rotate, inspect and compare the complete ductile iron fittings catalogue.',
  },
];

export default function ProductBridge() {
  const sectionRef = useRef<HTMLElement>(null);
  const { prefersReducedMotion, isMobile } = useDeviceProfile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smoothed so scroll wheel steps read as camera movement, not jitter.
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });

  // Camera pushing through the foundry.
  const bgScale = useTransform(p, [0, 1], [1.28, 1.02]);
  const bgY = useTransform(p, [0, 1], ['-4%', '4%']);
  const bgOpacity = useTransform(p, [0, 0.32, 0.62, 0.9], [0.55, 0.42, 0.16, 0]);

  // The pour plate crosses behind the product as depth.
  const pourOpacity = useTransform(p, [0.18, 0.4, 0.62], [0, 0.34, 0]);
  const pourScale = useTransform(p, [0.18, 0.62], [1.16, 1.0]);

  // Finished product rises into frame and settles.
  const productOpacity = useTransform(p, [0.3, 0.5, 0.84, 0.97], [0, 1, 1, 0.15]);
  const productY = useTransform(p, [0.3, 0.6, 1], ['14%', '0%', '-8%']);
  const productScale = useTransform(p, [0.3, 0.62, 1], [0.78, 1, 1.08]);

  // Closing wash — lands on the product stage's own background colour.
  const closeOpacity = useTransform(p, [0.7, 1], [0, 1]);

  const still = prefersReducedMotion;

  return (
    <section
      ref={sectionRef}
      id="bridge"
      aria-label="From manufacturing to finished product"
      className="relative w-full bg-vm-iron"
      style={{ height: still ? 'auto' : isMobile ? '230vh' : '280vh' }}
    >
      <div
        className={
          still
            ? 'relative w-full overflow-hidden py-20'
            : 'vm-grain sticky top-0 h-stage w-full overflow-hidden'
        }
      >
        {/* Continuity in: same tone the gallery above closes on. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-32 bg-gradient-to-b from-vm-iron to-transparent"
          aria-hidden="true"
        />

        {/* --- Foundry plate --- */}
        <motion.div
          className="absolute inset-0"
          style={still ? undefined : { scale: bgScale, y: bgY, opacity: bgOpacity }}
          aria-hidden="true"
        >
          <img
            src={foundryFloor}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* --- Pour plate (depth layer) --- */}
        <motion.div
          className="absolute inset-0"
          style={still ? { opacity: 0.2 } : { scale: pourScale, opacity: pourOpacity }}
          aria-hidden="true"
        >
          <img
            src={pourImage}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-vm-void/72 via-vm-void/45 to-vm-void/88"
          aria-hidden="true"
        />

        {/* --- Finished product --- */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={
            still
              ? undefined
              : { opacity: productOpacity, y: productY, scale: productScale }
          }
        >
          <img
            src={finishedProduct}
            alt="Finished ductile iron fitting"
            loading="lazy"
            decoding="async"
            className="max-h-[46vh] w-auto max-w-[76vw] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.65)] sm:max-h-[54vh] sm:max-w-[52vw]"
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="h-[46vw] w-[46vw] max-h-[520px] max-w-[520px] rounded-full bg-vm-amber/12 blur-[120px]" />
          </div>
        </motion.div>

        {/* --- Beat captions --- */}
        <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-between px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-vm-amber/85 sm:text-[11px]">
              From floor to fitting
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
            {BEATS.map((beat, i) => (
              <Beat key={beat.index} beat={beat} progress={p} slot={i} still={still} />
            ))}
          </div>
        </div>

        {/* Continuity out: resolves to the product stage's exact background. */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30 bg-vm-void"
          style={still ? { opacity: 0 } : { opacity: closeOpacity }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

interface BeatProps {
  beat: (typeof BEATS)[number];
  progress: ReturnType<typeof useSpring>;
  slot: number;
  still: boolean;
}

function Beat({ beat, progress, slot, still }: BeatProps) {
  // Each caption owns a third of the shot: enter, hold, release.
  const start = 0.16 + slot * 0.24;
  const opacity = useTransform(
    progress,
    [start - 0.1, start, start + 0.2, start + 0.3],
    [0.18, 1, 1, 0.18]
  );
  const y = useTransform(progress, [start - 0.1, start + 0.3], [16, -10]);

  return (
    <motion.div
      style={still ? undefined : { opacity, y }}
      className="border-t border-white/12 pt-4 sm:pt-5"
    >
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] tracking-[0.3em] text-vm-amber/75">
          {beat.index}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
          {beat.label}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-light leading-snug text-white sm:text-xl lg:text-2xl">
        {beat.title}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-white/50 sm:text-sm">
        {beat.body}
      </p>
    </motion.div>
  );
}
