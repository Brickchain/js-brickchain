import { Base } from './base';
/**
 * The Contract document is a message displayed to the user when signing a document.
 */
export declare type Contract = Base;
/**
 * This Signature Request is used to request a user to sign a contract.
 */
export declare class SignatureRequest extends Base {
    /**
     * A list of callback addresses of where to send a response.
     */
    replyTo: any[];
    /**
     * The contract requested for signing.
     */
    contract: Contract[];
    /**
     * The minimum required key level.
     */
    keyLevel?: number;
    [k: string]: any;
}
