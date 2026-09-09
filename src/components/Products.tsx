import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  Circle,
  Nut,
  Disc,
  Compass,
  BoxSelect,
  Layers,
  FileDown,
  ChevronDown,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MercuryViewer from './3d/MercuryViewer';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

import SEMISB from '../assets/images/Minimalist Simple Business imvoice (1).png';
import ENDCAPIMAGE from '../assets/images/Minimalist Simple Business imvoice (1).png';
import CASTINGSIMAGE from '../assets/images/telegram-cloud-photo-size-5-6150184609011317423-w.jpg';
import MOULDINGFLOOR from '../assets/images/mouldingfloor.png';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
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

// Standardized specifications applied uniformly to all products
const UNIFIED_SPECS = {
  size: 'DN 80mm - DN 1000mm (3" to 40")',
  pnRating: 'PN 10 / PN 16 / PN 25 / PN 40',
  standard: 'IS 9523:2000 & ISO 2531 / BS EN 545',
  materialGrade: 'Ductile Iron',
  testPressure: 'AS PER STANDARD',
  coating:
    'Internal Cement Mortar / High-Build Epoxy; External Zinc + Bitumen',
};

/**
 * NOTE ON MODEL PATHS
 * These filenames match `public/glbmodel/` exactly, including case. Linux
 * hosting is case-sensitive, so the previously capitalised paths 404'd in
 * production even though they resolved locally.
 */
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
    modelUrl: '/glbmodel/dfred.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'duckfoot-bend',
    name: 'DUCKFOOT BEND',
    category: 'FLANGED BEND',
    icon: Compass,
    is3D: true,
    modelUrl: '/glbmodel/duckfb.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'all-socket-tee',
    name: 'ALL SOCKET TEE',
    category: 'SOCKET FITTING',
    icon: Nut,
    is3D: true,
    modelUrl: '/glbmodel/ast.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'all-flange-tee',
    name: 'ALL FLANGE TEE',
    category: 'FLANGED FITTING',
    icon: Circle,
    is3D: true,
    modelUrl: '/glbmodel/aft.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'air-valve-tee',
    name: 'AIR VALVE TEE',
    category: 'FLANGED FITTING',
    icon: Box,
    is3D: true,
    modelUrl: '/glbmodel/a_v.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'double-socket-bends',
    name: 'DOUBLE SOCKET BENDS',
    category: 'SOCKET BEND',
    icon: Nut,
    is3D: true,
    modelUrl: '/glbmodel/dsbend.glb',
    ...UNIFIED_SPECS,
    angles: ['90° Bend', '45° Bend', '22.5° Bend', '11.25° Bend'],
  },
  {
    id: 'double-socket-reducer',
    name: 'DOUBLE SOCKET REDUCER',
    category: 'SOCKET FITTING',
    icon: Disc,
    is3D: true,
    modelUrl: '/glbmodel/dsred.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'flange-socket',
    name: 'FLANGE SOCKET',
    category: 'FLANGED FITTING',
    icon: BoxSelect,
    is3D: true,
    modelUrl: '/glbmodel/fsocket.glb',
    ...UNIFIED_SPECS,
  },
  {
    id: 'flange-spigot',
    name: 'FLANGE SPIGOT',
    category: 'FLANGED FITTING',
    icon: Circle,
    is3D: true,
    modelUrl: '/glbmodel/fspigot.glb',
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
    // Was a remote Unsplash photo; now an actual Varaha castings image.
    imageUrl: CASTINGSIMAGE,
    ...UNIFIED_SPECS,
  },
];

const BROCHURE_HREF = '/assets/Varaha_Metaliks_Brochure.pdf';

function specRows(product: ProductItem) {
  return [
    { label: 'Size Range', value: product.size },
    { label: 'Pressure Class', value: product.pnRating },
    { label: 'Standard', value: product.standard },
    { label: 'Metallurgy', value: product.materialGrade },
    { label: 'Test Pressure', value: product.testPressure },
    { label: 'Coating', value: product.coating },
  ];
}

/* ==========================================================================
   PRODUCT STAGE
   ========================================================================== */

export default function Products() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAngle, setSelectedAngle] = useState<string>(
    ALL_PRODUCTS[0].angles?.[0] ?? ''
  );
  const [specsOpen, setSpecsOpen] = useState(false);

  const {
    isMobile,
    isTablet,
    prefersReducedMotion,
    width: viewportWidth,
  } = useDeviceProfile();

  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const railRefs = useRef<Array<HTMLButtonElement | null>>([]);

  /**
   * Mobile height lock.
   * Only 2 of the 16 products carry deflection angles, so switching away from
   * one unmounts the angle row and the whole section would shrink (~124px),
   * reflowing everything below. Rather than reserve a dead row for the other
   * 14 products, we remember the tallest composition seen at this width and
   * hold it as a min-height, so the section height never changes on switch.
   * Self-tuning (no magic numbers) and reset on width change / rotation.
   */
  const mobileStackRef = useRef<HTMLDivElement>(null);
  const [stackMinH, setStackMinH] = useState(0);

  // Reset the lock when the viewport width changes (rotation / resize).
  useEffect(() => {
    setStackMinH(0);
  }, [viewportWidth]);

  useEffect(() => {
    if (!isMobile || specsOpen) return; // only measure the collapsed baseline,
    const el = mobileStackRef.current; // so expanding specs never locks in a
    if (!el) return;                   // permanently taller section
    const h = el.scrollHeight;
    setStackMinH((prev) => (h > prev ? h : prev));
  }, [isMobile, activeIndex, specsOpen, selectedAngle, viewportWidth]);

  const active = ALL_PRODUCTS[activeIndex] ?? ALL_PRODUCTS[0];

  const selectProduct = useCallback((index: number) => {
    setActiveIndex(index);
    const next = ALL_PRODUCTS[index];
    setSelectedAngle(next?.angles?.[0] ?? '');
  }, []);

  /**
   * Keep the active entry inside its selector.
   * Both use container-local scrolling (never `scrollIntoView`), so the page
   * scroll position is untouched when the product changes.
   */
  useEffect(() => {
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    const list = listRef.current;
    const listItem = itemRefs.current[activeIndex];
    if (list && listItem) {
      const top =
        listItem.offsetTop - list.clientHeight / 2 + listItem.clientHeight / 2;
      list.scrollTo({ top: Math.max(0, top), behavior });
    }

    const rail = railRef.current;
    const railItem = railRefs.current[activeIndex];
    if (rail && railItem) {
      const left =
        railItem.offsetLeft - rail.clientWidth / 2 + railItem.clientWidth / 2;
      rail.scrollTo({ left: Math.max(0, left), behavior });
    }
  }, [activeIndex, prefersReducedMotion, isMobile]);

  const stage = (
    <ProductStage product={active} reduced={prefersReducedMotion} />
  );

  return (
    <section
      id="products"
      className="vm-grain relative w-full overflow-hidden bg-vm-void text-white"
    >
      {/* Foundry underlay — carries the bridge's tone into the stage. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <img
          src={MOULDINGFLOOR}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-[0.13]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_48%,rgba(212,165,72,0.10),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-vm-void via-vm-void/55 to-vm-void" />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* ---------------- Section header ---------------- */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-vm-amber/85 sm:text-[11px]">
              Product showcase
            </p>
            <h2 className="mt-3 text-2xl font-light leading-tight tracking-tight text-white sm:text-4xl">
              Ductile iron fittings &amp;{' '}
              <span className="font-editorial italic text-vm-amber">
                heavy castings
              </span>
            </h2>
          </div>

          <a
            href={BROCHURE_HREF}
            download="Varaha_Metaliks_Brochure.pdf"
            className="tap-target group inline-flex items-center gap-2.5 border-b border-white/15 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:border-vm-amber/60 hover:text-white sm:text-[11px]"
          >
            <FileDown className="h-3.5 w-3.5 shrink-0 text-vm-amber" />
            <span>Corporate brochure</span>
          </a>
        </div>

        {/* ==================================================================
            MOBILE COMPOSITION
            identity -> 3D product -> key specifications -> selector
            Deliberately a different composition, not a squeezed desktop grid.
           ================================================================== */}
        {isMobile ? (
          <div
            ref={mobileStackRef}
            className="flex flex-col gap-4"
            style={stackMinH ? { minHeight: stackMinH } : undefined}
          >
            <ProductIdentity product={active} compact />

            <div className="relative h-[48vh] min-h-[300px] overflow-hidden">
              <div
                className="vm-pedestal pointer-events-none absolute inset-x-[14%] bottom-[4%] h-[34%] bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,rgba(212,165,72,0.20),transparent_72%)]"
                aria-hidden="true"
              />
              <div className="relative h-full w-full">{stage}</div>
            </div>

            {active.angles && active.angles.length > 0 && (
              <AngleSelector
                angles={active.angles}
                selected={selectedAngle}
                onSelect={setSelectedAngle}
              />
            )}

            <MobileSpecs
              product={active}
              open={specsOpen}
              onToggle={() => setSpecsOpen((v) => !v)}
            />

            <MobileSelector
              activeIndex={activeIndex}
              onSelect={selectProduct}
              railRef={railRef}
              railRefs={railRefs}
            />

            <EnquireLink />
          </div>
        ) : (
          /* ==================================================================
             DESKTOP / TABLET COMPOSITION
             LEFT identity + specs | CENTER model | RIGHT product list
             The centre column is never overlaid by panel UI.
             ================================================================== */
          <div
            className={`grid gap-8 xl:gap-10 ${
              isTablet
                ? 'grid-cols-[minmax(0,1fr)_260px]'
                : 'grid-cols-[260px_minmax(0,1fr)_280px] xl:grid-cols-[280px_minmax(0,1fr)_300px]'
            }`}
            style={{
              // One contained shot: the stage plus this section's own header
              // and padding must fit the viewport, otherwise the foot of the
              // product index can never be reached.
              height: 'clamp(460px, calc(var(--app-vh) - 300px), 780px)',
            }}
          >
            {/* ---------------- LEFT ---------------- */}
            {!isTablet && (
              <aside className="thin-scrollbar flex h-full min-h-0 flex-col gap-1 overflow-y-auto pr-3">
                <Panel>
                  <ProductIdentity product={active} />
                </Panel>

                {active.angles && active.angles.length > 0 && (
                  <Panel>
                    <PanelLabel>Deflection angles</PanelLabel>
                    <AngleSelector
                      angles={active.angles}
                      selected={selectedAngle}
                      onSelect={setSelectedAngle}
                    />
                  </Panel>
                )}

                <Panel>
                  <PanelLabel>Technical specification</PanelLabel>
                  <SpecList product={active} />
                </Panel>

                <Panel>
                  <PanelLabel>Materials &amp; standards</PanelLabel>
                  <dl className="mt-3 space-y-2.5">
                    <MetaRow label="Grade" value={active.materialGrade} />
                    <MetaRow label="Conformance" value={active.standard} />
                    <MetaRow label="Protection" value={active.coating} />
                  </dl>
                </Panel>

                <EnquireLink />
              </aside>
            )}

            {/* ---------------- CENTER ---------------- */}
            <div className="relative flex h-full min-h-0 flex-col">
              {/* The product owns the frame. No card, no border — only a
                  breathing pedestal light beneath it. */}
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <div
                  className="vm-pedestal pointer-events-none absolute inset-x-[12%] bottom-[6%] h-[38%] bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,rgba(212,165,72,0.22),transparent_72%)]"
                  aria-hidden="true"
                />
                <div className="relative h-full w-full">{stage}</div>
              </div>

              {/* Wordmark sits beneath the model, never across it. */}
              <div className="shrink-0 pt-4 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: 0, y: -8, transition: { duration: 0.2 } }
                    }
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h3 className="truncate text-lg font-light tracking-[0.14em] text-white/85 xl:text-xl">
                      {active.name}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-vm-amber/70">
                      {active.category}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ---------------- RIGHT ---------------- */}
            <aside className="flex h-full min-h-0 flex-col overflow-hidden border-l border-white/[0.07] pl-4">
              <div className="flex shrink-0 items-baseline justify-between pb-3.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/45">
                  Product range
                </span>
                <span className="font-mono text-[10px] tracking-[0.18em] text-vm-amber/70">
                  {String(activeIndex + 1).padStart(2, '0')}/
                  {ALL_PRODUCTS.length}
                </span>
              </div>

              {/* Independently scrollable — this list scrolls, the page does not. */}
              <div
                ref={listRef}
                className="thin-scrollbar pan-y-only -mr-1 min-h-0 flex-1 overflow-y-auto pr-1"
              >
                {ALL_PRODUCTS.map((product, index) => (
                  <ListRow
                    key={product.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    product={product}
                    index={index}
                    isActive={index === activeIndex}
                    onSelect={() => selectProduct(index)}
                  />
                ))}
              </div>

              {isTablet && (
                <div className="shrink-0 pt-3">
                  <div className="vm-rule mb-3" aria-hidden="true" />
                  <EnquireLink />
                </div>
              )}
            </aside>
          </div>
        )}

        {/* Tablet keeps the specification block below the stage rather than
            crowding a third column into a narrow viewport. */}
        {isTablet && (
          <div className="mt-5 grid grid-cols-2 gap-4">
            <Panel>
              <ProductIdentity product={active} />
              {active.angles && active.angles.length > 0 && (
                <div className="mt-4">
                  <AngleSelector
                    angles={active.angles}
                    selected={selectedAngle}
                    onSelect={setSelectedAngle}
                  />
                </div>
              )}
            </Panel>
            <Panel>
              <PanelLabel>Technical specification</PanelLabel>
              <SpecList product={active} />
            </Panel>
          </div>
        )}
      </div>
    </section>
  );
}

/* ==========================================================================
   STAGE — 3D model, or photography for the non-modelled products
   ========================================================================== */

function ProductStage({
  product,
  reduced,
}: {
  product: ProductItem;
  reduced: boolean;
}) {
  if (product.is3D && product.modelUrl) {
    return (
      <MercuryViewer
        modelUrl={product.modelUrl}
        productName={product.name}
        className="h-full w-full"
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={product.id}
        initial={reduced ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full w-full items-center justify-center p-6"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
          referrerPolicy="no-referrer"
        />
      </motion.div>
    </AnimatePresence>
  );
}

/* ==========================================================================
   SHARED PIECES
   ========================================================================== */

function Panel({ children }: { children: React.ReactNode }) {
  // No card. A hairline technical rule opens each block and the scene's own
  // atmosphere stays visible behind the type.
  return (
    <div className="pt-5 first:pt-0">
      <div className="vm-rule mb-4" aria-hidden="true" />
      {children}
    </div>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
      {children}
    </span>
  );
}

function ProductIdentity({
  product,
  compact = false,
}: {
  product: ProductItem;
  compact?: boolean;
}) {
  const Icon = product.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 shrink-0 text-vm-amber" />
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-vm-amber/80">
            {product.category}
          </span>
        </div>

        <h3
          className={`mt-3 font-light leading-tight tracking-tight text-white ${
            compact ? 'text-xl' : 'text-2xl xl:text-[1.7rem]'
          }`}
        >
          {product.name}
        </h3>

        {!compact && (
          <p className="mt-3 text-xs leading-relaxed text-white/45">
            Cast, machined and coated in-house to {product.standard}, then
            hydrostatically proved before dispatch.
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function SpecList({ product }: { product: ProductItem }) {
  return (
    <dl className="mt-3 space-y-2.5">
      {specRows(product).map((row) => (
        <div
          key={row.label}
          className="flex items-start justify-between gap-3 border-b border-white/[0.06] pb-2.5 last:border-0 last:pb-0"
        >
          <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
            {row.label}
          </dt>
          <dd className="text-right text-[11px] leading-snug text-white/80">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
        {label}
      </dt>
      <dd className="text-right text-[11px] leading-snug text-white/70">
        {value}
      </dd>
    </div>
  );
}

function AngleSelector({
  angles,
  selected,
  onSelect,
}: {
  angles: string[];
  selected: string;
  onSelect: (angle: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {angles.map((angle) => (
        <button
          key={angle}
          onClick={() => onSelect(angle)}
          aria-pressed={selected === angle}
          className={`tap-target cursor-pointer border-b px-2 font-mono text-[11px] tracking-wide transition-colors ${
            selected === angle
              ? 'border-vm-amber text-vm-amber'
              : 'border-white/12 text-white/45 hover:border-white/35 hover:text-white/80'
          }`}
        >
          {angle}
        </button>
      ))}
    </div>
  );
}

function EnquireLink() {
  return (
    <a
      href="#contact"
      className="tap-target group flex items-center justify-between gap-3 border-b border-vm-amber/25 text-left transition-colors hover:border-vm-amber/70"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-vm-amber/85 transition-colors group-hover:text-vm-amber">
        Enquire about this product
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-vm-amber transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}

/* ==========================================================================
   DESKTOP RIGHT-HAND LIST ROW
   ========================================================================== */

interface ListRowProps {
  product: ProductItem;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}

function ListRow({ product, index, isActive, onSelect, ref }: ListRowProps) {
  const Icon = product.icon;

  return (
    <button
      ref={ref}
      onClick={onSelect}
      aria-current={isActive}
      className={`group relative flex w-full cursor-pointer items-center gap-3 border-l-2 py-3 pl-3 pr-2 text-left transition-colors duration-300 ${
        isActive
          ? 'border-vm-amber bg-white/[0.03]'
          : 'border-transparent hover:border-white/20 hover:bg-white/[0.02]'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center transition-colors ${
          isActive ? 'text-vm-amber' : 'text-white/35'
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block truncate text-[12px] font-medium tracking-wide transition-colors ${
            isActive ? 'text-white' : 'text-white/70 group-hover:text-white/90'
          }`}
        >
          {product.name}
        </span>
        <span className="mt-0.5 block truncate font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
          {String(index + 1).padStart(2, '0')} • {product.category}
        </span>
      </span>

      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
          isActive ? 'bg-vm-amber' : 'bg-transparent'
        }`}
        aria-hidden="true"
      />
    </button>
  );
}

/* ==========================================================================
   MOBILE PIECES
   ========================================================================== */

function MobileSpecs({
  product,
  open,
  onToggle,
}: {
  product: ProductItem;
  open: boolean;
  onToggle: () => void;
}) {
  const rows = specRows(product);
  const preview = rows.slice(0, 2);

  return (
    <div className="border-t border-white/[0.09]">
      {/* Always-visible key figures, so specs are never fully hidden. */}
      <dl className="grid grid-cols-2 gap-px bg-white/[0.07]">
        {preview.map((row) => (
          <div key={row.label} className="bg-vm-void/70 py-3.5 pr-3.5 pl-0 [&+&]:pl-3.5">
            <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
              {row.label}
            </dt>
            <dd className="mt-1.5 text-[11px] leading-snug text-white/85">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <button
        onClick={onToggle}
        aria-expanded={open}
        className="tap-target flex w-full cursor-pointer items-center justify-between gap-3 border-t border-white/[0.07] text-left"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
          {open ? 'Hide full specification' : 'Full specification'}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-vm-amber transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <dl className="space-y-3 border-t border-white/[0.07] py-4">
              {rows.map((row) => (
                <div key={row.label}>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-[12px] leading-snug text-white/80">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileSelector({
  activeIndex,
  onSelect,
  railRef,
  railRefs,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  railRef: React.RefObject<HTMLDivElement | null>;
  railRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between px-0.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/40">
          Product range
        </span>
        <span className="font-mono text-[10px] tracking-[0.18em] text-vm-amber/70">
          {String(activeIndex + 1).padStart(2, '0')}/{ALL_PRODUCTS.length}
        </span>
      </div>

      {/* Horizontal rail, single-axis touch: swiping it cannot steal the
          page's vertical scroll, and it cannot widen the document. */}
      <div
        ref={railRef}
        className="pan-x-only no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1"
      >
        {ALL_PRODUCTS.map((product, index) => {
          const isActive = index === activeIndex;
          const Icon = product.icon;

          return (
            <button
              key={product.id}
              ref={(el) => {
                railRefs.current[index] = el;
              }}
              onClick={() => onSelect(index)}
              aria-current={isActive}
              className={`flex w-[150px] shrink-0 cursor-pointer flex-col justify-between border-t-2 pr-3 pt-3 text-left transition-colors duration-300 ${
                isActive ? 'border-vm-amber' : 'border-white/12'
              }`}
              style={{ minHeight: 88 }}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? 'text-vm-amber' : 'text-white/40'
                }`}
              />
              <span>
                <span
                  className={`line-clamp-2 text-[11px] font-medium leading-snug ${
                    isActive ? 'text-white' : 'text-white/65'
                  }`}
                >
                  {product.name}
                </span>
                <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
                  {product.category}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
