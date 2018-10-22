import { Base } from './base';
/**
 * This is the certificate schema that contains any signature from an issuer certifying that the current key is allowed to sign certain documents types. The base document can include the certificate as a proof.
 */
export declare class Certificate extends Base {
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
    [k: string]: any;
}
