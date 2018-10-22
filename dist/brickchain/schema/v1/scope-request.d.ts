import { Base } from './base';
/**
 * A client will use the Scope Request to fill in missing Facts for using a service.
 */
export interface ScopeRequest extends Base {
    /**
     * A list of callback addresses of where to send a response.
     */
    replyTo: any[];
    /**
     * An array of Scope objects.
     */
    scopes: any[];
    /**
     * encryptTo specifies what recipients to encrypt the response to.
     */
    encryptTo?: any[];
    /**
     * TODO: The required key level
     */
    keyLevel?: number;
    /**
     * The Contract, a message to display to the user.
     */
    contract?: {
        [k: string]: any;
    };
    [k: string]: any;
}
