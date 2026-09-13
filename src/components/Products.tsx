import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Circle,
  Nut,
  Disc,
  Compass,
  BoxSelect,
  Layers,
  FileDown,
  SlidersHorizontal,
  X,
  ArrowRight,
  ArrowDown,
  Sparkles,
  ShieldCheck,
  Cpu,
  Settings2,
  CheckCircle2,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import MercuryViewer from './3d/MercuryViewer';
import { Reveal, MaskLines, StaggerGroup, StaggerItem, DiamondMark, TONE } from './ui/primitives';
import SEMISB from '../assets/images/Minimalist Simple Business imvoice (1).png';
import MOULDINGFLOOR from '../assets/images/optimized/mouldingfloor.webp';
import ENDCAPIMAGE from '../assets/images/Minimalist Simple Business imvoice (1).png';

gsap.registerPlugin(ScrollTrigger);

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  icon: any;
  is3D: boolean;
  modelUrl?: string;
  imageUrl?: string;
  size: string;
  pnRating: string;
  standard: string;
  materialGrade: string;
  testPressure: string;
  coating: string;
  angles?: string[];
}

// Standardized specifications applied uniformly to all products as requested
const UNIFIED_SPECS = {
  size: 'DN 80mm - DN 1000mm (3" to 40")',
  pnRating: 'PN 10 / PN 16 / PN 25 / PN 40',
  standard: 'IS 9523:2000 & ISO 2531 / BS EN 545',
  materialGrade: 'Ductile Iron',
  testPressure: 'AS PER STANDARD',
  coating: 'Internal Cement Mortar / High-Build Epoxy; External Zinc + Bitumen',
};

export const ALL_PRODUCTS: ProductItem[] = [
  {
    id: 'double-flanged-bends',
    name: 'DOUBLE FLANGED BENDS',
    category: 'FLANGED BEND',
    icon: Compass,
    is3D: true,
    modelUrl: '/glbmodel/dfbend.glb',
    ...UNIFIED_SPECS,
    angles: ['90° Bend', '45° Bend', '22.5° Bend', '11.25° Bend'],
  },
  {
    id: 'double-flanged-reducer',
    name: 'DOUBLE FLANGED REDUCER',
    category: 'FLANGED FITTING',
    icon: Disc,
    is3D: true,
    modelUrl: '/glbmodel/DFRED.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'duckfoot-bend',
    name: 'DUCKFOOT BEND',
    category: 'FLANGED BEND',
    icon: Compass,
    is3D: true,
    modelUrl: '/glbmodel/DUCKFB.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'all-socket-tee',
    name: 'ALL SOCKET TEE',
    category: 'SOCKET FITTING',
    icon: Nut,
    is3D: true,
    modelUrl: '/glbmodel/AST.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'all-flange-tee',
    name: 'ALL FLANGE TEE',
    category: 'FLANGED FITTING',
    icon: Circle,
    is3D: true,
    modelUrl: '/glbmodel/AFT.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'air-valve-tee',
    name: 'AIR VALVE TEE',
    category: 'FLANGED FITTING',
    icon: Box,
    is3D: true,
    modelUrl: '/glbmodel/A_V.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'double-socket-bends',
    name: 'DOUBLE SOCKET BENDS',
    category: 'SOCKET BEND',
    icon: Nut,
    is3D: true,
    modelUrl: '/glbmodel/DSBEND.glb',
    ...UNIFIED_SPECS,
    angles: ['90° Bend', '45° Bend', '22.5° Bend', '11.25° Bend'],
  },
  {
    id: 'double-socket-reducer',
    name: 'DOUBLE SOCKET REDUCER',
    category: 'SOCKET FITTING',
    icon: Disc,
    is3D: true,
    modelUrl: '/glbmodel/DSRED.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'flange-socket',
    name: 'FLANGE SOCKET',
    category: 'FLANGED FITTING',
    icon: BoxSelect,
    is3D: true,
    modelUrl: '/glbmodel/FSOCKET.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'flange-spigot',
    name: 'FLANGE SPIGOT',
    category: 'FLANGED FITTING',
    icon: Circle,
    is3D: true,
    modelUrl: '/glbmodel/FSPIGOT.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'mechanical-joint-collar',
    name: 'MECHANICAL JOINT COLLAR',
    category: 'COUPLINGS & COLLARS',
    icon: Layers,
    is3D: true,
    modelUrl: '/glbmodel/mjc.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'dismantling-joint',
    name: 'DISMANTLING JOINT',
    category: 'SPECIAL JOINTS',
    icon: Layers,
    is3D: true,
    modelUrl: '/glbmodel/DISJ.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'semicircular-bends',
    name: 'SEMICIRCULAR BENDS',
    category: 'SPECIAL BENDS',
    icon: Compass,
    is3D: false,
    imageUrl: SEMISB,
    ...UNIFIED_SPECS,
  },
  {
    id: 'end-caps',
    name: 'END CAPS',
    category: 'CLOSURES & CAPS',
    icon: Disc,
    is3D: false,
    imageUrl: ENDCAPIMAGE,
    ...UNIFIED_SPECS,
  },
  {
    id: 'bell-mouth',
    name: 'BELL MOUTH',
    category: 'INTAKE & OUTLET',
    icon: Circle,
    is3D: true,
    modelUrl: '/glbmodel/BELLM.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'manhole-cover-special-castings',
    name: 'MANHOLE COVER & SPECIAL CASTINGS',
    category: 'CASTINGS & COVERS',
    icon: Layers,
    is3D: false,
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    ...UNIFIED_SPECS,
  },
];

const PILLARS = [
  {
    icon: Cpu,
    title: 'Technological Innovation',
    body: "At the forefront of the piping and casting industry, our company consistently integrates cutting-edge advancements and technologies into our products, ensuring they remain innovative and effective.",
  },
  {
    icon: Settings2,
    title: 'Tailored Customization',
    body: "We recognize that every project is unique. Our extensive customization options enable us to adapt our products to your project's exact specifications, ensuring seamless integration and optimal performance.",
  },
  {
    icon: ShieldCheck,
    title: 'Quality Assurance',
    body: "Quality is our hallmark. Every product, whether it's Ductile Iron Pipe Fittings or DI Manhole Covers, undergoes rigorous scrutiny, surpassing industry benchmarks for durability and performance.",
  },
];

const toTitleCase = (s: string) =>
  s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bMj\b/, 'MJ')
    .replace(/\bDi\b/, 'DI');

const CATEGORIES = [
  'Flange Fittings',
  'MJ Collar & Couplings',
  'DI Manhole Covers',
  'Dismantling Joints',
  'Engineering Products',
  'Special Castings & More',
];

/* ================================================================
   CatalogList — the product index as a premium technical catalogue.
   NUMBER · NAME · CATEGORY · ACTIVE INDICATOR · FINE DIVIDERS
   ================================================================ */
function CatalogList({
  activeIndex,
  onSelect,
  itemRefs,
  className = '',
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
  itemRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  className?: string;
}) {
  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b border-ink/15">
        <span className="label-tech text-copper-deep">Product Range</span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-ink/45 tabular-nums">
          {ALL_PRODUCTS.length} REF
        </span>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
        {ALL_PRODUCTS.map((p, idx) => {
          const active = idx === activeIndex;
          return (
            <button
              key={p.id}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onClick={() => onSelect(idx)}
              className={`group w-full flex items-center gap-3 py-3 border-b border-ink/8 text-left transition-colors duration-300 ${
                active ? 'bg-mineral/80' : 'hover:bg-mineral/50'
              }`}
              aria-pressed={active}
            >
              <span
                className={`font-mono text-[10px] tracking-[0.18em] tabular-nums shrink-0 w-6 ${
                  active ? 'text-copper-deep' : 'text-ink/40'
                }`}
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 min-w-0">
                <span
                  className={`block font-sans text-[11px] font-semibold uppercase tracking-[0.08em] truncate transition-colors ${
                    active ? 'text-ink' : 'text-ink/55 group-hover:text-ink/80'
                  }`}
                >
                  {toTitleCase(p.name)}
                </span>
                <span className="block font-mono text-[9px] tracking-[0.16em] text-ink/38 uppercase truncate">
                  {p.category}
                </span>
              </span>
              <DiamondMark
                size={5}
                color={active ? TONE.champagne : 'rgba(10,32,53,0.15)'}
                className="shrink-0 transition-transform duration-300 group-hover:scale-125"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Products() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [selectedAngle, setSelectedAngle] = useState<string>('90° Bend');
  const reduce = useReducedMotion();

  const activeProduct = ALL_PRODUCTS[activeIndex] || ALL_PRODUCTS[0];

  const trackRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const emberRef = useRef<HTMLDivElement>(null);
  const catalogItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileCatalogItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* Threshold: navy foundry dark → ivory portal opens, light falls. */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    if (reduce || !mq.matches) {
      if (portalRef.current) portalRef.current.style.clipPath = 'inset(0% 0% 0% 0%)';
      if (captionRef.current) captionRef.current.style.opacity = '0';
      if (emberRef.current) emberRef.current.style.opacity = '0';
      return;
    }
    const ctx = gsap.context(() => {
      const st = {
        trigger: trackRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.55,
      };
      gsap.fromTo(
        portalRef.current,
        { clipPath: 'inset(40% 42% round 26px)' },
        { clipPath: 'inset(0% 0% round 0px)', ease: 'none', scrollTrigger: { ...st, end: '58% bottom' } }
      );
      gsap.fromTo(
        captionRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '34% bottom' } }
      );
      gsap.fromTo(
        emberRef.current,
        { opacity: 1 },
        { opacity: 0, ease: 'none', scrollTrigger: { ...st, end: '46% bottom' } }
      );
    }, trackRef);
    return () => ctx.revert();
  }, [reduce]);

  useEffect(() => {
    const el = catalogItemRefs.current[activeIndex];
    el?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    const mel = mobileCatalogItemRefs.current[activeIndex];
    mel?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }, [activeIndex, reduce]);

  const handleSwitchProduct = (index: number) => {
    setActiveIndex(index);
    const p = ALL_PRODUCTS[index];
    if (p.angles && p.angles.length > 0) setSelectedAngle(p.angles[0]);
  };

  const ActiveIcon = activeProduct.icon;

  return (
    <section id="products" data-theme="light" className="relative w-full text-ink overflow-hidden">
      {/* ================================================================
          THRESHOLD + SHOWROOM STAGE
          ================================================================ */}
      <div ref={trackRef} className="relative md:h-[235vh]">
        <div className="md:sticky md:top-0 md:h-screen md:overflow-hidden">
          {/* Navy base — the foundry dark the portal opens from */}
          <div className="absolute inset-0 bg-navy">
            <div
              ref={emberRef}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(90% 70% at 50% 82%, rgba(199,166,106,0.28) 0%, rgba(199,166,106,0.1) 40%, transparent 72%), radial-gradient(60% 42% at 50% 96%, rgba(231,196,134,0.35) 0%, transparent 70%)',
              }}
            />
          </div>

          {/* Threshold caption — over the navy, burned away as light falls */}
          <div
            ref={captionRef}
            className="absolute inset-x-0 top-[16vh] z-20 px-[6vw] pointer-events-none hidden md:block"
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="h-px w-12 bg-champagne/80" />
              <span className="label-tech text-champagne">
                Scene 03 — From Casting to Finished Fitting
              </span>
            </div>
            <h2 className="display-tight text-ivory text-[clamp(2.2rem,5vw,4.6rem)]">
              Light falls{' '}
              <span className="font-display italic font-light text-champagne">on the object.</span>
            </h2>
          </div>

          {/* The ivory portal — architectural showroom */}
          <div
            ref={portalRef}
            className="relative md:absolute md:inset-0 z-10 bg-ivory will-transform"
            style={{ clipPath: 'inset(40% 42% round 26px)' }}
          >
            {/* faint architectural photograph, seated under ivory */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-[0.16]"
              style={{ backgroundImage: `url(${MOULDINGFLOOR})` }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(244,241,234,0.9) 0%, rgba(244,241,234,0.4) 22%, rgba(244,241,234,0.15) 50%, rgba(231,228,220,0.55) 88%, rgba(201,196,184,0.7) 100%)',
              }}
            />
            {/* survey grid — engineering catalogue underlay */}
            <div
              className="absolute inset-0 opacity-[0.35] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(10,32,53,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(10,32,53,0.05) 1px, transparent 1px)',
                backgroundSize: '56px 56px',
              }}
            />

            {/* ---------- STAGE ---------- */}
            <div className="relative h-full flex flex-col">
              {/* identity bar */}
              <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 h-14 sm:h-16 border-b border-ink/10 shrink-0">
                <div className="flex items-center gap-3">
                  <DiamondMark size={6} />
                  <span className="label-tech text-copper-deep">
                    Scene 04 — Product Showroom
                  </span>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-ink/50 tabular-nums hidden sm:block">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(ALL_PRODUCTS.length).padStart(2, '0')}
                  </span>
                  <a
                    href="/assets/Varaha_Metaliks_Brochure.pdf"
                    download="Varaha_Metaliks_Brochure.pdf"
                    className="group inline-flex items-center gap-2 label-tech text-copper-deep hover:text-ink transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5" strokeWidth={1.6} />
                    <span className="hidden sm:inline">Brochure</span>
                  </a>
                </div>
              </div>

              {/* mobile identity */}
              <div className="lg:hidden text-center pt-4 px-6 pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeProduct.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="label-tech text-copper-deep">{activeProduct.category}</span>
                    <h2 className="font-display font-medium text-ink text-xl leading-tight mt-1">
                      {toTitleCase(activeProduct.name)}
                    </h2>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* main area */}
              <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(280px,26%)_1fr_minmax(280px,24%)]">
                {/* LEFT — product information */}
                <div className="hidden lg:flex flex-col justify-center px-10 xl:px-14 border-r border-ink/10 min-h-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProduct.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <ActiveIcon className="w-3.5 h-3.5 text-copper-deep" strokeWidth={1.5} />
                        <span className="label-tech text-copper-deep">{activeProduct.category}</span>
                      </div>
                      <h2 className="display-tight text-ink text-[clamp(1.8rem,2.4vw,2.6rem)]">
                        {toTitleCase(activeProduct.name)}
                      </h2>
                      <span className="block h-px w-14 bg-copper mt-5 mb-6" />
                      <dl className="space-y-4">
                        <div>
                          <dt className="label-tech text-ink/45 mb-1">Size Range</dt>
                          <dd className="font-sans text-sm text-ink/80 font-medium">{activeProduct.size}</dd>
                        </div>
                        <div>
                          <dt className="label-tech text-ink/45 mb-1">Pressure Class</dt>
                          <dd className="font-sans text-sm text-copper-deep font-semibold">{activeProduct.pnRating}</dd>
                        </div>
                        <div>
                          <dt className="label-tech text-ink/45 mb-1">Standard</dt>
                          <dd className="font-sans text-sm text-ink/80 font-medium">{activeProduct.standard}</dd>
                        </div>
                      </dl>
                      <div className="mt-8 flex items-center gap-5">
                        <a
                          href="#contact"
                          className="group inline-flex items-center gap-2 rounded-full bg-navy hover:bg-steelnavy text-ivory px-5 py-2.5 label-tech transition-colors"
                        >
                          Inquire
                          <ArrowRight className="w-3.5 h-3.5 text-champagne transition-transform group-hover:translate-x-0.5" strokeWidth={1.6} />
                        </a>
                        <button
                          onClick={() => setIsSpecsOpen(true)}
                          className="label-tech text-ink/55 hover:text-ink link-draw transition-colors"
                        >
                          Full Specification
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* CENTER — the object */}
                <div className="relative min-h-0 h-[52vh] md:h-[48vh] lg:h-auto">
                  {activeProduct.is3D && activeProduct.modelUrl ? (
                    <MercuryViewer
                      modelUrl={activeProduct.modelUrl}
                      productName={activeProduct.name}
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center px-6 pb-6">
                      <div className="relative max-w-md w-full h-full max-h-[52vh] rounded-lg overflow-hidden bg-paper/70 backdrop-blur-sm border border-ink/10 shadow-[0_30px_60px_-30px_rgba(7,26,47,0.45)] flex items-center justify-center">
                        <img
                          src={activeProduct.imageUrl}
                          alt={activeProduct.name}
                          className="w-full h-full object-contain p-6"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 label-tech text-copper-deep bg-ivory/80 px-2 py-1 rounded-sm">
                          {activeProduct.category}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* specifications trigger */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 flex justify-center w-full px-4 pointer-events-none z-30">
                    {!isSpecsOpen && (
                      <button
                        onClick={() => setIsSpecsOpen(true)}
                        className="pointer-events-auto group inline-flex items-center gap-2.5 rounded-full bg-ivory/90 backdrop-blur-md border border-ink/12 px-5 py-2.5 shadow-[0_14px_40px_-16px_rgba(7,26,47,0.5)] hover:border-copper/60 hover:bg-ivory transition-all duration-300"
                        title="View Technical Specifications"
                      >
                        <SlidersHorizontal
                          className="w-3.5 h-3.5 text-copper-deep transition-transform duration-500 group-hover:rotate-90"
                          strokeWidth={1.6}
                        />
                        <span className="label-tech text-ink/75 group-hover:text-ink">
                          Specifications
                        </span>
                        <ArrowDown className="w-3 h-3 text-ink/40 group-hover:text-copper-deep transition-colors" strokeWidth={1.6} />
                      </button>
                    )}
                  </div>
                </div>

                {/* RIGHT — product range index */}
                <div className="hidden lg:block px-8 xl:px-10 py-6 border-l border-ink/10 min-h-0">
                  <CatalogList
                    activeIndex={activeIndex}
                    onSelect={handleSwitchProduct}
                    itemRefs={catalogItemRefs}
                    className="h-full"
                  />
                </div>
              </div>

              {/* mobile product range — after the object, per mobile composition */}
              <div className="lg:hidden border-t border-ink/10 px-5 h-[30vh] md:h-[26vh] overflow-hidden flex flex-col">
                <CatalogList
                  activeIndex={activeIndex}
                  onSelect={handleSwitchProduct}
                  itemRefs={mobileCatalogItemRefs}
                  className="h-full"
                />
              </div>

              {/* base bar */}
              <div className="hidden md:flex items-center justify-between px-8 lg:px-12 h-10 border-t border-ink/10 shrink-0">
                <span className="font-mono text-[9px] tracking-[0.24em] text-ink/40 uppercase">
                  Ductile Iron · Sand-Cast Finish · IS 9523:2000
                </span>
                <span className="font-mono text-[9px] tracking-[0.24em] text-ink/40 uppercase">
                  Varaha Metaliks — Showroom
                </span>
              </div>
            </div>
          </div>

          {/* ---------- Specification sheet ---------- */}
          <AnimatePresence>
            {isSpecsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 28 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="fixed md:absolute z-50 inset-x-2 bottom-3 md:inset-x-auto md:left-auto md:right-6 md:top-24 md:bottom-16 md:w-[400px] max-h-[76vh] md:max-h-none overflow-y-auto no-scrollbar rounded-2xl bg-paper/97 backdrop-blur-xl border border-ink/10 shadow-[0_40px_90px_-30px_rgba(7,26,47,0.6)] p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-ink/10">
                  <div>
                    <span className="inline-block font-mono text-[9px] tracking-[0.24em] uppercase text-copper-deep bg-copper/10 px-2 py-1 rounded-sm mb-2">
                      {activeProduct.category}
                    </span>
                    <h3 className="font-display font-medium text-ink text-xl leading-tight">
                      {activeProduct.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsSpecsOpen(false)}
                    className="shrink-0 w-8 h-8 rounded-full border border-ink/12 text-ink/60 hover:text-ink hover:border-ink/30 flex items-center justify-center transition-colors"
                    title="Close Specifications"
                    aria-label="Close specifications"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>

                {activeProduct.angles && activeProduct.angles.length > 0 && (
                  <div className="py-4 border-b border-ink/10">
                    <span className="label-tech text-ink/45 block mb-2">Deflection Angles:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProduct.angles.map((angle) => (
                        <button
                          key={angle}
                          onClick={() => setSelectedAngle(angle)}
                          className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-medium border transition-all ${
                            selectedAngle === angle
                              ? 'bg-navy text-ivory border-navy'
                              : 'bg-mineral text-ink/70 border-ink/8 hover:border-copper/50 hover:text-ink'
                          }`}
                        >
                          {angle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <dl className="py-3">
                  {[
                    { k: 'Size Range', v: activeProduct.size, accent: false },
                    { k: 'Pressure Class', v: activeProduct.pnRating, accent: true },
                    { k: 'Standard', v: activeProduct.standard, accent: false },
                    { k: 'Metallurgy', v: activeProduct.materialGrade, accent: false },
                    { k: 'Test Pressure', v: activeProduct.testPressure, accent: false },
                    { k: 'Coating', v: activeProduct.coating, accent: false },
                  ].map((row) => (
                    <div
                      key={row.k}
                      className="flex items-start justify-between gap-5 py-3 border-b border-ink/[0.07]"
                    >
                      <dt className="label-tech text-ink/45 shrink-0 pt-0.5 w-[38%]">{row.k}</dt>
                      <dd
                        className={`text-right text-xs font-medium leading-relaxed ${
                          row.accent ? 'text-copper-deep font-semibold' : 'text-ink/85'
                        }`}
                      >
                        {row.v}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="pt-4 flex items-center justify-between">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 rounded-full bg-navy hover:bg-steelnavy text-ivory px-4 py-2 label-tech transition-colors"
                  >
                    Inquire Now
                    <ArrowRight className="w-3.5 h-3.5 text-champagne" strokeWidth={1.6} />
                  </a>
                  <button
                    onClick={() => setIsSpecsOpen(false)}
                    className="label-tech text-ink/45 hover:text-ink transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ================================================================
          CAPABILITIES — navy sheet under the showroom
          ================================================================ */}
      <div data-theme="dark" className="relative z-10 bg-navy text-ivory overflow-hidden">
        <div
          className="pointer-events-none absolute -top-40 right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.10]"
          style={{
            background: 'radial-gradient(circle, rgba(199,166,106,0.55), transparent 62%)',
          }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-champagne/40 to-transparent" />

        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-16 sm:mb-24">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="kicker kicker--light">
                  <Sparkles className="w-3 h-3" strokeWidth={1.6} />
                  Full Spectrum Manufacturing
                </span>
              </Reveal>
              <MaskLines
                as="h2"
                className="display-tight text-ivory text-[clamp(2.1rem,4.6vw,4.2rem)] mt-6"
                lines={['Ductile Iron Pipe', 'Fittings & Heavy Castings']}
              />
            </div>
            <div className="lg:col-span-6 lg:col-start-7 flex items-end">
              <Reveal delay={0.15}>
                <p className="text-ivory/60 text-base leading-[1.85] max-w-xl">
                  Varaha Metaliks Pvt. Ltd. is into manufacturing of excellent
                  quality of Ductile Iron Pipe Fittings (as per IS 9523:2000),
                  Engineering Castings of various grades and Ductile Iron
                  Manhole Covers. Our products are accepted in domestic
                  projects and globally with all different varieties.
                </p>
              </Reveal>
            </div>
          </div>

          <StaggerGroup
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ivory/10 border border-ivory/10 rounded-2xl overflow-hidden mb-16 sm:mb-24"
          >
            {PILLARS.map((pillar, i) => (
              <StaggerItem key={pillar.title} className="bg-navy">
                <div className="group h-full p-8 sm:p-10 transition-colors duration-500 hover:bg-navy-2">
                  <div className="flex items-start justify-between mb-10">
                    <span className="w-10 h-10 rounded-full border border-champagne/40 text-champagne flex items-center justify-center">
                      <pillar.icon className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <span className="numeric-object text-ivory/15 text-4xl group-hover:text-champagne/30 transition-colors duration-500">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-medium text-ivory text-xl sm:text-[1.4rem] leading-snug mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-ivory/50 text-[13px] leading-[1.85]">{pillar.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <Reveal>
            <div className="rounded-2xl border border-ivory/12 bg-navy-2/60 p-7 sm:p-10">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-7 pb-8 mb-8 border-b border-ivory/10">
                <div className="max-w-xl">
                  <h3 className="font-display font-medium text-ivory text-2xl sm:text-3xl mb-3">
                    Comprehensive Product Categories
                  </h3>
                  <p className="text-ivory/45 text-sm leading-relaxed">
                    Manufactured and certified strictly according to IS
                    9523:2000, ISO 2531, and BS EN 545.
                  </p>
                </div>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 self-start md:self-auto rounded-full bg-champagne hover:bg-copper-deep text-navy hover:text-ivory px-6 py-3 label-tech transition-colors"
                >
                  Request Quotation
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.6}
                  />
                </a>
              </div>

              <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ivory/10 rounded-xl overflow-hidden border border-ivory/10">
                {CATEGORIES.map((item) => (
                  <StaggerItem
                    key={item}
                    className="bg-navy group hover:bg-navy-2 transition-colors duration-500"
                  >
                    <div className="flex items-center gap-3 px-5 py-4">
                      <CheckCircle2
                        className="w-4 h-4 text-champagne shrink-0"
                        strokeWidth={1.5}
                      />
                      <span className="text-ivory/75 group-hover:text-ivory text-xs font-semibold uppercase tracking-[0.08em] transition-colors">
                        {item}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
