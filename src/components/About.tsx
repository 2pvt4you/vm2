import { useState, useEffect, useRef } from 'react';
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
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Reveal,
  MaskLines,
  StaggerGroup,
  StaggerItem,
} from './ui/primitives';

// Factory & Facility Images uploaded by user (optimized editorial copies)
import imgFactoryShed from '../assets/images/optimized/photo_6221737969593728038_y.webp';
import imgFoundry1 from '../assets/images/optimized/photo_6226479652143217474_y.webp';
import imgFloor1 from '../assets/images/optimized/telegram-cloud-photo-size-5-6221737969593727894-y.webp';
import imgFloor2 from '../assets/images/optimized/telegram-cloud-photo-size-5-6221737969593727908-y.webp';
import imgInventory1 from '../assets/images/optimized/telegram-cloud-photo-size-5-6150184609011317423-w.webp';
import imgInspection1 from '../assets/images/optimized/telegram-cloud-photo-size-5-6150184609011317442-w.webp';
import imgMachining1 from '../assets/images/optimized/telegram-cloud-photo-size-5-6150184609011317444-w.webp';
import imgYard1 from '../assets/images/optimized/photo1714113109.webp';
import imgFoundry2 from '../assets/images/optimized/photo1714113133.webp';
import imgTesting1 from '../assets/images/optimized/WhatsApp Image 2024-04-26 at 11.26.56 (1).webp';

const FACTORY_PHOTOS: string[] = [
  imgFactoryShed,
  imgFoundry1,
  imgFloor1,
  imgFloor2,
  imgInventory1,
  imgInspection1,
  imgMachining1,
  imgYard1,
  imgFoundry2,
  imgTesting1,
];

export default function About() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const reduce = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance every 2 seconds with smooth transitions
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % FACTORY_PHOTOS.length);
    }, 2000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered]);

  const goToSlide = (idx: number) => setCurrentSlideIndex(idx);
  const nextSlide = () =>
    setCurrentSlideIndex((prev) => (prev + 1) % FACTORY_PHOTOS.length);
  const prevSlide = () =>
    setCurrentSlideIndex(
      (prev) => (prev - 1 + FACTORY_PHOTOS.length) % FACTORY_PHOTOS.length
    );

  return (
    <section
      id="about"
      data-theme="light"
      className="relative z-20 -mt-4 sm:-mt-6 rounded-t-[1.75rem] sm:rounded-t-[2.5rem] bg-ivory text-ink overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ink/20 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-24">
        {/* ==================== WHO WE ARE ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 sm:mb-28">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="kicker">Pioneering Heavy Foundry &amp; Casting</span>
            </Reveal>

            <MaskLines
              as="h2"
              className="display-tight text-ink text-[clamp(2.1rem,4.4vw,3.9rem)] mt-6 mb-9"
              lines={[
                'Engineering Reliability Across',
                'Global Water Infrastructure',
              ]}
            />

            <Reveal delay={0.1}>
              <div className="space-y-5 max-w-2xl text-[15px] leading-[1.9] text-ink/62">
                <p>
                  <strong className="text-ink font-semibold">
                    Varaha Metaliks Pvt. Ltd.
                  </strong>{' '}
                  stands as a premier manufacturer of premium quality{' '}
                  <strong className="text-ink font-semibold">
                    Ductile Iron Pipe Fittings (as per IS 9523:2000)
                  </strong>
                  , Engineering Castings of various grades, and Ductile Iron
                  Manhole Covers.
                </p>
                <p>
                  Guided by the{' '}
                  <strong className="text-ink font-semibold">
                    Mittal, Jhunjhunwala and Jaju families
                  </strong>
                  —distinguished industrial pioneers with over{' '}
                  <strong className="text-ink font-semibold">
                    40+ years of expertise
                  </strong>{' '}
                  in the Ferrous Metal, Water Infrastructure, and Heavy Casting
                  sectors.
                </p>
                <p>
                  Operating with a robust annual capacity of{' '}
                  <strong className="text-ink font-semibold">
                    7,200 Metric Tons
                  </strong>
                  , our manufacturing line integrates state-of-the-art machine
                  moulding (450 &amp; 900 ARPA) and hand moulding facilities
                  capable of casting single workpieces up to{' '}
                  <strong className="text-ink font-semibold">1.5 MT</strong>{' '}
                  with comprehensive UTM, BHN, spectrometer, and hydrostatic
                  testing.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Numbers as editorial data */}
          <div className="lg:col-span-5">
            <StaggerGroup className="flex flex-col" amount={0.2}>
              <StaggerItem>
                <div className="flex items-start justify-between gap-6 py-7 border-t border-ink/12">
                  <div>
                    <span className="numeric-object block text-[clamp(3.4rem,6vw,5.2rem)] text-ink leading-none">
                      7.2
                      <span className="text-copper text-[0.45em] align-top ml-1 font-sans font-bold tracking-tight">
                        K
                      </span>
                    </span>
                    <span className="label-tech text-steel mt-3 block">
                      Metric Tons Annual Capacity
                    </span>
                  </div>
                  <span className="w-10 h-10 rounded-full border border-copper/35 text-copper-deep flex items-center justify-center shrink-0 mt-2">
                    <Factory className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="flex items-start justify-between gap-6 py-7 border-t border-ink/12">
                  <div>
                    <span className="numeric-object block text-[clamp(3.4rem,6vw,5.2rem)] text-ink leading-none">
                      40
                      <span className="text-copper text-[0.55em] font-sans font-bold">
                        +
                      </span>
                    </span>
                    <span className="label-tech text-steel mt-3 block">
                      Years Industrial Expertise
                    </span>
                  </div>
                  <span className="w-10 h-10 rounded-full border border-copper/35 text-copper-deep flex items-center justify-center shrink-0 mt-2">
                    <Award className="w-4 h-4" strokeWidth={1.5} />
                  </span>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="relative mt-2 rounded-2xl bg-graphite text-ivory p-7 overflow-hidden">
                  <div
                    className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle, rgba(216,181,109,0.22), transparent 65%)',
                    }}
                  />
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-9 h-9 rounded-full border border-champagne/40 text-champagne flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <h3 className="font-display font-medium text-lg">
                      BIS &amp; ISO Certified
                    </h3>
                  </div>
                  <p className="font-mono text-[11px] tracking-[0.14em] text-champagne/90 mb-3">
                    CM/L NO: 6300089907 • IS 9523:2000
                  </p>
                  <p className="text-ivory/55 text-[13px] leading-relaxed">
                    Fully licensed for municipal, state water board, and
                    international water transmission supply networks.
                  </p>
                </div>
              </StaggerItem>
            </StaggerGroup>
          </div>
        </div>

        {/* ==================== PLANT GALLERY ==================== */}
        <Reveal amount={0.15} className="mb-20 sm:mb-28">
          <div className="flex flex-wrap items-end justify-between gap-5 mb-6">
            <h3 className="font-display font-medium text-2xl sm:text-3xl text-ink">
              Plant &amp; Infrastructure Gallery
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-full border border-ink/15 text-ink/70 hover:text-copper hover:border-copper/50 flex items-center justify-center transition-colors"
                title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
                aria-label={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5" strokeWidth={1.6} />
                ) : (
                  <Play className="w-3.5 h-3.5" strokeWidth={1.6} />
                )}
              </button>
              <button
                onClick={prevSlide}
                className="w-9 h-9 rounded-full border border-ink/15 text-ink/70 hover:text-copper hover:border-copper/50 flex items-center justify-center transition-colors"
                title="Previous photo"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={nextSlide}
                className="w-9 h-9 rounded-full border border-ink/15 text-ink/70 hover:text-copper hover:border-copper/50 flex items-center justify-center transition-colors"
                title="Next photo"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Cinematic scene frame */}
          <div
            className="relative w-full h-[46vh] sm:h-[58vh] lg:h-[64vh] rounded-xl sm:rounded-2xl overflow-hidden bg-graphite border border-ink/10 shadow-[0_40px_80px_-40px_rgba(21,23,26,0.45)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 0.55, ease: 'easeInOut' },
                  scale: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
                }}
                className="absolute inset-0"
              >
                <img
                  src={FACTORY_PHOTOS[currentSlideIndex]}
                  alt="Varaha Metaliks Manufacturing Facility"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Cinematic veils */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(21,23,26,0.22) 0%, transparent 28%, transparent 68%, rgba(21,23,26,0.4) 100%)',
              }}
            />

            {/* Edge metadata */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-3">
              <span className="h-px w-8 bg-champagne/80" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ivory/85 uppercase">
                Mahabubnagar
              </span>
            </div>
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 font-mono text-[11px] tracking-[0.28em] text-ivory/85 tabular-nums">
              {String(currentSlideIndex + 1).padStart(2, '0')}
              <span className="text-ivory/40"> / {String(FACTORY_PHOTOS.length).padStart(2, '0')}</span>
            </div>

            {/* Progress rule */}
            {isPlaying && !isHovered && (
              <div className="absolute bottom-0 inset-x-0 h-[2px] bg-ivory/15">
                <motion.div
                  key={currentSlideIndex}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.0, ease: 'linear' }}
                  className="h-full bg-copper"
                />
              </div>
            )}
          </div>

          {/* Film strip */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {FACTORY_PHOTOS.map((src, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`relative shrink-0 w-20 sm:w-28 h-12 sm:h-14 rounded-md overflow-hidden border transition-all duration-300 ${
                  currentSlideIndex === idx
                    ? 'border-copper opacity-100'
                    : 'border-transparent opacity-40 hover:opacity-80 grayscale-[0.35]'
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <img
                  src={src}
                  alt="Factory Thumbnail"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </Reveal>

        {/* ==================== VISION & MISSION — quiet, low motion ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink/10 border border-ink/10 rounded-2xl overflow-hidden">
          <Reveal className="bg-ivory">
            <div className="p-8 sm:p-12 h-full">
              <div className="flex items-center gap-4 mb-7">
                <Target className="w-5 h-5 text-copper" strokeWidth={1.5} />
                <div className="h-px flex-1 bg-ink/10" />
                <span className="label-tech text-steel">Global Excellence</span>
              </div>
              <h3 className="font-display font-medium text-2xl sm:text-3xl text-ink mb-5">
                Our Vision
              </h3>
              <p className="text-ink/62 text-[15px] leading-[1.9]">
                To be a global leader in the manufacturing of high-quality
                ferrous metal castings, renowned for our innovation,
                sustainability, and commitment to excellence, thereby
                contributing to the advancement of the infrastructure and
                industrial sectors worldwide.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="bg-mineral/60">
            <div className="p-8 sm:p-12 h-full">
              <div className="flex items-center gap-4 mb-7">
                <ShieldCheck className="w-5 h-5 text-copper" strokeWidth={1.5} />
                <div className="h-px flex-1 bg-ink/10" />
                <span className="label-tech text-steel">Quality &amp; Durability</span>
              </div>
              <h3 className="font-display font-medium text-2xl sm:text-3xl text-ink mb-5">
                Our Mission
              </h3>
              <p className="text-ink/62 text-[15px] leading-[1.9]">
                To deliver superior products that exceed ISO standards through
                advanced manufacturing and rigorous quality control. We invest
                in cutting-edge technology to produce dependable fittings and
                castings, ensuring dependable assets built for the long haul.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
