import { Base } from './base';
/**
 * A Revocation Request is sent to a Revocation service to request a Revocation of a document signature.
 */
export interface RevocationRequest extends Base {
    /**
     * This is the original signed document to be revoked.
     */
    jws: {
        [k: string]: any;
    };
    /**
     * The is the Revocation Checksum document to be published as a revocation.
     */
    revocationchecksum: {
        [k: string]: any;
    };
    /**
     * This is the priority of the Revocation Request, indicating the urgency of the Revocation to be published.
     */
    priority: number;
    [k: string]: any;
}
