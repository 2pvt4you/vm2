import { useRef, type ReactNode, type CSSProperties } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  type Variants,
} from 'motion/react';

/* ============================================================
   Design tokens — mirrored from src/index.css @theme.
   One navy / ivory / champagne system across the whole film.
   ============================================================ */
export const TONE = {
  ivory: '#F4F1EA',
  mineral: '#E7E4DC',
  mineralGrey: '#C9C4B8',
  paper: '#FBF9F4',
  navy: '#071A2F',
  navy2: '#0B233D',
  steelNavy: '#163A58',
  ink: '#0A2035',
  inkSoft: '#35485C',
  metallic: '#8B959D',
  champagne: '#C7A66A',
  champagneDeep: '#7A5E2B',
  /* legacy aliases used across components */
  graphite: '#0B233D',
  graphite2: '#071A2F',
  steel: '#8B959D',
  copper: '#C7A66A',
  copperDeep: '#7A5E2B',
  cobalt: '#163A58',
} as const;

const EASE = [0.22, 1, 0.36, 1] as const;

/* ============================================================
   Reveal — weighted, deliberate entrance
   ============================================================ */
const revealVariants: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: EASE, delay },
  }),
};

export function Reveal({
  children,
  className = '',
  delay = 0,
  y = 34,
  once = true,
  amount = 0.25,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      variants={revealVariants}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      {...(reduce ? { variants: undefined, initial: false } : {})}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   Stagger group
   ============================================================ */
const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export function StaggerGroup({
  children,
  className = '',
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <motion.div className={className} variants={revealVariants}>{children}</motion.div>;
}

/* ============================================================
   MaskLines — masked editorial headline reveal.
   Splits explicit lines so copy stays exactly authored.
   ============================================================ */
export function MaskLines({
  lines,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  amount = 0.4,
  delay = 0,
  stagger = 0.12,
}: {
  lines: ReactNode[];
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  lineClassName?: string;
  amount?: number;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount });
  const reduce = useReducedMotion();
  const MotionTag = motion(Tag as any);

  return (
    <MotionTag ref={ref as any} className={className} initial={false}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line">
          <motion.span
            className={lineClassName}
            initial={reduce ? false : { y: '112%' }}
            animate={inView ? { y: '0%' } : reduce ? undefined : { y: '112%' }}
            transition={{
              duration: 1.05,
              ease: EASE,
              delay: delay + i * stagger,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* ============================================================
   Parallax — GPU transform parallax bound to a tracked section
   ============================================================ */
export function Parallax({
  children,
  className = '',
  distance = 60,
  offset = ['start end', 'end start'] as [string, string],
  style,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  offset?: [string, string];
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <div ref={ref} className={className} style={style}>
      <motion.div style={reduce ? undefined : { y }} className="will-transform">
        {children}
      </motion.div>
    </div>
  );
}

/* ============================================================
   SectionIndex — small editorial marker (e.g. SCENE 02 / 10)
   ============================================================ */
export function SectionIndex({
  index,
  tone = 'dark',
  className = '',
}: {
  index: string;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <span
      className={`label-tech ${className}`}
      style={{
        color: tone === 'dark' ? TONE.champagne : TONE.champagneDeep,
      }}
    >
      {index}
    </span>
  );
}

/* ============================================================
   CornerFrame — fine registration ticks at the four corners.
   The shared corner language of the whole film.
   ============================================================ */
export function CornerFrame({
  color = 'rgba(199,166,106,0.55)',
  size = 18,
  inset = 16,
}: {
  color?: string;
  size?: number;
  inset?: number;
}) {
  const s: CSSProperties = { width: size, height: size };
  const pos = (styles: CSSProperties): CSSProperties => ({
    position: 'absolute',
    ...styles,
  });
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      <span
        style={pos({
          top: inset,
          left: inset,
          ...s,
          borderLeft: `1px solid ${color}`,
          borderTop: `1px solid ${color}`,
        })}
      />
      <span
        style={pos({
          top: inset,
          right: inset,
          ...s,
          borderRight: `1px solid ${color}`,
          borderTop: `1px solid ${color}`,
        })}
      />
      <span
        style={pos({
          bottom: inset,
          left: inset,
          ...s,
          borderLeft: `1px solid ${color}`,
          borderBottom: `1px solid ${color}`,
        })}
      />
      <span
        style={pos({
          bottom: inset,
          right: inset,
          ...s,
          borderRight: `1px solid ${color}`,
          borderBottom: `1px solid ${color}`,
        })}
      />
    </span>
  );
}

/* ============================================================
   DiamondMark — the shared gold separator glyph
   ============================================================ */
export function DiamondMark({
  size = 6,
  color = TONE.champagne,
  className = '',
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`inline-block rotate-45 shrink-0 ${className}`}
      style={{ width: size, height: size, background: color }}
    />
  );
}

/* ============================================================
   ArrowRule — STATE NAME ────────────→  geographic index rule
   ============================================================ */
export function ArrowRule({
  className = '',
  color = 'rgba(10,32,53,0.28)',
  headColor = 'rgba(122,94,43,0.8)',
}: {
  className?: string;
  color?: string;
  headColor?: string;
}) {
  return (
    <span aria-hidden className={`relative flex-1 h-px ${className}`} style={{ background: color }}>
      <span
        className="absolute right-0 top-1/2 -translate-y-1/2"
        style={{
          width: 7,
          height: 7,
          borderTop: `1px solid ${headColor}`,
          borderRight: `1px solid ${headColor}`,
          transform: 'translateY(-50%) rotate(45deg)',
        }}
      />
    </span>
  );
}
