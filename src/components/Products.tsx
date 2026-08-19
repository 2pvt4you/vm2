import React, { useState, useRef, useEffect } from 'react';
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
  Move3d,
  Sparkles,
  ShieldCheck,
  Cpu,
  Settings2,
  CheckCircle2
} from 'lucide-react';
import MercuryViewer from './3d/MercuryViewer';
import SEMISB from '../assets/images/Minimalist Simple Business imvoice (1).png';
import MOULDINGFLOOR from '../assets/images/mouldingfloor.jpg';
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
  coating: 'Internal Cement Mortar / High-Build Epoxy; External Zinc + Bitumen'
};

interface CategoryItem {
  id: string;
  name: string;
  category: string;
  icon: any;
  is3D: boolean;
  imageUrl: string;
}

export const ALL_PRODUCTS: ProductItem[] = [
  // 1. DOUBLE FLANGED BENDS 11.25°, 22.5°, 45°, 90° (glbmodel/dfbend.glb)
  {
    id: 'double-flanged-bends',
    name: 'DOUBLE FLANGED BENDS',
    category: 'FLANGED BEND',
    icon: Compass,
    is3D: true,
    modelUrl: '/glbmodel/dfbend.glb',
    ...UNIFIED_SPECS,
    angles: ['90° Bend', '45° Bend', '22.5° Bend', '11.25° Bend']
  },
  // 2. DOUBLE FLANGED REDUCER (glbmodel/DFRED.glb)
  {
    id: 'double-flanged-reducer',
    name: 'DOUBLE FLANGED REDUCER',
    category: 'FLANGED FITTING',
    icon: Disc,
    is3D: true,
    modelUrl: '/glbmodel/DFRED.glb',
    ...UNIFIED_SPECS
  },
  // 3. DUCKFOOT BEND (glbmodel/DUCKFB.glb)
  {
    id: 'duckfoot-bend',
    name: 'DUCKFOOT BEND',
    category: 'FLANGED BEND',
    icon: Compass,
    is3D: true,
    modelUrl: '/glbmodel/DUCKFB.glb',
    ...UNIFIED_SPECS
  },
  // 4. ALL SOCKET TEE (glbmodel/AST.glb)
  {
    id: 'all-socket-tee',
    name: 'ALL SOCKET TEE',
    category: 'SOCKET FITTING',
    icon: Nut,
    is3D: true,
    modelUrl: '/glbmodel/AST.glb',
    ...UNIFIED_SPECS
  },
  // 5. ALL FLANGE TEE (glbmodel/AFT.glb)
  {
    id: 'all-flange-tee',
    name: 'ALL FLANGE TEE',
    category: 'FLANGED FITTING',
    icon: Circle,
    is3D: true,
    modelUrl: '/glbmodel/AFT.glb',
    ...UNIFIED_SPECS
  },
  // 6. AIR VALVE TEE (glbmodel/A_V.glb)
  {
    id: 'air-valve-tee',
    name: 'AIR VALVE TEE',
    category: 'FLANGED FITTING',
    icon: Box,
    is3D: true,
    modelUrl: '/glbmodel/A_V.glb',
    ...UNIFIED_SPECS
  },
  // 7. DOUBLE SOCKET BENDS 11.25°, 22.5°, 45°, 90° (glbmodel/DSBEND.glb)
  {
    id: 'double-socket-bends',
    name: 'DOUBLE SOCKET BENDS',
    category: 'SOCKET BEND',
    icon: Nut,
    is3D: true,
    modelUrl: '/glbmodel/DSBEND.glb',
    ...UNIFIED_SPECS,
    angles: ['90° Bend', '45° Bend', '22.5° Bend', '11.25° Bend']
  },
  // 8. DOUBLE SOCKET REDUCER (glbmodel/DSRED.glb)
  {
    id: 'double-socket-reducer',
    name: 'DOUBLE SOCKET REDUCER',
    category: 'SOCKET FITTING',
    icon: Disc,
    is3D: true,
    modelUrl: '/glbmodel/DSRED.glb',
    ...UNIFIED_SPECS
  },
  // 9. FLANGE SOCKET (glbmodel/FSOCKET.glb)
  {
    id: 'flange-socket',
    name: 'FLANGE SOCKET',
    category: 'FLANGED FITTING',
    icon: BoxSelect,
    is3D: true,
    modelUrl: '/glbmodel/FSOCKET.glb',
    ...UNIFIED_SPECS
  },
  // 10. FLANGE SPIGOT (glbmodel/FSPIGOT.glb)
  {
    id: 'flange-spigot',
    name: 'FLANGE SPIGOT',
    category: 'FLANGED FITTING',
    icon: Circle,
    is3D: true,
    modelUrl: '/glbmodel/FSPIGOT.glb',
    ...UNIFIED_SPECS
  },
  // 11. MECHANICAL JOINT COLLAR
  {
    id: 'mechanical-joint-collar',
    name: 'MECHANICAL JOINT COLLAR',
    category: 'COUPLINGS & COLLARS',
    icon: Layers,
    is3D: true,
    modelUrl: '/glbmodel/mjc.glb',
    ...UNIFIED_SPECS
  },
  // 12. DISMANTLING JOINT
  {
    id: 'dismantling-joint',
    name: 'DISMANTLING JOINT',
    category: 'SPECIAL JOINTS',
    icon: Layers,
    is3D: true,
    modelUrl: '/glbmodel/DISJ.glb',
    ...UNIFIED_SPECS
  },
  // 13. SEMICIRCULAR BENDS
  {
    id: 'semicircular-bends',
    name: 'SEMICIRCULAR BENDS',
    category: 'SPECIAL BENDS',
    icon: Compass,
    is3D: false,
    imageUrl: SEMISB,
    ...UNIFIED_SPECS
  },
  // 14. END CAPS
  {
    id: 'end-caps',
    name: 'END CAPS',
    category: 'CLOSURES & CAPS',
    icon: Disc,
    is3D: false,
    imageUrl: ENDCAPIMAGE,
    ...UNIFIED_SPECS
  },
  // 15. BELL MOUTH
  {
    id: 'bell-mouth',
    name: 'BELL MOUTH',
    category: 'INTAKE & OUTLET',
    icon: Circle,
    is3D: true,
    modelUrl: '/glbmodel/BELLM.glb',
    ...UNIFIED_SPECS
  },
  // 16. MANHOLE COVER & SPECIAL CASTINGS
  {
    id: 'manhole-cover-special-castings',
    name: 'MANHOLE COVER & SPECIAL CASTINGS',
    category: 'CASTINGS & COVERS',
    icon: Layers,
    is3D: false,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    ...UNIFIED_SPECS
  }
  
];

export default function Products() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [selectedAngle, setSelectedAngle] = useState<string>('90° Bend');

  const activeProduct = ALL_PRODUCTS[activeIndex] || ALL_PRODUCTS[0];

  const upperNavScrollerRef = useRef<HTMLDivElement>(null);
  const navCardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Smooth scroll active product button into view
  useEffect(() => {
    const el = navCardRefs.current[activeIndex];
    if (el && upperNavScrollerRef.current) {
      const container = upperNavScrollerRef.current;
      const left = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left, behavior: 'smooth' });
    }
  }, [activeIndex]);

  const handleSwitchProduct = (index: number) => {
    setActiveIndex(index);
    if (ALL_PRODUCTS[index].angles && ALL_PRODUCTS[index].angles!.length > 0) {
      setSelectedAngle(ALL_PRODUCTS[index].angles![0]);
    }
  };

  const handleScrollNavLeft = () => {
    if (upperNavScrollerRef.current) {
      upperNavScrollerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const handleScrollNavRight = () => {
    if (upperNavScrollerRef.current) {
      upperNavScrollerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="products"
      className="relative w-full bg-white text-slate-900 overflow-hidden"
    >
      {/* ================= FULLSCREEN HERO PRODUCT STAGE (100dvh) ================= */}
      <div
        className="w-full h-screen h-[100dvh] max-h-[100dvh] flex flex-col justify-between overflow-hidden select-none relative bg-cover bg-center"
        style={{ backgroundImage: `url(${MOULDINGFLOOR})` }}
        >
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse 42% 55% at 50% 52%,
                rgba(255,255,255,0.08) 0%,
                rgba(255,255,255,0.025) 38%,
                rgba(0,0,0,0) 68%
              ),
              linear-gradient(
                180deg,
                rgba(5,10,16,0.16) 0%,
                rgba(5,10,16,0.02) 35%,
                rgba(5,10,16,0.18) 100%
              ),
              radial-gradient(
                ellipse at center,
                rgba(0,0,0,0) 42%,
                rgba(0,0,0,0.28) 100%
              )
            `,
          }}
        />

        {/* ================= REFINED UPPER HORIZONTAL CATALOGUE BAR ================= */}
        <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200 py-2.5 px-4 sm:px-8 relative shrink-0 z-30 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Move3d className="w-3.5 h-3.5 text-amber-600" />
                <span>3D PRODUCT CATALOGUE</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-700 truncate max-w-[200px] sm:max-w-xs">
                {activeProduct.name}
              </span>
              {activeProduct.is3D && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  3D VIEW READY
                </span>
              )}
            </div>

            {/* High-Contrast Carousel Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleScrollNavLeft}
                className="w-8 h-8 rounded-lg bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center cursor-pointer transition-all shadow-xs active:scale-95 border border-slate-800"
                title="Scroll Range Left"
                aria-label="Previous Products"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={handleScrollNavRight}
                className="w-8 h-8 rounded-lg bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 flex items-center justify-center cursor-pointer transition-all shadow-xs active:scale-95 border border-slate-800"
                title="Scroll Range Right"
                aria-label="Next Products"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Horizontal Product Range Scroller */}
          <div
            ref={upperNavScrollerRef}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5 scroll-smooth"
          >
            {ALL_PRODUCTS.map((prod, idx) => {
              const isActive = activeIndex === idx;
              const IconComp = prod.icon;
              return (
                <button
                  key={prod.id}
                  ref={(el) => {
                    navCardRefs.current[idx] = el;
                  }}
                  onClick={() => handleSwitchProduct(idx)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-left shrink-0 transition-all cursor-pointer min-w-[190px] sm:min-w-[220px] relative ${
                    isActive
                      ? 'bg-slate-950 border-amber-500 text-white shadow-md ring-1 ring-amber-500/50'
                      : 'bg-slate-50/90 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-xs font-bold truncate leading-tight ${
                        isActive ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {prod.name}
                    </div>
                    <div
                      className={`text-[9px] font-mono uppercase tracking-wider truncate mt-0.5 flex items-center gap-1.5 ${
                        isActive ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      <span>{prod.category}</span>
                      {prod.is3D && (
                        <span className={`px-1 py-0.2 rounded text-[8px] font-bold ${
                          isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-200 text-slate-700'
                        }`}>
                          3D
                        </span>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= MAIN HERO VIEWPORT (CLEAN, PROMINENT 3D HERO) ================= */}
        <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
          
          {/* Transparent 3D Stage or High-Res Image Fallback */}
          {activeProduct.is3D && activeProduct.modelUrl ? (
            <MercuryViewer
              modelUrl={activeProduct.modelUrl}
              productName={activeProduct.name}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
              <div className="relative max-w-lg w-full h-[55vh] rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                <img
                  src={activeProduct.imageUrl}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {activeProduct.category}
                  </span>
                  <h3 className="text-xl font-bold font-display">{activeProduct.name}</h3>
                </div>
              </div>
            </div>
          )}

          {/* ================= COMPACT SPECIFICATIONS TRIGGER & EXPANDABLE CARD ================= */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-6 z-20 pointer-events-auto">
            {isSpecsOpen ? (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-4 sm:p-5 text-slate-900 w-[calc(100vw-2rem)] max-w-sm sm:max-w-md animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-100">
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 px-1.5 py-0.5 rounded bg-slate-100">
                      {activeProduct.category}
                    </span>
                    <h2 className="text-lg sm:text-xl font-display font-black text-slate-950 tracking-tight leading-tight mt-1">
                      {activeProduct.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => setIsSpecsOpen(false)}
                    className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                    title="Close Specifications"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Angle Variant Buttons (if bends) */}
                {activeProduct.angles && activeProduct.angles.length > 0 && (
                  <div className="py-2 border-b border-slate-100">
                    <span className="text-[9px] font-mono uppercase font-bold text-slate-400 tracking-wider block mb-1">
                      Deflection Angles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProduct.angles.map((angle) => (
                        <button
                          key={angle}
                          onClick={() => setSelectedAngle(angle)}
                          className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all cursor-pointer ${
                            selectedAngle === angle
                              ? 'bg-blue-700 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {angle}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Standardized Technical Specs Grid */}
                <div className="grid grid-cols-2 gap-2 py-2.5 text-xs border-b border-slate-100">
                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Size Range
                    </span>
                    <span className="font-bold text-slate-900 text-[11px]">
                      {activeProduct.size}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Pressure Class
                    </span>
                    <span className="font-bold text-blue-700 text-[11px]">
                      {activeProduct.pnRating}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Standard
                    </span>
                    <span className="font-bold text-slate-800 text-[11px]">
                      {activeProduct.standard}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Metallurgy
                    </span>
                    <span className="font-bold text-slate-900 text-[11px]">
                      {activeProduct.materialGrade}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Test Pressure
                    </span>
                    <span className="font-bold text-slate-900 text-[11px]">
                      {activeProduct.testPressure}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Coating
                    </span>
                    <span className="font-medium text-slate-700 text-[10px] leading-tight block truncate" title={activeProduct.coating}>
                      {activeProduct.coating}
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2.5 flex items-center justify-between">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    <span>Inquire Now</span>
                    <ArrowRight className="w-3 h-3 text-amber-400" />
                  </a>

                  <button
                    onClick={() => setIsSpecsOpen(false)}
                    className="text-xs font-mono font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              /* Lightweight Minimalist Specifications Trigger Pill */
              <button
                onClick={() => setIsSpecsOpen(true)}
                className="bg-white/85 backdrop-blur-md hover:bg-white border border-slate-200/80 shadow-xs px-3 py-1.5 rounded-full flex items-center gap-2 cursor-pointer transition-all hover:scale-102 group text-slate-700 hover:text-slate-950"
                title="View Technical Specifications"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-600 transition-colors" />
                <span className="text-xs font-semibold tracking-tight">
                  Click to view specifications
                </span>
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-600">
                  ▾
                </span>
              </button>
            )}
          </div>

        </div>

        {/* ================= SLIM FULL-WIDTH BOTTOM BAR: DOWNLOAD CORPORATE BROCHURE ================= */}
        <a
          href="/assets/Varaha_Metaliks_Brochure.pdf"
          download="Varaha_Metaliks_Brochure.pdf"
          className="w-full bg-slate-950 hover:bg-slate-900 text-white h-12 sm:h-13 px-4 flex items-center justify-center gap-2.5 transition-colors cursor-pointer border-t border-slate-800 shrink-0 group z-30"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </div>
          <span className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase group-hover:text-amber-400 transition-colors truncate">
            DOWNLOAD OUR CORPORATE BROCHURE
          </span>
          <FileDown className="w-4 h-4 text-amber-400 group-hover:translate-y-0.5 transition-transform shrink-0" />
        </a>

      </div>

      {/* ================= COMPREHENSIVE PRODUCT & CASTING CAPABILITIES OVERVIEW ================= */}
      <div className="py-20 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Spectrum Manufacturing</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-white mb-4">
              Ductile Iron Pipe Fittings & Heavy Castings
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              Varaha Metaliks Pvt. Ltd. is into manufacturing of excellent quality of Ductile Iron Pipe Fittings (as per IS 9523:2000), Engineering Castings of various grades and Ductile Iron Manhole Covers. Our products are accepted in domestic projects and globally with all different varieties.
            </p>
          </div>

          {/* Three Key Pillar Statements matching reference brochure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Pillar 1: Innovation */}
            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-3">
                  Technological Innovation
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  At the forefront of the piping and casting industry, our company consistently integrates cutting-edge advancements and technologies into our products, ensuring they remain innovative and effective.
                </p>
              </div>
            </div>

            {/* Pillar 2: Customization */}
            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                  <Settings2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-3">
                  Tailored Customization
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  We recognize that every project is unique. Our extensive customization options enable us to adapt our products to your project's exact specifications, ensuring seamless integration and optimal performance.
                </p>
              </div>
            </div>

            {/* Pillar 3: Quality Assurance */}
            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-3">
                  Quality Assurance
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Quality is our hallmark. Every product, whether it's Ductile Iron Pipe Fittings or DI Manhole Covers, undergoes rigorous scrutiny, surpassing industry benchmarks for durability and performance.
                </p>
              </div>
            </div>

          </div>

          {/* Product Offerings Checklist Grid */}
          <div className="bg-slate-950 p-8 sm:p-10 rounded-3xl border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
              <div>
                <h3 className="text-2xl font-bold font-display text-white mb-2">
                  Comprehensive Product Categories
                </h3>
                <p className="text-slate-400 text-sm">
                  Manufactured and certified strictly according to IS 9523:2000, ISO 2531, and BS EN 545.
                </p>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all cursor-pointer self-start md:self-auto shadow-lg shadow-amber-500/20"
              >
                <span>Request Quotation</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-8 text-sm">
              {[
                'Flange Fittings',
                'MJ Collar & Couplings',
                'DI Manhole Covers',
                'Dismantling Joints',
                'Engineering Products',
                'Special Castings & More'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-200 font-medium text-xs truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
