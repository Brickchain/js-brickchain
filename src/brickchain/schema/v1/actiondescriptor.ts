import { Base } from './base'
/**
 * The Action Descriptor describes a specific type of Action. It is published by the Controller to the Realm, but could be broadcasted using any method. A list of Action Descriptors is shown in the App as a list of actions/services available from a Realm.
 */
export interface ActionDescriptor extends Base {
  /**
   * The binding of the descriptor, the identifier of the realm
   */
  binding?: string;
  /**
   * The label of the action descriptor
   */
  label: string;
  roles: string[];
  /**
   * Location of a web interface
   */
  uiURI?: string;
  /**
   * Inline HTML for a web interface
   */
  uiData?: string;
  /**
   * TODO
   */
  nonceType?: string;
  /**
   * The nonce to use (to protect replay attacks)
   */
  nonce?: {
    [k: string]: any;
  };
  /**
   * Where to receive a new nonce (to protect replay attacks)
   */
  nonceURI?: string;
  /**
   * The URI where to perform the Action
   */
  actionURI: string;
  /**
   * Additional parameters for the mandate, used by actions
   */
  params?: {
    ".*"?: string;
    [k: string]: any;
  };
  /**
   * To be able to query for additional scopes when performing the Action
   */
  scopes?: {
    [k: string]: any;
  };
  /**
   * An icon to be used for displaying the Action Descriptor (png/jpg/svg)
   */
  icon?: string;
  /**
   * The key level needed to perform the action
   */
  keyLevel?: number;
  /**
   * Do not display this descriptor in listings
   */
  internal?: boolean;
  /**
   * The message to display when signing the Action
   */
  contract?: {
    [k: string]: any;
  };
  [k: string]: any;
}
