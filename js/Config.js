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
        ENEMY: '#ff3333'
    }),
    INPUT: Object.freeze({
        KEYS: {
            UP: ['ArrowUp', 'KeyW'],
            DOWN: ['ArrowDown', 'KeyS'],
            LEFT: ['ArrowLeft', 'KeyA'],
            RIGHT: ['ArrowRight', 'KeyD'],
            PAUSE: ['Escape', 'Space']
        },
        THROTTLE_MS: 50 // Input debouncing
    }),
    GAMEPLAY: Object.freeze({
        SPEED_PLAYER: 0.08, // Move interval (s)
        SPEED_ENEMY: 5.0, // Grid units per second
        SPAWN_RATE: 3.5,
        SCORE_VAL: 100,
        MAX_DT: 0.1 // Anti-lag/cheat clamp
    }),
    SECURITY: Object.freeze({
        SALT: 0xDEADBEEF // Simple Obfuscation Salt
    })
});
