import * as v2 from '../schema/v2/index';
export declare class Base implements v2.Base {
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
    constructor(type: string, time?: Date);
    setType(type: string): void;
    getType(): string;
    setTimestamp(time: Date): void;
    getTimestamp(): Date;
    setID(id: string): void;
    getID(): string;
    getCertificate(): string;
    setCertificate(jwsCert: string): void;
    getRealm(): string;
    setRealm(realm: string): void;
    toJSON(): any;
}
