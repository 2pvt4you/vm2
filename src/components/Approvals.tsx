import { MapPin, CheckCircle2 } from 'lucide-react';
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
  'Odisha'
];

export default function Approvals() {
  return (
    <section id="approvals" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Water Board Approvals</h2>
            <p className="text-lg text-gray-600 mb-10">
              Our products meet the highest regional standards and have been rigorously tested and approved by state water boards across 11 states in India.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {states.map((state) => (
                <div key={state} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="font-semibold text-gray-800">{state}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] lg:h-[600px] bg-blue-50 rounded-[3rem] flex items-center justify-center border-8 border-white shadow-xl shadow-blue-900/5"
          >
             <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                <MapPin className="w-96 h-96 text-blue-900" />
             </div>
             <div className="relative z-10 text-center bg-white/60 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-sm">
                <h3 className="text-8xl font-black text-blue-900 mb-2">11</h3>
                <p className="text-xl font-bold text-blue-800 tracking-widest uppercase">Approved States</p>
                <div className="w-12 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
