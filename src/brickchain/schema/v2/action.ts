import { Base } from './base'
import { Contract } from './contract'
/**
 * The Action document is what is sent to an Action endpoint, to trigger a service or transaction. The Parameters can be inserted with data coming from an Action Descriptor or a web formed filled in by a user.
 */
export interface Action extends Base {
  /**
   * A list of Mandates used for the Action.
   */
  mandates: string[];
  /**
   * The nonce used for the Action to prevent replay attacks.
   */
  nonce?: string;
  /**
   * Additional parameters needed to perform the Action. It is up to the receiving controller to determine the use of the parameters.
   */
  params?: {
    ".*"?: string;
    [k: string]: any;
  };
  /**
   * All shared facts needed to perform the Action.
   */
  facts?: string[];
  /**
   * The signed Contract (compact encoded JWS) that was shown when the Action was signed.
   */
  contract?: string;
  [k: string]: any;
}
