

import * as v1 from '../schema/v1/';
import * as v2 from '../schema/v2/';

import {Base} from "./base";

/**
 * The Mandate Token is an encapsulated object containing Mandates. Used for inclusion in HTTP headers, when interacting with web views.
 */
export class MandateToken extends Base implements v2.MandateToken {

  public static TYPE = "https://schema.brickchain.com/v2/mandate.json";
  public static TYPEv1 = "mandate";

  /**
   * Can be multiple mandates encoded as compact JWS
   */
  mandates: string[];
  /**
   * The endpoint the client talks to (typically a web view).
   */
  uri?: string;
  /**
   * Seconds until expiration after the document was created (timestamp).
   */
  ttl: number;
  
  public constructor(time?: Date) {
    super(MandateToken.TYPE, time)
  }


}
