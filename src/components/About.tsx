import { motion } from 'motion/react';
import factoryInterior from '../assets/images/photo_6226479652143217474_y.jpg';

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-vm-paper py-24 sm:py-32 lg:py-40">
      <div className="section-shell">
        <div className="section-kicker">01 / Company introduction</div>
        <div className="mt-10 grid items-start gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="max-w-3xl text-[clamp(2.2rem,5vw,5.35rem)] font-display font-bold leading-[0.94] tracking-[-0.06em] text-vm-blue">
              Ductile Iron Pipe Fittings, DI Manhole Covers, Ferrous Alloy Castings and Engineering Castings.
            </p>
            <div className="mt-10 max-w-xl border-l-2 border-vm-gold pl-5 text-base leading-7 text-vm-blue/70 sm:pl-7 sm:text-lg sm:leading-8">
              <p>
                Varaha Metaliks Pvt. Ltd. is into manufacturing of excellent quality of Ductile Iron Pipe Fittings (as per IS 9523:2000), Engineering Castings of various grades and Ductile Iron Manhole Covers.
              </p>
              <p className="mt-5">
                Our products are accepted in domestic projects and globally with all different varieties.
              </p>
            </div>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="image-frame aspect-[4/3]">
              <img src={factoryInterior} alt="Varaha Metaliks foundry floor" loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute bottom-4 left-4 bg-vm-paper/92 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-vm-blue">Inside the plant</span>
            </div>
            <figcaption className="mt-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-vm-blue/45">
              <span>Varaha Metaliks</span>
              <span>Foundry / 01</span>
            </figcaption>
          </motion.figure>
        </div>

        <div className="mt-20 grid gap-px border-y border-vm-blue/15 bg-vm-blue/15 sm:grid-cols-2 lg:grid-cols-4">
          {['Ductile Iron Pipe Fittings', 'DI Manhole Covers', 'Ferrous Alloy Castings', 'Engineering Castings'].map((item, index) => (
            <div key={item} className="bg-vm-paper py-6 pr-5 sm:py-8 sm:pr-8">
              <span className="font-mono text-[10px] text-vm-gold">0{index + 1}</span>
              <p className="mt-4 max-w-[190px] font-display text-lg font-semibold leading-tight text-vm-blue sm:text-xl">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
