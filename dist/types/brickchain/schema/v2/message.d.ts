import { Base } from './base';
/**
 * The Message document is used to display a message in the app. Mostly used in multipart-messages, as part of a larger payload.
 */
export declare class Message extends Base {
    /**
     * The message title.
     */
    title?: string;
    /**
     * The content of the message.
     */
    message?: string;
    [k: string]: any;
}
