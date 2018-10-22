import * as v2 from '../schema/v2/index';
import { Base } from "./base";
export declare class Action extends Base implements v2.Action {
    static TYPE: string;
    static TYPEv1: string;
    /**
     * A list of Mandates used for the Action.
     */
    mandates: string[];
    /**
     * The nonce used for the Action to prevent replay attacks.
     */
    nonce?: string;
    /**
     * Additional parameters needed to perform the Action. It is up to the receiving controller to determine the use of the parameters.
     */
    params?: {
        [k: string]: any;
    };
    /**
     * All shared facts needed to perform the Action.
     */
    facts?: string[];
    /**
     * The signed Contract (compact encoded JWS) that was shown when the Action was signed.
     */
    contract?: string;
    constructor(time?: Date);
}
