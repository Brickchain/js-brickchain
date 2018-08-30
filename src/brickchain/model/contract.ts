
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";


/**
 * NOTE: Contains to terms and conditions for login etc.
 * Use NOTE: https://tools.ietf.org/html/rfc2985
 * see: NaturalPersonAttributeSet ATTRIBUTE 
 * 
 * 
 * https://tools.ietf.org/html/rfc5958
 * 
 */
export class Contract extends Base implements v2.Contract {

  public static TYPE = "https://schema.brickchain.com/v2/contract.json"
  public static TYPEv1 = "contract";

  text?: string;
  attachments?: {
    /**
     * The name of the attachment.
     */
    name?: string;
    /**
     * The attachment data.
     */
    data?: string;
    /**
     * MIME type of the attachment.
     */
    encoding?: string;
    [k: string]: any;
  }[];


  public constructor(time?:Date) {
      super(Contract.TYPE, time);
  }
  
}
