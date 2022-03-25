class Logger {
    LOGLEVEL = 0;

    spam(msg: string) {
        this.LOGLEVEL < 0 ? console.log(msg) : null
    }

    verbose(msg: string) {
        this.LOGLEVEL < 1 ? console.log(msg) : null
    }

    debug(msg: string) {
        this.LOGLEVEL < 2 ? console.log(msg) : null
    }
    
    info(msg: string) {
        this.LOGLEVEL < 3 ? console.info(msg) : null
    }
    
    error(msg: string) {
        this.LOGLEVEL < 4 ? console.error(msg) : null
    }
}

export const logger = new Logger();