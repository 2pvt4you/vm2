import { useEffect, useState } from 'react';

/**
 * Device capability + viewport profile.
 *
 * Everything cinematic in this project (frame sequence, WebGL product stage,
 * scroll typography, ticker) reads from this single source of truth so the
 * desktop and phone experiences can be *different compositions* rather than
 * the same layout at different scales.
 */
export interface DeviceProfile {
  /** < 768px — phone composition */
  isMobile: boolean;
  /** 768–1023px — tablet composition */
  isTablet: boolean;
  /** >= 1024px — full cinematic desktop composition */
  isDesktop: boolean;
  /** Coarse pointer: no reliable hover, so hover-only affordances are dropped */
  isTouch: boolean;
  /** OS-level reduced motion preference */
  prefersReducedMotion: boolean;
  /** Low core count / low memory / small screen — dial 3D + particles down */
  isLowPower: boolean;
  /** Renderer pixel-ratio ceiling appropriate for the device */
  dprCap: number;
  /** Current viewport width in px */
  width: number;
  /** Current viewport height in px (visual viewport where available) */
  height: number;
  /** true when the viewport is wider than it is tall */
  isLandscape: boolean;
}

const MOBILE_MAX = 767;
const TABLET_MAX = 1023;

function detectLowPower(width: number): boolean {
  if (typeof navigator === 'undefined') return false;

  const cores = (navigator as Navigator & { hardwareConcurrency?: number })
    .hardwareConcurrency;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;

  if (typeof cores === 'number' && cores > 0 && cores <= 4) return true;
  if (typeof memory === 'number' && memory > 0 && memory <= 4) return true;

  // Small screens are treated as constrained even when the UA is generous
  // about reporting cores.
  return width <= MOBILE_MAX;
}

function read(): DeviceProfile {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouch: false,
      prefersReducedMotion: false,
      isLowPower: false,
      dprCap: 2,
      width: 1440,
      height: 900,
      isLandscape: true,
    };
  }

  const width = window.innerWidth;
  const height = window.visualViewport?.height ?? window.innerHeight;

  const isMobile = width <= MOBILE_MAX;
  const isTablet = width > MOBILE_MAX && width <= TABLET_MAX;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  const isLowPower = detectLowPower(width);

  return {
    isMobile,
    isTablet,
    isDesktop: width > TABLET_MAX,
    isTouch,
    prefersReducedMotion,
    isLowPower,
    // Phones gain nothing visible above 2x on a small WebGL canvas but pay
    // the full fill-rate cost, so the ceiling drops with capability.
    dprCap: isLowPower ? 1.5 : isMobile ? 2 : 2,
    width,
    height,
    isLandscape: width > height,
  };
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(read);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setProfile(read()));
    };

    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('orientationchange', update, { passive: true });
    window.visualViewport?.addEventListener('resize', update);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
      window.visualViewport?.removeEventListener('resize', update);
      motionQuery.removeEventListener('change', update);
    };
  }, []);

  return profile;
}

/**
 * Keeps `--app-vh` in sync with the *actual* usable viewport height.
 *
 * iOS Safari reports `100vh` as the height with the URL bar hidden, which
 * makes full-bleed sections overflow by the toolbar height. `100dvh` fixes
 * most of it, but it also resizes mid-scroll and causes visible jumps, so we
 * additionally pin the value and only update it on real layout changes
 * (orientation, keyboard dismissal, significant resize) rather than on every
 * scroll-driven toolbar nudge.
 */
export function useViewportUnit(): void {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastWidth = window.innerWidth;
    let lastApplied = 0;

    const apply = (force = false) => {
      const height = window.visualViewport?.height ?? window.innerHeight;
      const width = window.innerWidth;

      // Ignore the small height deltas caused by the iOS toolbar sliding
      // during scroll — those must NOT relayout the page.
      const widthChanged = width !== lastWidth;
      const significant = Math.abs(height - lastApplied) > 80;

      if (!force && !widthChanged && !significant) return;

      lastWidth = width;
      lastApplied = height;

      document.documentElement.style.setProperty('--vh-unit', `${height / 100}px`);
      document.documentElement.style.setProperty('--app-vh', `${height}px`);
    };

    apply(true);

    const onResize = () => apply();
    const onOrientation = () => {
      // Orientation change reports stale metrics for a frame or two on iOS.
      setTimeout(() => apply(true), 120);
      setTimeout(() => apply(true), 400);
    };

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onOrientation, { passive: true });
    window.visualViewport?.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onOrientation);
      window.visualViewport?.removeEventListener('resize', onResize);
    };
  }, []);
}

/**
 * Reports whether an element is currently near the viewport.
 * Used to suspend the WebGL render loop when the product stage is off-screen.
 */
export function useInViewport<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  rootMargin = '200px'
): boolean {
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
