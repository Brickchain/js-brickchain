import * as v2 from '../schema/v2/index';
import { Base } from "./base";
export declare class Receipt extends Base implements v2.Receipt {
    static TYPE: string;
    static TYPEv1: string;
    /**
    * The Action document that formed the Receipt.
    */
    action?: string;
    /**
     * The URI for doing updates on the Receipt.
     */
    uri?: string;
    /**
     * A JWT to be used when doing updates on the Receipt.
     */
    jwt?: string;
    /**
     * An array of Intervals, used for events or bookings.
     */
    intervals?: {
        [k: string]: any;
    }[];
    /**
     * The label describing the Receipt.
     */
    label?: string;
    constructor(time?: Date);
}
