import { Base } from './base';
/**
 * The Revocation document is published as a revocation of a signature, and the content is a JWS containing a Revocation Checksum document.
 */
export interface Revocation extends Base {
    /**
     * This object is a Brickchain Revocation Checksum document.
     */
    checksum: {
        [k: string]: any;
    };
    [k: string]: any;
}
