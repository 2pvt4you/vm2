import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
  isAnimationFinished?: boolean;
}

export default function Navbar({ activeTab = 'home', setActiveTab, isAnimationFinished = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrolledPastProducts, setScrolledPastProducts] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about', id: 'about' as const },
    { name: 'Products', href: '#products', id: 'products' as const },
    { name: 'Approvals', href: '#approvals', id: 'approvals' as const },
    { name: 'Clients', href: '#clients', id: 'clients' as const },
    { name: 'Contact', href: '#contact', id: 'contact' as const },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
      const productsEl = document.getElementById('products');
      if (productsEl) {
        const rect = productsEl.getBoundingClientRect();
        // When the bottom of the products section is scrolled past top of viewport
        setScrolledPastProducts(rect.bottom <= 100);
      } else {
        setScrolledPastProducts(true);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When on standalone products tab, do not show the global navbar
  if (activeTab === 'products') {
    return null;
  }

  // Show navbar once hero cinematic sequence completes or on non-home tabs
  const showNavbar = activeTab !== 'home' ? true : (isAnimationFinished || scrolledPastProducts);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 pt-3 sm:pt-4 transition-all duration-700 ease-out transform ${
        showNavbar 
          ? 'translate-y-0 opacity-100 pointer-events-auto' 
          : '-translate-y-12 opacity-0 pointer-events-none'
      }`}
    >
      <nav
        className={`max-w-6xl mx-auto rounded-[50px] border transition-all duration-300 backdrop-blur-md ${
          scrolled
            ? 'bg-slate-50/90 border-blue-200/70 shadow-[0_12px_40px_-10px_rgba(30,64,175,0.22)]'
            : 'bg-slate-50/80 border-blue-100/80 shadow-[0_8px_28px_-8px_rgba(30,58,138,0.16)]'
        }`}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 px-5 sm:px-7">
          <a href="#" className="font-display text-lg sm:text-xl font-black tracking-tight uppercase text-blue-950 shrink-0">
            VARAHA <span className="text-blue-700">METALIKS</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveTab?.(link.id)}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-900 rounded-full hover:bg-blue-50/80 transition-all"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setActiveTab?.('contact')}
              className="ml-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg shadow-blue-900/20 hover:from-blue-600 hover:to-blue-800 transition-all"
            >
              Inquire Now
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-blue-900 hover:bg-blue-50 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden px-4 pb-4 pt-1 border-t border-blue-100/80">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setIsOpen(false);
                    setActiveTab?.(link.id);
                  }}
                  className="block px-4 py-2.5 text-base font-medium text-slate-700 hover:text-blue-900 hover:bg-blue-50 rounded-full transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => {
                  setIsOpen(false);
                  setActiveTab?.('contact');
                }}
                className="mt-2 text-center bg-gradient-to-r from-blue-700 to-blue-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-900/20"
              >
                Inquire Now
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
