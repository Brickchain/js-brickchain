export declare class Base {
    static verifier: any;
    context: string;
    type: string;
    subtype: string;
    timestamp: Date;
    id: string;
    certificateChain: string;
    signed: string;
    constructor(obj?: any);
    static parseSigned<T extends Base>(c: {
        new (obj?: any): T;
    }, signed: any, id?: string): Promise<T>;
    toString(): string;
    toJSON(): any;
}
