class Logger {
    LOGLEVEL = 0;

    verbose(msg) {
        this.LOGLEVEL < 0 ? console.log(msg) : null
    }

    debug(msg) {
        this.LOGLEVEL < 1 ? console.log(msg) : null
    }
    
    info(msg) {
        this.LOGLEVEL < 2 ? console.info(msg) : null
    }
    
    error(msg) {
        this.LOGLEVEL < 3 ? console.error(msg) : null
    }
}

export const logger = new Logger();