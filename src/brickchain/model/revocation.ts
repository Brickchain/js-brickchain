
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";

export class Revocation extends Base implements v2.Revocation{

  public static TYPE = "https://schema.brickchain.com/v2/revocation.json"

  /**
   * This object is a Brickchain Revocation Checksum document.
   */
  checksum: {
    [k: string]: any;
  };

  public constructor(time?:Date) {
      super(Revocation.TYPE, time);
  }
  
}

export class RevocationChecksum extends Base implements v2.RevocationChecksum {

  public static TYPE = "https://schema.brickchain.com/v2/revocation-checksum.json"

  /**
   * This string contains the checksum (encoded as a multihash) of a revoked signed document.
   */
  multihash: string;

  public constructor(time?:Date) {
      super(Revocation.TYPE, time);
  }
  
}

export class RevocationRequest extends Base implements v2.RevocationRequest {

  public static TYPE = "https://schema.brickchain.com/v2/revocation-request.json"
  public static TYPEv1 = "revocation";


  /**
   * This is the original signed document to be revoked.
   */
  jws: {
    [k: string]: any;
  };
  /**
   * The is the Revocation Checksum document to be published as a revocation.
   */
  revocationchecksum: {
    [k: string]: any;
  };
  /**
   * This is the priority of the Revocation Request, indicating the urgency of the Revocation to be published.
   */
  priority: number;

  public constructor(time?:Date) {
      super(Revocation.TYPE, time);
  }
  
}