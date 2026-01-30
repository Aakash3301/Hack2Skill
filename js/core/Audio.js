import { CONFIG } from '../Config.js';

/**
 * Procedural Audio Manager
 * Generates sound effects on the fly using oscillators.
 */
export class AUDIO {
    static #ctx = null;
    static #masterGain = null;
    static #muted = false;

    static init() {
        if (!this.#ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.#ctx = new AudioContext();
            this.#masterGain = this.#ctx.createGain();
            this.#masterGain.gain.value = CONFIG.AUDIO.VOL_MASTER;
            this.#masterGain.connect(this.#ctx.destination);
        }
        if (this.#ctx.state === 'suspended') {
            this.#ctx.resume().catch(() => { });
        }
    }

    static toggleMute() {
        this.#muted = !this.#muted;
        if (this.#masterGain) {
            this.#masterGain.gain.value = this.#muted ? 0 : CONFIG.AUDIO.VOL_MASTER;
        }
        return this.#muted;
    }

    static playCollect() {
        if (this.#muted || !this.#ctx) return;
        this.init(); // Ensure live

        const osc = this.#ctx.createOscillator();
        const gain = this.#ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.#ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.#ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.5, this.#ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.#ctx.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.#masterGain);

        osc.start();
        osc.stop(this.#ctx.currentTime + 0.1);
    }

    static playCrash() {
        if (this.#muted || !this.#ctx) return;
        this.init();

        const osc = this.#ctx.createOscillator();
        const gain = this.#ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.#ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.#ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.8, this.#ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.#ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(this.#masterGain);

        osc.start();
        osc.stop(this.#ctx.currentTime + 0.3);
    }
}
