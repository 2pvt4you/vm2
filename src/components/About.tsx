import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Factory,
  ShieldCheck,
  Target,
  Award,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

// Factory & Facility Images
import imgFactoryShed from '../assets/images/photo_6221737969593728038_y.jpg';
import imgFoundry1 from '../assets/images/photo_6226479652143217474_y.jpg';
import imgFloor1 from '../assets/images/telegram-cloud-photo-size-5-6221737969593727894-y.jpg';
import imgFloor2 from '../assets/images/telegram-cloud-photo-size-5-6221737969593727908-y.jpg';
import imgInventory1 from '../assets/images/telegram-cloud-photo-size-5-6150184609011317423-w.jpg';
import imgInspection1 from '../assets/images/telegram-cloud-photo-size-5-6150184609011317442-w.jpg';
import imgMachining1 from '../assets/images/telegram-cloud-photo-size-5-6150184609011317444-w.jpg';
import imgYard1 from '../assets/images/photo1714113109.jpg';
import imgFoundry2 from '../assets/images/photo1714113133.jpg';
import imgTesting1 from '../assets/images/WhatsApp Image 2024-04-26 at 11.26.56 (1).jpg';

interface Photo {
  src: string;
  caption: string;
}

const FACTORY_PHOTOS: Photo[] = [
  { src: imgFactoryShed, caption: 'Plant elevation' },
  { src: imgFoundry1, caption: 'Foundry bay' },
  { src: imgFloor1, caption: 'Moulding floor' },
  { src: imgFloor2, caption: 'Moulding line' },
  { src: imgInventory1, caption: 'Finished stock yard' },
  { src: imgInspection1, caption: 'Inspection' },
  { src: imgMachining1, caption: 'Machining' },
  { src: imgYard1, caption: 'Dispatch yard' },
  { src: imgFoundry2, caption: 'Pouring' },
  { src: imgTesting1, caption: 'Testing laboratory' },
];

const SLIDE_MS = 2000;

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const thumbRowRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const { isTouch, prefersReducedMotion, isMobile } = useDeviceProfile();

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);

  const running = isPlaying && !isHovered && !prefersReducedMotion;

  // --- Scroll parallax: the gallery plate drifts against the page so the
  // section reads as a camera move rather than a static block. ---
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

  // --- Auto-advance: one ~2 second cinematic moment per image. ---
  useEffect(() => {
    if (!running) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % FACTORY_PHOTOS.length);
    }, SLIDE_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  const goTo = useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex((next + FACTORY_PHOTOS.length) % FACTORY_PHOTOS.length);
  }, []);

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  // Keep the active thumbnail in view without scrolling the page.
  useEffect(() => {
    const el = thumbRefs.current[index];
    const row = thumbRowRef.current;
    if (!el || !row) return;

    const target =
      el.offsetLeft - row.clientWidth / 2 + el.clientWidth / 2;

    row.scrollTo({
      left: Math.max(0, target),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [index, prefersReducedMotion]);

  // --- Touch: horizontal swipe changes the shot, vertical is left to the page. ---
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    if (!start) return;
    touchStart.current = null;

    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;

    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) next();
    else prev();
  };

  const active = FACTORY_PHOTOS[index];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="vm-grain relative overflow-hidden bg-vm-void text-white"
    >
      {/* Continuity in from the hero frame sequence. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
        {/* ================= WHO WE ARE ================= */}
        <div className="mb-20 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-vm-amber/85 sm:text-[11px]">
              Pioneering heavy foundry &amp; casting
            </p>

            <h2 className="mt-5 text-3xl font-light leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              Engineering reliability across global{' '}
              <span className="font-editorial italic text-vm-amber">
                water infrastructure
              </span>
            </h2>

            <div className="mt-8 space-y-5 text-sm leading-relaxed text-white/55 sm:text-base">
              <p>
                <strong className="font-medium text-white/85">
                  Varaha Metaliks Pvt. Ltd.
                </strong>{' '}
                stands as a premier manufacturer of premium quality Ductile Iron
                Pipe Fittings (as per IS 9523:2000), Engineering Castings of
                various grades, and Ductile Iron Manhole Covers.
              </p>
              <p>
                Guided by the{' '}
                <strong className="font-medium text-white/85">
                  Mittal, Jhunjhunwala and Jaju families
                </strong>{' '}
                — distinguished industrial pioneers with over 40+ years of
                expertise in the Ferrous Metal, Water Infrastructure, and Heavy
                Casting sectors.
              </p>
              <p>
                Operating with a robust annual capacity of{' '}
                <strong className="font-medium text-white/85">
                  7,200 Metric Tons
                </strong>
                , our manufacturing line integrates state-of-the-art machine
                moulding (450 &amp; 900 ARPA) and hand moulding facilities
                capable of casting single workpieces up to 1.5 MT with
                comprehensive UTM, BHN, spectrometer, and hydrostatic testing.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5"
          >
            <Metric
              icon={<Factory className="h-6 w-6" />}
              value="7.2K"
              label="Metric tons annual capacity"
            />
            <Metric
              icon={<Award className="h-6 w-6" />}
              value="40+"
              label="Years industrial expertise"
            />

            <div className="relative col-span-2 overflow-hidden rounded-xl border border-vm-amber/20 bg-gradient-to-br from-vm-graphite to-vm-iron p-6">
              <div
                className="absolute right-0 top-0 h-28 w-28 -translate-y-6 translate-x-6 rounded-full bg-vm-amber/12 blur-2xl"
                aria-hidden="true"
              />
              <div className="relative flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-vm-amber/15 text-vm-amber">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-medium text-white">
                    BIS &amp; ISO Certified
                  </h3>
                  <p className="truncate font-mono text-[10px] tracking-wider text-vm-amber/80">
                    CM/L NO: 6300089907 • IS 9523:2000
                  </p>
                </div>
              </div>
              <p className="relative mt-4 text-xs leading-relaxed text-white/45">
                Fully licensed for municipal, state water board, and
                international water transmission supply networks.
              </p>
            </div>
          </motion.div>
        </div>

        {/* ================= PLANT & INFRASTRUCTURE GALLERY ================= */}
        <div className="mb-20">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-vm-amber/80">
                Inside the plant
              </p>
              <h3 className="mt-3 text-2xl font-light tracking-tight text-white sm:text-3xl">
                Plant &amp; Infrastructure Gallery
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="tap-target flex cursor-pointer items-center gap-2 rounded-lg border border-white/12 bg-white/5 px-3 font-mono text-[11px] font-medium tracking-wider text-white/75 transition-colors hover:border-vm-amber/40 hover:text-white"
                title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5 text-vm-amber" />
                ) : (
                  <Play className="h-3.5 w-3.5 text-vm-amber" />
                )}
                <span className="hidden sm:inline">
                  {isPlaying ? 'PAUSE' : 'PLAY'}
                </span>
              </button>

              <button
                onClick={prev}
                className="tap-target flex cursor-pointer items-center justify-center rounded-lg border border-white/12 bg-white/5 text-white/75 transition-colors hover:border-vm-amber/40 hover:text-white"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                onClick={next}
                className="tap-target flex cursor-pointer items-center justify-center rounded-lg border border-white/12 bg-white/5 text-white/75 transition-colors hover:border-vm-amber/40 hover:text-white"
                aria-label="Next photo"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Cinematic plate — each shot enters with a slow push, holds, and
              is released. Photography stays dominant: no text sits on it. */}
          <motion.div
            ref={stageRef}
            style={prefersReducedMotion ? undefined : { y: plateY }}
            className="pan-y-only relative h-72 w-full overflow-hidden rounded-2xl border border-white/10 bg-vm-iron shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] sm:h-[460px] lg:h-[560px]"
            onMouseEnter={isTouch ? undefined : () => setIsHovered(true)}
            onMouseLeave={isTouch ? undefined : () => setIsHovered(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 1.14, x: direction * 26 }
                }
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        scale: 1.04,
                        x: 0,
                        transition: {
                          opacity: { duration: 0.7, ease: 'easeOut' },
                          x: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                          // Slow continuous push for the full hold.
                          scale: { duration: 3.4, ease: 'linear' },
                        },
                      }
                }
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 1.0,
                        x: direction * -22,
                        transition: { duration: 0.7, ease: 'easeInOut' },
                      }
                }
                className="absolute inset-0"
              >
                <img
                  src={FACTORY_PHOTOS[index].src}
                  alt={FACTORY_PHOTOS[index].caption}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>

            {/* Vignette only — keeps the photograph the subject. */}
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,7,12,0.55)_100%)]"
              aria-hidden="true"
            />

            {/* Frame furniture */}
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 sm:bottom-5 sm:left-6 sm:right-6">
              <span className="rounded border border-white/12 bg-black/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 backdrop-blur-sm">
                {active.caption}
              </span>
              <span className="font-mono text-[10px] tracking-[0.22em] text-white/50">
                {String(index + 1).padStart(2, '0')} /{' '}
                {String(FACTORY_PHOTOS.length).padStart(2, '0')}
              </span>
            </div>

            {running && (
              <div className="absolute inset-x-0 bottom-0 z-20 h-0.5 bg-white/15">
                <motion.div
                  key={index}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                  className="h-full bg-vm-amber"
                />
              </div>
            )}
          </motion.div>

          {/* Thumbnails — single-axis scroll so a drag here cannot hijack the
              vertical page scroll on touch. */}
          <div
            ref={thumbRowRef}
            className="pan-x-only no-scrollbar mt-4 flex items-center gap-2.5 overflow-x-auto py-1"
          >
            {FACTORY_PHOTOS.map((photo, idx) => (
              <button
                key={photo.src}
                ref={(el) => {
                  thumbRefs.current[idx] = el;
                }}
                onClick={() => goTo(idx, idx > index ? 1 : -1)}
                className={`relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-lg border transition-all duration-500 sm:h-16 sm:w-28 ${
                  index === idx
                    ? 'border-vm-amber opacity-100'
                    : 'border-white/10 opacity-45 hover:opacity-90'
                }`}
                aria-label={`View ${photo.caption}`}
                aria-current={index === idx}
              >
                <img
                  src={photo.src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {isTouch && (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">
              Swipe to browse
            </p>
          )}
        </div>

        {/* ================= VISION & MISSION ================= */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          <Pillar
            icon={<Target className="h-5 w-5" />}
            title="Our Vision"
            kicker="Global excellence"
            body="To be a global leader in the manufacturing of high-quality ferrous metal castings, renowned for our innovation, sustainability, and commitment to excellence, thereby contributing to the advancement of the infrastructure and industrial sectors worldwide."
            delay={0}
            reduced={prefersReducedMotion}
          />
          <Pillar
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Our Mission"
            kicker="Quality & durability"
            body="To deliver superior products that exceed ISO standards through advanced manufacturing and rigorous quality control. We invest in cutting-edge technology to produce dependable fittings and castings, ensuring dependable assets built for the long haul."
            delay={isMobile ? 0 : 0.12}
            reduced={prefersReducedMotion}
          />
        </div>
      </div>

      {/* Continuity out into the manufacturing bridge. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-vm-iron"
        aria-hidden="true"
      />
    </section>
  );
}

function Metric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col justify-center rounded-xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
      <div className="mb-3 text-vm-amber">{icon}</div>
      <h3 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
        {value}
      </h3>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
    </div>
  );
}

function Pillar({
  icon,
  title,
  kicker,
  body,
  delay,
  reduced,
}: {
  icon: React.ReactNode;
  title: string;
  kicker: string;
  body: string;
  delay: number;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 sm:p-9"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vm-amber/12 text-vm-amber">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-light tracking-tight text-white">
            {title}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
            {kicker}
          </span>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-white/50 sm:text-base">{body}</p>
    </motion.div>
  );
}
