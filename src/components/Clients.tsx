import { useState } from 'react';
import { useDeviceProfile } from '../hooks/useDeviceProfile';

/**
 * Trusted Across Industry — two-lane market-style ticker.
 *
 * Lane 1 travels LEFT -> RIGHT, lane 2 travels RIGHT -> LEFT, at different
 * speeds. Each lane renders its item set exactly twice and the keyframes
 * translate by 50%, so the loop is seamless with no visible restart.
 *
 * The motion is a pure CSS transform (compositor-only), so it cannot
 * interfere with vertical page scrolling on touch devices.
 */

const CLIENTS = [
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

// Lane 2 runs the same roster offset so the two lanes never sit in register.
const LANE_A = CLIENTS;
const LANE_B = [...CLIENTS.slice(4), ...CLIENTS.slice(0, 4)];

interface CardProps {
  name: string;
  index: number;
  interactive: boolean;
}

function ClientCard({ name, index, interactive }: CardProps) {
  return (
    <div
      className={[
        'group mx-2 flex shrink-0 items-center gap-4 rounded-lg border border-white/10',
        'bg-white/[0.035] px-5 py-4 backdrop-blur-sm sm:mx-3 sm:px-6 sm:py-5',
        interactive
          ? 'transition-colors duration-500 hover:border-vm-amber/45 hover:bg-white/[0.07]'
          : '',
      ].join(' ')}
    >
      <span className="font-mono text-[10px] leading-none tracking-[0.28em] text-vm-amber/70">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="h-6 w-px bg-white/12" aria-hidden="true" />
      <span className="whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.13em] text-white/78 sm:text-sm">
        {name}
      </span>
    </div>
  );
}

interface LaneProps {
  items: string[];
  direction: 'ltr' | 'rtl';
  duration: number;
  interactive: boolean;
}

function Lane({ items, direction, duration, interactive }: LaneProps) {
  const [paused, setPaused] = useState(false);

  // Rendered twice — the ±50% keyframes depend on exactly two passes.
  const track = [...items, ...items];

  return (
    <div className="relative overflow-hidden" aria-hidden="true">
      <div
        className={[
          'vm-lane',
          direction === 'ltr' ? 'vm-lane-ltr' : 'vm-lane-rtl',
          paused ? 'vm-lane-paused' : '',
        ].join(' ')}
        style={{ animationDuration: `${duration}s` }}
        onMouseEnter={interactive ? () => setPaused(true) : undefined}
        onMouseLeave={interactive ? () => setPaused(false) : undefined}
      >
        {track.map((name, i) => (
          <ClientCard
            key={`${name}-${i}`}
            name={name}
            index={i % items.length}
            interactive={interactive}
          />
        ))}
      </div>
    </div>
  );
}

export default function Clients() {
  const { isTouch, prefersReducedMotion } = useDeviceProfile();
  const interactive = !isTouch && !prefersReducedMotion;

  return (
    <section
      id="clients"
      className="vm-grain relative overflow-hidden bg-vm-void py-20 sm:py-28"
    >
      {/* Continuity: bleeds out of the product stage above and into the
          approvals band below, so the film never cuts. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-vm-iron to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-vm-iron to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto mb-12 max-w-7xl px-5 sm:mb-16 sm:px-6 lg:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-vm-amber/80 sm:text-[11px]">
          Clientele
        </p>
        <h2 className="mt-4 max-w-3xl text-3xl font-light leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Trusted Across{' '}
          <span className="font-editorial italic text-vm-amber">Industry</span>
        </h2>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/45 sm:text-base">
          Supplying ductile iron pipe fittings and heavy castings to
          infrastructure, water and process majors across the country.
        </p>
      </div>

      <div className="relative space-y-3 sm:space-y-4">
        <Lane items={LANE_A} direction="ltr" duration={64} interactive={interactive} />
        <Lane items={LANE_B} direction="rtl" duration={82} interactive={interactive} />

        {/* Edge fades so items enter and leave frame instead of popping. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-vm-void to-transparent sm:w-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-vm-void to-transparent sm:w-40"
          aria-hidden="true"
        />
      </div>

      {/* Accessible, non-animated copy of the roster. */}
      <ul className="sr-only">
        {CLIENTS.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </section>
  );
}
