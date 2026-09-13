import { motion } from 'motion/react';

export default function VisionMission() {
  return (
    <section className="bg-vm-paper py-24 sm:py-32 lg:py-40">
      <div className="section-shell">
        <div className="section-kicker">03 / Direction</div>
        <div className="mt-9 grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <h2 className="max-w-sm text-[clamp(3rem,7vw,7rem)] font-display font-bold uppercase leading-[0.82] tracking-[-0.08em] text-vm-blue">Our<br />vision<br /><span className="text-vm-gold">&amp;</span><br />mission</h2>
          <div className="grid gap-12 sm:grid-cols-2 sm:gap-10">
            <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.65 }} className="border-t-2 border-vm-blue pt-5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-vm-gold">Our vision</div>
              <p className="mt-7 text-xl leading-8 text-vm-blue sm:text-2xl sm:leading-9">To be a global leader in manufacturing high-quality ferrous metal castings, with emphasis on innovation, sustainability and excellence.</p>
            </motion.article>
            <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.65, delay: 0.1 }} className="border-t-2 border-vm-blue pt-5">
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-vm-gold">Our mission</div>
              <p className="mt-7 text-base leading-7 text-vm-blue/75 sm:text-lg sm:leading-8">To deliver superior products that exceed ISO standards through advanced manufacturing and rigorous quality control. We invest in cutting-edge technology and innovative practices to produce reliable ductile iron pipe fittings, manhole covers, and ferrous alloy castings. Our commitment to sustainability minimizes our environmental footprint and benefits the communities we serve. By leveraging our metallurgists&apos; expertise and fostering continuous learning, we maintain our competitive edge and build long-term customer relationships through tailored solutions and exceptional service.</p>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  );
}
