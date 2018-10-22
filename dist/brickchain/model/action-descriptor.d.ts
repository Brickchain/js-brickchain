import * as v2 from '../schema/v2/index';
import { Base } from "./base";
import { Scope } from "./scope";
import { Contract } from "./contract";
export declare class ActionDescriptor extends Base implements v2.ActionDescriptor {
    static TYPE: string;
    static TYPEv1: string;
    /**
     * The label describing the Action Descriptor.
     */
    label: string;
    /**
     * A list of roles that can use the action, can be used to lookup mandates for action.
     */
    roles: string[];
    /**
     * Location of a web interface. Inline HTML data can be provided using a data URI.
     */
    uiURI?: string;
    /**
     * The URI where to perform the Action.
     */
    actionURI: string;
    /**
     * A URI where an updated version of this Action Descriptor can be retrieved. Used for dynamic Action Descriptor content, to include device state.
     */
    refreshURI?: string;
    /**
     * Additional parameters describing any necessary details of the service, used by Actions.
     */
    params?: {
        [k: string]: any;
    };
    /**
     * A list of scope objects, asking the user to share facts with the service controller when performing an Action.
     */
    scopes?: Scope[];
    /**
     * An icon to be used for displaying the Action Descriptor (png/jpg/svg).
     */
    icon?: string;
    /**
     * The minimum key level needed to perform the action.
     */
    keyLevel?: number;
    /**
     * An moption to not display this descriptor in listings.
     */
    internal?: boolean;
    /**
     * The message to display when signing the Action.
     */
    contract?: Contract;
    constructor(time?: Date);
}
