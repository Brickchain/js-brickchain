import { Base } from './base';
/**
 * A Mandate enables an entity (user, service) to act in a certain Role in a service connected to a Realm. A Mandate is issued to a public key, and may only be used by that key.
 */
export declare class Mandate extends Base {
    /**
     * The name of the mandate.
     */
    role: string;
    /**
     * The human readable name for the mandate (the role).
     */
    roleName?: string;
    /**
     * The date and time the Mandate is valid from.
     */
    validFrom?: string;
    /**
     * The date and time the Mandate is valid until.
     */
    validUntil?: string;
    /**
     * The public JWK of the receipent of the Mandate.
     */
    recipient: {
        [k: string]: any;
    };
    /**
     * The key id of the sender of the invite.
     */
    sender?: string;
    /**
     * Additional parameters for the mandate, used by actions.
     */
    params?: {
        ".*"?: string;
        [k: string]: any;
    };
    [k: string]: any;
}
