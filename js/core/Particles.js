import { CONFIG } from '../Config.js';
import { MathUtils } from '../Utils.js';

/**
 * Zero-Allocation Particle System
 * Uses fixed TypedArrays for maximum performance.
 */
export class ParticleSystem {
    #count;
    #x;
    #y;
    #vx;
    #vy;
    #life;
    #maxLife;
    #activeCount = 0;

    constructor() {
        const N = CONFIG.PARTICLES.COUNT;
        this.#count = N;
        this.#x = new Float32Array(N);
        this.#y = new Float32Array(N);
        this.#vx = new Float32Array(N);
        this.#vy = new Float32Array(N);
        this.#life = new Float32Array(N);
        this.#maxLife = new Float32Array(N);
    }

    /**
     * Spawn an explosion of particles
     */
    emit(x, y, color, amount = 10) {
        const GridW = CONFIG.GRID.W;
        const GridH = CONFIG.GRID.H;

        let spawned = 0;
        for (let i = 0; i < this.#count; i++) {
            if (this.#life[i] <= 0) {
                this.#x[i] = x;
                this.#y[i] = y;

                const angle = Math.random() * 6.28;
                const speed = Math.random() * 5 + 2;

                this.#vx[i] = Math.cos(angle) * speed;
                this.#vy[i] = Math.sin(angle) * speed;

                this.#life[i] = 1.0;
                this.#maxLife[i] = Math.random() * 0.5 + 0.5;

                spawned++;
                if (spawned >= amount) break;
            }
        }
    }

    update(dt) {
        for (let i = 0; i < this.#count; i++) {
            if (this.#life[i] > 0) {
                this.#life[i] -= dt;

                this.#x[i] += this.#vx[i] * dt;
                this.#y[i] += this.#vy[i] * dt;
            }
        }
    }

    /**
     * Renderer calls this directly to draw batch
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} tileSize
     */
    draw(ctx, tileSize) {
        ctx.fillStyle = CONFIG.COLORS.PARTICLE;
        for (let i = 0; i < this.#count; i++) {
            if (this.#life[i] > 0) {
                const px = this.#x[i] * tileSize;
                const py = this.#y[i] * tileSize;
                const size = (this.#life[i] / this.#maxLife[i]) * (tileSize * 0.4);

                ctx.globalAlpha = this.#life[i];
                ctx.fillRect(px, py, size, size);
            }
        }
        ctx.globalAlpha = 1.0;
    }
}
