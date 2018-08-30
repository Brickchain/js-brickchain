
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";

export class Message extends Base implements v2.Message {

  public static TYPE = "https://schema.brickchain.com/v2/message.json"
  public static TYPEv1 = "message";


   /**
   * The message title.
   */
  title?: string;
  /**
   * The content of the message.
   */
  message?: string;

  public constructor(time?:Date) {
      super(Message.TYPE, time);
  }
  
}
