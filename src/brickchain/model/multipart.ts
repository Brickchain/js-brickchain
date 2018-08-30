
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";

export class Multipart extends Base implements v2.Multipart{

  public static TYPE = "https://schema.brickchain.com/v2/multipart.json"
  public static TYPEv1 = "multipart";


  parts: {
    /**
     * The used encoding of the document part.
     */
    encoding?: string;
    /**
     * The name of the part.
     */
    name?: string;
    /**
     * The document itself.
     */
    document?: string;
    /**
     * TODO
     */
    uri?: string;
  }[];
  
  public constructor(time?:Date) {
      super(Multipart.TYPE, time);
  }
  
}
