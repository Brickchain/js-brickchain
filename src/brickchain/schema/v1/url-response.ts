import { Base } from './base'
/**
 * This is the URL Response schema, used for sending the Integrity app an URL as a response.
 */
export interface UrlResponse extends Base {
  /**
   * The URL.
   */
  url: string;
  [k: string]: any;
}
