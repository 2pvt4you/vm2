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
  Anvil,
  Gauge,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Reveal,
  MaskLines,
  StaggerGroup,
  StaggerItem,
  Parallax,
  CornerFrame,
  DiamondMark,
  TONE,
} from './ui/primitives';

gsap.registerPlugin(ScrollTrigger);

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

const STATS = [
  { value: '7.2', suffix: 'K', label: 'Metric Tons Annual Capacity', icon: Factory },
  { value: '40', suffix: '+', label: 'Years Industrial Expertise', icon: Award },
  { value: '1.5', suffix: 'MT', label: 'Largest Single Casting', icon: Anvil },
  { value: '11', suffix: '', label: 'State Water Board Approvals', icon: Gauge },
];

export default function About() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const reduce = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const thresholdRef = useRef<HTMLDivElement>(null);
  const seamImgRef = useRef<HTMLDivElement>(null);
  const seamLineRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const seamCaptionRef = useRef<HTMLDivElement>(null);

  /* ================= MOLTEN SEAM THRESHOLD =================
     The hero's white-gold flash resolves here: a champagne seam
     ignites across the navy, the foundry image splits open from
     its centre, the flash burns away. MOVE → SHIFT → REVEAL → SETTLE. */
  useEffect(() => {
    if (reduce) {
      if (seamImgRef.current) seamImgRef.current.style.clipPath = 'inset(0% 0% 0% 0%)';
      if (flashRef.current) flashRef.current.style.opacity = '0';
      if (seamLineRef.current) seamLineRef.current.style.opacity = '0';
      if (seamCaptionRef.current) seamCaptionRef.current.style.opacity = '1';
      return;
    }
    const ctx = gsap.context(() => {
      const trigger = {
        trigger: thresholdRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
      };
      // 1. flash burns away
      gsap.fromTo(flashRef.current, { opacity: 1 }, { opacity: 0, ease: 'none', scrollTrigger: { ...trigger, end: '38% top' } });
      // 2. seam ignites across the frame
      gsap.fromTo(seamLineRef.current, { scaleX: 0, opacity: 1 }, { scaleX: 1, opacity: 1, ease: 'none', scrollTrigger: { ...trigger, end: '30% top' } });
      // 3. foundry image splits open from the seam
      gsap.fromTo(
        seamImgRef.current,
        { clipPath: 'inset(6% 50% 6% 50%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { ...trigger, start: '18% top', end: '72% top' } }
      );
      // 4. seam dissolves into the image
      gsap.to(seamLineRef.current, { opacity: 0, ease: 'none', scrollTrigger: { ...trigger, start: '52% top', end: '74% top' } });
      // 5. caption settles in
      gsap.fromTo(seamCaptionRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: { ...trigger, start: '58% top', end: '86% top' } });
    }, thresholdRef);
    return () => ctx.revert();
  }, [reduce]);

  // Auto-advance archive every 2.4s
  useEffect(() => {
    if (!isPlaying || isHovered || reduce) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % FACTORY_PHOTOS.length);
    }, 2400);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, reduce]);

  const goToSlide = (idx: number) => setCurrentSlideIndex(idx);
  const nextSlide = () => setCurrentSlideIndex((prev) => (prev + 1) % FACTORY_PHOTOS.length);
  const prevSlide = () => setCurrentSlideIndex((prev) => (prev - 1 + FACTORY_PHOTOS.length) % FACTORY_PHOTOS.length);

  return (
    <section id="about" data-theme="dark" className="relative z-20 bg-navy text-ivory overflow-hidden">
      {/* hairline handoff from the hero flash */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-champagne/50 to-transparent" />

      {/* ================================================================
          MOLTEN SEAM THRESHOLD — hero flash → foundry reveal
          ================================================================ */}
      <div ref={thresholdRef} className="relative h-[150vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-navy">
          {/* residual flash from the film */}
          <div
            ref={flashRef}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background:
                'radial-gradient(120% 90% at 50% 70%, rgba(250,236,200,0.98) 0%, rgba(231,196,134,0.75) 45%, rgba(244,241,234,0.9) 100%)',
            }}
          />

          {/* the foundry, splitting open from the seam */}
          <div
            ref={seamImgRef}
            className="absolute inset-0 will-transform"
            style={{ clipPath: 'inset(6% 50% 6% 50%)' }}
          >
            <img
              src={imgFoundry2}
              alt="Varaha Metaliks foundry — molten metal pouring"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              draggable={false}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(7,26,47,0.72) 0%, rgba(7,26,47,0.18) 30%, rgba(7,26,47,0.14) 62%, rgba(7,26,47,0.82) 100%)',
              }}
            />
          </div>

          {/* the igniting seam */}
          <div
            ref={seamLineRef}
            className="absolute left-[8vw] right-[8vw] top-1/2 h-px z-10"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(199,166,106,0.9) 18%, rgba(247,226,178,1) 50%, rgba(199,166,106,0.9) 82%, transparent)',
              boxShadow: '0 0 24px rgba(199,166,106,0.65)',
              transform: 'scaleX(0)',
              opacity: 0,
            }}
          />

          {/* threshold captions */}
          <div className="absolute top-[7vh] left-[6vw] right-[6vw] z-10 flex items-center justify-between">
            <span className="label-tech text-champagne">Scene 02 — The Foundry</span>
            <span className="label-tech text-ivory/50 hidden sm:block">
              Molten → Form → Fitting
            </span>
          </div>

          <div ref={seamCaptionRef} className="absolute inset-x-0 bottom-[9vh] z-10 px-[6vw]" style={{ opacity: 0 }}>
            <h2 className="display-tight text-ivory text-[clamp(2.4rem,6.4vw,6rem)]">
              Material. Craft.{' '}
              <span className="font-display italic font-light text-champagne">Precision.</span>
            </h2>
            <div className="mt-5 flex items-center gap-4">
              <span className="h-px w-14 bg-champagne/80" />
              <p className="max-w-xl font-sans text-[12px] sm:text-sm text-ivory/65 leading-relaxed">
                The camera steps through the bay door — heat, sand and iron
                become the fittings that carry a nation's water.
              </p>
            </div>
          </div>

          <CornerFrame color="rgba(199,166,106,0.4)" inset={20} />
        </div>
      </div>

      {/* ================================================================
          WHO WE ARE — editorial statement + numbers as data
          ================================================================ */}
      <div className="relative bg-navy">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 pt-10 sm:pt-16 pb-24 sm:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="kicker kicker--light">
                  Pioneering Heavy Foundry &amp; Casting
                </span>
              </Reveal>

              <MaskLines
                as="h2"
                className="display-tight text-ivory text-[clamp(2.2rem,4.6vw,4.2rem)] mt-6 mb-9"
                lines={[
                  'Engineering Reliability Across',
                  <span key="w" className="text-champagne">Global Water Infrastructure</span>,
                ]}
              />

              <Reveal delay={0.1}>
                <div className="space-y-5 max-w-2xl text-[15px] leading-[1.9] text-ivory/60">
                  <p>
                    <strong className="text-ivory font-semibold">Varaha Metaliks Pvt. Ltd.</strong>{' '}
                    stands as a premier manufacturer of premium quality{' '}
                    <strong className="text-ivory font-semibold">
                      Ductile Iron Pipe Fittings (as per IS 9523:2000)
                    </strong>
                    , Engineering Castings of various grades, and Ductile Iron
                    Manhole Covers.
                  </p>
                  <p>
                    Guided by the{' '}
                    <strong className="text-ivory font-semibold">
                      Mittal, Jhunjhunwala and Jaju families
                    </strong>
                    —distinguished industrial pioneers with over{' '}
                    <strong className="text-ivory font-semibold">40+ years of expertise</strong>{' '}
                    in the Ferrous Metal, Water Infrastructure, and Heavy Casting
                    sectors.
                  </p>
                  <p>
                    Operating with a robust annual capacity of{' '}
                    <strong className="text-ivory font-semibold">7,200 Metric Tons</strong>,
                    our manufacturing line integrates state-of-the-art machine
                    moulding (450 &amp; 900 ARPA) and hand moulding facilities
                    capable of casting single workpieces up to{' '}
                    <strong className="text-ivory font-semibold">1.5 MT</strong>{' '}
                    with comprehensive UTM, BHN, spectrometer, and hydrostatic
                    testing.
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Numbers as editorial data */}
            <div className="lg:col-span-5">
              <StaggerGroup className="flex flex-col" amount={0.2}>
                {STATS.map((s) => (
                  <StaggerItem key={s.label}>
                    <div className="flex items-start justify-between gap-6 py-6 border-t border-ivory/12">
                      <div>
                        <span className="numeric-object block text-[clamp(3rem,5.4vw,4.6rem)] text-ivory leading-none">
                          {s.value}
                          {s.suffix && (
                            <span className="text-champagne text-[0.45em] align-top ml-1 font-sans font-bold tracking-tight">
                              {s.suffix}
                            </span>
                          )}
                        </span>
                        <span className="label-tech text-metallic mt-3 block">{s.label}</span>
                      </div>
                      <span className="w-10 h-10 rounded-full border border-champagne/35 text-champagne flex items-center justify-center shrink-0 mt-2">
                        <s.icon className="w-4 h-4" strokeWidth={1.5} />
                      </span>
                    </div>
                  </StaggerItem>
                ))}

                <StaggerItem>
                  <div className="relative mt-2 rounded-2xl bg-navy-2 border border-champagne/20 p-7 overflow-hidden">
                    <div
                      className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(199,166,106,0.2), transparent 65%)',
                      }}
                    />
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-9 h-9 rounded-full border border-champagne/40 text-champagne flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                      </span>
                      <h3 className="font-display font-medium text-lg text-ivory">
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
        </div>
      </div>

      {/* ================================================================
          DOCUMENTARY BEATS — large imagery, slow push, editorial captions
          ================================================================ */}
      <div className="relative bg-navy-2">
        <div className="absolute top-0 inset-x-0 h-px rule-ivory" />

        {/* Beat B — factory shed, full-bleed */}
        <div className="max-w-[1500px] mx-auto px-5 sm:px-10 lg:px-16 pt-20 sm:pt-28">
          <Reveal>
            <div className="flex items-end justify-between gap-6 mb-6">
              <span className="label-tech text-champagne">01 — Factory Shed · Casting Bay</span>
              <span className="label-tech text-ivory/45 hidden sm:block">Mahabubnagar · Telangana</span>
            </div>
          </Reveal>
          <Parallax distance={40} className="overflow-hidden rounded-lg border border-ivory/10">
            <div className="relative h-[52vh] sm:h-[68vh] overflow-hidden">
              <img
                src={imgFactoryShed}
                alt="Varaha Metaliks factory shed and casting bay"
                className="absolute inset-0 w-full h-[118%] object-cover will-transform"
                referrerPolicy="no-referrer"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,26,47,0.25), transparent 30%, transparent 66%, rgba(7,26,47,0.5))' }} />
            </div>
          </Parallax>
        </div>

        {/* Beat C — the moulding floor statement + image */}
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 pt-24 sm:pt-36 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-10">
            <div className="lg:col-span-8">
              <MaskLines
                as="h2"
                className="display-tight text-ivory text-[clamp(2.2rem,5.4vw,5rem)]"
                lines={[
                  'The moulding floor, where',
                  <span key="c" className="text-champagne">capacity becomes character.</span>,
                ]}
              />
            </div>
            <div className="lg:col-span-4">
              <Reveal delay={0.15}>
                <p className="text-ivory/55 text-sm leading-[1.85]">
                  Machine moulding featuring 450 and 900 ARPA lines, beside hand
                  moulding bays casting single pieces to 1.5 metric tons.
                </p>
              </Reveal>
            </div>
          </div>

          <Parallax distance={46} className="overflow-hidden rounded-lg border border-ivory/10">
            <div className="relative h-[48vh] sm:h-[62vh] overflow-hidden">
              <img
                src={imgFloor1}
                alt="Moulding floor with stacked mould boxes"
                className="absolute inset-0 w-full h-[118%] object-cover will-transform"
                referrerPolicy="no-referrer"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,26,47,0.28), transparent 32%, transparent 64%, rgba(7,26,47,0.55))' }} />
              <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 flex items-center gap-3">
                <DiamondMark size={6} />
                <span className="font-mono text-[10px] tracking-[0.3em] text-ivory/85 uppercase">
                  450 / 900 ARPA · Hand Moulding
                </span>
              </div>
            </div>
          </Parallax>
        </div>

        {/* Beat D — machining & inspection, offset pair */}
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 py-24 sm:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
            <Reveal>
              <div className="overflow-hidden rounded-lg border border-ivory/10">
                <div className="relative h-[44vh] sm:h-[54vh] overflow-hidden">
                  <img
                    src={imgMachining1}
                    alt="Machining of ductile iron fittings"
                    className="absolute inset-0 w-full h-[114%] object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(7,26,47,0.6))' }} />
                  <div className="absolute bottom-5 left-5">
                    <span className="label-tech text-champagne">03 — Machining</span>
                    <p className="mt-2 font-display text-ivory text-xl">Precision after the pour.</p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12} className="md:mt-20">
              <div className="overflow-hidden rounded-lg border border-ivory/10">
                <div className="relative h-[44vh] sm:h-[54vh] overflow-hidden">
                  <img
                    src={imgInspection1}
                    alt="Inspection and testing of castings"
                    className="absolute inset-0 w-full h-[114%] object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(7,26,47,0.6))' }} />
                  <div className="absolute bottom-5 left-5">
                    <span className="label-tech text-champagne">04 — Inspection &amp; Testing</span>
                    <p className="mt-2 font-display text-ivory text-xl">UTM · BHN · Spectrometer · Hydro.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Beat E — plant archive viewer */}
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 pb-24 sm:pb-32">
          <Reveal amount={0.15}>
            <div className="flex flex-wrap items-end justify-between gap-5 mb-6">
              <div>
                <span className="label-tech text-champagne">05 — Plant Archive</span>
                <h3 className="font-display font-medium text-2xl sm:text-3xl text-ivory mt-3">
                  Plant &amp; Infrastructure Gallery
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full border border-ivory/20 text-ivory/70 hover:text-champagne hover:border-champagne/50 flex items-center justify-center transition-colors"
                  title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
                  aria-label={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" strokeWidth={1.6} /> : <Play className="w-3.5 h-3.5" strokeWidth={1.6} />}
                </button>
                <button
                  onClick={prevSlide}
                  className="w-9 h-9 rounded-full border border-ivory/20 text-ivory/70 hover:text-champagne hover:border-champagne/50 flex items-center justify-center transition-colors"
                  title="Previous photo"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-9 h-9 rounded-full border border-ivory/20 text-ivory/70 hover:text-champagne hover:border-champagne/50 flex items-center justify-center transition-colors"
                  title="Next photo"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div
              className="relative w-full h-[46vh] sm:h-[58vh] lg:h-[64vh] rounded-lg overflow-hidden bg-navy border border-ivory/12 shadow-[0_40px_90px_-45px_rgba(0,0,0,0.8)]"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={currentSlideIndex}
                  initial={{ opacity: 0, scale: reduce ? 1 : 1.07 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.55, ease: 'easeInOut' },
                    scale: { duration: 2.4, ease: [0.22, 1, 0.36, 1] },
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

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(7,26,47,0.3) 0%, transparent 28%, transparent 68%, rgba(7,26,47,0.5) 100%)',
                }}
              />

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

              {isPlaying && !isHovered && !reduce && (
                <div className="absolute bottom-0 inset-x-0 h-[2px] bg-ivory/15">
                  <motion.div
                    key={currentSlideIndex}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.4, ease: 'linear' }}
                    className="h-full bg-champagne"
                  />
                </div>
              )}

              <CornerFrame color="rgba(199,166,106,0.4)" inset={14} />
            </div>

            {/* Film strip */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {FACTORY_PHOTOS.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`relative shrink-0 w-20 sm:w-28 h-12 sm:h-14 rounded-md overflow-hidden border transition-all duration-300 ${
                    currentSlideIndex === idx
                      ? 'border-champagne opacity-100'
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
        </div>

        {/* Beat F — vision & mission */}
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 pb-24 sm:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ivory/10 border border-ivory/10 rounded-2xl overflow-hidden">
            <Reveal className="bg-navy">
              <div className="p-8 sm:p-12 h-full">
                <div className="flex items-center gap-4 mb-7">
                  <Target className="w-5 h-5 text-champagne" strokeWidth={1.5} />
                  <div className="h-px flex-1 bg-ivory/10" />
                  <span className="label-tech text-metallic">Global Excellence</span>
                </div>
                <h3 className="font-display font-medium text-2xl sm:text-3xl text-ivory mb-5">
                  Our Vision
                </h3>
                <p className="text-ivory/55 text-[15px] leading-[1.9]">
                  To be a global leader in the manufacturing of high-quality
                  ferrous metal castings, renowned for our innovation,
                  sustainability, and commitment to excellence, thereby
                  contributing to the advancement of the infrastructure and
                  industrial sectors worldwide.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="bg-navy-2">
              <div className="p-8 sm:p-12 h-full">
                <div className="flex items-center gap-4 mb-7">
                  <ShieldCheck className="w-5 h-5 text-champagne" strokeWidth={1.5} />
                  <div className="h-px flex-1 bg-ivory/10" />
                  <span className="label-tech text-metallic">Quality &amp; Durability</span>
                </div>
                <h3 className="font-display font-medium text-2xl sm:text-3xl text-ivory mb-5">
                  Our Mission
                </h3>
                <p className="text-ivory/55 text-[15px] leading-[1.9]">
                  To deliver superior products that exceed ISO standards through
                  advanced manufacturing and rigorous quality control. We invest
                  in cutting-edge technology to produce dependable fittings and
                  castings, ensuring dependable assets built for the long haul.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
