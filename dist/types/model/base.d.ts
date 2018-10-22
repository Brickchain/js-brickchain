export declare class Base {
    static verifier: any;
    type: string;
    timestamp: Date;
    id: string;
    certificate: string;
    constructor(obj?: any);
    static parseSigned<T extends Base>(c: {
        new (obj?: any): T;
    }, signed: any, id?: string): Promise<T>;
    toString(): string;
    toJSON(): any;
}
