
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";

export class Receipt extends Base implements v2.Receipt {

  public static TYPE = "https://schema.brickchain.com/v2/receipt.json"
  public static TYPEv1 = "receipt";


   /**
   * The Action document that formed the Receipt.
   */
  action?: string;
  /**
   * The URI for doing updates on the Receipt.
   */
  uri?: string;
  /**
   * A JWT to be used when doing updates on the Receipt.
   */
  jwt?: string;
  /**
   * An array of Intervals, used for events or bookings.
   */
  intervals?: {
    [k: string]: any;
  }[];
  /**
   * The label describing the Receipt.
   */
  label?: string;
  
  public constructor(time?:Date) {
      super(Receipt.TYPE, time);
  }
  
}
