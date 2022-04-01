/* A wrapper around functions because function.name is a readonly property
 * Allows to give names to anonymous functions for easier debugging
 * If no name is provided, fallback to function.name if non-empty, else "Untitled"
*/


import { logger } from "./logger";


export default class Timer {
    called = false;
    time: number;
    name: string;
    func: () => void;

    constructor(func?: () => void, ms?: number, name?: string) {
        this.func = func ? func : () => {};
        this.name = name ? name : this.func.name ? this.func.name : "Untitled";
        this.time = ms ? ms : 0.0;
    }

    tick(delta: number) {
        if (this.time == 0.0) {
            this.call();
            this.func = () => {};
        }
        this.time -= delta;
        if (this.time <= 0.0) {
            this.time = 0.0;
        }
    }

    call(): void {
        logger.debug(`Calling "${this.name}" Timer`)
        this.func();
        if (this.called) logger.info(`The "${this.name}" Timer was called more than once`)
        this.called = true;
    }
}
