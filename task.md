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

## Stage 1 refinement — "one continuous film" pass (after user review of 41029fa)

User feedback on 41029fa: hero type sat ON the factory not IN it; ProductBridge
reveal felt inserted/card-like; Products read as a dashboard; navbar too dominant;
some sections still felt like separate blocks. Agreed staged delivery — flagship
scenes first (hero + bridge + products + navbar + continuity), then extend the
SAME language to the remaining sections in Stage 2.

- [x] `src/index.css` — new CINEMATIC SCENE SYSTEM block, inserted BEFORE the
      reduced-motion block (order matters or the `*` override kills it):
      `.vm-scrim-type` (localised radial readability scrim), `.vm-type-in-scene`
      (mix-blend-mode: multiply + @supports fallback), `.vm-rule` (hairline
      divider that replaces card borders), `.vm-nav-dark` / `.vm-nav-clear`,
      `.vm-pedestal` + breathe keyframes
- [x] `Navbar.tsx` — compact contextual glass (h-12/14, max-w-5xl), clear at top
      -> dark once scrolled, mono uppercase links, amber outline Inquire.
      Preserved: all links, activeTab gating, products -> return null, reveal gate.
      Added: mobile sheet closes on scroll so it can't travel over content.
- [x] `ScrollToBeginHeader.tsx` — type now belongs to the plate:
      removed the full-frame white wash (was 0.34-0.52) -> `.vm-scrim-type`;
      removed the white halo textShadow (the "sticker" cause) -> multiply blend;
      added per-statement focus pull (blur on approach/exit) + camera push
      (depthScale 1.035 -> 0.985); intro cover 60% -> 35% white.
- [x] FIXED headline collision: `Reveal`'s root hardcodes `relative inline-block`,
      so a caller's `block` lost at equal CSS specificity and "Mittal, Jhunjhunwala"
      + "& Jaju" rendered on ONE line, overlapping. Fix = line break moved to a
      wrapper `<span className="block">`; Reveal MUST stay inline-block because its
      wipe clip-path percentage measures the root's width, not the text.
- [x] `ProductBridge.tsx` — foundry -> product is now one material transformation:
      mask-based emergence (productMask 118% -> -14%) instead of an opacity fade,
      removed the `bg-vm-amber/12 blur-[120px]` halo plate, shared heat wash
      carried from the pour, camera turn toward the next scene, `.vm-rule` settle
      line. Captions now stack in ONE slot and hand over.
- [x] FIXED hooks violation: `useMotionTemplate` had been written inside a JSX
      ternary — hoisted to component top level.
- [x] FIXED beat overlap: beats are 0.24 apart, so each must be fully out by
      start+0.15; ranges were start+0.26 and two captions co-existed.
- [x] FIXED the white card: `...removebg-preview.png` was NEVER actually cut out
      (alpha channel present but corners opaque white), which is what made the
      reveal read as a pasted card. Knocked the backing out of the SAME photo ->
      `finished-fitting-cutout.png`. Photo not substituted.
- [x] `Products.tsx` — de-chromed from dashboard to showroom: `Panel`, the right
      `<aside>`, `MobileSpecs`, mobile cards, `ListRow`, `AngleSelector`,
      `EnquireLink` and the brochure link all lost
      `rounded-2xl border bg-black/35 backdrop-blur-md` in favour of `.vm-rule`
      hairlines, left index bars and open type. Model given dominance: stage
      frame removed, `.vm-pedestal` light added, columns narrowed
      (300/320 -> 260/280), gap 5 -> 8/10.
- [x] FIXED showroom overflow: the stage was `min(82vh,820px)`, so section height
      was 1012px vs a 900px viewport (over by 112-135px at every desktop size)
      and the foot of the product index was unreachable. Now
      `clamp(460px, calc(var(--app-vh) - 300px), 780px)` -> fits with ~26px spare.
- [x] `bun run lint` + `bun run build` clean
- [x] Re-verified 390/414/844x390/768/1024/1440: 0 console errors, 0 failed
      requests, 0 horizontal overflow, scrollHeight stable
- [x] All 16 products cycled on desktop/tablet/mobile: 16/16 distinct, no GLB 4xx
      (Playwright click timeouts on a few rows are an actionability artifact of
      the list auto-recentering — hit-testing confirmed no overlay)

### Stage 2 (only after user review — reuse Stage 1 language, invent nothing new)
About progressive story · documentary gallery · product-exit continuation ·
Clients ticker refinement · Approvals editorial reveal · dark->warm Contact
resolve · mobile recomposition

## Open / low priority
- Root `mercury.glb` + root `glbmodel/` look unused (served copies live in
  public/glbmodel/). Verify before deleting.
- verify.py + shots/ + verify-report.json are scratch — do not commit.

## Key constraints (do not break)
Navbar structure/links/mobile menu · Contact form + API · hero frame-sequence
engine (335 frames, ScrollToBeginHeader is a pure scrollProgress consumer) ·
existing GLB assets + product data · real Varaha business info · existing routes/APIs
