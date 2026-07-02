# Chychkan

Landing site for the Chychkan gorge guesthouse (Kyrgyzstan) — rooms, restaurant,
activities, and directions. Trilingual (ky / ru / en). Bookings go through
WhatsApp only; the site is fully static.

## Stack

- **Vite + React 19** (single static page; the whole UI lives in `src/app/page.tsx`)
- **Tailwind CSS 4** (via `@tailwindcss/vite`) mixed with inline styles
- **motion** (scroll-linked animation, springs), **lenis** (inertia scrolling),
  **three** (lazy-loaded WebGL depth-parallax hero), **lucide-react** icons
- Live extras: Open-Meteo current weather for the gorge, WebAudio-synthesized
  river ambience (no audio files)
- Deployed to **GitHub Pages** via `.github/workflows/deploy.yml`

## Imagery

All photography under `public/gen/` is AI-generated (SDXL-Turbo, run locally),
curated per image; the WebGL hero uses a Depth-Anything-V2 depth map
(`g-hero-depth.webp`). SVG artwork (tunduk mark, panorama, night scene, menu
icons) is hand-built in `page.tsx`. Real photos can replace any of these by
swapping files — keep the same paths.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
```

## Build

```bash
npm run build      # static site emitted to ./dist
npm run preview    # serve the built ./dist locally
```

### GitHub Pages base path

The project site is served from a sub-path (`/chychkan-real/`). The deploy
workflow sets `VITE_BASE=/chychkan-real/` so asset URLs resolve correctly;
locally it defaults to `/`. Asset paths in code go through the `asset()` helper
in `page.tsx`; in `index.html` use `%BASE_URL%`.
