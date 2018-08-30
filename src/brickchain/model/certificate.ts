
import * as v1 from '../schema/v1/index';
import * as v2 from '../schema/v2/index';

import {Base} from "./base";

export class Certificate extends Base implements v2.Certificate {

  public static TYPE = "https://schema.brickchain.com/v2/certificate.json"
  public static TYPEv1 = "certificate-chain";


   /**
   * Seconds until expiration after the document was created (timestamp).
   */
  ttl?: number;
  /**
   * The issuer key as JWK
   */
  issuer: {
    [k: string]: any;
  };
  /**
   * The subject key as JWK
   */
  subject: {
    [k: string]: any;
  };
  /**
   * A list of document types that the subject can sign.
   */
  documentTypes?: string[];
  /**
   * A list of roles that the subject can assume.
   */
  allowedRoles?: string[];
  /**
   * The minimum required key level for subsequent certificates in the certificate chain.
   */
  keyLevel: number;

  public constructor(time?:Date) {
      super(Certificate.TYPE, time);
  }
  
}
