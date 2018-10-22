import { Base } from './base';
/**
 * A Receipt is a proof of a successful transaction with a service. May be used in the App for further interaction with the service.
 */
export interface Receipt extends Base {
    /**
     * The Role that executed the Action that formed the Receipt
     */
    role?: string;
    /**
     * The Action document that formed the Receipt
     */
    action?: string;
    /**
     * The URI for doing updates on the Receipt
     */
    uri?: string;
    /**
     * A JWT to be used when doing updates on the Receipt
     */
    jwt?: string;
    /**
     * An array of Intervals, used for events or bookings
     */
    intervals?: {
        [k: string]: any;
    }[];
    /**
     * The label describing the Receipt
     */
    label?: string;
    /**
     * TODO: perhaps remove this, all extra params used for the Action
     */
    params?: string[];
    [k: string]: any;
}
