/**
 * This is the Base schema for Brickchain documents. All Brickchain documents use this as its base, and includes most fields from the base document.
 */
export interface Base {
    /**
     * URI to this schema document (see JSON-LD)
     */
    "@context"?: string;
    /**
     * Document type (see JSON-LD)
     */
    "@type": string;
    /**
     * Document sub type
     */
    "@subtype"?: string;
    /**
     * Timestamp of when the document was created
     */
    "@timestamp": string;
    /**
     * A unique identifier of the document (uuid)
     */
    "@id"?: string;
    /**
     * The certificate chain that was used as proof of current signature
     */
    "@certificateChain"?: string;
    /**
     * The name of the realm that owns this document
     */
    "@realm"?: string;
    [k: string]: any;
}
