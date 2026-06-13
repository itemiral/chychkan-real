# Agent notes

Vite + React 19 + Tailwind CSS 4 single-page static site. The entire UI is in
`src/app/page.tsx` (mounted by `src/main.tsx`). No router, no backend, no SSR.

- Reference public assets through the `asset()` helper in `page.tsx` so the
  GitHub Pages base path (`import.meta.env.BASE_URL`) is applied — never hardcode
  `/foo.png`.
- Build with `npm run build` (output → `dist/`); preview with `npm run preview`.
