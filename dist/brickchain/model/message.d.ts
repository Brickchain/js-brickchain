import * as v2 from '../schema/v2/index';
import { Base } from "./base";
export declare class Message extends Base implements v2.Message {
    static TYPE: string;
    static TYPEv1: string;
    /**
    * The message title.
    */
    title?: string;
    /**
     * The content of the message.
     */
    message?: string;
    constructor(time?: Date);
}
