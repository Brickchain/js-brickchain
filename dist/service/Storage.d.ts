export declare class Storage {
    constructor();
    set(key: string, value: string): Promise<string>;
    setObj(key: string, json: Object): Promise<string>;
    get(key: string): Promise<string>;
    getObj(key: string): Promise<any>;
    list(): Promise<string[]>;
    delete(key: string): Promise<any>;
    writeReadTest(k: string, d: string): Promise<boolean>;
    test(): Promise<boolean>;
}
