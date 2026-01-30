/**
 * Command Pattern
 * Decouples input from execution.
 */

export class Command {
    execute(actor) { }
}

export class MoveCommand extends Command {
    constructor(x, y) {
        super();
        this.dx = x;
        this.dy = y;
    }
    execute(actor) {
        actor.queueDirection(this.dx, this.dy);
    }
}

export class PauseCommand extends Command {
    execute(engine) {
        engine.togglePause();
    }
}
