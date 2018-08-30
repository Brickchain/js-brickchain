
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";
import {Contract} from "./contract";

export class SignatureRequest extends Base implements v2.SignatureRequest {

  public static TYPE = "https://schema.brickchain.com/v2/signature-request.json";
  public static TYPEv1 = "signature-request";
  
  /**
   * A list of callback addresses of where to send a response.
   */
  replyTo: string[];
  /**
   * The contract requested for signing.
   */
  contract: Contract[];
  /**
   * The minimum required key level.
   */
  keyLevel?: number;

  public constructor(time?:Date) {
      super(SignatureRequest.TYPE, time);
  }
  
}
