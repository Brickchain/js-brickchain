import { Base } from './base'
import { Contract } from './contract'
import { Scope } from './scope'
/**
 * The Contract document is a message displayed to the user when signing a document.
 */
export type Contract = Base;

/**
 * A client will use the Scope Request to fill in missing Facts for using a service.
 */
export interface ScopeRequest extends Base {
  /**
   * A list of callback addresses of where to send a response.
   */
  replyTo: string[];
  /**
   * An array of Scope objects.
   */
  scopes: Scope[];
  /**
   * The minimum required key level that signs the response.
   */
  keyLevel?: number;
  /**
   * The Contract, a message to display to the user.
   */
  contract?: Contract[];
  [k: string]: any;
}
