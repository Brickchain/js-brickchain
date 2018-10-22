import { Base } from './base';
/**
 * This is the Controller Binding schema for Brickchain documents used for binding a Realm with a Controller.
 */
export declare class ControllerBinding extends Base {
    /**
     * The Realm Descriptor object.
     */
    realmDescriptor: {
        [k: string]: any;
    };
    /**
     * An array of admin roles that are allow to manage the Controller.
     */
    adminRoles: string[];
    /**
     * A Controller Certificate given from the Realm.
     */
    controllerCertificate: string;
    /**
     * A list of Mandates that allows the controller to act as a certain role in the realm.
     */
    mandates?: string[];
    [k: string]: any;
}
