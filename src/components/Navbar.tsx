import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: any) => void;
  isAnimationFinished?: boolean;
}

/**
 * Navigation as part of the film.
 *
 * The old treatment was a full-width white application pill that sat on top of
 * the cinematic plate and competed with every section title. This version keeps
 * every link and handler identical but:
 *   - rides on dark glass so it belongs to the industrial environment
 *   - stays compact (48/56px) and narrow, so it never reads as a toolbar
 *   - thins out further once the visitor is deep in the film
 *   - closes the mobile sheet on scroll so it cannot cover product content
 */
export default function Navbar({
  activeTab = 'home',
  setActiveTab,
  isAnimationFinished = false,
}: NavbarProps) {
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

  // An open mobile sheet must never travel over product/section content.
  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [isOpen]);

  // When on standalone products tab, do not show the global navbar
  if (activeTab === 'products') {
    return null;
  }

  // Show navbar once hero cinematic sequence completes or on non-home tabs
  const showNavbar =
    activeTab !== 'home' ? true : isAnimationFinished || scrolledPastProducts;

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 px-3 pt-2.5 transition-all duration-700 ease-out sm:px-4 sm:pt-3.5 ${
        showNavbar
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-10 opacity-0'
      }`}
    >
      <nav
        className={`mx-auto max-w-5xl rounded-full border transition-all duration-500 ${
          scrolled ? 'vm-nav-dark' : 'vm-nav-clear'
        }`}
        style={{
          boxShadow: scrolled
            ? '0 18px 50px -22px rgba(0,0,0,0.85)'
            : '0 10px 34px -20px rgba(0,0,0,0.6)',
        }}
      >
        <div className="flex h-12 items-center justify-between px-4 sm:h-14 sm:px-6">
          <a
            href="#"
            className="font-display shrink-0 text-[13px] font-semibold tracking-[0.16em] text-white uppercase sm:text-sm"
          >
            VARAHA <span className="text-vm-amber">METALIKS</span>
          </a>

          <div className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveTab?.(link.id)}
                className="rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-white/60 uppercase transition-colors duration-300 hover:bg-white/[0.06] hover:text-white"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setActiveTab?.('contact')}
              className="border-vm-amber/40 text-vm-amber hover:bg-vm-amber/10 hover:border-vm-amber/70 ml-2 rounded-full border px-4 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-300"
            >
              Inquire
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white md:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-white/[0.08] px-3 pt-1 pb-3 md:hidden">
            <div className="flex flex-col gap-0.5 pt-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setIsOpen(false);
                    setActiveTab?.(link.id);
                  }}
                  className="tap-target flex items-center rounded-full px-4 font-mono text-[11px] tracking-[0.18em] text-white/70 uppercase transition-colors hover:bg-white/[0.06] hover:text-white"
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
                className="tap-target border-vm-amber/40 text-vm-amber mt-1.5 flex items-center justify-center rounded-full border font-mono text-[11px] tracking-[0.18em] uppercase"
              >
                Inquire
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
