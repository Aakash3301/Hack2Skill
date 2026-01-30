/**
 * Player Entity
 */
export class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.tail = [];
        this.len = 1;
        this.dir = { x: 0, y: 0 };
        this.nextDir = { x: 1, y: 0 };
    }

    init(x, y) {
        this.x = x;
        this.y = y;
        this.tail.length = 0;
        this.len = 1;
        this.dir = { x: 1, y: 0 };
        this.nextDir = { x: 1, y: 0 };
    }

    queueDirection(dx, dy) {
        if (dx !== 0 && this.dir.x === -dx) return;
        if (dy !== 0 && this.dir.y === -dy) return;
        this.nextDir = { x: dx, y: dy };
    }

    tick() {
        this.dir = this.nextDir;
        this.tail.unshift({ x: this.x, y: this.y });
        while (this.tail.length > this.len) this.tail.pop();
        this.x += this.dir.x;
        this.y += this.dir.y;
    }
}
