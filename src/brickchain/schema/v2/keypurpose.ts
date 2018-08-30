/**
 * The Key Purpose documents is a part of the Controller Descriptor schema, and desribes to the Realm what kind of Document Types is needed in the Certificate.
 */
export interface KeyPurpose {
  /**
   * The document type needed in the certificate.
   */
  documentType: string;
  /**
   * This document type may be optional or required.
   */
  required?: boolean;
  /**
   * The description of (the requirement of) the document type.
   */
  description?: string;
  [k: string]: any;
}
