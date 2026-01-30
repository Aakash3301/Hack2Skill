/**
 * Generic Object Pool
 * Optimized for zero-allocation performance.
 */
export class Pool {
    #items = [];
    #factory;
    #resetter;

    constructor(factory, resetter, initialSize = 10) {
        this.#factory = factory;
        this.#resetter = resetter;
        for (let i = 0; i < initialSize; i++) this.release(this.#factory());
    }

    get() {
        if (this.#items.length > 0) {
            const item = this.#items.pop();
            this.#resetter(item);
            return item;
        }
        return this.#factory();
    }

    release(item) {
        this.#items.push(item);
    }
}
