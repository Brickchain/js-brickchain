import { Base } from "./base";
export declare class MandateToken extends Base {
    mandate: string;
    uri: string;
    ttl: number;
    constructor(obj?: any);
    toJSON(): any;
}
