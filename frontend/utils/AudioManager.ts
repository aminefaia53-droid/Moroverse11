"use client";

class AudioManager {
    private ambientSource: HTMLAudioElement | null = null;
    private weatherSource: HTMLAudioElement | null = null;
    private marketSource: HTMLAudioElement | null = null;
    private isEnabled: boolean = false;
    private currentWeather: string = 'clear'; // 'clear' | 'rain' | 'market'

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
             this.weatherSource = new Audio("/audio/soft-rain-ambience.mp3");
             this.weatherSource.loop = true;
             this.weatherSource.volume = 0.0;
        }

        if (!this.marketSource) {
            this.marketSource = new Audio("/audio/moroccan-souk.mp3"); // Placeholder for bustling market
            this.marketSource.loop = true;
            this.marketSource.volume = 0.0;
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

    public setWeatherState(weather: 'clear' | 'rain' | 'market') {
        if (typeof window === 'undefined') return;
        this.currentWeather = weather;
        
        if (!this.isEnabled) return;

        const fadeAudio = (audioObj: HTMLAudioElement | null, targetVol: number) => {
            if (!audioObj) return;
            if (targetVol > 0) {
                audioObj.volume = 0;
                audioObj.play().catch(e => console.warn(e));
            }
            let vol = audioObj.volume;
            const diff = targetVol - vol;
            if (Math.abs(diff) < 0.01) return;
            
            const step = diff > 0 ? 0.05 : -0.05;
            const fadeId = setInterval(() => {
                vol += step;
                if ((step > 0 && vol >= targetVol) || (step < 0 && vol <= targetVol)) {
                    clearInterval(fadeId);
                    audioObj.volume = targetVol;
                    if (targetVol === 0) audioObj.pause();
                } else {
                    audioObj.volume = vol;
                }
            }, 200);
        };

        if (weather === 'rain') {
            fadeAudio(this.weatherSource, 0.4);
            fadeAudio(this.marketSource, 0);
        } else if (weather === 'market') {
            fadeAudio(this.marketSource, 0.3);
            fadeAudio(this.weatherSource, 0);
        } else {
            // clear
            fadeAudio(this.weatherSource, 0);
            fadeAudio(this.marketSource, 0);
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
        if (this.marketSource) {
            this.marketSource.pause();
        }
    }
}

export default AudioManager;

