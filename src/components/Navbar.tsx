import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Process', href: '#manufacturing' },
  { name: 'Products', href: '#products' },
  { name: 'Approvals', href: '#approvals' },
  { name: 'Clients', href: '#clients' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5">
      <nav
        className={`mx-auto max-w-[1480px] border transition-all duration-500 ${
          scrolled
            ? 'border-vm-blue/15 bg-vm-paper/94 text-vm-blue shadow-[0_16px_50px_rgba(4,27,78,0.12)] backdrop-blur-xl'
            : 'border-white/20 bg-[#071b43]/55 text-white backdrop-blur-xl'
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <a href="#home" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-bold transition-colors ${scrolled ? 'border-vm-gold text-vm-gold' : 'border-vm-gold text-vm-gold'}`}>V</span>
            <span className="font-display text-[12px] font-bold tracking-[0.18em] uppercase sm:text-[13px]">
              VARAHA <span className="text-vm-gold">METALIKS</span>
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${scrolled ? 'text-vm-blue/65 hover:text-vm-blue' : 'text-white/70 hover:text-white'}`}
              >
                {link.name}
              </a>
            ))}
            <a href="#contact" className="ml-3 border border-vm-gold px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-vm-gold transition-colors hover:bg-vm-gold hover:text-vm-blue">
              Let's talk
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className={`border-t px-4 pb-4 pt-2 md:hidden ${scrolled ? 'border-vm-blue/10' : 'border-white/15'}`}>
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="tap-target flex items-center border-b border-current/10 text-[11px] font-semibold uppercase tracking-[0.2em]">
                  {link.name}
                </a>
              ))}
              <a href="#contact" onClick={() => setOpen(false)} className="tap-target mt-3 flex items-center justify-center border border-vm-gold text-[11px] font-semibold uppercase tracking-[0.2em] text-vm-gold">
                Let's talk
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
