"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Crown, Sparkles, MapPin, Building2, Camera, Music, Palmtree, Waves, Mountain, Tent, Sunset } from "lucide-react";

// Components
import BattleDashboard from "../components/BattleDashboard";
import CityGrid from "../components/CityGrid";
import LandmarkGrid from "../components/LandmarkGrid";
import HistoricalFiguresGrid from "../components/HistoricalFiguresGrid";

// Utils
import AudioManager from "../utils/AudioManager";

export default function Home() {
  const [lang, setLang] = useState<"en" | "ar">("ar");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    AudioManager.instance.init();

    const handleFirstInteraction = () => {
      AudioManager.instance.enableAudio();
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);

    return () => window.removeEventListener('click', handleFirstInteraction);
  }, []);

  const t = {
    en: {
      welcome: "MoroVerse: The Imperial Horizon",
      subtitle: "A Majesty Beyond Shadows, Carved in Eternal Emerald",
      cta: "Explore the Encyclopedia",
      sections: {
        encyclopedia: "Kingdom Encyclopedia",
        encyclopediaDesc: "Explore the soul of every city, from the blue jewel in the north to the Atlantic pearl of the south.",
        battles: "Epochs of Valor",
        battlesDesc: "Where dynastic glory meets the infinite drift.",
        landmarks: "Majestic Landmarks",
        landmarksDesc: "Exploring the zenith of Moroccan architectural and historical heritage.",
        figures: "Historical Figures",
        figuresDesc: "Discover the luminaries who shaped the destiny of the Kingdom across the ages."
      }
    },
    ar: {
      welcome: "موروفيرس: الأفق الإمبراطوري",
      subtitle: "عظمة تتجاوز الظلال، منقوشة في الزمرد الأبدي",
      cta: "استكشف الموسوعة",
      sections: {
        encyclopedia: "موسوعة المملكة",
        encyclopediaDesc: "استكشف روح كل مدينة، من الجوهرة الزرقاء شمالاً إلى لؤلؤة الجنوب.",
        battles: "عصور البسالة",
        battlesDesc: "حيث تلتقي الأمجاد السلالية بالانجراف اللامتناهي.",
        landmarks: "معالم مغربية",
        landmarksDesc: "استكشاف ذروة التراث المعماري والتاريخي للمملكة المغربية.",
        figures: "شخصيات تاريخية",
        figuresDesc: "اكتشف الأعلام الذين سطروا أمجاد المملكة عبر العصور."
      }
    }
  }[lang];

  if (!isClient) return null;

  return (
    <div className={`min-h-screen relative overflow-hidden text-foreground selection:bg-primary/20 font-sans ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* FIXED BACKGROUND: CINEMATIC RADIAL GLOW & DUNES */}
      <div className="fixed inset-0 z-0 hero-radial-glow overflow-hidden">

        {/* Dynamic Subtle Landscape Overlay */}
        <div className="absolute inset-0 landscape-zoom opacity-20 mix-blend-overlay transition-opacity duration-1000">
          <Image
            src="/hero-bg.png"
            alt="MoroVerse Landscape"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Sand Dunes Layers (Parallax/Bottom Fixed) */}
        <div className="absolute bottom-0 w-full h-[40vh] min-h-[300px] pointer-events-none z-10 flex flex-col justify-end">
          {/* Back Dune */}
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full text-[#8b0000] opacity-80 z-10">
            <path fill="currentColor" fillOpacity="1" d="M0,192L48,208C96,224,192,256,288,256C384,256,480,224,576,202.7C672,181,768,171,864,181.3C960,192,1056,224,1152,218.7C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>

          {/* Middle Glowing Dune */}
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[85%] text-[#aa3a18] opacity-90 z-20 mix-blend-screen drop-shadow-[0_-10px_30px_rgba(197,160,89,0.3)]">
            <path fill="currentColor" fillOpacity="1" d="M0,224L60,234.7C120,245,240,267,360,256C480,245,600,203,720,186.7C840,171,960,181,1080,202.7C1200,224,1320,256,1380,272L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>

          {/* Front Golden Sand Dune */}
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[60%] text-[#C5A059] z-30 drop-shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
            <path fill="currentColor" fillOpacity="1" d="M0,96L80,117.3C160,139,320,181,480,186.7C640,192,800,160,960,144C1120,128,1280,128,1360,128L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>

          {/* Camel Parallax Effect walking on the middle dune */}
          <div className="absolute bottom-[20%] md:bottom-[30%] w-[200vw] h-32 pointer-events-none z-20 opacity-60 animate-camel-tread flex items-end drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-1/6 flex justify-around px-4">
                <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24 fill-[#3a0b0b]">
                  <path d="M70,40 C65,30 55,25 45,35 L40,40 L30,40 C25,40 20,45 20,50 L20,70 L25,70 L25,80 L30,80 L30,70 L40,70 L40,80 L45,80 L45,70 L60,70 C65,70 70,65 70,60 L75,60 C80,60 85,55 85,50 L85,45 C85,40 80,35 75,35 C70,35 65,40 65,45 L60,45 C60,40 65,35 70,40 Z M30,45 C28,45 25,48 25,50 C25,52 28,55 30,55 C32,55 35,52 35,50 C35,48 32,45 30,45 Z" />
                </svg>
                <svg viewBox="0 0 100 100" className="w-12 h-12 md:w-16 md:h-16 fill-[#3a0b0b] ml-4 md:ml-8 transform translate-y-3 md:translate-y-4">
                  <path d="M70,40 C65,30 55,25 45,35 L40,40 L30,40 C25,40 20,45 20,50 L20,70 L25,70 L25,80 L30,80 L30,70 L40,70 L40,80 L45,80 L45,70 L60,70 C65,70 70,65 70,60 L75,60 C80,60 85,55 85,50 L85,45 C85,40 80,35 75,35 C70,35 65,40 65,45 L60,45 C60,40 65,35 70,40 Z" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      <header className="fixed top-0 w-full z-50 py-4 px-4 md:py-6 md:px-12 flex justify-between items-center bg-[#1a0404]/90 backdrop-blur-xl border-b border-primary/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <div className="p-1.5 md:p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-[0_0_15px_rgba(197,160,89,0.5)] transform -rotate-3">
            <Globe className="text-white w-4 h-4 md:w-5 md:h-5" />
          </div>
          <h1 className="font-display text-sm md:text-xl tracking-[0.4em] text-white font-black uppercase text-glow">MOROVERSE</h1>
        </div>
        <div className="flex items-center gap-4 md:gap-8 pr-[70px] md:pr-0">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="font-bold text-[9px] md:text-[10px] tracking-widest text-primary/80 hover:text-primary transition-all px-4 py-2 md:px-8 md:py-3 rounded-full border border-primary/20 bg-black/40 backdrop-blur-md whitespace-nowrap hover:shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:border-primary/50"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center z-20 px-6 md:px-24">

        {/* Glowing Majestic Central Flag */}
        <div className="absolute inset-0 flex items-center justify-center md:pl-[20%] pointer-events-none mt-16 md:mt-0">
          <div className="relative">
            {/* Massive Glow Behind Flag */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-secondary/40 rounded-full blur-[60px] md:blur-[100px]"></div>

            {/* The Flag Pole */}
            <div className="absolute top-[10%] bottom-[-20%] left-[8%] w-1 md:w-2 bg-gradient-to-b from-slate-300 via-slate-400 to-transparent rounded-full shadow-2xl z-20"></div>

            <svg viewBox="0 0 900 600" className="w-[85vw] md:w-[800px] h-auto max-w-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-flag-flutter z-30 relative ml-8 md:ml-12 mt-4 md:mt-8 origin-left">
              <rect width="900" height="600" fill="#c1272d" rx="20" />
              <path
                d="M450,165 L482,264 L586,264 L502,325 L534,424 L450,363 L366,424 L398,325 L314,264 L418,264 Z"
                fill="none"
                stroke="#006233"
                strokeWidth="28"
                strokeLinejoin="round"
                className="filter drop-shadow-[0_0_15px_rgba(0,98,51,0.5)]"
              />
            </svg>
          </div>
        </div>

        {/* Left Aligned Content overlapping the cinematic background */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-40 max-w-3xl text-left"
        >
          <div className="inline-flex justify-center gap-4 mb-6 md:mb-10 text-primary bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-primary/20 shadow-xl">
            <Crown className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase">Royal Archives</span>
          </div>
          <h2 className="text-5xl md:text-8xl lg:text-[120px] font-sans mb-4 md:mb-6 text-white uppercase tracking-tighter leading-none font-black text-glow" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 40px rgba(197,160,89,0.4)' }}>
            {lang === 'ar' ? 'المغرب' : 'MOROCCO'}
          </h2>
          <h3 className="text-3xl md:text-5xl lg:text-7xl font-serif text-white/90 mb-4 md:mb-6 font-bold" style={{ textShadow: '0 5px 20px rgba(0,0,0,0.8)' }}>
            {lang === 'ar' ? 'جلالة ملكية' : 'Royal Majesty'}
          </h3>
          <p className="text-lg md:text-2xl text-primary font-medium mb-10 md:mb-12 tracking-wide leading-relaxed uppercase drop-shadow-md">
            {lang === 'ar' ? 'تدرجات الذهب الخالص' : 'Matte Gold Gradients'}
            <br />
            <span className="text-sm md:text-lg text-white/60 font-light mt-2 block capitalize">
              {lang === 'ar' ? 'اكتشف عبق التاريخ وروعة المكان' : 'Explore the soul and beauty of the Kingdom'}
            </span>
          </p>
          <button className="px-12 md:px-16 py-5 md:py-6 bg-gradient-to-r from-[#8b0000] to-[#500000] text-white font-black text-xs md:text-sm tracking-[0.3em] uppercase hover:from-primary hover:to-primary transition-all duration-500 rounded-full shadow-[0_10px_30px_rgba(139,0,0,0.5)] hover:shadow-[0_0_30px_rgba(197,160,89,0.8)] border border-white/10 flex items-center gap-4">
            {t.cta}
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
          </button>
        </motion.div>
      </section>

      {/* City Encyclopedia */}
      <section className="py-48 px-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center space-y-8">
            <h3 className="text-6xl font-serif text-primary uppercase tracking-[0.3em] font-black text-glow drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
              {t.sections.encyclopedia}
            </h3>
            <p className="text-white/60 max-w-4xl mx-auto text-xl font-light tracking-wide leading-relaxed uppercase drop-shadow-md">
              {t.sections.encyclopediaDesc}
            </p>
            <div className="w-64 h-1 bg-primary/20 mx-auto" />
          </div>

          <CityGrid lang={lang} />
        </div>
      </section>

      {/* Chronicles */}
      <section className="py-48 px-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center space-y-8">
            <h3 className="text-6xl font-serif text-primary uppercase tracking-[0.3em] font-black text-glow drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">{t.sections.battles}</h3>
            <p className="text-white/60 max-w-4xl mx-auto text-xl font-light tracking-wide leading-relaxed uppercase drop-shadow-md">{t.sections.battlesDesc}</p>
            <div className="w-64 h-1 bg-primary/20 mx-auto" />
          </div>

          <BattleDashboard lang={lang} />
        </div>
      </section>

      {/* Majestic Landmarks */}
      <section className="py-48 px-10 relative z-20 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-24 text-center space-y-8"
          >
            <h3 className="text-7xl font-serif text-primary uppercase tracking-wider font-black drop-shadow-sm text-glow">
              {lang === 'ar' ? (
                <span className="font-arabic text-primary/80">معالم مغربية</span>
              ) : (
                "Majestic Landmarks"
              )}
            </h3>
            <p className="text-white/60 max-w-4xl mx-auto text-xl font-light tracking-wide leading-relaxed uppercase drop-shadow-md">
              {t.sections.landmarksDesc}
            </p>
            <div className="w-64 h-1.5 bg-primary/20 mx-auto rounded-full" />
          </motion.div>

          <LandmarkGrid lang={lang} />
        </div>
      </section>

      {/* Historical Figures */}
      <section className="py-48 px-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-24 text-center space-y-8"
          >
            <h3 className="text-7xl font-serif text-primary uppercase tracking-[0.4em] font-black drop-shadow-sm">
              {lang === 'ar' ? (
                <span className="font-arabic text-primary/80">{t.sections.figures}</span>
              ) : (
                t.sections.figures
              )}
            </h3>
            <p className="text-white/60 max-w-4xl mx-auto text-xl font-light tracking-wide leading-relaxed uppercase drop-shadow-md">
              {t.sections.figuresDesc}
            </p>
            <div className="w-64 h-1.5 bg-primary/20 mx-auto rounded-full" />
          </motion.div>

          <HistoricalFiguresGrid lang={lang} />
        </div>
      </section>

      <footer className="py-32 text-center border-t border-primary/20 relative z-20 bg-black/60 backdrop-blur-xl">
        <Crown className="w-14 h-14 text-primary mx-auto mb-10 opacity-60 drop-shadow-[0_0_15px_rgba(197,160,89,0.5)]" />

        <div className="flex justify-center gap-12 mb-16 text-xs font-black uppercase tracking-[0.3em]">
          <Link href="/about" className="text-primary hover:text-white transition-all border-b border-transparent hover:border-primary pb-1">
            {lang === 'ar' ? 'عن MoroVerse' : 'About MoroVerse'}
          </Link>
          <Link href="/contact" className="text-slate-400 hover:text-primary transition-all border-b border-transparent hover:border-primary pb-1">
            {lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </Link>
        </div>

        <p className="text-foreground/30 text-[10px] tracking-[1.2em] uppercase font-bold mb-10 italic">Architected by Mohamed Amine El Amiri</p>
        <div className="flex justify-center gap-16 opacity-20">
          {["Sovereignty", "Identity", "Kingdom", "Heritage"].map(x => <span key={x} className="text-[11px] uppercase font-black tracking-[0.5em]">{x}</span>)}
        </div>
        <p className="mt-20 text-[9px] uppercase tracking-[0.6em] text-foreground/10 font-bold">MoroVerse 2026 | Royal Digital Archives</p>
      </footer>
    </div>
  );
}
