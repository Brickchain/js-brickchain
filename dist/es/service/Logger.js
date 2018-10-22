export class Logger {
    constructor(name) {
        this.name = "";
        this.name = name;
    }
    static create(name) {
        return Logger.logger(name);
    }
    log(message, ...args) {
        console.log(this.name, ":", message, ...args);
    }
    format(message, ...args) {
        return this.name + ":" + message + " " + args ? args.join(",") : "";
    }
    error(message, ...args) {
        console.error(this.format(message, args));
    }
    debug(message, ...args) {
        console.debug(this.format(message, args));
    }
    info(message, ...args) {
        console.info(this.format(message, args));
    }
}
Logger.logger = (name) => {
    return new Logger(name);
};
//# sourceMappingURL=Logger.js.map