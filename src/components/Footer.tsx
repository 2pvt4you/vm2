export default function Footer() {
  return (
    <footer className="bg-vm-blue px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1480px] flex-col justify-between gap-6 border-t border-white/20 pt-6 sm:flex-row sm:items-end">
        <div>
          <div className="font-display text-sm font-bold tracking-[0.18em]">VARAHA <span className="text-vm-gold">METALIKS</span></div>
          <div className="mt-3 font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">BIS CERTIFIED ISO 9001 COMPANY · IS 9523:2000 · CM/L NO 6300089907</div>
        </div>
        <div className="text-left font-mono text-[10px] uppercase tracking-[0.16em] text-white/45 sm:text-right">© {new Date().getFullYear()} Varaha Metaliks Pvt. Ltd.<br />All rights reserved.</div>
      </div>
    </footer>
  );
}
