import { Base } from './base';
/**
 * The Contract document is a message displayed to the user when signing a document.
 */
export declare class Contract extends Base {
    /**
     * A Contract message, displayed for the user for signing.
     */
    text?: string;
    attachments?: {
        /**
         * The name of the attachment.
         */
        name?: string;
        /**
         * The attachment data.
         */
        data?: string;
        /**
         * MIME type of the attachment.
         */
        encoding?: string;
        [k: string]: any;
    }[];
    [k: string]: any;
}
