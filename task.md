# Varaha Metaliks — cinematic upgrade (branch: runable/agent-work)

Base branch / PR target: `sam-changes` (repo default; no main exists).
Dev server: tmux session `dev` -> http://localhost:3000, log /tmp/dev.log
Checks: `bun run lint` (tsc --noEmit), `bun run build` (vite build)

## Done + verified
- [x] Deleted dead `src/components/ns.tsx` (unimported, TS1005 broke typecheck)
- [x] `src/index.css` rewrite — vm-* palette, --app-vh/.h-stage, ticker keyframes,
      ken-burns, grain, tap-target/pan-x/pan-y/no-scrollbar, reduced-motion block
- [x] `src/hooks/useDeviceProfile.ts` — useDeviceProfile / useViewportUnit / useInViewport
- [x] `ScrollToBeginHeader.tsx` rewrite (§1) — 859 -> ~380 lines, enter/travel/hold/exit,
      clip-path reveal, desktop L->R travel, mobile drift clamped ±1.6vw
- [x] `Clients.tsx` rewrite (§8) — two lanes LTR 64s / RTL 82s, items duplicated x2
- [x] `ProductBridge.tsx` new (§4) — manufacturing -> finished product -> showcase
- [x] `App.tsx` — single <Home>, useViewportUnit(), new section order,
      fixed pre-existing `<Footer setActiveTab>` type error (Footer takes no props)
- [x] `About.tsx` rewrite (§3) — 2s cinematic beats, cross-dissolve + slow push,
      swipe, thumb auto-centre via container-local scrollTo
- [x] `Products.tsx` rewrite (§5/§6) — 3-column desktop, tablet + mobile branches,
      GLB casing fixed, Unsplash removed, capabilities block removed, brochure preserved
- [x] `3d/MercuryViewer.tsx` rewrite (§10) — cached normal map, viewport-suspended loop,
      touch OrbitControls + touch-action pan-y, out/in swap, full dispose, PMREM leak fixed
- [x] `HeroVideo.tsx` — h-[360vh]/h-screen -> --app-vh + .h-stage, removed unused
      whiteOverlayOpacity, spinner respects reduced motion
- [x] `bun run lint` clean (exit 0)
- [x] `bun run build` passes (exit 0)
- [x] Multi-viewport sweep via verify.py (390/414/844x390/768/1024/1440):
      0 console errors, 0 failed requests (no GLB 404s), no missing sections,
      NO horizontal overflow at any width, scrollHeight stable across scroll
      (no layout jumping). Report: verify-report.json, shots in shots/

- [x] Products centrepiece verified (desktop 1440): live WebGL2 canvas 654x637,
      context not lost, canvas centre is the topmost element (no UI over model),
      16 rows, right list scrolls independently without moving the page,
      switch -> name+specs update, new GLB 200, scroll preserved exactly,
      active row kept in view
- [x] Cycled ALL 16 products: 0 page-scroll drift, every stage had a visual,
      no 4xx/5xx on any .glb (casing fix confirmed)
- [x] Mobile 390 verified: order identity->3D->specs->selector, rail scrolls
      horizontally without moving page, canvas touch-action=pan-y (vertical
      swipe stays with page), specs toggle works, no tap target <40px,
      3 consecutive switches all preserved scroll + stable height
- [x] FIXED layout jump: only 2 of 16 products have `angles`, so on mobile the
      angle row unmounted and the section shrank 124px (1223->1099) on switch.
      Added a self-tuning mobile min-height lock (measures collapsed baseline,
      resets on width change) -> docH spread now 0px, secH constant 1223.
- [x] Clients ticker verified: 2 lanes, vm-ticker-ltr 64s + vm-ticker-rtl 82s,
      both running, 18 children each (9 names x2 -> matches +/-50% keyframes),
      each lane wider than parent (seamless loop)
- [x] Contact form verified: empty submit blocked by validation (0 API calls,
      3 :invalid), real submit -> POST /api/contact 200 -> success state.
      NOTE: `bun run dev` starts ONLY Vite; the API needs `bun run dev:server`
      (tmux session `api`, :3001). A 500 on /api/contact just means it is not
      running (Vite proxy ECONNREFUSED) — not an app bug.

## Then
- [ ] Commit to runable/agent-work, push, open PR against sam-changes
      PR notes: §1-§12, mobile recomposition, and fixes: stray `S`, `...` className,
      duplicate specs pill, GLB casing 404s, Unsplash URL, Footer prop type error,
      PMREM texture leak, non-functional Retry button, mobile OrbitControls disabled,
      ns.tsx deletion

## Open / low priority
- Root `mercury.glb` + root `glbmodel/` look unused (served copies live in
  public/glbmodel/). Verify before deleting.
- verify.py + shots/ + verify-report.json are scratch — do not commit.

## Key constraints (do not break)
Navbar structure/links/mobile menu · Contact form + API · hero frame-sequence
engine (335 frames, ScrollToBeginHeader is a pure scrollProgress consumer) ·
existing GLB assets + product data · real Varaha business info · existing routes/APIs
