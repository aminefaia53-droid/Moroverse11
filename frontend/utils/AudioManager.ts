"use client";

class AudioManager {
    private ambientSource: HTMLAudioElement | null = null;
    private isEnabled: boolean = false;

    public static instance: AudioManager = new AudioManager();

    private constructor() { }

    public init() {
        if (typeof window === 'undefined') return;

        if (!this.ambientSource) {
            this.ambientSource = new Audio("/audio/andalusi-city.mp3"); // local placeholder for Moroccan Oud/Andalusian
            this.ambientSource.loop = true;
            this.ambientSource.volume = 0.3;
        }
    }

    public enableAudio() {
        this.isEnabled = true;
        this.init();
        if (this.ambientSource) {
            this.ambientSource.play().catch(e => console.warn("Audio Context blocked:", e));
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
    }
}

export default AudioManager;
