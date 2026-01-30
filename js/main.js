import { GameEngine } from './GameEngine.js';

window.onload = () => {
    try {
        new GameEngine();
    } catch (e) {
        console.error("CRITICAL ERROR:", e);
        alert("Game Failed to Start: " + e.message);
    }
};
