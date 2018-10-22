/**
 * This is the Base schema for Brickchain documents. All Brickchain documents use this as its base, and includes all fields from the base document.
 */
export declare class Base {
    /**
     * Document type as URI, subtype after '#'.
     */
    "@type": string;
    /**
     * Timestamp of when the document was created.
     */
    "@timestamp": string;
    /**
     * A unique identifier of the document (uuid).
     */
    "@id"?: string;
    /**
     * The certificate chain that was used as proof of current signature.
     */
    "@certificate"?: string;
    /**
     * The name of the realm that issued this document.
     */
    "@realm"?: string;
}
