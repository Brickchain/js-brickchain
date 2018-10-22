import * as v2 from '../schema/v2/index';
import { Base } from "./base";
import { Contract } from "./contract";
export declare class SignatureRequest extends Base implements v2.SignatureRequest {
    static TYPE: string;
    static TYPEv1: string;
    /**
     * A list of callback addresses of where to send a response.
     */
    replyTo: string[];
    /**
     * The contract requested for signing.
     */
    contract: Contract[];
    /**
     * The minimum required key level.
     */
    keyLevel?: number;
    constructor(time?: Date);
}
