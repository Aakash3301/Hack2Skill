import { CONFIG } from '../Config.js';

/**
 * Canvas Renderer
 * Handles all drawing operations. Dumb renderer.
 */
export class Renderer {
    #ctx;
    #config;

    constructor(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) throw new Error(`Canvas ${canvasId} not found`);
        this.#ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
        this.#config = CONFIG.GRID;

        canvas.width = this.#config.W * this.#config.TILE;
        canvas.height = this.#config.H * this.#config.TILE;
    }

    clear() {
        this.#ctx.fillStyle = CONFIG.COLORS.BG;
        this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

        this.#ctx.strokeStyle = CONFIG.COLORS.GRID;
        this.#ctx.lineWidth = 1;
        this.#ctx.beginPath();
        const w = this.#ctx.canvas.width;
        const h = this.#ctx.canvas.height;
        const t = this.#config.TILE;

        for (let x = 0; x <= w; x += t) { this.#ctx.moveTo(x, 0); this.#ctx.lineTo(x, h); }
        for (let y = 0; y <= h; y += t) { this.#ctx.moveTo(0, y); this.#ctx.lineTo(w, y); }
        this.#ctx.stroke();
    }

    drawEntity(x, y, color, shape = 'rect', pulse = 0) {
        const t = this.#config.TILE;
        const px = x * t;
        const py = y * t;

        this.#ctx.fillStyle = color;

        if (shape === 'rect') {
            this.#ctx.fillRect(px + 1, py + 1, t - 2, t - 2);
        } else if (shape === 'circle') {
            const r = (t / 2 - 2) + Math.sin(pulse) * 2;
            this.#ctx.beginPath();
            this.#ctx.arc(px + t / 2, py + t / 2, r, 0, 6.28);
            this.#ctx.fill();
        }
    }
}
