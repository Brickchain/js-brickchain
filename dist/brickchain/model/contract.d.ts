import * as v2 from '../schema/v2/index';
import { Base } from "./base";
/**
 * NOTE: Contains to terms and conditions for login etc.
 * Use NOTE: https://tools.ietf.org/html/rfc2985
 * see: NaturalPersonAttributeSet ATTRIBUTE
 *
 *
 * https://tools.ietf.org/html/rfc5958
 *
 */
export declare class Contract extends Base implements v2.Contract {
    static TYPE: string;
    static TYPEv1: string;
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
    constructor(time?: Date);
}
