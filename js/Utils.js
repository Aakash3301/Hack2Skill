/**
 * Static Math Utilities
 * Pure functions for game calculations.
 */
export const MathUtils = {
    clamp: (v, min, max) => (v < min ? min : v > max ? max : v),
    randInt: (max) => (Math.random() * max) | 0,
    // Fast 2D Distance Squared (No Sqrt)
    distSq: (x1, y1, x2, y2) => (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
};
