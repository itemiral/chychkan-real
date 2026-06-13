# Chychkan

Landing site for the Chychkan gorge guesthouse (Kyrgyzstan) — rooms, restaurant,
spa, tours, and trekking. Trilingual (ky / ru / en).

## Stack

- **Next.js 16** (static export — `output: "export"`)
- **React 19**, **Tailwind CSS 4**, **Framer Motion**
- Deployed to **GitHub Pages** via `.github/workflows/deploy.yml`

The whole landing page lives in `src/app/page.tsx`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build    # static site emitted to ./out
```

Because it's a static export there is no server runtime — booking is handled
client-side (WhatsApp deep link / form-as-a-service).
