import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TONE } from './ui/primitives';

type TabId = 'home' | 'about' | 'products' | 'approvals' | 'clients' | 'contact';

interface NavbarProps {
  activeTab?: TabId | string;
  setActiveTab?: (tab: TabId) => void;
  isAnimationFinished?: boolean;
}

const NAV_LINKS: { name: string; href: string; id: TabId }[] = [
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Products', href: '#products', id: 'products' },
  { name: 'Approvals', href: '#approvals', id: 'approvals' },
  { name: 'Clients', href: '#clients', id: 'clients' },
  { name: 'Contact', href: '#contact', id: 'contact' },
];

export default function Navbar({
  activeTab = 'home',
  setActiveTab,
  isAnimationFinished = false,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeSection, setActiveSection] = useState<string>('');

  /* Scroll state + dominant theme (mirrored by SectionThemeSpy) */
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 24);
          ticking = false;
        });
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new MutationObserver(() => {
      const t = document.documentElement.dataset.uiTheme;
      setTheme(t === 'dark' ? 'dark' : 'light');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-ui-theme'],
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  /* Scroll-spy for active link */
  useEffect(() => {
    const sections = NAV_LINKS.map((l) =>
      document.getElementById(l.id)
    ).filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [activeTab, isAnimationFinished]);

  if (activeTab === 'products') return null;

  const showNavbar =
    activeTab !== 'home' ? true : isAnimationFinished;

  const dark = theme === 'dark';

  const goSection = (id: TabId) => {
    setIsOpen(false);
    if (activeTab === 'home') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    setActiveTab?.('home');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  };

  const goHome = () => {
    setIsOpen(false);
    if (activeTab !== 'home') {
      setActiveTab?.('home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const barClass = scrolled
    ? dark
      ? 'bg-graphite/75 backdrop-blur-xl border-b border-ivory/10'
      : 'bg-ivory/80 backdrop-blur-xl border-b border-ink/10'
    : dark
      ? 'bg-transparent border-b border-transparent'
      : 'bg-transparent border-b border-transparent';

  const linkColor = dark ? 'text-ivory/70 hover:text-ivory' : 'text-ink/65 hover:text-ink';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-700 ${barClass} ${
          showNavbar
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <nav className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-14 sm:h-[68px]">
            {/* Wordmark */}
            <button
              onClick={goHome}
              className="group flex items-center gap-2.5 shrink-0"
              aria-label="Varaha Metaliks — home"
            >
              <span
                className="block w-2 h-2 rotate-45 transition-transform duration-500 group-hover:rotate-[135deg]"
                style={{ background: TONE.copper }}
              />
              <span
                className="font-sans font-bold uppercase tracking-[0.22em] text-[12px] sm:text-[13px]"
                style={{ color: dark ? TONE.ivory : TONE.ink }}
              >
                Varaha <span style={{ color: TONE.copper }}>Metaliks</span>
              </span>
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {NAV_LINKS.map((link) => {
                const active = activeSection === link.id;
                return (
                  <button
                    key={link.name}
                    onClick={() => goSection(link.id)}
                    className={`label-tech relative pb-1 transition-colors duration-300 ${linkColor} ${
                      active ? '!text-current' : ''
                    }`}
                    style={
                      active
                        ? { color: dark ? TONE.champagne : TONE.copperDeep }
                        : undefined
                    }
                  >
                    {link.name}
                    <span
                      className="absolute left-0 -bottom-0 h-px transition-transform duration-500 ease-out"
                      style={{
                        width: '100%',
                        background: dark ? TONE.champagne : TONE.copper,
                        transform: active ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left',
                      }}
                    />
                  </button>
                );
              })}

              <button
                onClick={() => goSection('contact')}
                className="group inline-flex items-center gap-1.5 pl-4 pr-3 py-2 rounded-full border transition-all duration-300 label-tech"
                style={{
                  borderColor: dark ? 'rgba(216,181,109,0.45)' : 'rgba(185,106,58,0.45)',
                  color: dark ? TONE.champagne : TONE.copperDeep,
                }}
              >
                Inquire Now
                <ArrowUpRight
                  className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.6}
                />
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 -mr-2"
              aria-label="Open menu"
              style={{ color: dark ? TONE.ivory : TONE.ink }}
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen editorial menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[85] md:hidden bg-ivory flex flex-col"
          >
            <div className="flex items-center justify-between h-14 px-5">
              <span className="font-sans font-bold uppercase tracking-[0.22em] text-[12px] text-ink">
                Varaha <span style={{ color: TONE.copper }}>Metaliks</span>
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 -mr-2 flex items-center justify-center text-ink"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-7">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.22 + i * 0.07,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => goSection(link.id)}
                  className="group flex items-baseline justify-between border-b border-ink/10 py-4 text-left"
                >
                  <span className="display-tight text-4xl text-ink">
                    {link.name}
                  </span>
                  <span className="label-tech text-copper">0{i + 1}</span>
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => goSection('contact')}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-graphite text-ivory py-4 label-tech"
              >
                Inquire Now
                <ArrowUpRight className="w-4 h-4 text-champagne" strokeWidth={1.5} />
              </motion.button>
            </div>

            <div className="px-7 pb-8">
              <p className="label-tech text-steel">
                BIS Certified ISO 9001 Company
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
