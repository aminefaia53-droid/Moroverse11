"use client";

class AudioManager {
    private ambientSource: HTMLAudioElement | null = null;
    private weatherSource: HTMLAudioElement | null = null;
    private isEnabled: boolean = false;
    private currentWeather: string = 'clear'; // 'clear' | 'rain'

    public static instance: AudioManager = new AudioManager();

    private constructor() { }

    public init() {
        if (typeof window === 'undefined') return;

        if (!this.ambientSource) {
            this.ambientSource = new Audio("/audio/andalusi-city.mp3"); // local placeholder for Moroccan Oud/Andalusian
            this.ambientSource.loop = true;
            this.ambientSource.volume = 0.2;
        }

        if (!this.weatherSource) {
             // Use a low, calm rain track
             // Make sure to add this file to public/audio later, or use a reliable CDN
             this.weatherSource = new Audio("/audio/soft-rain-ambience.mp3");
             this.weatherSource.loop = true;
             this.weatherSource.volume = 0.0; // Start at 0 volume
        }
    }

    public enableAudio() {
        this.isEnabled = true;
        this.init();
        if (this.ambientSource) {
            this.ambientSource.play().catch(e => console.warn("Audio Context blocked:", e));
        }
        if (this.weatherSource && this.currentWeather === 'rain') {
            this.weatherSource.volume = 0.4;
            this.weatherSource.play().catch(e => console.warn("Weather Audio Context blocked:", e));
        }
    }

    public setWeatherState(weather: 'clear' | 'rain') {
        if (typeof window === 'undefined') return;
        this.currentWeather = weather;
        
        if (!this.isEnabled || !this.weatherSource) return;

        if (weather === 'rain') {
            this.weatherSource.volume = 0;
            this.weatherSource.play().catch(e => console.warn(e));
            // Fade in
            let vol = 0;
            const fadeId = setInterval(() => {
                vol += 0.05;
                if (vol >= 0.4) {
                    clearInterval(fadeId);
                    this.weatherSource!.volume = 0.4;
                } else {
                    this.weatherSource!.volume = vol;
                }
            }, 200);
        } else {
            // Fade out
            let vol = this.weatherSource.volume;
            const fadeId = setInterval(() => {
                vol -= 0.05;
                if (vol <= 0) {
                    clearInterval(fadeId);
                    this.weatherSource!.pause();
                    this.weatherSource!.volume = 0;
                } else {
                    this.weatherSource!.volume = vol;
                }
            }, 200);
        }
    }


    public speak(text: string, lang: 'en' | 'ar', onComplete?: () => void) {
        if (!this.isEnabled || typeof window === 'undefined') return;

        // Cancel any pending speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;

        // Try to find a better voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v =>
            (lang === 'ar' && (v.name.includes('Naayf') || v.name.includes('Arabic'))) ||
            (lang === 'en' && (v.name.includes('Google US English') || v.name.includes('Male')))
        );

        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onend = () => {
            if (onComplete) onComplete();
        };

        window.speechSynthesis.speak(utterance);
    }

    public stopAmbient() {
        if (this.ambientSource) {
            this.ambientSource.pause();
        }
        if (this.weatherSource) {
            this.weatherSource.pause();
        }
    }
}

export default AudioManager;

