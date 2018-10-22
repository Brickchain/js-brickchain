import * as v2 from '../schema/v2/';
import { Base } from "./base";
/**
 * The Mandate Token is an encapsulated object containing Mandates. Used for inclusion in HTTP headers, when interacting with web views.
 */
export declare class MandateToken extends Base implements v2.MandateToken {
    static TYPE: string;
    static TYPEv1: string;
    /**
     * Can be multiple mandates encoded as compact JWS
     */
    mandates: string[];
    /**
     * The endpoint the client talks to (typically a web view).
     */
    uri?: string;
    /**
     * Seconds until expiration after the document was created (timestamp).
     */
    ttl: number;
    constructor(time?: Date);
}
