import * as v2 from '../schema/v2/index';
import { Base } from "./base";
export declare class RealmDescriptor extends Base implements v2.RealmDescriptor {
    static TYPE: string;
    static TYPEv1: string;
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
    icon?: string;
    /**
     * The location of the banner used for displaying the Realm.
     */
    banner?: string;
    constructor(time?: Date);
    getLabel(): string;
}
