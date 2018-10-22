export declare class Logger {
    static logger: (name: string) => Logger;
    name: String;
    constructor(name: string);
    static create(name: string): Logger;
    log(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
}
