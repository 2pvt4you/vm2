import { motion } from 'motion/react';

import patternShop from '../assets/images/photo1714113109 (1).jpg';
import sandPlant from '../assets/images/telegram-cloud-photo-size-5-6150184609011317444-w.jpg';
import sandFloor from '../assets/images/photo1714113109 (1).jpg';
import coldBox from '../assets/images/telegram-cloud-photo-size-5-6221737969593727894-y.jpg';
import furnace from '../assets/images/telegram-cloud-photo-size-5-6150184609011317423-w.jpg';
import wetLab from '../assets/images/telegram-cloud-photo-size-5-6221737969593727908-y.jpg';
import shotBlast from '../assets/images/photo1714113133.jpg';
import fettling from '../assets/images/telegram-cloud-photo-size-5-6150184609011317442-w.jpg';
import inspection from '../assets/images/photo_6221737969593728038_y.jpg';
import hydro from '../assets/images/WhatsApp Image 2024-04-26 at 11.26.56 (1).jpg';
import machining from '../assets/images/telegram-cloud-photo-size-5-6150184609011317444-w.jpg';
import factoryFloor from '../assets/images/mouldingfloor.png';

interface ProcessItem {
  number: string;
  title: string;
  image: string;
  description?: string;
  details?: string[];
  highlight?: boolean;
}

const processItems: ProcessItem[] = [
  {
    number: '01',
    title: 'Pattern Shop',
    image: patternShop,
    description: 'Fully equipped facility for resin, wooden and metallic patterns. Modern inspection and repair section. Dedicated repair section.',
  },
  {
    number: '02',
    title: 'Sand Plant',
    image: sandPlant,
    details: ['Two auto-charging mixers', 'One intensive mixer', '100 MT/hour sand, bentonite and coal dust capacity', 'Dust collecting equipment', 'Sand drying system', 'Magnetic separator', 'Water sprinklers'],
  },
  {
    number: '03',
    title: 'Sand Testing Arrangement',
    image: sandFloor,
    details: ['Sand Rammer with Base Block', 'Digital Universal Strength Testing Machine', 'Rapid Moisture Tester', 'Sieve Shaker', 'Compactability Tester', 'Clay Washer and Methylene Blue Clay Tester', 'Mould and Core Hardness Tester', 'Digital Moisture Tester', 'Permeability Meter'],
  },
  {
    number: '04',
    title: 'Cold Box Core System',
    image: coldBox,
    description: 'Automatic Cold Box Core Shooting Centre. Core shooters with 40L, 10L and 5L capacities. Mixture capacity of 4.2 MT/hour. Core boxes with 2 to 6 parts. Automatic core coating and drying plant.',
  },
  {
    number: '05',
    title: 'Induction Furnace',
    image: furnace,
    details: ['Three 2MT induction furnaces with five crucibles', 'Two 1MT induction furnaces with three crucibles'],
  },
  {
    number: '06',
    title: 'Wet Laboratory Equipment',
    image: wetLab,
    details: ['Strohlein apparatus', 'Muffle furnaces', 'Digital hot air oven', 'Digital pH meter', 'Digital single pan balance', 'Dry & wet bulb hygrometers', 'Distillation apparatus', 'Digital temperature / humidity / clock'],
  },
  {
    number: '07',
    title: 'Shot Blasting Facility',
    image: shotBlast,
    description: 'Continuous Hangar Type Shot Blasting Machine. 18 hooks/hour. Six impellers.',
  },
  {
    number: '08',
    title: 'Fettling',
    image: fettling,
    description: 'Edge treatment.',
  },
  {
    number: '09',
    title: 'Dimension Inspection',
    image: inspection,
    description: 'Rigid dimension checks. Go / No-Go gauges.',
  },
  {
    number: '10',
    title: 'Hydrostatic Testing',
    image: hydro,
    description: '100% hydrostatic testing for all types of fittings. Automated Hydro Testing Machines for testing various types of fittings.',
    highlight: true,
  },
  {
    number: '11',
    title: 'Machining Facility',
    image: machining,
    details: ['Lathes', 'Shaping', 'Planing machines', 'Radial drills', 'CNC machines', 'Multi-head drilling units', 'Horizontal balancing machine'],
  },
  {
    number: '12',
    title: 'Cement Lining',
    image: factoryFloor,
    description: 'Offered according to customer requirements. Spray water curing after application. Quality assurance, thickness checking and finishing.',
  },
  {
    number: '13',
    title: 'Painting',
    image: factoryFloor,
    details: ['Black Bitumen Coating', 'Paint Thickness Checking', 'Zinc coating according to customer specifications'],
  },
];

export function ManufacturingProcess() {
  return (
    <section id="manufacturing" className="bg-vm-mist py-24 sm:py-32 lg:py-40">
      <div className="section-shell">
        <div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="section-kicker">04 / Manufacturing process</div>
            <h2 className="mt-8 max-w-2xl text-[clamp(3.7rem,8vw,8.8rem)] font-display font-bold uppercase leading-[0.8] tracking-[-0.09em] text-vm-blue">Manufacturing<br /><span className="text-vm-gold">process.</span></h2>
          </div>
          <div className="max-w-xl border-l-2 border-vm-gold pl-6 text-base leading-7 text-vm-blue/65 sm:text-lg sm:leading-8">A visual journey through the actual facility — moulding, testing, melting, finishing and inspection.</div>
        </div>

        <div className="mt-16 grid items-stretch gap-5 border-y border-vm-blue/15 bg-white md:grid-cols-[0.95fr_1.05fr]">
          <div className="min-h-[280px] overflow-hidden md:min-h-[360px]"><img src={sandFloor} alt="Laboratory and testing arrangement" loading="lazy" className="h-full w-full object-cover" /></div>
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <div className="section-kicker">Laboratory / testing</div>
            <h3 className="mt-7 max-w-xl text-[clamp(2.5rem,5vw,5.5rem)] font-display font-bold uppercase leading-[0.84] tracking-[-0.08em] text-vm-blue">Laboratory<br /><span className="text-vm-gold">&amp; testing.</span></h3>
            <p className="mt-6 max-w-lg text-sm leading-6 text-vm-blue/65 sm:text-base">Sand testing arrangement and wet laboratory equipment support the manufacturing process.</p>
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {processItems.map((item, index) => <ProcessCard key={item.number} item={item} index={index} />)}
        </div>
      </div>
    </section>
  );
}

function ProcessCard({ item, index }: { item: ProcessItem; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.55, delay: Math.min(index % 3, 2) * 0.06 }}
      className={`process-card ${item.highlight ? 'process-card--dark md:col-span-2 xl:col-span-2' : ''}`}
    >
      <div className={`${item.highlight ? 'grid md:grid-cols-[1.15fr_0.85fr]' : ''}`}>
        <div className={`${item.highlight ? 'aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]'} overflow-hidden`}>
          <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
        </div>
        <div className={`p-6 sm:p-8 ${item.highlight ? 'flex flex-col justify-center md:p-10' : ''}`}>
          <div className={`flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] ${item.highlight ? 'text-vm-gold' : 'text-vm-gold'}`}>
            <span>{item.number}</span>
            {item.highlight && <span>Quality check</span>}
          </div>
          <h3 className={`mt-7 max-w-sm font-display text-2xl font-bold uppercase leading-[0.9] tracking-[-0.05em] sm:text-3xl ${item.highlight ? 'text-white sm:text-5xl' : 'text-vm-blue'}`}>{item.highlight ? <>100%<br />Hydrostatic<br />Testing</> : item.title}</h3>
          {item.description && <p className={`mt-6 max-w-xl text-sm leading-6 ${item.highlight ? 'text-white/70 sm:text-base' : 'text-vm-blue/65'}`}>{item.description}</p>}
          {item.details && <ul className={`mt-6 grid gap-x-4 gap-y-2 text-[12px] leading-5 ${item.details.length > 4 ? 'sm:grid-cols-2' : ''} ${item.highlight ? 'text-white/70' : 'text-vm-blue/65'}`}>
            {item.details.map((detail) => <li key={detail} className="flex gap-2"><span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-vm-gold" />{detail}</li>)}
          </ul>}
        </div>
      </div>
    </motion.article>
  );
}

export function QualityAssurance() {
  return (
    <section className="relative overflow-hidden bg-vm-blue py-20 text-white sm:py-28">
      <div className="absolute inset-0 opacity-25"><img src={factoryFloor} alt="" className="h-full w-full object-cover" /></div>
      <div className="absolute inset-0 bg-vm-blue/85" />
      <div className="section-shell relative grid items-center gap-12 lg:grid-cols-[1fr_auto]">
        <div>
          <div className="section-kicker section-kicker-light">05 / Quality assurance</div>
          <h2 className="mt-8 max-w-4xl text-[clamp(3rem,7vw,7rem)] font-display font-bold uppercase leading-[0.82] tracking-[-0.08em]">Manufacturing<br /><span className="text-vm-gold">to confidence.</span></h2>
        </div>
        <p className="max-w-sm border-l border-vm-gold pl-5 text-base leading-7 text-white/70">Products undergo rigorous scrutiny and quality checks as they move from manufacturing and testing to finished products.</p>
      </div>
    </section>
  );
}
