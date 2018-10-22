import { Base } from './base';
/**
 * This is the Realm Descriptor schema, includes all public metadata about a realm.
 */
export declare class RealmDescriptor extends Base {
    /**
     * The label of the Realm.
     */
    label?: string;
    /**
     * The public JWK of the Realm.
     */
    publicKey?: {
        [k: string]: any;
    };
    /**
     * The Invite URL for the Realm.
     */
    inviteURL?: string;
    /**
     * Location of where to find services published by the Realm.
     */
    servicesURL?: string;
    /**
     * The location of the icon used for displaying the Realm.
     */
    icon?: {
        [k: string]: any;
    };
    /**
     * The location of the banner used for displaying the Realm.
     */
    banner?: string;
    [k: string]: any;
}
