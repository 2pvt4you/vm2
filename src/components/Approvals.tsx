import { MapPin, ShieldCheck } from 'lucide-react';
import {
  Reveal,
  MaskLines,
  StaggerGroup,
  StaggerItem,
  ArrowRule,
  CornerFrame,
  DiamondMark,
} from './ui/primitives';

const states = [
  'Telangana',
  'Andhra Pradesh',
  'Tamil Nadu',
  'Karnataka',
  'Maharashtra',
  'Madhya Pradesh',
  'Uttar Pradesh',
  'Chattisgarh',
  'West Bengal',
  'Gujarat',
  'Odisha',
];

const CERTIFICATIONS = [
  { title: 'BIS Certified', meta: 'CM/L NO: 6300089907' },
  { title: 'ISO 9001', meta: 'Certified Company' },
  { title: 'IS 9523:2000', meta: 'DI Pipe Fittings' },
  { title: 'ISO 2531 · BS EN 545', meta: 'Global Standards' },
];

const TESTING = ['UTM', 'BHN', 'Spectrometer', 'Hydrostatic'];

export default function Approvals() {
  return (
    <section
      id="approvals"
      data-theme="light"
      className="relative bg-mineral text-ink overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-px rule-ink" />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28">
        {/* ==================== header ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-14 sm:mb-20">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="kicker">Scene 06 — Trust &amp; Approvals</span>
            </Reveal>
            <MaskLines
              as="h2"
              className="display-tight text-ink text-[clamp(2.4rem,5.6vw,5.2rem)] mt-5"
              lines={[
                'Approved where',
                <span key="w" className="font-display italic font-light text-copper-deep">water flows.</span>,
              ]}
            />
          </div>
          <div className="lg:col-span-5 flex items-end">
            <Reveal delay={0.12}>
              <p className="text-ink/60 text-[15px] leading-[1.9] max-w-md">
                Our products meet the highest regional standards and have been
                rigorously tested and approved by state water boards across 11
                states in India.
              </p>
            </Reveal>
          </div>
        </div>

        {/* ==================== certifications band ==================== */}
        <StaggerGroup
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10 rounded-2xl overflow-hidden mb-8"
          amount={0.1}
        >
          {CERTIFICATIONS.map((c) => (
            <StaggerItem key={c.title} className="bg-ivory">
              <div className="p-6 sm:p-8 h-full">
                <div className="flex items-center gap-3 mb-5">
                  <ShieldCheck className="w-4 h-4 text-copper-deep" strokeWidth={1.5} />
                  <span className="block h-px flex-1 bg-ink/10" />
                </div>
                <h3 className="font-display font-medium text-ink text-lg sm:text-xl leading-snug">
                  {c.title}
                </h3>
                <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-copper-deep">
                  {c.meta}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* testing chips */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-3 mb-16 sm:mb-24">
            <span className="label-tech text-ink/45 mr-2">Every melt verified —</span>
            {TESTING.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ivory/70 px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-ink/70"
              >
                <DiamondMark size={4} color="rgba(122,94,43,0.7)" />
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        {/* ==================== geographic index + the number ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-start">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <Reveal>
              <div className="flex items-center justify-between pb-4 border-b border-ink/20 mb-2">
                <span className="label-tech text-copper-deep">Geographic Reach</span>
                <span className="label-tech text-ink/40">State Water Boards</span>
              </div>
            </Reveal>
            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-x-12" amount={0.05}>
              {states.map((state, i) => (
                <StaggerItem key={state}>
                  <div className="group flex items-center gap-4 py-4 border-b border-ink/10">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-ink/40 tabular-nums w-6 shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-sans font-semibold text-sm sm:text-base text-ink/80 group-hover:text-ink transition-colors whitespace-nowrap">
                      {state}
                    </span>
                    <ArrowRule className="group-hover:opacity-100 opacity-70" />
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* The number as object */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <Reveal>
              <div className="relative rounded-2xl sm:rounded-3xl bg-ivory/80 border border-ink/10 h-[380px] sm:h-[520px] flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.5]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(10,32,53,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(10,32,53,0.045) 1px, transparent 1px)',
                    backgroundSize: '44px 44px',
                  }}
                />
                <MapPin
                  className="absolute w-[80%] h-[80%] text-copper/[0.08]"
                  strokeWidth={0.6}
                />
                <div className="relative text-center px-8">
                  <span className="numeric-object block text-[clamp(7rem,18vw,13rem)] text-ink leading-[0.8]">
                    11
                  </span>
                  <span className="block mt-5 h-px w-12 bg-copper mx-auto" />
                  <p className="mt-5 label-tech text-copper-deep text-[11px] sm:text-xs">
                    Approved States
                  </p>
                </div>
                <CornerFrame color="rgba(122,94,43,0.45)" inset={18} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
