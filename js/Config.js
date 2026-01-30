/**
 * Global Configuration
 * Deep Frozen for Immutability (Security)
 */
export const CONFIG = Object.freeze({
    GRID: Object.freeze({
        W: 40,
        H: 30,
        TILE: 20
    }),
    COLORS: Object.freeze({
        BG: '#050510',
        GRID: '#1a1a2e',
        PLAYER: '#00ffcc',
        FRAGMENT: '#ff00ff',
        ENEMY: '#ff3333',
        PARTICLE: '#ffffff'
    }),
    INPUT: Object.freeze({
        KEYS: {
            UP: ['ArrowUp', 'KeyW'],
            DOWN: ['ArrowDown', 'KeyS'],
            LEFT: ['ArrowLeft', 'KeyA'],
            RIGHT: ['ArrowRight', 'KeyD'],
            PAUSE: ['Escape', 'Space']
        },
        THROTTLE_MS: 50,
        SWIPE_THRESHOLD: 30 // Mobile Swipe Distance
    }),
    GAMEPLAY: Object.freeze({
        baseSpeedPlayer: 0.08,
        baseSpeedEnemy: 5.0,
        baseSpawnRate: 3.5,
        SCORE_VAL: 100,
        MAX_DT: 0.1,
        DIFFICULTY_EXP: 1.2 // Power function exponent
    }),
    SECURITY: Object.freeze({
        SALT: 0xDEADBEEF,
        STORAGE_KEY: 'egs_secure_v1',
        SECRET: 'HACK2SKILL_SECURE_2026' // For HMAC
    }),
    AUDIO: Object.freeze({
        ENABLED: true,
        VOL_MASTER: 0.3
    }),
    PARTICLES: Object.freeze({
        COUNT: 500
    })
});
