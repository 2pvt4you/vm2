import { useEffect, useState } from 'react';
import factoryFrame from '../newframes/frames0/frame_0185.webp';

interface HeroVideoProps {
  onAnimationFinishedChange?: (finished: boolean) => void;
}

/**
 * The opening frame is deliberately quiet: one real factory plate, one idea,
 * and enough room around the headline for the plant to stay present.
 */
export default function HeroVideo({ onAnimationFinishedChange }: HeroVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    onAnimationFinishedChange?.(true);
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.65);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onAnimationFinishedChange]);

  return (
    <section
      id="home"
      className="hero-frame relative isolate min-h-[100svh] overflow-hidden bg-vm-void text-white"
      aria-label="40 years of expertise"
    >
      <img
        src={factoryFrame}
        alt="Varaha Metaliks manufacturing facility"
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1800ms] ease-out ${
          isLoaded ? 'scale-100' : 'scale-[1.04]'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#06152f]/90 via-[#06152f]/55 to-[#06152f]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#05070c]/80 via-transparent to-[#06152f]/20" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1500px] items-end px-5 pb-14 pt-32 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="max-w-[640px]">
          <div className="mb-7 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-vm-gold">
            <span className="h-px w-12 bg-vm-gold" aria-hidden="true" />
            <span>VARAHA METALIKS</span>
          </div>
          <h1 className="hero-title max-w-[680px] font-display font-extrabold uppercase leading-[0.84] tracking-[-0.075em] text-white">
            <span className="block">40 YEARS</span>
            <span className="block text-vm-gold">OF EXPERTISE</span>
          </h1>
          <div className="mt-8 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.26em] text-white/65">
            <span>REAL FACTORY</span>
            <span className="h-px w-16 bg-white/35" aria-hidden="true" />
            <span>01</span>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className={`absolute bottom-8 right-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/75 transition-opacity duration-500 sm:right-8 lg:right-12 ${scrolled ? 'opacity-0' : 'opacity-100'}`}
        aria-label="Scroll to company introduction"
      >
        <span className="hidden sm:inline">Explore the story</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 text-vm-gold">↓</span>
      </a>
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-1/3 bg-vm-gold" aria-hidden="true" />
    </section>
  );
}
