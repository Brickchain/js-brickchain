import { Base } from './base'
/**
 * This is the Realm Descriptor schema for Brickchain documents, see more at https://developer.brickchain.com/
 */
export interface RealmDescriptor extends Base {
  /**
   * The name of the Realm
   */
  name?: string;
  /**
   * The description of the Realm
   */
  description?: string;
  /**
   * The public JWK of the Realm
   */
  publicKey?: {
    [k: string]: any;
  };
  /**
   * Versioned API endpoints for the Realm
   */
  endpoints?: string[];
  /**
   * The Invite URL for the Realm
   */
  inviteURL?: string;
  /**
   * Location of where to find services published by the Realm
   */
  servicesURL?: string;
  /**
   * A list of historical keys used by the Realm
   */
  keyHistory?: string[];
  /**
   * The location of the icon used for displaying the Realm
   */
  icon?: {
    [k: string]: any;
  };
  /**
   * The location of the banner used for displaying the Realm
   */
  banner?: string;
  [k: string]: any;
}
