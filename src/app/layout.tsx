import type { Metadata } from "next";
import "./globals.css";

// Public URL of the deployed site, used to turn relative social-share image
// paths into absolute URLs. Defaults to the GitHub Pages address.
const SITE_URL = "https://itemiral.github.io/chychkan-real/";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Touristic Complex Chychkan — Mountain Lodge, Kyrgyzstan",
  description:
    "Luxury mountain retreat in Chychkan Gorge, 240 km from Bishkek. Horseback riding, trekking, authentic cuisine. Open May–September. Book via WhatsApp.",
  keywords: "Chychkan, Kyrgyzstan, mountain lodge, gorge, hotel, tourism, Bishkek, Osh highway",
  openGraph: {
    title: "Touristic Complex Chychkan",
    description: "Mountain lodge in the Chychkan Gorge, Kyrgyzstan. 2200m altitude. Open May–September.",
    images: ["kyrgyzstan-bg.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ky" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FDFAF5]">{children}</body>
    </html>
  );
}
