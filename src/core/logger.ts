export default class Logger {
    level = {
        spam: -1,
        verbose: 0,
        debug: 1,
        info: 2,
        error: 3,
        disabled: 5,
    };
    minimum = 2;
    namespace = "";

    constructor(namespace = "") {
        this.namespace = namespace;
    }

    formatMsg(string: string) {
        return `${this.namespace}${this.namespace ? ": " : ""}${string}`
    }

    spam(msg: string) {
        this.minimum < 0 ? console.log(this.formatMsg(msg)) : null;
    }

    verbose(msg: string) {
        this.minimum < 1 ? console.log(this.formatMsg(msg)) : null;
    }

    debug(msg: string) {
        this.minimum < 2 ? console.log(this.formatMsg(msg)) : null;
    }
    
    info(msg: string) {
        this.minimum < 3 ? console.info(this.formatMsg(msg)) : null;
    }
    
    error(msg: string) {
        this.minimum < 4 ? console.error(this.formatMsg(msg)) : null;
    }
}

export const logger = new Logger("muffin-game");
