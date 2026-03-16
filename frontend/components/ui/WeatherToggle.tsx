"use client";

import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, ShoppingBag } from 'lucide-react';
import AudioManager from '@/utils/AudioManager';

type WeatherState = 'clear' | 'rain' | 'market';

export default function WeatherToggle() {
    const [weather, setWeather] = useState<WeatherState>('clear');

    const toggleWeather = () => {
        let nextState: WeatherState = 'clear';
        if (weather === 'clear') nextState = 'rain';
        else if (weather === 'rain') nextState = 'market';
        
        setWeather(nextState);
        AudioManager.instance.setWeatherState(nextState);

        // Disptach event to change globals.css or background classes if needed
        window.dispatchEvent(new CustomEvent('moroverse-weather-change', { detail: nextState }));
    };

    // Listen for external sync
    useEffect(() => {
        const handleSync = (e: any) => setWeather(e.detail);
        window.addEventListener('moroverse-weather-change', handleSync);
        return () => window.removeEventListener('moroverse-weather-change', handleSync);
    }, []);

    // Effect to apply body styling based on weather for immersive "multi-state"
    useEffect(() => {
        const root = document.documentElement;
        if (weather === 'rain') {
            root.style.setProperty('--weather-overlay', 'linear-gradient(to bottom, rgba(0,20,40,0.4), transparent)');
        } else if (weather === 'market') {
            root.style.setProperty('--weather-overlay', 'linear-gradient(to bottom, rgba(200,100,0,0.1), transparent)');
        } else {
            root.style.setProperty('--weather-overlay', 'none');
        }
    }, [weather]);

    return (
        <button 
            onClick={toggleWeather}
            className="fixed bottom-6 right-6 z-[100] p-3 md:p-4 rounded-full bg-black/80 backdrop-blur-md border border-[#c5a059]/40 text-[#c5a059] hover:bg-[#c5a059]/20 hover:scale-110 transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] flex items-center justify-center group"
            title="Toggle Atmosphere (Clear -> Rain -> Market)"
        >
            {weather === 'clear' && <Sun size={24} className="group-hover:rotate-90 transition-transform duration-500" />}
            {weather === 'rain' && <CloudRain size={24} className="animate-pulse" />}
            {weather === 'market' && <ShoppingBag size={24} className="group-hover:translate-x-1 transition-transform" />}
        </button>
    );
}
