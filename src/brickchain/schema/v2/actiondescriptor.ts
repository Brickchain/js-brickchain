import { Base } from './base'
import { Contract } from './contract'
import { Scope } from './scope'
/**
 * The Contract document is a message displayed to the user when signing a document.
 */
export type Contract = Base;

/**
 * The Action Descriptor describes a specific type of Action. It is published by the Controller to the Realm, but could be broadcasted using any method. A list of Action Descriptors is shown in the App as a list of actions/services available from a Realm.
 */
export interface ActionDescriptor extends Base {
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
    ".*"?: string;
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
  [k: string]: any;
}
