import { useReducedMotion } from 'motion/react';
import { Reveal, MaskLines, DiamondMark, TONE } from './ui/primitives';

const CLIENTS: { name: string; sector: string }[] = [
  { name: 'MEGHA ENGINEERING & INFRASTRUCTURES LIMITED', sector: 'EPC · Water Infra' },
  { name: "DIVI'S LABORATORIES LIMITED", sector: 'Pharma Infrastructure' },
  { name: 'L&T', sector: 'EPC · National Infra' },
  { name: 'POWER MECH', sector: 'Power & Water' },
  { name: 'VISHWANATH INFRA', sector: 'Road & Water Infra' },
  { name: 'Vishnu Prakash R Punglia Ltd', sector: 'Infrastructure' },
  { name: 'GVPR LTD', sector: 'Infrastructure' },
  { name: 'GAJA ENGINEERING', sector: 'Engineering' },
  { name: 'TRINITY CORPORATION', sector: 'Corporation' },
];

const LANE_1 = CLIENTS.slice(0, 5);
const LANE_2 = CLIENTS.slice(5);

function LaneItem({ name, sector }: { name: string; sector: string }) {
  return (
    <span className="flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10 shrink-0">
      <span className="font-display text-ivory text-[clamp(1.4rem,3.2vw,2.8rem)] whitespace-nowrap font-light">
        {name}
      </span>
      <span className="label-tech text-champagne/70 whitespace-nowrap hidden md:block">
        {sector}
      </span>
      <DiamondMark size={6} color="rgba(199,166,106,0.6)" />
      <span className="block w-px h-8 bg-ivory/15" aria-hidden />
    </span>
  );
}

function TickerLane({
  items,
  direction,
  duration,
  reduce,
}: {
  items: { name: string; sector: string }[];
  direction: 'ltr' | 'rtl';
  duration: number;
  reduce: boolean;
}) {
  const copies = reduce ? 1 : 2;
  return (
    <div className="ticker-hover overflow-hidden py-5 sm:py-7 border-y border-ivory/10">
      {reduce ? (
        <div className="flex flex-wrap gap-x-8 gap-y-3 px-6">
          {items.map((c) => (
            <LaneItem key={c.name} {...c} />
          ))}
        </div>
      ) : (
        <div
          className={`ticker-track ${direction === 'ltr' ? 'ticker-track--rev' : ''}`}
          style={{ ['--ticker-dur' as any]: `${duration}s` }}
        >
          {Array.from({ length: copies }).flatMap((_, ci) =>
            items.map((c) => (
              <LaneItem key={`${ci}-${c.name}`} {...c} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function Clients() {
  const reduce = useReducedMotion();

  return (
    <section
      id="clients"
      data-theme="dark"
      className="relative bg-navy text-ivory overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-champagne/40 to-transparent" />

      {/* ============ PRODUCT → NETWORK bridge ============ */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 pt-16 sm:pt-24 pb-10">
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            {['Product', 'Product Family', 'Application', 'Industrial Network'].map(
              (step, i) => (
                <span key={step} className="flex items-center gap-4">
                  <span
                    className={`label-tech ${
                      i === 3 ? 'text-champagne' : 'text-ivory/45'
                    }`}
                  >
                    {step}
                  </span>
                  {i < 3 && (
                    <span className="flex items-center gap-2" aria-hidden>
                      <span className="block w-10 sm:w-16 h-px bg-ivory/20" />
                      <DiamondMark size={4} color="rgba(199,166,106,0.5)" />
                    </span>
                  )}
                </span>
              )
            )}
          </div>
        </Reveal>
      </div>

      {/* ============ Editorial header ============ */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <Reveal>
              <span className="kicker kicker--light">Scene 05 — Industrial Network</span>
            </Reveal>
            <MaskLines
              as="h2"
              className="display-tight text-ivory text-[clamp(2.6rem,6.4vw,6rem)] mt-5"
              lines={[
                'Trusted Across',
                <span key="i" className="font-display italic font-light text-champagne">Industry.</span>,
              ]}
            />
          </div>
          <div className="lg:col-span-4">
            <Reveal delay={0.12}>
              <p className="text-ivory/55 text-sm leading-[1.85] max-w-sm">
                Trusted by industry leaders and publicly listed companies for
                their critical infrastructure needs.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ============ Two opposing continuous lanes ============ */}
      <div className="relative">
        <TickerLane items={LANE_1} direction="ltr" duration={56} reduce={!!reduce} />
        <div className="h-px bg-ivory/10" />
        <TickerLane items={LANE_2} direction="rtl" duration={48} reduce={!!reduce} />
      </div>

      {/* ============ Bottom metadata ============ */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 py-8 flex flex-wrap items-center justify-between gap-4">
        <span className="label-tech text-ivory/40">
          Publicly Listed Companies · EPC Contractors · Water Boards
        </span>
        <span className="label-tech text-champagne/70">
          {CLIENTS.length} Named Partners
        </span>
      </div>
    </section>
  );
}
