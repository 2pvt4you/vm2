type TabId = 'home' | 'about' | 'products' | 'approvals' | 'clients' | 'contact';

interface FooterProps {
  setActiveTab?: (tab: TabId) => void;
}

export default function Footer(_props: FooterProps) {
  return (
    <footer
      data-theme="dark"
      className="relative z-20 -mt-5 rounded-t-[2rem] sm:rounded-t-[2.75rem] bg-graphite-2 text-ivory overflow-hidden"
    >
      {/* warm top edge */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-champagne/35 to-transparent" />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 w-[70vw] h-72 rounded-full opacity-[0.07]"
        style={{
          background:
            'radial-gradient(ellipse, rgba(216,181,109,0.8), transparent 65%)',
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-20 flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-2 h-2 rotate-45 bg-copper" />
          <h2 className="font-sans font-bold tracking-[0.24em] uppercase text-sm sm:text-base text-ivory">
            Varaha Metaliks Pvt. Ltd
          </h2>
          <span className="block w-2 h-2 rotate-45 bg-copper" />
        </div>

        <p className="label-tech text-champagne/80 mb-8">
          BIS Certified ISO 9001 Company
        </p>

        <span className="block w-16 h-px bg-ivory/15 mb-8" />

        <p className="text-ivory/40 text-xs tracking-wide">
          &copy; {new Date().getFullYear()} Varaha Metaliks Pvt. Ltd. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
