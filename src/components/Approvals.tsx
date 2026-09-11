import { MapPin, CheckCircle2 } from 'lucide-react';
import { Reveal, MaskLines, StaggerGroup, StaggerItem } from './ui/primitives';

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

export default function Approvals() {
  return (
    <section
      id="approvals"
      data-theme="light"
      className="bg-mineral text-ink border-t border-ink/8"
    >
      <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 items-center">
          {/* Editorial text + state register */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <MaskLines
              as="h2"
              className="display-tight text-ink text-[clamp(2.1rem,4.4vw,3.8rem)] mb-6"
              lines={['Water Board', 'Approvals']}
            />
            <Reveal delay={0.1}>
              <p className="text-ink/62 text-[15px] leading-[1.9] max-w-xl mb-10">
                Our products meet the highest regional standards and have been
                rigorously tested and approved by state water boards across 11
                states in India.
              </p>
            </Reveal>

            <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
              {states.map((state) => (
                <StaggerItem key={state}>
                  <div className="group flex items-center gap-4 py-4 border-b border-ink/10">
                    <CheckCircle2
                      className="w-4 h-4 text-copper shrink-0 transition-transform duration-300 group-hover:scale-110"
                      strokeWidth={1.5}
                    />
                    <span className="font-sans font-medium text-sm text-ink/85 group-hover:text-ink transition-colors">
                      {state}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>

          {/* The number as object */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <Reveal>
              <div className="relative rounded-2xl sm:rounded-3xl bg-ivory/70 border border-ink/10 h-[380px] sm:h-[520px] flex items-center justify-center overflow-hidden">
                {/* Technical survey grid */}
                <div
                  className="absolute inset-0 opacity-[0.5]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(21,23,26,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(21,23,26,0.045) 1px, transparent 1px)',
                    backgroundSize: '44px 44px',
                  }}
                />
                <MapPin
                  className="absolute w-[80%] h-[80%] text-copper/[0.07]"
                  strokeWidth={0.6}
                />
                <div className="absolute top-5 left-5 w-6 h-6 border-l border-t border-copper/40" />
                <div className="absolute top-5 right-5 w-6 h-6 border-r border-t border-copper/40" />
                <div className="absolute bottom-5 left-5 w-6 h-6 border-l border-b border-copper/40" />
                <div className="absolute bottom-5 right-5 w-6 h-6 border-r border-b border-copper/40" />
                <div className="relative text-center px-8">
                  <span className="numeric-object block text-[clamp(7rem,18vw,13rem)] text-ink leading-[0.8]">
                    11
                  </span>
                  <span className="block mt-5 h-px w-12 bg-copper mx-auto" />
                  <p className="mt-5 label-tech text-copper-deep text-[11px] sm:text-xs">
                    Approved States
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
