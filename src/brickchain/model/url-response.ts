
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";

export class UrlResponse extends Base implements v2.UrlResponse {

  public static TYPE = "https://schema.brickchain.com/v2/url-response.json"
  public static TYPEv1 = "url-response"

 /**
   * The URL.
   */
  url: string;
  
  public constructor(time?:Date) {
      super(UrlResponse.TYPE, time);
  }
  
}
