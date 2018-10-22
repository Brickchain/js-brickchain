import { Base } from './base';
/**
 * A Fact is a personal identifier, something that identifies an individual or a property defining a person. An Assertion in OAuth lingo, contains a claim such as an e-mail address, Facebook ID, or passport number. The Fact is signed by an issuer - a KYC service, and stored by the user in the App. There can also be self-signed facts. Facts may be shared when requested through a Scope Request, and is bundled with other document types, for example an Action.
 */
export declare class Fact extends Base {
    /**
     * The fact itself, can be more than one fact of each type.
     */
    data: {
        [k: string]: any;
    };
    /**
     * The URI for the issuing Realm of the fact.
     */
    issuer?: string;
    /**
     * The human readable label of the fact.
     */
    label: string;
    /**
     * The public JWK of the receipient of the fact.
     */
    recipient: string;
    /**
     * Seconds until expiration after the document was created (@timestamp).
     */
    ttl?: number;
    [k: string]: any;
}
