# Agent notes

Vite + React 19 + Tailwind CSS 4 single-page static site. The entire UI is in
`src/app/page.tsx` (mounted by `src/main.tsx`). No router, no backend, no SSR.
Bookings are WhatsApp-only (`WA` constant) — do not add forms or backends.

- Reference public assets through the `asset()` helper in `page.tsx` (and
  `%BASE_URL%` inside `index.html`) so the GitHub Pages base path applies —
  never hardcode `/foo.png`.
- All photos in `public/gen/` are AI-generated and curated; the hero's WebGL
  depth layer needs `g-hero.webp` + `g-hero-depth.webp` to stay in sync (if you
  replace the hero, regenerate the depth map).
- Animations: motion + lenis + small CSS keyframes in `globals.css`. Every
  animation must respect `prefers-reduced-motion` (see the existing media
  query and the guards in Atmosphere/DepthHero/Intro).
- Translations live in the `T` record (ky/ru/en) — new UI strings need all
  three languages.
- Build with `npm run build` (output → `dist/`); preview with `npm run preview`.
