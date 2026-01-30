import { MathUtils } from './Utils.js';
import { Player } from './entities/Player.js';
import { GameEngine } from './GameEngine.js'; // Requires exporting GameEngine class
import { CONFIG } from './Config.js';
import { Command, MoveCommand } from './core/Command.js';

/**
 * Test Runner
 * Simple Unit Testing Framework for Browser Console.
 */
export class TestRunner {
    constructor() {
        this.tests = [];
        this.registerTests();
    }

    registerTests() {
        this.addTest('MathUtils.clamp', () => {
            if (MathUtils.clamp(10, 0, 5) !== 5) throw new Error('Clamp Max Failed');
            if (MathUtils.clamp(-10, 0, 5) !== 0) throw new Error('Clamp Min Failed');
            if (MathUtils.clamp(3, 0, 5) !== 3) throw new Error('Clamp Mid Failed');
        });

        this.addTest('MathUtils.distSq', () => {
            if (MathUtils.distSq(0, 0, 3, 4) !== 25) throw new Error('Distance Squared Failed');
        });

        this.addTest('Player.Initialization', () => {
            const p = new Player();
            p.init(10, 10);
            if (p.x !== 10 || p.y !== 10) throw new Error('Init Pos Failed');
            if (p.len !== 1) throw new Error('Init Length Failed');
        });

        this.addTest('Player.Movement', () => {
            const p = new Player();
            p.init(10, 10);
            p.queueDirection(1, 0); // Move Right
            p.tick();
            if (p.x !== 11 || p.y !== 10) throw new Error(`Move Right Failed: ${p.x},${p.y}`);

            // Tail Logic
            if (p.tail.length !== 1) throw new Error('Tail Growth Logic Error');
            if (p.tail[0].x !== 10 || p.tail[0].y !== 10) throw new Error(`Tail Position Error: ${JSON.stringify(p.tail)}`);
        });

        this.addTest('Player.Collision.Self', () => {
            const p = new Player();
            p.init(5, 5);
            p.len = 3;
            // Fake a tail collision scenario
            p.tail = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
            // Logic check: usually collision is checked by GameEngine iterate loop
            // taking player pos vs tail array.
            const collision = p.tail.some(t => t.x === p.x && t.y === p.y);
            if (!collision) throw new Error('Collision Logic Failed');
        });

        this.addTest('Config.Immutability', () => {
            try {
                CONFIG.GRID.W = 999;
            } catch (e) { }
            if (CONFIG.GRID.W !== 40) throw new Error('Config is Mutable!');
        });

        this.addTest('Command.Execution', () => {
            const p = new Player();
            const cmd = new MoveCommand(0, 1);
            p.queueDirection = (dx, dy) => {
                if (dx !== 0 || dy !== 1) throw new Error('Command sent wrong args');
            };
            cmd.execute(p);
        });
    }

    addTest(name, fn) {
        this.tests.push({ name, fn });
    }

    run() {
        console.group('%c 🧪 RUNNING TEST SUITE ', 'background: #222; color: #bada55');
        let passed = 0;
        let failed = 0;

        this.tests.forEach(test => {
            try {
                test.fn();
                console.log(`%c[PASS] ${test.name}`, 'color: #00ff00');
                passed++;
            } catch (err) {
                console.error(`[FAIL] ${test.name}`, err);
                failed++;
            }
        });

        console.log(`%cRESULTS: ${passed} Passed | ${failed} Failed`, 'font-weight: bold; color: ' + (failed > 0 ? 'red' : 'lightgreen'));
        console.groupEnd();
        return { passed, failed };
    }
}

// Attach to Window for Console Access
window.GameTests = new TestRunner();
console.log("%c[A11Y & TEST] Test Runner Loaded. Type 'GameTests.run()' to execute.", "color: orange");
