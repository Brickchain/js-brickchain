import { Base } from './base';
/**
 * This Signature Request is used to request a user to sign a document.
 */
export interface SignatureRequest extends Base {
    /**
     * A list of callback addresses of where to send a response.
     */
    replyTo: any[];
    /**
     * The document requested for signing.
     */
    document: string;
    /**
     * TODO: The required key level
     */
    keyLevel?: number;
    [k: string]: any;
}
