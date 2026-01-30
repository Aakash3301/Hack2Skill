import { CONFIG } from '../Config.js';
import { MoveCommand, PauseCommand } from './Command.js';

/**
 * Input System
 * Handles keyboard events and queues commands.
 */
export class InputSystem {
    #lastInputTime = 0;
    #queue = [];
    #commands;

    constructor() {
        // Pre-allocate commands
        this.#commands = {
            UP: new MoveCommand(0, -1),
            DOWN: new MoveCommand(0, 1),
            LEFT: new MoveCommand(-1, 0),
            RIGHT: new MoveCommand(1, 0),
            PAUSE: new PauseCommand()
        };

        window.addEventListener('keydown', (e) => this.#onKeyDown(e));
    }

    #onKeyDown(e) {
        const now = performance.now();
        // Throttling prevents spamming
        if (now - this.#lastInputTime < CONFIG.INPUT.THROTTLE_MS && !CONFIG.INPUT.KEYS.PAUSE.includes(e.code)) {
            return;
        }
        this.#lastInputTime = now;

        const code = e.code;
        let cmd = null;

        // Strict Whitelist Mapping
        if (CONFIG.INPUT.KEYS.UP.includes(code)) cmd = this.#commands.UP;
        else if (CONFIG.INPUT.KEYS.DOWN.includes(code)) cmd = this.#commands.DOWN;
        else if (CONFIG.INPUT.KEYS.LEFT.includes(code)) cmd = this.#commands.LEFT;
        else if (CONFIG.INPUT.KEYS.RIGHT.includes(code)) cmd = this.#commands.RIGHT;
        else if (CONFIG.INPUT.KEYS.PAUSE.includes(code)) cmd = this.#commands.PAUSE;

        if (cmd) this.#queue.push(cmd);
    }

    /**
     * Returns next command or null
     */
    pop() {
        return this.#queue.shift() || null;
    }

    reset() {
        this.#queue = [];
        this.#lastInputTime = 0;
    }
}
