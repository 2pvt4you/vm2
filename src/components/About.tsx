import React, { useState, useEffect, useRef } from 'react';
import { Factory, ShieldCheck, Target, Award, Play, Pause, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Factory & Facility Images uploaded by user
import imgFactoryShed from '../assets/images/photo_6221737969593728038_y.jpg';
import imgFoundry1 from '../assets/images/photo_6226479652143217474_y.jpg';
import imgFloor1 from '../assets/images/telegram-cloud-photo-size-5-6221737969593727894-y.jpg';
import imgFloor2 from '../assets/images/telegram-cloud-photo-size-5-6221737969593727908-y.jpg';
import imgInventory1 from '../assets/images/telegram-cloud-photo-size-5-6150184609011317423-w.jpg';
import imgInspection1 from '../assets/images/telegram-cloud-photo-size-5-6150184609011317442-w.jpg';
import imgMachining1 from '../assets/images/telegram-cloud-photo-size-5-6150184609011317444-w.jpg';
import imgYard1 from '../assets/images/photo1714113109.jpg';
import imgFoundry2 from '../assets/images/photo1714113133.jpg';
import imgTesting1 from '../assets/images/WhatsApp Image 2024-04-26 at 11.26.56 (1).jpg';

const FACTORY_PHOTOS: string[] = [
  imgFactoryShed,
  imgFoundry1,
  imgFloor1,
  imgFloor2,
  imgInventory1,
  imgInspection1,
  imgMachining1,
  imgYard1,
  imgFoundry2,
  imgTesting1
];

export default function About() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Auto-advance every 2 seconds with smooth transitions
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % FACTORY_PHOTOS.length);
    }, 2000); // 2-second transition interval

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered]);

  const goToSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % FACTORY_PHOTOS.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + FACTORY_PHOTOS.length) % FACTORY_PHOTOS.length);
  };

  return (
    <section id="about" className="py-20 sm:py-24 bg-white text-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= WHO WE ARE HEADER & KEY METRICS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Pioneering Heavy Foundry & Casting</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-950 mb-6 font-display tracking-tight">
              Engineering Reliability Across Global Water Infrastructure
            </h2>
            <div className="prose prose-lg text-slate-600 leading-relaxed space-y-4">
              <p>
                <strong>Varaha Metaliks Pvt. Ltd.</strong> stands as a premier manufacturer of premium quality <strong>Ductile Iron Pipe Fittings (as per IS 9523:2000)</strong>, Engineering Castings of various grades, and Ductile Iron Manhole Covers.
              </p>
              <p>
                Guided by the <strong>Mittal, Jhunjhunwala and Jaju families</strong>—distinguished industrial pioneers with over <strong>40+ years of expertise</strong> in the Ferrous Metal, Water Infrastructure, and Heavy Casting sectors.
              </p>
              <p>
                Operating with a robust annual capacity of <strong>7,200 Metric Tons</strong>, our manufacturing line integrates state-of-the-art machine moulding (450 & 900 ARPA) and hand moulding facilities capable of casting single workpieces up to <strong>1.5 MT</strong> with comprehensive UTM, BHN, spectrometer, and hydrostatic testing.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 grid grid-cols-2 gap-4"
          >
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-center shadow-xs">
                <Factory className="w-9 h-9 text-blue-700 mb-3" />
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 mb-1">7.2K</h3>
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Metric Tons Annual Capacity</p>
             </div>
             
             <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-center shadow-xs">
                <Award className="w-9 h-9 text-amber-600 mb-3" />
                <h3 className="font-display text-3xl sm:text-4xl font-bold text-slate-950 mb-1">40+</h3>
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider">Years Industrial Expertise</p>
             </div>

             <div className="bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl text-white col-span-2 shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl" />
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">BIS & ISO Certified</h3>
                    <p className="text-amber-400/90 font-mono text-xs">CM/L NO: 6300089907 • IS 9523:2000</p>
                  </div>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Fully licensed for municipal, state water board, and international water transmission supply networks.
                </p>
             </div>
          </motion.div>
        </div>

        {/* ================= PURE PHOTO SHOWCASE (NO NUMBERS, NO DATA, NO TEXT ON PHOTOS, SLIGHT SHADOW HIGHLIGHT) ================= */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
              Plant & Infrastructure Gallery
            </h3>

            {/* Minimalist Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                title={isPlaying ? 'Pause auto-play' : 'Resume auto-play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                <span className="hidden sm:inline">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={prevSlide}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Previous photo"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={nextSlide}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                title="Next photo"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clean Photo Frame with Slight Highlighting Shadow & No Text Overlay */}
          <div 
            className="w-full h-80 sm:h-[460px] lg:h-[560px] rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border border-slate-200/80 relative bg-slate-900"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Animated Photo Transition (2s pacing) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideIndex}
                initial={{ opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
              >
                <img 
                  src={FACTORY_PHOTOS[currentSlideIndex]} 
                  alt="Varaha Metaliks Manufacturing Facility" 
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>

            {/* Subtle Progress Bar */}
            {isPlaying && !isHovered && (
              <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-20">
                <motion.div
                  key={currentSlideIndex}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.0, ease: 'linear' }}
                  className="h-full bg-amber-500"
                />
              </div>
            )}
          </div>

          {/* Clean Interactive Thumbnail Row */}
          <div className="mt-4 flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
            {FACTORY_PHOTOS.map((src, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`relative shrink-0 w-20 sm:w-28 h-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shadow-sm ${
                  currentSlideIndex === idx
                    ? 'border-amber-500 scale-105 shadow-md ring-2 ring-amber-500/30'
                    : 'border-slate-200 opacity-60 hover:opacity-100'
                }`}
                aria-label={`View photo ${idx + 1}`}
              >
                <img 
                  src={src} 
                  alt="Factory Thumbnail" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {currentSlideIndex === idx && (
                  <div className="absolute inset-0 bg-amber-500/15" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ================= VISION & MISSION CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mr-4 shrink-0 shadow-xs">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-slate-950">Our Vision</h3>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">GLOBAL EXCELLENCE</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              To be a global leader in the manufacturing of high-quality ferrous metal castings, renowned for our innovation, sustainability, and commitment to excellence, thereby contributing to the advancement of the infrastructure and industrial sectors worldwide.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mr-4 shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-slate-950">Our Mission</h3>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">QUALITY & DURABILITY</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
              To deliver superior products that exceed ISO standards through advanced manufacturing and rigorous quality control. We invest in cutting-edge technology to produce dependable fittings and castings, ensuring dependable assets built for the long haul.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
