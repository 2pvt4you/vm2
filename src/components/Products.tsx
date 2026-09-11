import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Circle,
  Nut,
  Disc,
  Compass,
  BoxSelect,
  Layers,
  ChevronLeft,
  ChevronRight,
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
import { motion, AnimatePresence } from 'motion/react';
import MercuryViewer from './3d/MercuryViewer';
import { Reveal, MaskLines, StaggerGroup, StaggerItem, TONE } from './ui/primitives';
import SEMISB from '../assets/images/Minimalist Simple Business imvoice (1).png';
import MOULDINGFLOOR from '../assets/images/optimized/mouldingfloor.webp';
import ENDCAPIMAGE from '../assets/images/Minimalist Simple Business imvoice (1).png';

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
  // 1. DOUBLE FLANGED BENDS 11.25°, 22.5°, 45°, 90°
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
  // 2. DOUBLE FLANGED REDUCER
  {
    id: 'double-flanged-reducer',
    name: 'DOUBLE FLANGED REDUCER',
    category: 'FLANGED FITTING',
    icon: Disc,
    is3D: true,
    modelUrl: '/glbmodel/DFRED.glb',
    ...UNIFIED_SPECS,
  },
  // 3. DUCKFOOT BEND
  {
    id: 'duckfoot-bend',
    name: 'DUCKFOOT BEND',
    category: 'FLANGED BEND',
    icon: Compass,
    is3D: true,
    modelUrl: '/glbmodel/DUCKFB.glb',
    ...UNIFIED_SPECS,
  },
  // 4. ALL SOCKET TEE
  {
    id: 'all-socket-tee',
    name: 'ALL SOCKET TEE',
    category: 'SOCKET FITTING',
    icon: Nut,
    is3D: true,
    modelUrl: '/glbmodel/AST.glb',
    ...UNIFIED_SPECS,
  },
  // 5. ALL FLANGE TEE
  {
    id: 'all-flange-tee',
    name: 'ALL FLANGE TEE',
    category: 'FLANGED FITTING',
    icon: Circle,
    is3D: true,
    modelUrl: '/glbmodel/AFT.glb',
    ...UNIFIED_SPECS,
  },
  // 6. AIR VALVE TEE
  {
    id: 'air-valve-tee',
    name: 'AIR VALVE TEE',
    category: 'FLANGED FITTING',
    icon: Box,
    is3D: true,
    modelUrl: '/glbmodel/A_V.glb',
    ...UNIFIED_SPECS,
  },
  // 7. DOUBLE SOCKET BENDS
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
  // 8. DOUBLE SOCKET REDUCER
  {
    id: 'double-socket-reducer',
    name: 'DOUBLE SOCKET REDUCER',
    category: 'SOCKET FITTING',
    icon: Disc,
    is3D: true,
    modelUrl: '/glbmodel/DSRED.glb',
    ...UNIFIED_SPECS,
  },
  // 9. FLANGE SOCKET
  {
    id: 'flange-socket',
    name: 'FLANGE SOCKET',
    category: 'FLANGED FITTING',
    icon: BoxSelect,
    is3D: true,
    modelUrl: '/glbmodel/FSOCKET.glb',
    ...UNIFIED_SPECS,
  },
  // 10. FLANGE SPIGOT
  {
    id: 'flange-spigot',
    name: 'FLANGE SPIGOT',
    category: 'FLANGED FITTING',
    icon: Circle,
    is3D: true,
    modelUrl: '/glbmodel/FSPIGOT.glb',
    ...UNIFIED_SPECS,
  },
  // 11. MECHANICAL JOINT COLLAR
  {
    id: 'mechanical-joint-collar',
    name: 'MECHANICAL JOINT COLLAR',
    category: 'COUPLINGS & COLLARS',
    icon: Layers,
    is3D: true,
    modelUrl: '/glbmodel/mjc.glb',
    ...UNIFIED_SPECS,
  },
  // 12. DISMANTLING JOINT
  {
    id: 'dismantling-joint',
    name: 'DISMANTLING JOINT',
    category: 'SPECIAL JOINTS',
    icon: Layers,
    is3D: true,
    modelUrl: '/glbmodel/DISJ.glb',
    ...UNIFIED_SPECS,
  },
  // 13. SEMICIRCULAR BENDS
  {
    id: 'semicircular-bends',
    name: 'SEMICIRCULAR BENDS',
    category: 'SPECIAL BENDS',
    icon: Compass,
    is3D: false,
    imageUrl: SEMISB,
    ...UNIFIED_SPECS,
  },
  // 14. END CAPS
  {
    id: 'end-caps',
    name: 'END CAPS',
    category: 'CLOSURES & CAPS',
    icon: Disc,
    is3D: false,
    imageUrl: ENDCAPIMAGE,
    ...UNIFIED_SPECS,
  },
  // 15. BELL MOUTH
  {
    id: 'bell-mouth',
    name: 'BELL MOUTH',
    category: 'INTAKE & OUTLET',
    icon: Circle,
    is3D: true,
    modelUrl: '/glbmodel/BELLM.glb',
    ...UNIFIED_SPECS,
  },
  // 16. MANHOLE COVER & SPECIAL CASTINGS
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

export default function Products() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [selectedAngle, setSelectedAngle] = useState<string>('90° Bend');

  const activeProduct = ALL_PRODUCTS[activeIndex] || ALL_PRODUCTS[0];

  const railScrollerRef = useRef<HTMLDivElement>(null);
  const railItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = railItemRefs.current[activeIndex];
    const container = railScrollerRef.current;
    if (el && container) {
      const left = el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2;
      container.scrollTo({ left, behavior: 'smooth' });
    }
  }, [activeIndex]);

  const handleSwitchProduct = (index: number) => {
    setActiveIndex(index);
    const p = ALL_PRODUCTS[index];
    if (p.angles && p.angles.length > 0) setSelectedAngle(p.angles[0]);
  };

  const scrollRail = (dir: number) => {
    railScrollerRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  };

  const ActiveIcon = activeProduct.icon;

  return (
    <section
      id="products"
      className="relative w-full text-ink overflow-hidden"
    >
      {/* ================================================================
          PRODUCT STAGE — bright industrial portal (emerges from flash)
          ================================================================ */}
      <div
        data-theme="light"
        className="relative w-full h-screen h-[100dvh] flex flex-col overflow-hidden select-none bg-ivory"
      >
        {/* Portal photograph */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${MOULDINGFLOOR})` }}
        />
        {/* Seating + legibility veils */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(244,241,234,0.72) 0%, rgba(244,241,234,0.10) 18%, rgba(244,241,234,0) 42%, rgba(244,241,234,0) 72%, rgba(37,40,42,0.10) 92%, rgba(37,40,42,0.28) 100%)',
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[42%] pointer-events-none hidden md:block"
          style={{
            background:
              'linear-gradient(90deg, rgba(244,241,234,0.55) 0%, rgba(244,241,234,0.12) 55%, transparent 100%)',
          }}
        />

        {/* ---- Compact product rail ---- */}
        <div className="relative z-30 pt-14 sm:pt-[72px]">
          <div className="relative px-2 sm:px-6">
            <button
              onClick={() => scrollRail(-1)}
              aria-label="Previous products"
              className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full border border-ink/15 bg-ivory/80 backdrop-blur text-ink/70 hover:text-copper hover:border-copper/50 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scrollRail(1)}
              aria-label="Next products"
              className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full border border-ink/15 bg-ivory/80 backdrop-blur text-ink/70 hover:text-copper hover:border-copper/50 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <div
              ref={railScrollerRef}
              className="no-scrollbar flex items-center gap-1.5 overflow-x-auto scroll-smooth px-9 sm:px-12 py-1"
            >
              {ALL_PRODUCTS.map((prod, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={prod.id}
                    ref={(el) => {
                      railItemRefs.current[idx] = el;
                    }}
                    onClick={() => handleSwitchProduct(idx)}
                    className={`group relative shrink-0 rounded-full px-3.5 sm:px-4 py-2 text-left transition-all duration-300 border ${
                      isActive
                        ? 'bg-graphite text-ivory border-graphite shadow-[0_10px_30px_-12px_rgba(21,23,26,0.7)]'
                        : 'bg-ivory/55 backdrop-blur-sm border-ink/10 text-ink/55 hover:text-ink hover:border-ink/25'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[9px] tracking-widest ${
                          isActive ? 'text-champagne' : 'text-steel'
                        }`}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-sans text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap">
                        {prod.name}
                      </span>
                    </span>
                    {isActive && (
                      <span className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-1 h-1 rotate-45 bg-copper" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---- Editorial product name plate (desktop, edge aligned) ---- */}
        <div className="absolute z-20 left-8 xl:left-14 top-1/2 -translate-y-1/2 w-[26%] min-w-[300px] max-w-[380px] pointer-events-none hidden xl:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <ActiveIcon className="w-3.5 h-3.5 text-copper" strokeWidth={1.5} />
                <span className="label-tech text-copper-deep">
                  {activeProduct.category}
                </span>
              </div>
              <h2 className="display-tight text-ink text-[clamp(1.7rem,2.7vw,2.7rem)]">
                {toTitleCase(activeProduct.name)}
              </h2>
              <span className="block h-px w-14 bg-copper mt-5 mb-5" />
              <dl>
                <dt className="label-tech text-steel mb-1">Size Range</dt>
                <dd className="font-sans text-sm text-ink/75 font-medium">
                  {activeProduct.size}
                </dd>
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ---- Mobile name plate ---- */}
        <div className="relative z-20 lg:hidden px-5 pt-3 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="label-tech text-copper-deep">
                {activeProduct.category}
              </span>
              <h2 className="font-display font-medium text-ink text-lg leading-tight mt-0.5 normal-case">
                {toTitleCase(activeProduct.name)}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ---- Main 3D viewport / image fallback ---- */}
        <div className="relative z-10 flex-1 min-h-0 pb-12 sm:pb-10">
          {activeProduct.is3D && activeProduct.modelUrl ? (
            <MercuryViewer
              modelUrl={activeProduct.modelUrl}
              productName={activeProduct.name}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center px-6 pb-6">
              <div className="relative max-w-md w-full h-[52vh] rounded-lg overflow-hidden bg-ivory/70 backdrop-blur-sm border border-ink/10 shadow-[0_30px_60px_-30px_rgba(21,23,26,0.45)] flex items-center justify-center">
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
        </div>

        {/* ---- Specifications trigger ---- */}
        <div className="absolute z-40 left-1/2 -translate-x-1/2 bottom-14 sm:bottom-[4.25rem] flex justify-center w-full px-4 pointer-events-none">
          {!isSpecsOpen && (
            <button
              onClick={() => setIsSpecsOpen(true)}
              className="pointer-events-auto group inline-flex items-center gap-2.5 rounded-full bg-ivory/90 backdrop-blur-md border border-ink/12 px-5 py-2.5 shadow-[0_14px_40px_-16px_rgba(21,23,26,0.5)] hover:border-copper/60 hover:bg-ivory transition-all duration-300"
              title="View Technical Specifications"
            >
              <SlidersHorizontal
                className="w-3.5 h-3.5 text-copper transition-transform duration-500 group-hover:rotate-90"
                strokeWidth={1.6}
              />
              <span className="label-tech text-ink/75 group-hover:text-ink">
                Click to view specifications
              </span>
              <ArrowDown className="w-3 h-3 text-steel group-hover:text-copper transition-colors" strokeWidth={1.6} />
            </button>
          )}
        </div>

        {/* ---- Specification sheet ---- */}
        <AnimatePresence>
          {isSpecsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 28 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute z-50 inset-x-2 bottom-14 sm:inset-x-auto sm:left-auto sm:right-6 sm:top-24 sm:bottom-24 sm:w-[400px] max-h-[72vh] sm:max-h-none overflow-y-auto no-scrollbar rounded-2xl bg-paper/97 backdrop-blur-xl border border-ink/10 shadow-[0_40px_90px_-30px_rgba(21,23,26,0.6)] p-5 sm:p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-ink/10">
                <div>
                  <span className="inline-block font-mono text-[9px] tracking-[0.24em] uppercase text-copper-deep bg-copper/8 px-2 py-1 rounded-sm mb-2">
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

              {/* Angle variants */}
              {activeProduct.angles && activeProduct.angles.length > 0 && (
                <div className="py-4 border-b border-ink/10">
                  <span className="label-tech text-steel block mb-2">
                    Deflection Angles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProduct.angles.map((angle) => (
                      <button
                        key={angle}
                        onClick={() => setSelectedAngle(angle)}
                        className={`px-3 py-1.5 rounded-full font-mono text-[11px] font-medium border transition-all ${
                          selectedAngle === angle
                            ? 'bg-graphite text-ivory border-graphite'
                            : 'bg-mineral text-ink/70 border-ink/8 hover:border-copper/50 hover:text-ink'
                        }`}
                      >
                        {angle}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical specification rows */}
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
                    <dt className="label-tech text-steel shrink-0 pt-0.5 w-[38%]">
                      {row.k}
                    </dt>
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

              {/* Footer actions */}
              <div className="pt-4 flex items-center justify-between">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 rounded-full bg-graphite hover:bg-graphite-2 text-ivory px-4 py-2 label-tech transition-colors"
                >
                  Inquire Now
                  <ArrowRight className="w-3.5 h-3.5 text-champagne" strokeWidth={1.6} />
                </a>
                <button
                  onClick={() => setIsSpecsOpen(false)}
                  className="label-tech text-steel hover:text-ink transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---- Brochure bar ---- */}
        <a
          href="/assets/Varaha_Metaliks_Brochure.pdf"
          download="Varaha_Metaliks_Brochure.pdf"
          className="group absolute left-0 right-0 bottom-0 z-40 h-11 sm:h-12 bg-graphite/96 backdrop-blur-md border-t border-champagne/18 flex items-center justify-center gap-2.5 hover:bg-graphite transition-colors"
        >
          <FileDown
            className="w-4 h-4 text-champagne transition-transform duration-500 group-hover:translate-y-0.5"
            strokeWidth={1.6}
          />
          <span className="label-tech text-ivory/85 group-hover:text-champagne transition-colors">
            Download Our Corporate Brochure
          </span>
        </a>
      </div>

      {/* ================================================================
          CAPABILITIES — graphite sheet rising over the bright stage
          ================================================================ */}
      <div
        data-theme="dark"
        className="relative z-10 bg-graphite text-ivory overflow-hidden"
      >
        {/* warm foundry atmosphere, extremely restrained */}
        <div
          className="pointer-events-none absolute -top-40 right-[-10%] w-[60vw] h-[60vw] rounded-full opacity-[0.10]"
          style={{
            background:
              'radial-gradient(circle, rgba(216,181,109,0.55), transparent 62%)',
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

          {/* Three pillars */}
          <StaggerGroup
            className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ivory/10 border border-ivory/10 rounded-2xl overflow-hidden mb-16 sm:mb-24"
          >
            {PILLARS.map((pillar, i) => (
              <StaggerItem key={pillar.title} className="bg-graphite">
                <div className="group h-full p-8 sm:p-10 transition-colors duration-500 hover:bg-graphite-2">
                  <div className="flex items-start justify-between mb-10">
                    <span className="w-10 h-10 rounded-full border border-copper/40 text-copper flex items-center justify-center">
                      <pillar.icon className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <span className="numeric-object text-ivory/15 text-4xl group-hover:text-champagne/30 transition-colors duration-500">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-medium text-ivory text-xl sm:text-[1.4rem] leading-snug mb-4">
                    {pillar.title}
                  </h3>
                  <p className="text-ivory/50 text-[13px] leading-[1.85]">
                    {pillar.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {/* Comprehensive categories */}
          <Reveal>
            <div className="rounded-2xl border border-ivory/12 bg-graphite-2/60 p-7 sm:p-10">
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
                  className="group inline-flex items-center gap-2 self-start md:self-auto rounded-full bg-copper hover:bg-copper-deep text-ivory px-6 py-3 label-tech transition-colors"
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
                    className="bg-graphite group hover:bg-graphite-2 transition-colors duration-500"
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
