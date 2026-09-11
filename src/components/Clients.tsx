import { Building2 } from 'lucide-react';
import { Reveal, MaskLines, StaggerGroup, StaggerItem } from './ui/primitives';

const clients = [
  'MEGHA ENGINEERING & INFRASTRUCTURES LIMITED',
  "DIVI'S LABORATORIES LIMITED",
  'L&T',
  'POWER MECH',
  'VISHWANATH INFRA',
  'Vishnu Prakash R Punglia Ltd',
  'GVPR LTD',
  'GAJA ENGINEERING',
  'TRINITY CORPORATION',
];

export default function Clients() {
  return (
    <section
      id="clients"
      data-theme="light"
      className="bg-ivory text-ink border-t border-ink/8"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28">
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <MaskLines
            as="h2"
            className="display-tight text-ink text-[clamp(2.1rem,4.4vw,3.8rem)]"
            lines={['Our Esteemed Clients']}
          />
          <Reveal delay={0.15}>
            <p className="mt-6 text-ink/62 text-[15px] leading-[1.9]">
              Trusted by industry leaders and publicly listed companies for
              their critical infrastructure needs.
            </p>
          </Reveal>
        </div>

        <StaggerGroup className="border-t border-ink/12" amount={0.1}>
          {clients.map((client, index) => (
            <StaggerItem key={client}>
              <div className="group relative flex items-center gap-4 sm:gap-7 py-5 sm:py-6 border-b border-ink/12 overflow-hidden">
                {/* hover sweep */}
                <span
                  className="absolute inset-0 bg-mineral origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                  style={{ transformOrigin: 'left' }}
                  aria-hidden
                />
                <span className="relative label-tech text-steel group-hover:text-copper transition-colors shrink-0 w-7">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <Building2
                  className="relative w-4 h-4 text-steel group-hover:text-copper transition-colors duration-300 shrink-0 hidden sm:block"
                  strokeWidth={1.4}
                />
                <h3 className="relative flex-1 font-sans font-semibold tracking-[0.02em] text-[13px] sm:text-base text-ink/85 group-hover:text-ink transition-colors leading-snug">
                  {client}
                </h3>
                <span
                  className="relative block w-6 h-px bg-copper/0 group-hover:bg-copper/70 transition-all duration-500 group-hover:w-10 shrink-0"
                  aria-hidden
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
