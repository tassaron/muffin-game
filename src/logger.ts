class Logger {
    LOGLEVEL = 0;

    verbose(msg: string) {
        this.LOGLEVEL < 0 ? console.log(msg) : null
    }

    debug(msg: string) {
        this.LOGLEVEL < 1 ? console.log(msg) : null
    }
    
    info(msg: string) {
        this.LOGLEVEL < 2 ? console.info(msg) : null
    }
    
    error(msg: string) {
        this.LOGLEVEL < 3 ? console.error(msg) : null
    }
}

export const logger = new Logger();