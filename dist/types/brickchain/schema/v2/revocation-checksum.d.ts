import { Base } from './base';
/**
 * A signed Checksum document is published as part of a Revocation.
 */
export declare class RevocationChecksum extends Base {
    /**
     * This string contains the checksum (encoded as a multihash) of a revoked signed document.
     */
    multihash: string;
    [k: string]: any;
}
