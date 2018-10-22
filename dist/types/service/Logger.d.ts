export declare class Logger {
    static logger: (name: string) => Logger;
    name: string;
    constructor(name: string);
    static create(name: string): Logger;
    log(message: string, ...args: any[]): void;
    private format(message, ...args);
    error(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
}
