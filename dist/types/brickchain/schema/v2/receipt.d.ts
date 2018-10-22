import { Base } from './base';
/**
 * A Receipt is a proof of a successful transaction with a service. May be used in the App for further interaction with the service.
 */
export declare class Receipt extends Base {
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
    [k: string]: any;
}
