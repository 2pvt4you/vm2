import { motion } from 'motion/react';

const metrics = [
  { value: '7,200', unit: 'METRIC TONS', label: 'Annual manufacturing capacity' },
  { value: '40+', unit: 'YEARS', label: 'Of expertise in ferrous metal, water, infra and other diverse sectors' },
  { value: '1.5 MT', unit: 'SINGLE-PIECE CASTING', label: 'Capability' },
  { value: '450 / 900', unit: 'ARPA', label: 'Machine moulding, alongside hand moulding facilities' },
];

export default function Capability() {
  return (
    <section id="capability" className="bg-vm-blue py-24 text-white sm:py-32 lg:py-36">
      <div className="section-shell">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div>
            <div className="section-kicker section-kicker-light">02 / Capability</div>
            <h2 className="mt-7 max-w-xl text-[clamp(2.8rem,6vw,6.6rem)] font-display font-bold leading-[0.88] tracking-[-0.07em]">Capability</h2>
          </div>
          <p className="max-w-sm border-l border-vm-gold pl-5 text-sm leading-6 text-white/65 sm:text-base">
            A robust annual manufacturing capacity, supported by advanced laboratory and testing facilities.
          </p>
        </div>

        <div className="mt-20 grid border-t border-white/20 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.value}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              className="border-b border-white/20 py-8 pr-6 sm:min-h-[220px] sm:border-r sm:px-6 sm:first:pl-0 lg:border-b-0 lg:py-10 lg:first:pl-0"
            >
              <div className="font-display text-[clamp(2.7rem,5vw,5.3rem)] font-bold leading-none tracking-[-0.08em] text-vm-gold">{metric.value}</div>
              <div className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">{metric.unit}</div>
              <p className="mt-4 max-w-[190px] text-sm leading-6 text-white/55">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
