import * as v2 from '../schema/v2/index';
import { Base } from "./base";
export declare class Certificate extends Base implements v2.Certificate {
    static TYPE: string;
    static TYPEv1: string;
    /**
    * Seconds until expiration after the document was created (timestamp).
    */
    ttl?: number;
    /**
     * The issuer key as JWK
     */
    issuer: {
        [k: string]: any;
    };
    /**
     * The subject key as JWK
     */
    subject: {
        [k: string]: any;
    };
    /**
     * A list of document types that the subject can sign.
     */
    documentTypes?: string[];
    /**
     * A list of roles that the subject can assume.
     */
    allowedRoles?: string[];
    /**
     * The minimum required key level for subsequent certificates in the certificate chain.
     */
    keyLevel: number;
    constructor(time?: Date);
}
