import { Base } from './base';
/**
 * This is the Mandate Token schema for Brickchain documents, see more at https://developer.brickchain.com/
 */
export interface Message extends Base {
    /**
     * The message title
     */
    title?: string;
    /**
     * The content of the message
     */
    message?: string;
    [k: string]: any;
}
