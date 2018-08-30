import { Base } from './base'
/**
 * This is the Controller Binding schema for Brickchain documents used for binding a Realm with a Controller, see more at https://developer.brickchain.com/
 */
export interface ControllerBinding extends Base {
  /**
   * The Realm Descriptor object
   */
  realmDescriptor: {
    [k: string]: any;
  };
  /**
   * An array of admin roles that are allow to manage the Controller
   */
  adminRoles?: string[];
  /**
   * A Controller Certificate Chain given from the Realm
   */
  controllerCertificateChain?: string;
  /**
   * A new Mandate for the Controller issued by the Realm
   */
  mandate?: string;
  [k: string]: any;
}
