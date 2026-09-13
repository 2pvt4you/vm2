import { lazy, Suspense, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
const MercuryViewer = lazy(() => import('./3d/MercuryViewer'));

import socketImage from '../assets/images/finished-fitting-cutout.png';
import flangeImage from '../assets/images/Minimalist Simple Business imvoice (1).png';
import manholeImage from '../assets/images/telegram-cloud-photo-size-5-6221737969593728021-y-removebg-preview.png';
import castingsImage from '../assets/images/photo1714113109.jpg';

interface Product {
  name: string;
  kind: string;
  image: string;
  modelUrl?: string;
}

const products: Product[] = [
  { name: 'Socket Fitting', kind: 'Ductile Iron Pipe Fittings', image: socketImage, modelUrl: '/glbmodel/fsocket.glb' },
  { name: 'Flange fittings', kind: 'Ductile Iron Pipe Fittings', image: flangeImage, modelUrl: '/glbmodel/dfbend.glb' },
  { name: 'MJ collar', kind: 'Ductile Iron Pipe Fittings', image: socketImage, modelUrl: '/glbmodel/mjc.glb' },
  { name: 'DI Manhole Cover', kind: 'DI Manhole Covers', image: manholeImage },
  { name: 'Dismantling joint', kind: 'Ductile Iron Pipe Fittings', image: flangeImage, modelUrl: '/glbmodel/DISJ.glb' },
  { name: 'Engineering products', kind: 'Engineering Castings', image: castingsImage },
  { name: 'Special castings & much more', kind: 'Ferrous Alloy Castings', image: socketImage },
];

export default function Products() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = products[activeIndex];

  return (
    <section id="products" className="relative overflow-hidden bg-vm-paper py-24 sm:py-32 lg:py-40">
      <div className="section-shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <div className="section-kicker">06 / Products</div>
            <h2 className="mt-8 max-w-4xl text-[clamp(3.5rem,8vw,8.7rem)] font-display font-bold uppercase leading-[0.8] tracking-[-0.09em] text-vm-blue">Product<br /><span className="text-vm-gold">range.</span></h2>
          </div>
          <a href="/assets/Varaha_Metaliks_Brochure.pdf" download="Varaha_Metaliks_Brochure.pdf" className="inline-flex items-center gap-2 border-b border-vm-blue/30 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-vm-blue transition-colors hover:border-vm-gold hover:text-vm-gold">View brochure <ArrowUpRight className="h-4 w-4" /></a>
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-16">
          <nav aria-label="Product range" className="border-t-2 border-vm-blue">
            <div className="flex items-center justify-between py-5 font-mono text-[10px] uppercase tracking-[0.2em] text-vm-blue/50"><span>Product range</span><span>{String(activeIndex + 1).padStart(2, '0')} / {products.length}</span></div>
            <div>
              {products.map((product, index) => (
                <button key={product.name} type="button" onClick={() => setActiveIndex(index)} aria-current={activeIndex === index} className={`group flex w-full items-center justify-between border-t border-vm-blue/15 py-4 text-left transition-colors ${activeIndex === index ? 'text-vm-blue' : 'text-vm-blue/40 hover:text-vm-blue/80'}`}>
                  <span className="font-display text-lg font-semibold leading-tight tracking-[-0.03em] sm:text-xl">{product.name}</span>
                  <span className={`ml-3 h-2 w-2 shrink-0 rounded-full transition-colors ${activeIndex === index ? 'bg-vm-gold' : 'bg-vm-blue/15 group-hover:bg-vm-gold/60'}`} />
                </button>
              ))}
            </div>
          </nav>

          <div className="relative min-h-[430px] overflow-hidden bg-vm-mist sm:min-h-[560px]">
            <span className="pointer-events-none absolute -left-2 top-4 z-0 font-display text-[clamp(6rem,17vw,17rem)] font-bold uppercase leading-none tracking-[-0.1em] text-vm-blue/[0.055]">{active.name.split(' ')[0]}</span>
            <AnimatePresence mode="wait">
              <motion.div key={active.name} initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .5, ease: [.22, 1, .36, 1] }} className="relative z-10 flex h-full min-h-[430px] flex-col justify-between p-6 sm:min-h-[560px] sm:p-10">
                <div className="flex items-start justify-between"><span className="font-mono text-[10px] uppercase tracking-[0.22em] text-vm-blue/45">{active.kind}</span><span className="font-mono text-[10px] text-vm-gold">{String(activeIndex + 1).padStart(2, '0')}</span></div>
                <div className="relative flex min-h-[260px] flex-1 items-center justify-center py-8 sm:min-h-[360px] sm:py-4">{active.modelUrl ? <Suspense fallback={<img src={active.image} alt={active.name} className="max-h-[300px] max-w-[82%] object-contain mix-blend-multiply drop-shadow-[0_25px_28px_rgba(9,43,109,0.18)] sm:max-h-[380px]" />}><MercuryViewer modelUrl={active.modelUrl} productName={active.name} className="h-full w-full" /></Suspense> : <img src={active.image} alt={active.name} loading={activeIndex === 0 ? 'eager' : 'lazy'} className="max-h-[300px] max-w-[82%] object-contain mix-blend-multiply drop-shadow-[0_25px_28px_rgba(9,43,109,0.18)] sm:max-h-[380px]" />}</div>
                <div className="flex flex-wrap items-end justify-between gap-5 border-t border-vm-blue/15 pt-5"><h3 className="max-w-xl font-display text-[clamp(2rem,4vw,4.6rem)] font-bold uppercase leading-[0.85] tracking-[-0.07em] text-vm-blue">{active.name}</h3><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-vm-blue/45">Varaha Metaliks</span></div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
