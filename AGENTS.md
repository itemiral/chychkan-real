# Agent notes

Vite + React 19 + Tailwind CSS 4 single-page static site. The entire UI is in
`src/app/page.tsx` (mounted by `src/main.tsx`). No router, no backend, no SSR.
Bookings are WhatsApp-only (`WA` constant) — do not add forms or backends.

- Reference public assets through the `asset()` helper in `page.tsx` (and
  `%BASE_URL%` inside `index.html`) so the GitHub Pages base path applies —
  never hardcode `/foo.png`.
- All photos in `public/gen/` are AI-generated and curated. Three surfaces use
  the WebGL `DepthImage` component and need image + depth map to stay in sync
  (regenerate the `*-depth.webp` with Depth-Anything-V2 if you swap the image):
  hero (`g-hero`), panorama band (`g-panorama`), night CTA (`g-yurt-night`).
- Animations: motion + lenis + small CSS keyframes in `globals.css`. Every
  animation must respect `prefers-reduced-motion` (see the existing media
  query and the guards in Atmosphere/DepthImage/Intro).
- Translations live in the `T` record (ky/ru/en) — new UI strings need all
  three languages.
- Build with `npm run build` (output → `dist/`); preview with `npm run preview`.
