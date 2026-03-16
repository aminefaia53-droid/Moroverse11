"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Crown, Sparkles, MapPin, Building2, Camera, Music, Palmtree, Waves, Mountain, Tent, Sunset, Compass, MoveRight, Activity } from "lucide-react";

// Components
import dynamic from "next/dynamic";
import SmartSidebar from "../components/SmartSidebar";
import CommunityPulse from "../components/community/CommunityPulse";
import ContentDiscoveryGrid from "@/components/community/ContentDiscoveryGrid";
import HeritageFactSheet, { HeritageItem } from "@/components/HeritageFactSheet";

// Utils
import { useEncyclopedia } from "@/hooks/useEncyclopedia";
import { Post } from "@/types/social";
import { LucideSearch, LucideMapPin, Map, Landmark, Swords, Users } from "lucide-react";

const ExploreMap = dynamic(() => import("@/components/community/ExploreMap"), { ssr: false });

const PILLARS = [
    { id: 'heritage', icon: Landmark, en: 'Architectural Heritage', ar: 'التراث المعماري' },
    { id: 'geography', icon: Map, en: 'Geography & Regions', ar: 'الجغرافيا والمدن' },
    { id: 'chronicles', icon: Swords, en: 'Chronicles of Valor', ar: 'عصور البسالة' },
    { id: 'biographies', icon: Users, en: 'Historical Figures', ar: 'شخصيات تاريخية' },
    { id: 'tourism', icon: Compass, en: 'Elite Tourism', ar: 'رحلات النخبة' }
];

import AudioManager from "../utils/AudioManager";
import MoroVerseLogo from '@/components/MoroVerseLogo';
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "../components/ui/LanguageSwitcher";

export default function Home() {
  const { lang, setLang } = useLanguage();
  const [isClient, setIsClient] = useState(false);
  const isRTL = lang === 'ar';

  const [activePillar, setActivePillar] = useState<string>('heritage');
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [activeLocation, setActiveLocation] = useState<HeritageItem | null>(null);

  // Unified 5-Pillar Data Fetching Hook (Dashboard API)
  const { posts, isLoading } = useEncyclopedia(activePillar, selectedCity);

  const handleLocationSelect = (loc: Post | string) => {
      if (typeof loc === 'string') {
          setSelectedCity(loc === selectedCity ? undefined : loc);
      } else {
          // Map Post (from Dashboard API) directly to HeritageItem
          const item: HeritageItem = {
              id: loc.id,
              name: { ar: loc.location_name || '', en: loc.location_name || '' },
              city: { ar: loc.city || '', en: loc.city || '' },
              history: loc.content || '',
              summary: loc.summary || '',
              imageUrl: loc.image_url || undefined,
              model_url: loc.model_url || undefined,
              video_url: loc.video_url || undefined,
              gallery: loc.gallery || undefined,
              type: loc.location_type || 'post',
              slug: loc.slug,
              stats: {
                  year: loc.year,
                  era: loc.era,
                  combatants: loc.combatants ? { ar: loc.combatants, en: loc.combatants } : undefined,
                  leaders: loc.leaders ? { ar: loc.leaders, en: loc.leaders } : undefined,
                  outcome: loc.outcome ? { ar: loc.outcome, en: loc.outcome } : undefined,
                  tactics: loc.tactics ? { ar: loc.tactics, en: loc.tactics } : undefined,
                  impact: loc.impact ? { ar: loc.impact, en: loc.impact } : undefined
              }
          };
          setActiveLocation(item);
          
          // Auto-Pan map to location if coordinates exist
          if (loc.lat && loc.lng) {
              window.dispatchEvent(new CustomEvent('map-fly-to-target', { 
                  detail: { target: [loc.lat, loc.lng], zoom: 15 } 
              }));
          }
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

      {/* Sovereign Archive Engine: Map & Interactive Cards */}
      <section id="explore-engine" className="py-24 px-4 md:px-10 relative z-20 bg-[#050505]">
        <div className="max-w-7xl mx-auto space-y-12">
            
            {/* 5 Pillars Navigation */}
            <div className="overflow-x-auto pb-4 hide-scrollbar">
                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''} justify-start sm:justify-center`}>
                    {PILLARS.map(pillar => {
                        const Icon = pillar.icon;
                        const isActive = activePillar === pillar.id;
                        return (
                            <button
                                key={pillar.id}
                                onClick={() => { setActivePillar(pillar.id); setSelectedCity(undefined); }}
                                className={`flex items-center gap-3 px-6 py-4 rounded-3xl border whitespace-nowrap transition-all duration-300 ${isRTL ? 'flex-row-reverse font-arabic' : ''} ${
                                    isActive 
                                    ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-[0_0_30px_rgba(197,160,89,0.3)] scale-105' 
                                    : 'bg-black/40 text-white/50 border-white/10 hover:border-[#c5a059]/50 hover:text-white'
                                }`}
                            >
                                <Icon size={20} className={isActive ? 'text-black' : 'text-[#c5a059]'} />
                                <span className={`text-sm font-black uppercase tracking-widest ${isRTL ? 'font-arabic tracking-normal' : ''}`}>
                                    {isRTL ? pillar.ar : pillar.en}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Discovery Engine: Map Section */}
            <div className="space-y-6">
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <div className={`flex items-center gap-2 text-xs font-bold uppercase text-[#C5A059] bg-[#C5A059]/5 px-4 py-2 rounded-full border border-[#C5A059]/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <LucideMapPin size={14} />
                        <span className={isRTL ? 'font-arabic tracking-normal' : ''}>
                            {isRTL 
                                ? `ترشيح الأرشيف: ${PILLARS.find(p => p.id === activePillar)?.ar}` 
                                : `Visual Filtering: ${PILLARS.find(p => p.id === activePillar)?.en} Active`}
                        </span>
                    </div>
                    {selectedCity && (
                        <div className={`flex items-center gap-2 text-xs font-bold uppercase text-white/60 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span>{isRTL ? 'المدينة النشطة:' : 'Active City:'}</span>
                            <span className="text-white">{selectedCity}</span>
                            <button onClick={() => setSelectedCity(undefined)} className="ml-2 hover:text-red-400 font-bold text-lg">✕</button>
                        </div>
                    )}
                </div>
                <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    <ExploreMap 
                        onLocationSelect={handleLocationSelect} 
                        activeCategory={activePillar} 
                        selectedLocationId={activeLocation?.id}
                    />
                </div>
            </div>

            {/* Content Grid Section with horizontal mobile scroll */}
            <div className="pt-8 border-t border-white/10">
                <ContentDiscoveryGrid 
                    posts={posts} 
                    isLoading={isLoading} 
                    onCardClick={handleLocationSelect} 
                />
            </div>
            
        </div>
      </section>

      {/* Smart Fact Sheet Modal (Integrated here directly) */}
      <HeritageFactSheet 
          item={activeLocation} 
          isOpen={!!activeLocation} 
          onClose={() => setActiveLocation(null)} 
          lang={lang}
      />


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
