import * as v2 from '../schema/v2/';
import { Base } from "./";
export declare class Mandate extends Base implements v2.Mandate {
    static TYPE: string;
    "@type": string;
    role: string;
    roleName?: string;
    validFrom?: string;
    validUntil?: string;
    recipient: {
        [k: string]: any;
    };
    sender?: string;
    params?: {
        [k: string]: any;
        ".*"?: string;
    };
    constructor();
}
