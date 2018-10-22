import { Base } from "./base";
export declare class Part {
    encoding: string;
    name: string;
    document: string;
    uri: string;
}
export declare class Multipart extends Base {
    parts: Part[];
    constructor(obj?: any);
    toJSON(): any;
}
