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

      {/* FIXED BACKGROUND: PURE WHITE WITH ENHANCED ANIMATED FLAG */}
      <div className="fixed inset-0 z-0 bg-white">
        {/* Animated Large Flag Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08] animate-flag-flutter">
          <svg viewBox="0 0 900 600" className="w-[85%] max-w-[1200px] h-auto drop-shadow-2xl">
            <rect width="900" height="600" fill="#c1272d" rx="40" />
            <path
              d="M450,165 L482,264 L586,264 L502,325 L534,424 L450,363 L366,424 L398,325 L314,264 L418,264 Z"
              fill="none"
              stroke="#006233"
              strokeWidth="28"
              strokeLinejoin="round"
              className="filter drop-shadow-[0_0_15px_rgba(0,98,51,0.3)]"
            />
          </svg>
        </div>

        {/* Dynamic Subtle Landscape Overlay */}
        <div className="absolute inset-0 landscape-zoom opacity-[0.05] grayscale mix-blend-multiply transition-opacity duration-1000">
          <Image
            src="/hero-bg.png"
            alt="MoroVerse Landscape"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <header className="fixed top-0 w-full z-50 py-6 px-12 flex justify-between items-center bg-white/40 backdrop-blur-xl border-b border-secondary/10">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary rounded-xl shadow-xl transform -rotate-3">
            <Globe className="text-white w-5 h-5" />
          </div>
          <h1 className="font-display text-xl tracking-[0.4em] text-foreground font-black uppercase">MOROVERSE</h1>
        </div>
        <div className="flex items-center gap-8">
          <button
            onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
            className="font-bold text-[10px] tracking-widest text-foreground hover:text-primary transition-all px-8 py-3 rounded-full border border-foreground/10 bg-white/50 backdrop-blur-md"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center z-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="glass-card-elite p-20 max-w-6xl text-center border-t-8 border-primary/20 bg-white/80"
        >
          <div className="flex justify-center gap-8 mb-10 text-primary opacity-60">
            <Crown className="w-8 h-8" />
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-6xl md:text-8xl font-serif mb-8 text-foreground uppercase tracking-tighter leading-none font-black">
            {t.welcome}
          </h2>
          <p className="text-xl md:text-2xl text-foreground/50 font-light mb-12 tracking-[0.2em] max-w-4xl mx-auto uppercase">
            {t.subtitle}
          </p>
          <button className="px-20 py-6 bg-primary text-white font-black text-xs tracking-[0.5em] uppercase hover:bg-slate-900 transition-all rounded-full shadow-2xl shadow-primary/30">
            {t.cta}
          </button>
        </motion.div>
      </section>

      {/* City Encyclopedia */}
      <section className="py-48 px-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 text-center space-y-8">
            <h3 className="text-6xl font-serif text-primary uppercase tracking-[0.3em] font-black">
              {t.sections.encyclopedia}
            </h3>
            <p className="text-foreground/40 max-w-4xl mx-auto text-xl font-light tracking-wide leading-relaxed uppercase">
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
            <h3 className="text-6xl font-serif text-primary uppercase tracking-[0.3em] font-black">{t.sections.battles}</h3>
            <p className="text-foreground/40 max-w-4xl mx-auto text-xl font-light tracking-wide leading-relaxed uppercase">{t.sections.battlesDesc}</p>
            <div className="w-64 h-1 bg-primary/20 mx-auto" />
          </div>

          <BattleDashboard lang={lang} />
        </div>
      </section>

      {/* Majestic Landmarks */}
      <section className="py-48 px-10 relative z-20 bg-slate-50/30">
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
                <span className="font-arabic text-primary/80">معالم مغربية</span>
              ) : (
                "Majestic Landmarks"
              )}
            </h3>
            <p className="text-foreground/40 max-w-4xl mx-auto text-xl font-light tracking-wide leading-relaxed uppercase">
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
            <p className="text-foreground/40 max-w-4xl mx-auto text-xl font-light tracking-wide leading-relaxed uppercase">
              {t.sections.figuresDesc}
            </p>
            <div className="w-64 h-1.5 bg-primary/20 mx-auto rounded-full" />
          </motion.div>

          <HistoricalFiguresGrid lang={lang} />
        </div>
      </section>

      <footer className="py-32 text-center border-t border-primary/5 relative z-20 bg-white">
        <Crown className="w-14 h-14 text-primary mx-auto mb-10 opacity-20" />

        <div className="flex justify-center gap-12 mb-16 text-xs font-black uppercase tracking-[0.3em]">
          <Link href="/about" className="text-slate-400 hover:text-primary transition-all border-b border-transparent hover:border-primary pb-1">
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
