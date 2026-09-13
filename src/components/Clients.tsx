import { motion } from 'motion/react';

const clients = [
  'MEGHA ENGINEERING & INFRASTRUCTURES LIMITED',
  "DIVI'S LABORATORIES LIMITED",
  'L&T',
  'POWER MECH',
  'VISHWANATH INFRA',
  'Vishnu Prakash R Punglia Ltd',
  'GVPR LTD',
  'GAJA ENGINEERING',
  'TRINITY CORPORATION',
];

export default function Clients() {
  return (
    <section id="clients" className="border-t border-vm-blue/10 bg-vm-mist py-24 sm:py-32 lg:py-36">
      <div className="section-shell">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <div className="section-kicker">09 / Clients</div>
            <h2 className="mt-8 max-w-3xl text-[clamp(3rem,6vw,6.2rem)] font-display font-bold uppercase leading-[0.84] tracking-[-0.08em] text-vm-blue">Client<br /><span className="text-vm-gold">list.</span></h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-vm-blue/60">A selection of clients already named on the Varaha Metaliks website.</p>
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8 }} className="mt-16 grid border-t border-vm-blue/20 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client, index) => (
            <div key={client} className="flex min-h-[112px] items-center gap-5 border-b border-vm-blue/20 py-7 sm:border-r sm:px-6 sm:first:pl-0 lg:min-h-[132px]">
              <span className="font-mono text-[10px] text-vm-gold">{String(index + 1).padStart(2, '0')}</span>
              <span className="max-w-[220px] font-display text-base font-semibold uppercase leading-tight tracking-[-0.02em] text-vm-blue sm:text-lg">{client}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
