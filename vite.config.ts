import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// On a GitHub Pages *project* site the app is served from a sub-path
// (e.g. /chychkan-real/). The Pages workflow sets VITE_BASE; locally it
// defaults to '/' so `vite dev` serves from the root.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
});
