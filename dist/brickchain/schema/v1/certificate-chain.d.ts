/**
 * This is the Certificate Chain schema... TODO.
 */
export interface CertificateChain {
    /**
     * Timestamp of when the document was created
     */
    timestamp: string;
    /**
     * Seconds until expiration after the document was created (timestamp)
     */
    ttl?: number;
    /**
     * The root key as JWK
     */
    root?: {
        [k: string]: any;
    };
    /**
     * The subkey as JWK
     */
    subKey?: {
        [k: string]: any;
    };
    /**
     * TODO
     */
    documentTypes?: string[];
    /**
     * TODO: The required key level
     */
    keyLevel?: number;
    [k: string]: any;
}
