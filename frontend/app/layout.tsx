import { Outfit, Cinzel, Playfair_Display, Inter, Amiri } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-arabic",
  weight: ["400", "700"],
  subsets: ["arabic"],
});

export const metadata = {
  title: "MoroVerse | The 100% Digital Twin of Morocco",
  description: "Experience the Kingdom of Light in a revolutionary digital dimension.",
  manifest: "/manifest.json",
  themeColor: "#006233",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MoroVerse",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${cinzel.variable} ${playfair.variable} ${inter.variable} ${amiri.variable} antialiased selection:bg-gold-royal/30 selection:text-gold-royal`}
      >
        {children}
      </body>
    </html>
  );
}
