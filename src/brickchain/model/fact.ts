
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";

/**
 *  A Fact is a personal attribute certified by signatories. 
 *  "data" can be anything that we can run JSON.stringify on.
 *  
 */
export class Fact extends Base implements v2.Fact{

  public static TYPE = "https://schema.brickchain.com/v2/fact.json"
  public static TYPEv1 = "fact";

  /**
   * The fact itself, can be more than one fact of each type.
   */
  data: any; 

  /**
   * The human readable label of the fact.
   */
  label: string;
  /**
   * An array of Fact Signatures.
   */
  signatures?: FactSignature[];

  /**
   * any add on data.
   */
  [k: string]: any;

  public constructor(time?:Date) {
      super(Fact.TYPE, time);
  }
  
}

export class FactSignature implements v2.FactSignature {
  /**
   * The certificate from the issuing realm.
   */
  certificate?: string;
  /**
   * The date and time of the issued fact signature.
   */
  timestamp: string;
  /**
   * The date and time of when this fact signature expires.
   */
  expires?: string;
  /**
   * The subject the signature is issued for as a JWK
   */
  subject: {
    [k: string]: any;
  };
  /**
   * The checksum of the fact that this fact signature covers.
   */
  hash: string;
  /**
   * TODO
   */
  metadata?: {
    ".*"?: string;
    [k: string]: any;
  };
  [k: string]: any;

  public constructor() {

  }
}
