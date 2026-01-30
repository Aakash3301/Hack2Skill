import { CONFIG } from '../Config.js';

/**
 * Secure Storage System
 * Uses a simple Hash-based Message Authentication Code (HMAC) to verify integrity.
 */
export class SecureStorage {

    static #hash(data) {
        let str = data + CONFIG.SECURITY.SECRET;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash.toString(16);
    }

    static save(key, value) {
        try {
            const payload = {
                data: value,
                hash: this.#hash(String(value))
            };
            localStorage.setItem(key, JSON.stringify(payload));
        } catch (e) {
            console.warn("Storage Save Failed", e);
        }
    }

    static load(key, fallback = 0) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return fallback;

            const payload = JSON.parse(raw);
            const computedHash = this.#hash(String(payload.data));

            if (payload.hash !== computedHash) {
                console.error("STORAGE TAMPERING DETECTED. RESETTING.");
                return fallback;
            }
            return payload.data;
        } catch (e) {
            console.warn("Storage Load Failed", e);
            return fallback;
        }
    }
}
