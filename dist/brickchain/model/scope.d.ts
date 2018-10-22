import * as v2 from '../schema/v2/index';
import { Base } from "./base";
import { Contract } from "./contract";
export declare class ScopeRequest extends Base implements v2.ScopeRequest {
    static TYPE: string;
    static TYPEv1: string;
    /**
     * A list of callback addresses of where to send a response.
     */
    replyTo: string[];
    /**
     * An array of Scope objects.
     */
    scopes: Scope[];
    /**
     * The minimum required key level that signs the response.
     */
    keyLevel?: number;
    /**
     * The Contract, a message to display to the user.
     */
    contract?: Contract[];
    /**
     * This string contains the checksum (encoded as a multihash) of a revoked signed document.
     */
    multihash: string;
    constructor(time?: Date);
}
/**
 * scope is used in scope-request and login-request.
 */
export declare class Scope implements v2.Scope {
    /**
     * The name of the Scope.
     */
    name: string;
    /**
     * An URI of where to retrieve a fact of this type of fact.
     */
    link?: string;
    /**
     * This fact may be optional or required.
     */
    required?: boolean;
    constructor(name?: string);
}
