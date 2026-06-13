# Chychkan

Landing site for the Chychkan gorge guesthouse (Kyrgyzstan) — rooms, restaurant,
spa, tours, and trekking. Trilingual (ky / ru / en).

## Stack

- **Vite + React 19** (single static page)
- **Tailwind CSS 4** (via `@tailwindcss/vite`), **lucide-react** icons
- Deployed to **GitHub Pages** via `.github/workflows/deploy.yml`

The whole landing page lives in `src/app/page.tsx`; `src/main.tsx` mounts it.

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
in `page.tsx`, which prefixes `import.meta.env.BASE_URL`.

## Booking

Static site, no server runtime — booking is handled client-side (WhatsApp deep
link; an email-form fallback can be added via a form service).
