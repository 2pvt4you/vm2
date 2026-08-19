import { Building2 } from 'lucide-react';
import { motion } from 'motion/react';

const clients = [
  "MEGHA ENGINEERING & INFRASTRUCTURES LIMITED",
  "DIVI'S LABORATORIES LIMITED",
  "L&T",
  "POWER MECH",
  "VISHWANATH INFRA",
  "Vishnu Prakash R Punglia Ltd",
  "GVPR LTD",
  "GAJA ENGINEERING",
  "TRINITY CORPORATION",
];

export default function Clients() {
  return (
    <section id="clients" className="py-24 bg-slate-50 text-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-blue-950">Our Esteemed Clients</h2>
          <p className="text-lg text-slate-600">
            Trusted by industry leaders and publicly listed companies for their critical infrastructure needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client, index) => (
            <motion.div
              key={client}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="p-8 rounded-2xl flex flex-col justify-center items-center text-center border transition-all bg-white/80 border-blue-100 shadow-[0_8px_28px_-10px_rgba(30,58,138,0.12)] hover:border-blue-300 hover:shadow-[0_12px_36px_-10px_rgba(30,64,175,0.18)]"
            >
              <Building2 className="w-10 h-10 mb-4 text-blue-700" />
              <h3 className="font-bold leading-snug text-xl text-blue-950">
                {client}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
