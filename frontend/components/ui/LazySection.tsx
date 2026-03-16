"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LazySectionProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    className?: string;
    isRTL?: boolean;
}

export default function LazySection({ children, title, subtitle, icon, className = "", isRTL = false }: LazySectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // Disconnect once loaded to freeze it in DOM
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            { rootMargin: "200px 0px" } // Load slightly before it comes into view
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section 
            ref={ref} 
            className={`py-16 md:py-24 relative z-20 ${className}`}
        >
            {/* Moroccan Title Styling */}
            {(title || icon) && (
                <div className="max-w-7xl mx-auto px-4 md:px-10 mb-12 flex flex-col items-center text-center">
                    {icon && (
                        <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-[#8b0000]/20 to-[#c5a059]/10 border border-[#c5a059]/30 drop-shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                            {icon}
                        </div>
                    )}
                    {title && (
                        <h2 className={`text-3xl md:text-5xl font-black mb-4 text-[#c5a059] drop-shadow-md tracking-wider ${isRTL ? "font-arabic" : ""}`}>
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <p className={`text-white/60 max-w-2xl text-sm md:text-base font-medium leading-relaxed ${isRTL ? "font-arabic" : ""}`}>
                            {subtitle}
                        </p>
                    )}
                    <div className="mt-8 w-48 h-1 bg-gradient-to-r from-transparent via-[#c5a059]/50 to-transparent"></div>
                </div>
            )}

            {/* Content Mount Boundary */}
            <div className="min-h-[300px] w-full relative">
                <AnimatePresence>
                    {isVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-full relative z-10"
                        >
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isVisible && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 border-4 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </section>
    );
}
