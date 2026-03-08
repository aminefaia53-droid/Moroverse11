import { Outfit, Cinzel, Playfair_Display, Inter, Cairo } from "next/font/google";
import "./globals.css";
import MoroVerseAssistant from "../components/MoroVerseAssistant";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-arabic",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata = {
  title: "MoroVerse | الموسوعة الرقمية للتاريخ المغربي",
  description: "استكشف عمق التاريخ المغربي وروعة حضارته في بوابة زمنية متطورة. معارك، مدن، معالم، وشخصيات تاريخية — كلها موثّقة في MoroVerse.",
  keywords: "تاريخ المغرب, مدن مغربية, معارك مغربية, المرابطون, وليلي, فاس, مراكش, ابن بطوطة, فاطمة الفهرية",
  manifest: "/manifest.json",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  authors: [{ name: "Mohamed Amine El Amiri" }],
  creator: "MoroVerse Royal Digital Archive",
  publisher: "MoroVerse",
  openGraph: {
    type: "website",
    locale: "ar_MA",
    alternateLocale: "en_US",
    url: "https://moroverse.vercel.app",
    siteName: "MoroVerse — الأرشيف الرقمي المغربي",
    title: "MoroVerse | الموسوعة الرقمية للتاريخ المغربي",
    description: "استكشف عمق التاريخ المغربي وروعة حضارته في بوابة زمنية متطورة. معارك، مدن، معالم، وشخصيات تاريخية.",
    images: [
      {
        url: "https://moroverse.vercel.app/hero-bg.png",
        width: 1200,
        height: 630,
        alt: "MoroVerse — الأرشيف الرقمي للمملكة المغربية",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoroVerse | الموسوعة الرقمية للتاريخ المغربي",
    description: "استكشف عمق التاريخ المغربي وروعة حضارته في بوابة زمنية متطورة.",
    images: ["https://moroverse.vercel.app/hero-bg.png"],
    creator: "@moroverse",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MoroVerse",
  },
  alternates: {
    canonical: "https://moroverse.vercel.app",
  },
};

export const viewport = {
  themeColor: '#8b0000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../components/ThemeProvider";
import WeatherOverlay from "../components/WeatherOverlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${cinzel.variable} ${playfair.variable} ${inter.variable} ${cairo.variable} antialiased selection:bg-gold-royal/30 selection:text-gold-royal`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <WeatherOverlay />
            {children}
            <MoroVerseAssistant />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
