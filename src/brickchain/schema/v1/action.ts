import { Base } from './base'
/**
 * The Action document is what is sent to an Action endpoint, to trigger a service or transaction. The Parameters can be inserted with data coming from an Action Descriptor or a web formed filled in by a user.
 */
export interface Action extends Base {
  /**
   * The Role used for the Action
   */
  role: string;
  /**
   * The Mandate used for the Action
   */
  mandate?: string;
  /**
   * The nonce used for the Action
   */
  nonce?: string;
  /**
   * Additional parameters needed to perform the Action
   */
  params?: {
    ".*"?: string;
    [k: string]: any;
  };
  /**
   * All shared facts needed to perform the Action
   */
  facts?: string[];
  /**
   * The message that was shown when the Action was signed
   */
  contract?: {
    [k: string]: any;
  };
  [k: string]: any;
}
