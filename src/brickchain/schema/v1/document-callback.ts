/**
 * This is the Document Callback schema... TODO.
 */
export interface DocumentCallback {
  /**
   * ID of the document
   */
  id?: string;
  /**
   * The document type
   */
  type?: string;
  /**
   * Timestamp of when the document was created
   */
  timestamp: string;
  /**
   * TODO
   */
  operation?: string;
  /**
   * TODO
   */
  linkId?: string;
  /**
   * TODO
   */
  linkType?: string;
  [k: string]: any;
}
