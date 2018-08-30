import { Base } from './base'
/**
 * The Contract document is a message displayed to the user when signing a document.
 */
export interface Contract extends Base {
  /**
   * A Contract message, displayed for the user for signing
   */
  text?: string;
  [k: string]: any;
}
