import { Check } from 'lucide-react';
import { motion } from 'motion/react';

const states = [
  'Telangana',
  'Andhra Pradesh',
  'Tamil Nadu',
  'Karnataka',
  'Maharashtra',
  'Madhya Pradesh',
  'Uttar Pradesh',
  'Chattisgarh',
  'West Bengal',
  'Gujarat',
  'Odisha',
];

export default function Approvals() {
  return (
    <section id="approvals" className="bg-vm-paper py-24 sm:py-32 lg:py-36">
      <div className="section-shell">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <div className="section-kicker">08 / Water board approvals</div>
            <h2 className="mt-8 max-w-lg text-[clamp(3rem,6vw,6.4rem)] font-display font-bold uppercase leading-[0.84] tracking-[-0.08em] text-vm-blue">Water board<br /><span className="text-vm-gold">approvals.</span></h2>
            <p className="mt-8 max-w-md border-l-2 border-vm-gold pl-5 text-base leading-7 text-vm-blue/65 sm:text-lg sm:leading-8">Our products meet the highest regional standards and have been rigorously tested and approved by state water boards across 11 states in India.</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} className="border-t-2 border-vm-blue">
            <div className="flex items-end justify-between border-b border-vm-blue/15 py-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-vm-blue/55">States listed on the website</span>
              <span className="font-display text-4xl font-bold tracking-[-0.08em] text-vm-blue">11</span>
            </div>
            <div className="grid sm:grid-cols-2">
              {states.map((state, index) => (
                <div key={state} className="flex items-center gap-3 border-b border-vm-blue/15 py-4 text-sm font-semibold text-vm-blue sm:mr-6">
                  <span className="font-mono text-[10px] text-vm-gold">{String(index + 1).padStart(2, '0')}</span>
                  <Check className="h-4 w-4 text-vm-gold" aria-hidden="true" />
                  {state}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
