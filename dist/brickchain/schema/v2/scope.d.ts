/**
 * A Scope is used as part of a Scope Request or an Action Descriptor. Contains the type of scope, and a link of where to get it. It does not include the Base document, and is not signed as a standalone object.
 */
export interface Scope {
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
    [k: string]: any;
}
