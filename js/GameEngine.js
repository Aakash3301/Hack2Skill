import { CONFIG } from './Config.js';
import { MathUtils } from './Utils.js';
import { Pool } from './core/Pool.js';
import { InputSystem } from './core/Input.js';
import { Renderer } from './core/Renderer.js';
import { PauseCommand, MoveCommand } from './core/Command.js';
import { Player } from './entities/Player.js';
import { Enemy } from './entities/Enemy.js';

/**
 * Game Engine
 * Singleton Orchestrator
 */
export class GameEngine {
    static #instance;

    // State
    #state = 'MENU';
    #score = 0;
    #shadowScore = 0;
    #highScore = 0;

    // Systems
    #renderer;
    #input;
    #enemyPool;

    // Entities
    #player;
    #enemies = [];
    #fragment = { x: 0, y: 0, active: false };

    // Loops
    #lastTime = 0;
    #moveTimer = 0;
    #spawnTimer = 0;
    #globalTime = 0;

    constructor() {
        if (GameEngine.#instance) return GameEngine.#instance;
        GameEngine.#instance = this;

        // Initialize Systems
        this.#renderer = new Renderer('gameCanvas');
        this.#input = new InputSystem();

        // Initialize Entities
        this.#player = new Player();
        this.#enemyPool = new Pool(
            () => new Enemy(),
            (e) => { e.active = true; },
            20
        );

        // Bind DOM
        const startBtn = document.getElementById('start-btn');
        if (startBtn) startBtn.onclick = () => this.start();

        this.#loadHighScore();
        this.#updateHUD();

        // Start Loop
        requestAnimationFrame((t) => this.#loop(t));

        console.log("[SYSTEM] GameEngine Initialized (Modular)");
    }

    #loadHighScore() {
        try {
            const s = localStorage.getItem('egs_prod_high');
            if (s) this.#highScore = parseInt(s, 10) ^ CONFIG.SECURITY.SALT;
        } catch (e) { }
    }

    #saveHighScore() {
        try {
            localStorage.setItem('egs_prod_high', (this.#highScore ^ CONFIG.SECURITY.SALT).toString());
        } catch (e) { }
    }

    #addScore(val) {
        if (val > CONFIG.GAMEPLAY.SCORE_VAL) return;
        this.#score += val;
        this.#shadowScore = (this.#score ^ CONFIG.SECURITY.SALT);
    }

    #checkIntegrity() {
        if ((this.#score ^ CONFIG.SECURITY.SALT) !== this.#shadowScore) {
            console.error("SECURITY VIOLATION");
            this.gameOver(true);
            return false;
        }
        return true;
    }

    start() {
        this.#state = 'PLAYING';
        this.#score = 0;
        this.#shadowScore = (0 ^ CONFIG.SECURITY.SALT);
        this.#globalTime = 0;
        this.#moveTimer = 0;
        this.#spawnTimer = 0;

        this.#input.reset();

        this.#player.init(Math.floor(CONFIG.GRID.W / 2), Math.floor(CONFIG.GRID.H / 2));

        this.#enemies.forEach(e => this.#enemyPool.release(e));
        this.#enemies.length = 0;
        this.#spawnFragment();

        this.#toggleOverlay(false);
        this.#updateHUD();
        this.#announce("Game Started. Good Luck. Level 1.");

        // Focus Canvas for Keyboard Events
        const canvas = document.getElementById('gameCanvas');
        if (canvas) canvas.focus();

        this.#lastTime = performance.now();
    }

    togglePause() {
        if (this.#state === 'PLAYING') {
            this.#state = 'PAUSED';
            document.getElementById('status-text').innerText = "SUSPENDED";
            this.#toggleOverlay(true, false);
            this.#announce("Game Paused");
        } else if (this.#state === 'PAUSED') {
            this.#state = 'PLAYING';
            this.#toggleOverlay(false);
            this.#announce("Resuming Game");
            this.#lastTime = performance.now();

            const canvas = document.getElementById('gameCanvas');
            if (canvas) canvas.focus();
        }
    }

    gameOver(violation = false) {
        this.#state = 'GAMEOVER';
        if (!violation && this.#score > this.#highScore) {
            this.#highScore = this.#score;
            this.#saveHighScore();
        }

        const title = violation ? "SECURITY BREACH" : "CRITICAL FAILURE";
        const status = violation ? "INTEGRITY COMPROMISED" : "SYSTEM CRASHED";
        const msg = `${title}. ${status}. Final Data: ${this.#score}`;

        document.getElementById('title-text').innerText = title;
        document.getElementById('status-text').innerText = status;

        this.#updateHUD();
        this.#toggleOverlay(true);
        this.#announce(msg);

        // Focus Start Button for easy restart
        const btn = document.getElementById('start-btn');
        if (btn) btn.focus();
    }

    #announce(msg) {
        const el = document.getElementById('a11y-status');
        if (el) el.innerText = msg;
    }

    #spawnFragment() {
        let valid = false;
        let x, y;
        let safeOps = 0;
        while (!valid && safeOps++ < 100) {
            x = MathUtils.randInt(CONFIG.GRID.W);
            y = MathUtils.randInt(CONFIG.GRID.H);
            valid = true;
            if (x === this.#player.x && y === this.#player.y) valid = false;
            for (let t of this.#player.tail) if (t.x === x && t.y === y) valid = false;
        }
        this.#fragment.x = x;
        this.#fragment.y = y;
        this.#fragment.active = true;
    }

    #spawnEnemy() {
        const e = this.#enemyPool.get();
        if (Math.random() > 0.5) {
            e.x = Math.random() > 0.5 ? 0 : CONFIG.GRID.W - 1;
            e.y = MathUtils.randInt(CONFIG.GRID.H);
        } else {
            e.x = MathUtils.randInt(CONFIG.GRID.W);
            e.y = Math.random() > 0.5 ? 0 : CONFIG.GRID.H - 1;
        }
        this.#enemies.push(e);
    }

    #loop(now) {
        if (!this.#lastTime) this.#lastTime = now;
        let dt = (now - this.#lastTime) / 1000;
        this.#lastTime = now;

        if (dt > CONFIG.GAMEPLAY.MAX_DT) dt = CONFIG.GAMEPLAY.MAX_DT;

        if (this.#state === 'PLAYING') {
            if (!this.#checkIntegrity()) return;
            this.#update(dt);
        }

        this.#draw();
        requestAnimationFrame((t) => this.#loop(t));
    }

    #update(dt) {
        this.#globalTime += dt;

        let cmd = this.#input.pop();
        if (cmd) {
            if (cmd instanceof PauseCommand) cmd.execute(this);
            else if (cmd instanceof MoveCommand) cmd.execute(this.#player);
        }

        this.#moveTimer += dt;
        if (this.#moveTimer >= CONFIG.GAMEPLAY.SPEED_PLAYER) {
            this.#moveTimer -= CONFIG.GAMEPLAY.SPEED_PLAYER;

            this.#player.tick();

            const p = this.#player;
            if (p.x < 0 || p.x >= CONFIG.GRID.W || p.y < 0 || p.y >= CONFIG.GRID.H) {
                return this.gameOver();
            }
            for (let t of p.tail) {
                if (t.x === p.x && t.y === p.y) return this.gameOver();
            }
            if (p.x === this.#fragment.x && p.y === this.#fragment.y) {
                this.#addScore(CONFIG.GAMEPLAY.SCORE_VAL);
                p.len += 1;
                this.#spawnFragment();
                this.#updateHUD();
            }
        }

        const enemyDist = CONFIG.GAMEPLAY.SPEED_ENEMY * dt;
        const pX = this.#player.x;
        const pY = this.#player.y;

        for (let i = 0; i < this.#enemies.length; i++) {
            const e = this.#enemies[i];
            const dx = pX - e.x;
            const dy = pY - e.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 0.01) {
                e.x += (dx / dist) * enemyDist;
                e.y += (dy / dist) * enemyDist;
            }

            if (MathUtils.distSq(pX, pY, e.x, e.y) < 0.64) {
                return this.gameOver();
            }
        }

        this.#spawnTimer += dt;
        if (this.#spawnTimer >= CONFIG.GAMEPLAY.SPAWN_RATE) {
            this.#spawnTimer = 0;
            this.#spawnEnemy();
        }
    }

    #draw() {
        const ren = this.#renderer;
        ren.clear();

        if (this.#fragment.active) {
            const pulse = this.#globalTime * 5;
            ren.drawEntity(this.#fragment.x, this.#fragment.y, CONFIG.COLORS.FRAGMENT, 'circle', pulse);
        }

        for (let t of this.#player.tail) {
            ren.drawEntity(t.x, t.y, CONFIG.COLORS.PLAYER, 'rect');
        }
        ren.drawEntity(this.#player.x, this.#player.y, CONFIG.COLORS.PLAYER, 'rect');

        for (let e of this.#enemies) {
            ren.drawEntity(e.x, e.y, CONFIG.COLORS.ENEMY, 'rect');
        }
    }

    #updateHUD() {
        const scoreEl = document.getElementById('score-val');
        const highEl = document.getElementById('high-score-val');
        if (scoreEl) scoreEl.innerText = this.#score;
        if (highEl) highEl.innerText = this.#highScore;
    }

    #toggleOverlay(visible, showBtn = true) {
        const el = document.getElementById('overlay');
        const btn = document.getElementById('start-btn');
        if (el) el.classList.toggle('hidden', !visible);
        if (btn) btn.classList.toggle('hidden', !showBtn);
    }
}
