import { Base } from './base';
/**
 * A Mandate enables an entity (user, service) to act in a certain Role in a service connected to a Realm. A Mandate is issued to a public key, and may only be used by that key.
 */
export interface Mandate extends Base {
    /**
     * The name of the mandate
     */
    role?: string;
    /**
     * The human readable name for the mandate (the role)
     */
    label?: string;
    /**
     * Seconds until expiration after the document was created (timestamp)
     */
    ttl?: number;
    /**
     * Identifier of the receipient of the mandate
     */
    recipient?: string;
    /**
     * Name of the receipient of the mandate
     */
    recipientName?: string;
    /**
     * The public JWK of the recipient of the fact
     */
    recipientPublicKey?: {
        [k: string]: any;
    };
    /**
     * The id of the mandate request
     */
    requestId?: string;
    /**
     * The id of the sender of the invite
     */
    sender?: string;
    /**
     * Additional parameters for the mandate, used by actions
     */
    params?: {
        ".*"?: string;
        [k: string]: any;
    };
    [k: string]: any;
}
