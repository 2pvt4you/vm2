import { useEffect } from 'react';

/* ============================================================
   SectionThemeSpy
   Reads [data-theme="light" | "dark"] sections and mirrors the
   dominant viewport theme onto <html data-ui-theme>. The navbar
   and grain layer adapt to the cinematic light/dark narrative.
   ============================================================ */
export function SectionThemeSpy() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-theme]')
    );
    if (sections.length === 0) return;

    const setTheme = (theme: string) => {
      if (document.documentElement.dataset.uiTheme !== theme) {
        document.documentElement.dataset.uiTheme = theme;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        /* Pick the most visible themed section. */
        let best: { ratio: number; theme: string } | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const theme =
              (entry.target as HTMLElement).dataset.theme || 'light';
            if (!best || entry.intersectionRatio > best.ratio) {
              best = { ratio: entry.intersectionRatio, theme };
            }
          }
        }
        if (best) setTheme(best.theme);
      },
      { threshold: [0.2, 0.4, 0.6, 0.8], rootMargin: '-10% 0px -10% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    setTheme('light');

    return () => observer.disconnect();
  }, []);

  return null;
}

/* ============================================================
   Grain — fixed material layer. Multiply on light canvases,
   overlay on dark cinematic scenes.
   ============================================================ */
export function Grain() {
  return <div className="grain-layer" aria-hidden />;
}
