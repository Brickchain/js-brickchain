import { Base } from './base';
import { KeyPurpose } from './keypurpose';
/**
 * A Controller Descriptor is published by a Controller with metadata about itself.
 */
export interface ControllerDescriptor extends Base {
    /**
     * The label of the Controller.
     */
    label?: string;
    /**
     * Used to retrieve Action Descriptors from controller.
     */
    actionsURI?: string;
    /**
     * The Admin UI, inline or URI.
     */
    adminUI?: string;
    /**
     * The location of the binding URI, used by the Realm.
     */
    bindURI: string;
    /**
     * The controller's public key as JWK.
     */
    key: {
        [k: string]: any;
    };
    /**
     * An array of keypurposes, describes document types for the controller's certificate.
     */
    keyPurposes?: KeyPurpose[];
    /**
     * An indication that the Controller needs configuration.
     */
    requireSetup?: boolean;
    /**
     * Can be used to create new empty bindings on the controller.
     */
    addBindingEndpoint?: string;
    /**
     * An icon for the controller.
     */
    icon?: string;
    [k: string]: any;
}
