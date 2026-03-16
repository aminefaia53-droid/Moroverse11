"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Crown, Sparkles, MapPin, Building2, Camera, Music, Palmtree, Waves, Mountain, Tent, Sunset, Compass, MoveRight, Activity } from "lucide-react";

// Components
import dynamic from "next/dynamic";
import SmartSidebar from "../components/SmartSidebar";
import CommunityPulse from "../components/community/CommunityPulse";
import LazySection from "@/components/ui/LazySection";
import LazyContentGrid from "@/components/community/LazyContentGrid";
import OmniSearchBar from "@/components/ui/OmniSearchBar";

import AudioManager from "../utils/AudioManager";
import MoroVerseLogo from '@/components/MoroVerseLogo';
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";
import { Landmark, Map, Swords, Users } from "lucide-react";
import WeatherToggle from "@/components/ui/WeatherToggle";

export default function Home() {
  const { lang, setLang } = useLanguage();
  const [isClient, setIsClient] = useState(false);
  const isRTL = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const handleGlobalSearch = (query: string) => {
      const q = query.trim();
      setSearchQuery(q);

      // Audio weather sync based on city context
      if (q) {
          const lowerQ = q.toLowerCase();
          if (lowerQ.includes('fes') || lowerQ.includes('فاس') || lowerQ.includes('marrakech') || lowerQ.includes('مراكش')) {
              AudioManager.instance.setWeatherState('market');
          } else if (lowerQ.includes('chefchaouen') || lowerQ.includes('شفشاون') || lowerQ.includes('ifrane') || lowerQ.includes('ifran')) {
              AudioManager.instance.setWeatherState('rain');
          }
      } else {
          AudioManager.instance.setWeatherState('clear');
      }

      // Auto-scroll to results
      if (q && searchResultsRef.current) {
          setTimeout(() => {
              searchResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
      }
  };

  const t = ({
    en: {
      welcome: "MoroVerse: The Imperial Horizon",
      subtitle: "A Majesty Beyond Shadows, Carved in Eternal Emerald",
      cta: "Explore the Encyclopedia",
      sections: {
        encyclopedia: "Geography & Regions",
        encyclopediaDesc: "Explore the soul of every city, from the blue jewel in the north to the Atlantic pearl of the south.",
        battles: "Chronicles of Valor",
        battlesDesc: "Where dynastic glory meets the infinite drift.",
        landmarks: "Architectural Heritage",
        landmarksDesc: "Exploring the zenith of Moroccan architectural and historical heritage.",
        tourism: "Elite Tourism",
        tourismDesc: "Experience the Kingdom through tailored immersive adventures.",
        figures: "Historical Figures",
        figuresDesc: "Discover the luminaries who shaped the destiny of the Kingdom across the ages."
      }
    },
    ar: {
      welcome: "موروفيرس: الأفق الإمبراطوري",
      subtitle: "عظمة تتجاوز الظلال، منقوشة في الزمرد الأبدي",
      cta: "استكشف المدونة",
      sections: {
        encyclopedia: "الجغرافيا والمدن",
        encyclopediaDesc: "استكشف روح كل مدينة، من الجوهرة الزرقاء شمالاً إلى لؤلؤة الجنوب.",
        battles: "عصور البسالة",
        battlesDesc: "حيث تلتقي الأمجاد السلالية بالانجراف اللامتناهي.",
        landmarks: "التراث المعماري",
        landmarksDesc: "استكشاف ذروة التراث المعماري والتاريخي للمملكة المغربية.",
        tourism: "رحلات النخبة",
        tourismDesc: "اكتشف تنوع المملكة من خلال تجارب سياحية مصممة بعناية لتأسرك.",
        figures: "شخصيات تاريخية",
        figuresDesc: "اكتشف الأعلام الذين سطروا أمجاد المملكة عبر العصور."
      }
    }
  } as any)[lang] || ({
    en: {
      welcome: "MoroVerse: The Imperial Horizon",
      subtitle: "A Majesty Beyond Shadows, Carved in Eternal Emerald",
      cta: "Explore the Encyclopedia",
      sections: {
        encyclopedia: "Geography & Regions",
        encyclopediaDesc: "Explore the soul of every city, from the blue jewel in the north to the Atlantic pearl of the south.",
        battles: "Chronicles of Valor",
        battlesDesc: "Where dynastic glory meets the infinite drift.",
        landmarks: "Architectural Heritage",
        landmarksDesc: "Exploring the zenith of Moroccan architectural and historical heritage.",
        tourism: "Elite Tourism",
        tourismDesc: "Experience the Kingdom through tailored immersive adventures.",
        figures: "Historical Figures",
        figuresDesc: "Discover the luminaries who shaped the destiny of the Kingdom across the ages."
      }
    }
  }).en;

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

  if (!isClient) return null;

  return (
    <div className={`min-h-screen relative overflow-x-hidden text-foreground selection:bg-primary/20 font-sans ${lang === 'ar' ? 'font-arabic' : ''}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>

      {/* Zellij Silk Overlay */}
      <div className="zellij-overlay fixed inset-0 pointer-events-none opacity-[0.07]"></div>
      {/* FIXED BACKGROUND: CINEMATIC RADIAL GLOW & DUNES */}
      <div className="fixed inset-0 z-0 hero-radial-glow overflow-hidden">

        {/* Dynamic Subtle Landscape Overlay */}
        <div className="absolute inset-0 landscape-zoom opacity-20 md:mix-blend-overlay transition-opacity duration-1000 will-change-transform">
          <Image
            src="/hero-bg.png"
            alt="MoroVerse Landscape"
            fill
            className="object-cover object-center transform-gpu"
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
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[85%] text-[#aa3a18] opacity-90 z-20 mix-blend-screen drop-shadow-none md:drop-shadow-[0_-10px_30px_rgba(197,160,89,0.3)]">
            <path fill="currentColor" fillOpacity="1" d="M0,224L60,234.7C120,245,240,267,360,256C480,245,600,203,720,186.7C840,171,960,181,1080,202.7C1200,224,1320,256,1380,272L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>

          {/* Front Golden Sand Dune */}
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="absolute bottom-0 w-full h-[60%] text-[#C5A059] z-30 drop-shadow-md md:drop-shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
            <path fill="currentColor" fillOpacity="1" d="M0,96L80,117.3C160,139,320,181,480,186.7C640,192,800,160,960,144C1120,128,1280,128,1360,128L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>

          {/* Camel Parallax Effect walking on the middle dune */}
          <div className="hidden md:flex absolute bottom-[20%] md:bottom-[30%] w-[200vw] h-32 pointer-events-none z-20 opacity-60 animate-camel-tread items-end drop-shadow-none md:drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] will-change-transform">
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

      <header className="fixed top-0 w-full z-50 py-2.5 px-4 md:py-3 md:px-10 flex justify-between items-center bg-[#1a0404]/80 backdrop-blur-sm border-b border-primary/5 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <MoroVerseLogo className="w-5 h-5 md:w-7 md:h-7" />
            <h1 className="font-display text-[9px] md:text-xs tracking-[0.6em] text-white/70 font-medium uppercase" style={{ letterSpacing: '0.6em' }}>MOROVERSE</h1>
          </div>
          {/* Integrated Sidebar Trigger - Harmonized with Logo */}
          <div className="h-4 w-[1px] bg-primary/20 mx-1 hidden md:block"></div>
          <SmartSidebar isHeaderTrigger={true} />
        </div>
        <div className="flex items-center gap-3 md:gap-8">
          {/* Direct Community Button for Mobile & Desktop */}
          <Link href="/community" className="flex items-center gap-1.5 text-[var(--primary)] hover:text-[var(--background)] transition-colors bg-[var(--primary)]/10 hover:bg-[var(--primary)]/90 px-3 py-1.5 rounded-full border border-[var(--primary)]/20 shadow-[0_0_10px_rgba(197,160,89,0.2)]">
            <Activity className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-bold tracking-wider uppercase font-arabic">
              {lang === 'ar' ? 'نبض المجتمع' : 'Community'}
            </span>
          </Link>

          <LanguageSwitcher />
        </div>
      </header>

      {/* Smart Sidebar Panel is rendered here, but trigger is in header */}
      <SmartSidebar isHeaderTrigger={false} />

      {/* Community Pulse Sidebar (Visible on desktop) */}
      <CommunityPulse />

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center z-20 px-4">

        {/* Glowing Majestic Central Flag */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-16 md:mt-0 opacity-40">
          <div className="relative">
            {/* Massive Glow Behind Flag */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[var(--primary)]/10 rounded-full blur-[40px] md:blur-[120px] will-change-transform"></div>

            <svg viewBox="0 0 900 600" className="w-[85vw] md:w-[800px] h-auto max-w-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] md:drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-flag-flutter z-30 relative mt-4 md:mt-8 origin-left will-change-transform">
              <rect width="900" height="600" fill="#c1272d" rx="20" />
              <path
                d="M450,165 L482,264 L586,264 L502,325 L534,424 L450,363 L366,424 L398,325 L314,264 L418,264 Z"
                fill="none"
                stroke="#006233"
                strokeWidth="28"
                strokeLinejoin="round"
                className="filter drop-shadow-[0_0_10px_rgba(0,98,51,0.3)] md:drop-shadow-[0_0_15px_rgba(0,98,51,0.5)]"
              />
            </svg>
          </div>
        </div>

        {/* Centered Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-40 max-w-4xl w-full text-center mx-auto px-4 flex flex-col items-center mt-20"
        >
          <div className="flex flex-col items-center gap-6 mb-6 mt-16">
            <MoroVerseLogo className="w-14 h-14 md:w-20 md:h-20 drop-shadow-[0_0_20px_var(--glow-color)] transition-all duration-1000 opacity-90" />
            <h2 className="font-display text-3xl md:text-5xl text-[var(--foreground)] font-medium tracking-[0.7em] text-glow transition-colors duration-1000 uppercase" style={{ textShadow: '0 8px 32px rgba(0,0,0,0.9), 0 0 20px var(--glow-color)', opacity: 0.9 }}>
              MOROVERSE
            </h2>
          </div>

          <div className="inline-flex justify-center gap-3 mb-10 text-[var(--primary)] bg-[var(--background)]/20 backdrop-blur-md px-5 py-2 rounded-full border border-[var(--primary)]/10 shadow-xl">
            <Crown className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-70" />
            <span className="text-[9px] md:text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">The Moroccan Digital Archive</span>
          </div>

          <div className="space-y-4 mb-12 max-w-2xl">
            <h3 className="text-xl md:text-3xl text-[var(--foreground)] font-bold font-arabic drop-shadow-md">
              {lang === 'ar' ? 'تاريخ عريق يرحب بكم' : 'AI Meets Authenticity'}
            </h3>
            <p className="text-xs md:text-base text-[var(--primary)]/80 font-medium tracking-wide leading-relaxed bg-[var(--background)]/10 py-4 px-8 rounded-2xl backdrop-blur-[2px] border border-[var(--primary)]/5">
              {lang === 'ar' ? 'اكتشف عبق التاريخ وروعة المكان في بوابة زمنية متطورة' : 'Explore the soul and beauty of the Kingdom through an advanced time portal'}
            </p>
          </div>

          <Link href="/explore">
            <button className="px-12 md:px-16 py-4 md:py-5 bg-gradient-to-r from-[var(--secondary)] to-[var(--background)] text-[var(--foreground)] font-bold text-[10px] md:text-xs tracking-[0.4em] uppercase transition-all duration-500 rounded-full shadow-2xl hover:shadow-[0_0_40px_var(--glow-color)] border border-[var(--primary)]/20 flex items-center gap-3 group">
              <Compass className="w-4 h-4 text-[var(--primary)] group-hover:text-[var(--foreground)] transition-colors" />
              {t.cta}
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Global AI Omni-Search Bar */}
      <section className="relative z-30 py-10 px-4 mt-[-100px] md:mt-[-150px]">
          <OmniSearchBar isRTL={isRTL} onSearchSubmit={handleGlobalSearch} />
      </section>

      {/* ─── LIVE SEARCH RESULTS ─── */}
      {searchQuery && (
          <section ref={searchResultsRef} className="relative z-30 py-8 px-4 md:px-10 border-y border-[#FFD700]/20 bg-[#0f3b57]/20 backdrop-blur-sm">
              <div className="max-w-7xl mx-auto">
                  <div className="flex items-center gap-3 mb-6">
                      <span className="text-[#FFD700] text-xl">🔍</span>
                      <h2 className="text-white font-bold text-lg">
                          {isRTL ? `نتائج البحث: "${searchQuery}"` : `Search: "${searchQuery}"`}
                      </h2>
                      <button
                          onClick={() => { setSearchQuery(''); AudioManager.instance.setWeatherState('clear'); }}
                          className="ml-auto text-white/40 hover:text-white text-xs border border-white/20 px-3 py-1 rounded-full transition-colors"
                      >
                          {isRTL ? 'إلغاء' : 'Clear'}
                      </button>
                  </div>
                  <LazyContentGrid category="all" lang={lang as 'en' | 'ar'} searchQuery={searchQuery} />
              </div>
          </section>
      )}

      {/* Modern Vertical Architecture: Lazy Loaded Sections */}
      <div className="relative z-20 pb-24 space-y-12">
          
          <LazySection 
              title={isRTL ? "المدن الخالدة" : "Eternal Cities"}
              subtitle={isRTL ? "استكشف روح كل مدينة وتفاصيلها الجغرافية." : "Explore the soul of every city and its geography."}
              icon={<Map size={32} className="text-[#c5a059]" />}
              isRTL={isRTL}
          >
              <div className="px-4 md:px-10">
                  <LazyContentGrid category="geography" lang={lang as 'en' | 'ar'} />
              </div>
          </LazySection>

          <LazySection 
              title={isRTL ? "المعالم التاريخية" : "Architectural Heritage"}
              subtitle={isRTL ? "ذروة التراث المعماري والتاريخي للمملكة المغربية." : "The zenith of Moroccan architectural and historical heritage."}
              icon={<Landmark size={32} className="text-[#c5a059]" />}
              isRTL={isRTL}
              className="bg-[#0a0a0a]/50 border-y border-white/5"
          >
              <div className="px-4 md:px-10">
                  <LazyContentGrid category="heritage" lang={lang as 'en' | 'ar'} />
              </div>
          </LazySection>

          <LazySection 
              title={isRTL ? "عصور البسالة" : "Chronicles of Valor"}
              subtitle={isRTL ? "سجلات المعارك الإمبراطورية." : "Records of Imperial Battles."}
              icon={<Swords size={32} className="text-[#c5a059]" />}
              isRTL={isRTL}
          >
              <div className="px-4 md:px-10">
                  <LazyContentGrid category="chronicles" lang={lang as 'en' | 'ar'} />
              </div>
          </LazySection>

          <LazySection 
              title={isRTL ? "شخصيات تاريخية" : "Historical Figures"}
              subtitle={isRTL ? "الأعلام الذين سطروا أمجاد المملكة." : "Luminaries who shaped the destiny of the Kingdom."}
              icon={<Users size={32} className="text-[#c5a059]" />}
              isRTL={isRTL}
              className="bg-[#0a0a0a]/50 border-y border-white/5"
          >
              <div className="px-4 md:px-10">
                  <LazyContentGrid category="biographies" lang={lang as 'en' | 'ar'} />
              </div>
          </LazySection>

          <LazySection 
              title={isRTL ? "رحلات النخبة" : "Elite Tourism"}
              subtitle={isRTL ? "تجارب سياحية مصممة بعناية." : "Discover experiences tailored to captivate."}
              icon={<Globe size={32} className="text-[#c5a059]" />}
              isRTL={isRTL}
          >
              <div className="px-4 md:px-10">
                  <LazyContentGrid category="tourism" lang={lang as 'en' | 'ar'} />
              </div>
          </LazySection>

      </div>

      <WeatherToggle />

      <footer className="py-32 text-center border-t border-primary/20 relative z-20 bg-black/60 backdrop-blur-sm">
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
