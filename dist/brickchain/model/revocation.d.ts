import * as v2 from '../schema/v2/index';
import { Base } from "./base";
export declare class Revocation extends Base implements v2.Revocation {
    static TYPE: string;
    /**
     * This object is a Brickchain Revocation Checksum document.
     */
    checksum: {
        [k: string]: any;
    };
    constructor(time?: Date);
}
export declare class RevocationChecksum extends Base implements v2.RevocationChecksum {
    static TYPE: string;
    /**
     * This string contains the checksum (encoded as a multihash) of a revoked signed document.
     */
    multihash: string;
    constructor(time?: Date);
}
export declare class RevocationRequest extends Base implements v2.RevocationRequest {
    static TYPE: string;
    static TYPEv1: string;
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
    constructor(time?: Date);
}
