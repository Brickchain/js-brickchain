/**
 * A Fact Signature document is an attachment to a Fact that allows a Fact to have multiple signatures.
 */
export interface FactSignature {
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
}
