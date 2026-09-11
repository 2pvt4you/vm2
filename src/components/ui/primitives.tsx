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
   Design tokens (mirror src/index.css @theme)
   ============================================================ */
export const TONE = {
  ivory: '#F4F1EA',
  mineral: '#E7E4DC',
  paper: '#FBFAF6',
  ink: '#15171A',
  inkSoft: '#3A3D40',
  graphite: '#25282A',
  graphite2: '#1D2022',
  steel: '#6E7478',
  copper: '#B96A3A',
  copperDeep: '#9A5429',
  champagne: '#D8B56D',
  cobalt: '#315CFF',
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
  className,
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
  className,
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
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={revealVariants}
    >
      {children}
    </motion.div>
  );
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
  className,
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
   SectionIndex — small editorial marker (e.g. 01 / 06)
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
        color: tone === 'dark' ? TONE.copper : TONE.champagne,
      }}
    >
      {index}
    </span>
  );
}
