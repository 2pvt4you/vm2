import { DiamondMark } from './ui/primitives';

type TabId = 'home' | 'about' | 'products' | 'approvals' | 'clients' | 'contact';

interface FooterProps {
  setActiveTab?: (tab: TabId) => void;
}

const NAV = [
  { name: 'About', id: 'about' },
  { name: 'Products', id: 'products' },
  { name: 'Clients', id: 'clients' },
  { name: 'Approvals', id: 'approvals' },
  { name: 'Contact', id: 'contact' },
];

export default function Footer(_props: FooterProps) {
  const goSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      data-theme="dark"
      className="relative z-20 bg-navy-2 text-ivory overflow-hidden border-t border-ink/10"
    >
      {/* champagne hairline — continuity from contact */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-champagne/45 to-transparent" />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[70vw] h-72 rounded-full opacity-[0.07]"
        style={{
          background: 'radial-gradient(ellipse, rgba(199,166,106,0.8), transparent 65%)',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 pt-16 sm:pt-20 pb-10">
        {/* Oversized wordmark */}
        <div className="pb-12 sm:pb-16 border-b border-ivory/10">
          <h2 className="display-tight text-ivory/90 text-[clamp(2.6rem,7.4vw,7rem)] leading-none">
            Varaha{' '}
            <span className="font-display italic font-light text-champagne">Metaliks</span>
          </h2>
          <p className="mt-4 label-tech text-champagne/80">
            From Iron to Infrastructure.
          </p>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12 sm:py-16">
          <div>
            <span className="label-tech text-metallic block mb-5">Company</span>
            <p className="text-ivory/55 text-[13px] leading-[1.85] max-w-xs">
              Premier manufacturer of Ductile Iron Pipe Fittings, Engineering
              Castings and DI Manhole Covers — guided by the Mittal,
              Jhunjhunwala and Jaju families.
            </p>
          </div>

          <div>
            <span className="label-tech text-metallic block mb-5">Navigate</span>
            <ul className="space-y-3">
              {NAV.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => goSection(l.id)}
                    className="group inline-flex items-center gap-3 text-ivory/70 hover:text-ivory text-sm font-medium transition-colors"
                  >
                    <DiamondMark size={4} color="rgba(199,166,106,0.55)" />
                    <span className="link-draw">{l.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="label-tech text-metallic block mb-5">Contact</span>
            <ul className="space-y-3 text-ivory/60 text-[13px] leading-relaxed">
              <li>
                <a href="mailto:varahametaliks@gmail.com" className="hover:text-champagne transition-colors link-draw">
                  varahametaliks@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919849029993" className="hover:text-champagne transition-colors">
                  +91-9849029993
                </a>
              </li>
              <li>
                <a href="tel:+919248063222" className="hover:text-champagne transition-colors">
                  +91-9248063222
                </a>
              </li>
              <li className="pt-1 text-ivory/45">
                Basheerbagh, Hyderabad — 500029
                <br />
                Works: Mahabubnagar Dist., Telangana
              </li>
            </ul>
          </div>

          <div>
            <span className="label-tech text-metallic block mb-5">Standards</span>
            <ul className="space-y-3 font-mono text-[11px] tracking-[0.16em] uppercase text-ivory/55">
              <li>BIS · CM/L NO: 6300089907</li>
              <li>ISO 9001 Certified</li>
              <li>IS 9523:2000</li>
              <li>ISO 2531 · BS EN 545</li>
            </ul>
          </div>
        </div>

        {/* Base rule */}
        <div className="pt-8 border-t border-ivory/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="block w-2 h-2 rotate-45 bg-champagne" />
            <span className="font-sans font-bold tracking-[0.24em] uppercase text-[11px] text-ivory/80">
              Varaha Metaliks Pvt. Ltd
            </span>
          </div>
          <p className="text-ivory/40 text-xs tracking-wide text-center">
            &copy; {new Date().getFullYear()} Varaha Metaliks Pvt. Ltd. All rights reserved.
          </p>
          <span className="label-tech text-champagne/70">
            BIS Certified ISO 9001 Company
          </span>
        </div>
      </div>
    </footer>
  );
}
