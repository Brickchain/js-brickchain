import { Base } from "./base";
import { Part } from "./multipart";
import { Contract } from "./contract";
export declare class Action extends Base {
    role: string;
    mandate: string;
    nonce: string;
    params: any;
    facts: Part[];
    contract: Contract;
    constructor(obj?: any);
    toJSON(): any;
}
